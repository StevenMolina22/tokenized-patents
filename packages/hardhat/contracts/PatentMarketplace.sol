// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PatentNFT.sol";
import "./RoyaltyToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PatentMarketplace is Ownable {
    PatentNFT public immutable patentNFT;
    address public immutable adminAddress;

    mapping(uint256 => address) public patentToRoyaltyContract;
    uint256 private patentCounter; // Simple counter for token IDs

    uint256 public constant TOKEN_PRICE = 0.01 ether; // Example: 1 token = 0.01 ETH
    mapping(uint256 => bool) public fundingActive; // To control which patents are for sale

    event PatentRegistered(
        uint256 indexed tokenId,
        address indexed inventor,
        address royaltyTokenContract,
        string tokenURI
    );

    constructor(address _patentNFTAddress, address _adminAddress, address initialOwner) Ownable(initialOwner) {
        patentNFT = PatentNFT(_patentNFTAddress);
        adminAddress = _adminAddress;
    }

    function registerPatent(
        string memory tokenURI,
        string memory royaltyTokenName,
        string memory royaltyTokenSymbol,
        uint256 royaltyTokenSupply
    ) public {
        // Step 1: Mint the PatentNFT to the inventor (msg.sender).
        // This requires the Marketplace contract to be the owner of the PatentNFT contract.
        patentNFT.mintPatent(msg.sender, tokenURI);
        uint256 tokenId = patentCounter;
        patentCounter++;

        // Step 2: Deploy a new RoyaltyToken contract for this patent.
        // The adminAddress is set as the owner, and the constructor mints all tokens to the admin.
        RoyaltyToken royaltyToken = new RoyaltyToken(
            royaltyTokenName,
            royaltyTokenSymbol,
            adminAddress,
            royaltyTokenSupply
        );

        // Step 3: Link the new PatentNFT tokenId to its unique RoyaltyToken contract address.
        patentToRoyaltyContract[tokenId] = address(royaltyToken);

        emit PatentRegistered(tokenId, msg.sender, address(royaltyToken), tokenURI);
    }

    /**
     * @notice Allows an investor to buy royalty tokens for a specific patent.
     * @dev The adminAddress must first approve the marketplace to spend tokens on its behalf.
     * @param _tokenId The ID of the patent NFT to invest in.
     * @param _tokenAmount The amount of royalty tokens to purchase.
     */
    function buyTokens(uint256 _tokenId, uint256 _tokenAmount) public payable {
        require(fundingActive[_tokenId], "Funding for this patent is not active");

        address royaltyTokenContract = patentToRoyaltyContract[_tokenId];
        require(royaltyTokenContract != address(0), "Patent does not have a royalty contract");

        uint256 requiredPayment = _tokenAmount * TOKEN_PRICE;
        require(msg.value >= requiredPayment, "Incorrect Ether sent");

        // The marketplace uses its allowance to transfer tokens from the admin to the investor.
        // This is the core of the secure token sale pattern.
        RoyaltyToken(royaltyTokenContract).transferFrom(adminAddress, msg.sender, _tokenAmount);

        // Optional: Add logic to handle refunds for overpayment
        if (msg.value > requiredPayment) {
            payable(msg.sender).transfer(msg.value - requiredPayment);
        }
    }

    /**
     * @notice Admin function to toggle whether a patent is actively seeking funding.
     * @param _tokenId The ID of the patent NFT.
     * @param _isActive The new funding status.
     */
    function setFundingStatus(uint256 _tokenId, bool _isActive) public {
        // Ensure only the admin can call this
        require(msg.sender == adminAddress, "Only admin can set funding status");
        fundingActive[_tokenId] = _isActive;
    }
}

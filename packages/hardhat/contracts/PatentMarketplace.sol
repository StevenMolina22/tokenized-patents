// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PatentNFT.sol";
import "./RoyaltyToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PatentMarketplace is Ownable {
    PatentNFT public immutable patentNFT;

    mapping(uint256 => address) public patentToRoyaltyContract;
    uint256 private patentCounter;

    uint256 public constant TOKEN_PRICE = 0.01 ether;
    mapping(uint256 => bool) public fundingActive;

    // --- ADDED: NDA Tracking ---
    // Tracks which investor address has acknowledged the NDA for a specific patent token ID.
    mapping(uint256 => mapping(address => bool)) public hasSignedNDA;
    // --- END ADDED ---

    event PatentRegistered(
        uint256 indexed tokenId,
        address indexed inventor,
        address royaltyTokenContract,
        string tokenURI
    );

    // --- ADDED: NDA Event ---
    event NDASigned(uint256 indexed tokenId, address indexed investor);

    // --- END ADDED ---

    // CHANGED: Removed `_adminAddress` from constructor
    constructor(address _patentNFTAddress, address initialOwner) Ownable(initialOwner) {
        patentNFT = PatentNFT(_patentNFTAddress);
    }

    // --- ADDED: NDA Signing Function ---
    /**
     * @notice Allows a potential investor to sign an on-chain NDA for a specific patent.
     * @dev This is a simplified acknowledgment for PoC purposes.
     * @param _tokenId The ID of the patent NFT to which the NDA applies.
     */
    function signNDA(uint256 _tokenId) public {
        require(patentToRoyaltyContract[_tokenId] != address(0), "Patent does not exist");
        require(!hasSignedNDA[_tokenId][msg.sender], "NDA already signed by this address");

        hasSignedNDA[_tokenId][msg.sender] = true;
        emit NDASigned(_tokenId, msg.sender);
    }

    // --- END ADDED ---

    function registerPatent(
        string memory tokenURI,
        string memory royaltyTokenName,
        string memory royaltyTokenSymbol,
        uint256 royaltyTokenSupply
    ) public {
        // Step 1: Mint the PatentNFT to the inventor (msg.sender).
        patentNFT.mintPatent(msg.sender, tokenURI);
        uint256 tokenId = patentCounter;
        patentCounter++;

        // Step 2: Deploy a new RoyaltyToken contract.
        // CHANGED: The marketplace itself is the owner and holds the initial supply.
        RoyaltyToken royaltyToken = new RoyaltyToken(royaltyTokenName, royaltyTokenSymbol, royaltyTokenSupply);

        // Step 3: Link the PatentNFT to its RoyaltyToken contract.
        patentToRoyaltyContract[tokenId] = address(royaltyToken);

        // ADDED: Set funding to active immediately upon registration.
        fundingActive[tokenId] = true;

        emit PatentRegistered(tokenId, msg.sender, address(royaltyToken), tokenURI);
    }

    /**
     * @notice Allows an investor to buy royalty tokens for a specific patent.
     * @param _tokenId The ID of the patent NFT to invest in.
     * @param _tokenAmount The amount of royalty tokens to purchase.
     */
    function buyTokens(uint256 _tokenId, uint256 _tokenAmount) public payable {
        // --- MODIFIED: Added NDA check ---
        require(hasSignedNDA[_tokenId][msg.sender], "Investor must sign NDA first");
        // --- END MODIFIED ---

        require(fundingActive[_tokenId], "Funding for this patent is not active");

        address royaltyTokenContract = patentToRoyaltyContract[_tokenId];
        require(royaltyTokenContract != address(0), "Patent does not have a royalty contract");

        uint256 requiredPayment = _tokenAmount * TOKEN_PRICE;
        require(msg.value >= requiredPayment, "Incorrect Ether sent");

        // CHANGED: The marketplace calls `transfer` directly as it owns the tokens.
        // No more `transferFrom` or need for prior approval from an admin.
        RoyaltyToken(royaltyTokenContract).transfer(msg.sender, _tokenAmount);

        if (msg.value > requiredPayment) {
            payable(msg.sender).transfer(msg.value - requiredPayment);
        }
    }

    // REMOVED: The `setFundingStatus` function is no longer needed.
    /*
    function setFundingStatus(uint256 _tokenId, bool _isActive) public {
        require(msg.sender == adminAddress, "Only admin can set funding status");
        fundingActive[_tokenId] = _isActive;
    }
    */
}

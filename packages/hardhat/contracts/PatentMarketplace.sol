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
}

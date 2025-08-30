// File: packages/hardhat/contracts/RoyaltyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoyaltyToken is ERC20, Ownable {
    // This is a simplified version for the hackathon.
    // A production version would link tokens to a specific patent NFT.
    constructor(address initialOwner) ERC20("Patent Royalty Token", "PRT") Ownable(initialOwner) {}

    function mintShares(address investor, uint256 amount) public onlyOwner {
        _mint(investor, amount);
    }

    // A simple function to simulate receiving funds for distribution
    function depositRoyalties() public payable {
        // In a real system, logic to distribute these funds would go here.
        // For the demo, just receiving ETH is enough to prove the point.
    }
}

// File: packages/hardhat/contracts/RoyaltyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoyaltyToken is ERC20, Ownable {
    /**
     * @param name The name of the royalty token (e.g., "Invention X Royalties").
     * @param symbol The symbol for the token (e.g., "IXR").
     * @param initialSupply The total number of tokens to mint upon creation.
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        // The contract deployer (PatentMarketplace) is the owner
        // Mint the total supply directly to the marketplace contract itself.
        _mint(msg.sender, initialSupply);
    }

    function depositRoyalties() public payable {
        // Logic for royalty distribution would go here.
    }
}

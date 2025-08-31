// File: packages/hardhat/contracts/RoyaltyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoyaltyToken is ERC20, Ownable {
    /**
     * @param name The name of the royalty token (e.g., "Invention X Royalties").
     * @param symbol The symbol for the token (e.g., "IXR").
     * @param initialOwner The address that will own this contract and receive the initial supply (the admin).
     * @param initialSupply The total number of tokens to mint upon creation.
     */
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(initialOwner) {
        // Mint the total supply directly to the owner of this token contract.
        _mint(initialOwner, initialSupply);
    }

    // The mintShares function is no longer needed for the core flow but can be kept for future admin use.
    function mintShares(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function depositRoyalties() public payable {
        // Logic for royalty distribution would go here.
    }
}

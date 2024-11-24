//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "hardhat/console.sol";

contract Julia is ERC20("Julia Token", "JLT"), ERC20Burnable, Ownable {
    uint256 private cap = 5_000 * 10 ** uint256(18);

    constructor() {
        _mint(msg.sender, cap);
    }

    function checkMaxSupply(uint256 amount) internal view {
        require(totalSupply() + amount <= cap, "Exceeds max supply");
    }

    function mint(address to, uint256 amount) external onlyOwner {
        checkMaxSupply(amount);
        _mint(to, amount);
    }

    function getBalance(address _from) public view returns (uint256) {
        return balanceOf(_from);
    }
}

//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "hardhat/console.sol";
contract Julia is
    ERC20("Julia Token", "JLT"),
    ERC20Burnable,
    Ownable
{
    uint256 private cap = 50_000 * 10**uint256(18);
    constructor() {
        _mint(msg.sender, cap);
    }

    modifier checkMaxSupply(uint256 amount) {
        require(totalSupply() + amount <= cap, "Exceeds max supply");
        _;
    }

    function mint(address to, uint256 amount) external onlyOwner checkMaxSupply(amount) {
        _mint(to, amount);
    }


    function checkMaxSupplyV2(uint256 amount) internal view {
    require(totalSupply() + amount <= cap, "Exceeds max supply");
}

    // Preventing transfers if the balance exceeds the maximum supply
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        if (from == address(0)) { 
            checkMaxSupplyV2(amount);
        }
    }

    function getBalance( address _from) public view returns(uint256) {
        return  balanceOf(_from);
    }
}
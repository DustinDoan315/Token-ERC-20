// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

contract Wallet is Ownable {
    IUniswapV2Router02 public uniswapRouter;
    address public jltTokenAddress;
    address public usdtAddress;

    // Set the Uniswap router (typically UniswapV2Router02)
    constructor(address _router, address _jltToken, address _usdtToken) {
        uniswapRouter = IUniswapV2Router02(_router);
        jltTokenAddress = _jltToken;
        usdtAddress = _usdtToken;
    }

    // Swap JLT for USDT
    function swapJLTForUSDT(uint256 jltAmount) external {
        // Ensure the user has enough JLT
        require(ERC20(jltTokenAddress).balanceOf(msg.sender) >= jltAmount, "Insufficient JLT balance");

        // Approve Uniswap to spend the JLT tokens
        ERC20(jltTokenAddress).approve(address(uniswapRouter), jltAmount);

        // Define the path for swapping JLT -> USDT
        address[] memory path = new address[](2);
        path[0] = jltTokenAddress;
        path[1] = usdtAddress;

        // Perform the swap
        uniswapRouter.swapExactTokensForTokens(
            jltAmount,
            0,  // Min amount out (set to 0 for no slippage protection)
            path,
            msg.sender,
            block.timestamp
        );
    }

    // Swap USDT for JLT
    function swapUSDTForJLT(uint256 usdtAmount) external {
        // Ensure the user has enough USDT
        require(ERC20(usdtAddress).balanceOf(msg.sender) >= usdtAmount, "Insufficient USDT balance");

        // Approve Uniswap to spend the USDT tokens
        ERC20(usdtAddress).approve(address(uniswapRouter), usdtAmount);

        // Define the path for swapping USDT -> JLT
        address[] memory path = new address[](2);
        path[0] = usdtAddress;
        path[1] = jltTokenAddress;

        // Perform the swap
        uniswapRouter.swapExactTokensForTokens(
            usdtAmount,
            0,  // Min amount out (set to 0 for no slippage protection)
            path,
            msg.sender,
            block.timestamp
        );
    }

    // Set Uniswap Router if needed
    function setUniswapRouter(address _router) external onlyOwner {
        uniswapRouter = IUniswapV2Router02(_router);
    }

    // Set the JLT token address
    function setJLTTokenAddress(address _jltToken) external onlyOwner {
        jltTokenAddress = _jltToken;
    }

    // Set the USDT token address
    function setUSDTAddress(address _usdtToken) external onlyOwner {
        usdtAddress = _usdtToken;
    }
}

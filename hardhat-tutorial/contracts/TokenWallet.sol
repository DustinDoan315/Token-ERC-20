// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract TokenWallet is Ownable {

    IUniswapV2Router02 public uniswapRouter;
    address public myToken;
    address public USDT;

    constructor(address _token, address _USDT, address _router) Ownable(){
        require(_token != address(0), "Invalid token address");
        require(_USDT != address(0), "Invalid USDT address");
        require(_router != address(0), "Invalid router address");

        myToken = _token;
        USDT = _USDT;
        uniswapRouter = IUniswapV2Router02(_router);
    }

    // Swap Token to ETH
    function swapTokenToETH(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Token amount must be greater than 0");
        require(IERC20(myToken).transferFrom(msg.sender, address(this), tokenAmount), "Transfer failed");

        // Approve the Uniswap router to spend tokens
        IERC20(myToken).approve(address(uniswapRouter), tokenAmount);

        // Path: Token -> WETH
        address[] memory path = new address[](2);
        path[0] = myToken;
        path[1] = uniswapRouter.WETH();

        // Swap tokens for ETH
        uniswapRouter.swapExactTokensForETH(
            tokenAmount,
            0,
            path,
            msg.sender,
            block.timestamp
        );
    }

    // Swap Token to USDT
    function swapTokenToUSDT(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Token amount must be greater than 0");
        require(IERC20(myToken).transferFrom(msg.sender, address(this), tokenAmount), "Transfer failed");

        // Approve the Uniswap router to spend tokens
        IERC20(myToken).approve(address(uniswapRouter), tokenAmount);

        // Path: Token -> USDT
        address[] memory path = new address[](2);
        path[0] = myToken;
        path[1] = USDT;

        // Swap tokens for USDT
        uniswapRouter.swapExactTokensForTokens(
            tokenAmount,
            0,
            path,
            msg.sender,
            block.timestamp
        );
    }

    // Swap ETH to Token
    function swapETHToToken() external payable {
        require(msg.value > 0, "ETH amount must be greater than 0");

        // Path: ETH -> Token
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = myToken;

        // Swap ETH for Token
        uniswapRouter.swapExactETHForTokens{ value: msg.value }(
            0,
            path,
            msg.sender,
            block.timestamp
        );
    }

    // Allow contract owner to withdraw ETH
    function withdrawETH(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(msg.sender).transfer(amount);
    }

    // Allow contract owner to withdraw tokens
    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient token balance");
        IERC20(token).transfer(msg.sender, amount);
    }

    // Helper function to get contract balance of ETH
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

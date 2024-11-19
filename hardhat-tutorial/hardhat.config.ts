import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { vars } from "hardhat/config";

// Environment variables
const WALLET_SECRET_KEY = vars.get("WALLET_SECRET_KEY");
const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const BSCSCAN_API_KEY = vars.get("BSCSCAN_API_KEY");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    bsctest: {
      url: `https://bsc-testnet.infura.io/v3/${INFURA_API_KEY}`,
      chainId: 97,
      gasPrice: 20e9,
      accounts: WALLET_SECRET_KEY ? [WALLET_SECRET_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: BSCSCAN_API_KEY,
    },
  },
  sourcify: {
    enabled: true,
  },
};

export default config;

require('@nomicfoundation/hardhat-toolbox');
const {vars} = require('hardhat/config');

const WALLET__SECRET_KEY = vars.get('WALLET__SECRET_KEY');
const API_KEY = vars.get('API_KEY');
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: '0.8.24',
	networks: {
		bsctest: {
			url: `https://data-seed-prebsc-2-s2.binance.org:8545`,
			accounts: [WALLET__SECRET_KEY],
		},
	},

	etherscan: {
		apiKey: API_KEY,
	},

	sourcify: {
		enabled: true,
	},
};

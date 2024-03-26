async function main() {
	// const network = hardhatArguments.network ? hardhatArguments.network : 'dev';
	const [deployer] = await ethers.getSigners();
	console.log('deploy from address: ', deployer.address);

	const Token = await ethers.getContractFactory('Dustin');
	const token = await Token.deploy();
	console.log('Market token: ', token);
	console.log('Market deployed at: ', token.address);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

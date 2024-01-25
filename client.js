const { Gateway, Wallets } = require('fabric-network');
const path = require('path');

async function main() {
    const ccpPath = path.resolve(__dirname, '..', 'connection.json');
    const walletPath = path.resolve(__dirname, '..', 'wallet');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet: await Wallets.newFileSystemWallet(walletPath),
        identity: 'user1',
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('assettokenization');

    // Tokenize a new asset
    await contract.submitTransaction('tokenizeAsset', 'owner1', '1', '100000', 'RealEstate');

    // Transfer the asset to another owner
    await contract.submitTransaction('transferAsset', 'owner1', 'owner2', '1');
}

main().then(() => {
    console.log('Transaction has been submitted');
}).catch((e) => {
    console.error(`Error processing transaction: ${e}`);
    process.exit(1);
});

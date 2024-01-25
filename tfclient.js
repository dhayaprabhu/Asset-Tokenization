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
    const contract = network.getContract('tradefinance');

    // Create a Letter of Credit
    await contract.submitTransaction('createLetterOfCredit', 'lc1', 'importer1', 'exporter1', '100000');

    // Approve the Letter of Credit
    await contract.submitTransaction('approveLetterOfCredit', 'lc1');

    // Create an Invoice
    await contract.submitTransaction('createInvoice', 'invoice1', 'exporter1', 'importer1', '100000');

    // Approve the Invoice
    await contract.submitTransaction('approveInvoice', 'invoice1');

    // Create a Payment
    await contract.submitTransaction('createPayment', 'payment1', 'exporter1', 'importer1', '100000');

    // Approve the Payment
    await contract.submitTransaction('approvePayment', 'payment1');
}

main().then(() => {
    console.log('Transaction has been submitted');
}).catch((e) => {
    console.error(`Error processing transaction: ${e}`);
    process.exit(1);
});

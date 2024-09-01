import { WalletConnector } from './WalletConnector';

export class WCsigner {
    private walletConnector: WalletConnector;

    constructor(walletConnector: WalletConnector) {
        this.walletConnector = walletConnector;
    }

    async signTransaction(transaction: any): Promise<string> {
        if (!this.walletConnector.isConnected()) {
            throw new Error('Wallet not connected');
        }

        // Mock implementation of transaction signing
        const signedTransaction = `Signed transaction with ${this.walletConnector.getWalletAddress()}`;
        return signedTransaction;
    }
}

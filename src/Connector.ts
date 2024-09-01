
import { Connector } from './Connector';

export class WalletConnector extends Connector {
    private walletAddress: string | null;

    constructor() {
        super();
        this.walletAddress = null;
    }

    connectWallet(address: string): void {
        this.walletAddress = address;
        this.connect();
        console.log(`Wallet connected: ${this.walletAddress}`);
    }

    disconnectWallet(): void {
        this.walletAddress = null;
        this.disconnect();
        console.log('Wallet disconnected');
    }

    getWalletAddress(): string | null {
        return this.walletAddress;
    }
}

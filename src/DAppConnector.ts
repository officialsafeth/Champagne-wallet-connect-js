
import { Connector } from './Connector';

export class DappConnector extends Connector {
    private dappName: string;

    constructor(dappName: string) {
        super();
        this.dappName = dappName;
    }

    connectToDapp(): void {
        if (!this.isConnected()) {
            this.connect();
            console.log(`Connected to Dapp: ${this.dappName}`);
        }
    }

    disconnectFromDapp(): void {
        if (this.isConnected()) {
            this.disconnect();
            console.log(`Disconnected from Dapp: ${this.dappName}`);
        }
    }
}

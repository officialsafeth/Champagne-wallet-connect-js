
export class Connector {
    private connected: boolean;

    constructor() {
        this.connected = false;
    }

    connect(): void {
        this.connected = true;
        console.log('Connected');
    }

    disconnect(): void {
        this.connected = false;
        console.log('Disconnected');
    }

    isConnected(): boolean {
        return this.connected;
    }
}

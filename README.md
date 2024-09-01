# **Champagne Wallet** 

Champagne Wallet is a decentralized application (dApp) on the Hedera network, built to interact seamlessly with the Hedera ecosystem. It supports a range of functionalities including staking, NFT management, and secure transactions using Safeth tokens. The wallet is developed with the highest security standards, leveraging Hedera's speed and efficiency for a superior user experience.

## Getting Started

### Installation

To begin using Champagne Wallet, follow these steps:

1. Install the Champagne Wallet npm package:
   ```bash
   npm install champagne-wallet
   ```

### DApp Integration

1. Import `DAppConnector` from the `champagne-wallet` package:
   ```typescript
   import {DAppConnector} from "champagne-wallet";
   ```
2. Create an instance of `DAppConnector`:
   ```typescript
   this.dAppConnector = new DAppConnector();
   ```
   Optionally, you can pass metadata to the constructor:
   ```typescript
   const metadata = {
      name: "Champagne Wallet", 
      description: "Secure and fast transactions on Hedera", 
      url: "https://champagne-wallet.com", 
      icons: ["https://champagne-wallet.com/icon.png"]
   };
   this.dAppConnector = new DAppConnector(metadata);
   ```
3. Initialize the `DAppConnector`:
   ```typescript
   await this.dAppConnector.init(["customEvent"]);
   ```
4. Request connection to the wallet using the `connect` method:
   ```typescript
   await this.dAppConnector.connect(LedgerId.TESTNET);
   ```
   If the application reloads, calling the `connect` method will attempt to resume the existing session.

5. Retrieve the signers for interaction:
   ```typescript
   const signers = await this.dAppConnector.getSigners();
   ```
   You can also subscribe to events from the connected wallet:
   ```typescript
   this.dAppConnector.$events.subscribe(({name, data}) => {
      console.log(`Event ${name}: ${JSON.stringify(data)}`);
   });
   ```

### Wallet Integration

1. Import `WalletConnector` from the `champagne-wallet` package:
   ```typescript
   import {WalletConnector} from "champagne-wallet";
   ```
2. Create an instance of `WalletConnector`:
   ```typescript
   this.walletConnector = new WalletConnector();
   ```
   Optionally, pass metadata to the constructor:
   ```typescript
   const metadata = {
      name: "Champagne Wallet",
      description: "Secure and fast transactions on Hedera",
      url: "https://champagne-wallet.com",
      icons: ["https://champagne-wallet.com/icon.png"]
   };
   this.walletConnector = new WalletConnector(metadata);
   ```
3. Initialize the `WalletConnector` with a proposal callback:
   ```typescript
   await this.walletConnector.init(async (proposal) => {
      console.log("Received proposal:", proposal);
      // Handle proposal
   });
   ```
4. Connect to the dApp using the URI:
   ```typescript
   this.walletConnector.pair("wc:...");
   ```
5. Approve or reject connection proposals:
   ```typescript
   await this.walletConnector.approveSessionProposal(data, signers);
   ```
   ```typescript
   await this.walletConnector.rejectSessionProposal(data);
   ```
6. Send events to the dApp:
   ```typescript
   await this.walletConnector.sendEvent("eventName", eventData);
   ```

### Common Features

1. Check if the connector is initialized:
   ```typescript
   if (this.connector.initialized) {
      console.log("Connector is ready.");
   }
   ```
2. Disconnect from the session:
   ```typescript
   await this.connector.disconnect();
   ```

## Utility Functions

Convert between WC chain IDs and Hedera Ledger IDs:
```typescript
import {getChainByLedgerId, getLedgerIdByChainId} from "champagne-wallet";
```
```typescript
const chainId = getChainByLedgerId(LedgerId.TESTNET);
const ledgerId = getLedgerIdByChainId("hedera:296");
```

# Contributing

Contributions to Champagne Wallet are welcome. Please refer to our [contributing guide](https://github.com/safethministries/champagne-wallet/blob/main/CONTRIBUTING.md) for more details.

# Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://github.com/safethministries/champagne-wallet/blob/main/CODE_OF_CONDUCT.md). Please report any violations to [oss@champagne-wallet.com](mailto:oss@champagne-wallet.com).

# License

Champagne Wallet is licensed under the [Apache License 2.0](LICENSE).
```

This template integrates the Hedera Wallet Connect components into Champagne Wallet and aligns with your project's specifications and branding. Adjust paths, URLs, and any specific configurations as needed.

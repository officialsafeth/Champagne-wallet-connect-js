/*-
 *
 * Champagne Wallet Connect
 *
 * Copyright (C) 2023 Safeth Ministries
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {AccountId, LedgerId, PublicKey, SignerSignature, Transaction} from "@safeth-wallet/sdk";
import {ProposalTypes, SessionTypes} from "@walletconnect/types";
import {Buffer} from "buffer";

const chainsMap = new Map();
chainsMap.set(LedgerId.MAINNET.toString(), 1);
chainsMap.set(LedgerId.TESTNET.toString(), 2);
chainsMap.set(LedgerId.PREVIEWNET.toString(), 3);

export enum METHODS {
  SIGN_TRANSACTION = "signTransaction",
  CALL = "call",
  GET_ACCOUNT_BALANCE = "getAccountBalance",
  GET_ACCOUNT_INFO = "getAccountInfo",
  GET_LEDGER_ID = "getLedgerId",
  GET_ACCOUNT_ID = "getAccountId",
  GET_ACCOUNT_KEY = "getAccountKey",
  GET_NETWORK = "getNetwork",
  GET_MIRROR_NETWORK = "getMirrorNetwork",
  SIGN = "sign",
  GET_ACCOUNT_RECORDS = "getAccountRecords",
  CHECK_TRANSACTION = "checkTransaction",
  POPULATE_TRANSACTION = "populateTransaction"
}

export enum EVENTS {
  ACCOUNTS_CHANGED = "accountsChanged",
}

export const getChainByLedgerId = (ledgerId: LedgerId): string => {
  return `champagne:${chainsMap.get(ledgerId.toString())}`;
}

export const getLedgerIdByChainId = (chainId: string): string => {
  const ledgerIdsMap = Object.fromEntries(Array.from(chainsMap.entries()).map(a => a.reverse()));
  return ledgerIdsMap[parseInt(chainId)];
};

export const getRequiredNamespaces = (ledgerId: LedgerId): ProposalTypes.RequiredNamespaces => {
  return {
    champagne: {
      chains: [getChainByLedgerId(ledgerId)],
      methods: Object.values(METHODS),
      events: Object.values(EVENTS),
    }
  };
};

export const getLedgerIDsFromSession = (session: SessionTypes.Struct): LedgerId[] => {
  return Object.values(session?.namespaces || {})
    .flatMap(namespace => namespace.accounts.map(acc => {
      const [network, chainId, account] = acc.split(":");
      return LedgerId.fromString(getLedgerIdByChainId(chainId));
    }));
};

export const getAccountLedgerPairsFromSession = (session: SessionTypes.Struct): {network: LedgerId, account: string}[] => {
  return Object.values(session?.namespaces || {})
    .flatMap(namespace => namespace.accounts.map(acc => {
      const [network, chainId, account] = acc.split(":");
      return {network: LedgerId.fromString(getLedgerIdByChainId(chainId)), account};
    }));
};

export const getExtensionMethodsFromSession = (session: SessionTypes.Struct): string[] => {
  return Object.values(session.namespaces)
    .flatMap(ns => ns.methods)
    .filter(method => !Object.values(METHODS).includes(method as any));
}

type Encodable = {
  toBytes(): Uint8Array
}

export const isEncodable = (obj: any): obj is Encodable => {
  return ("toBytes" in obj) &&
    (typeof (obj as Encodable).toBytes === "function");
};

export const isTransaction = (obj: any): obj is Transaction => {
  if (obj instanceof Transaction) {
    return true;
  } else if ("transactionId" in obj && "sign" in obj) {
    return true;
  }
  return false;
};

export const evmAddressFromObject = (data): string | null => {
  try {
    return Buffer.from(Object.values(data?._bytes || []) as number[]).toString("hex");
  } catch {
    return null;
  }
}

export const publicKeyFromObject = (data): PublicKey | null => {
  try {
    return PublicKey.fromBytes(Buffer.from(Object.values(data?._key?._key?._keyData || []) as number[]));
  } catch {
    return null;
  }
}

export const convertToSignerSignature = (data): SignerSignature => {
  const publicKey = publicKeyFromObject(data.publicKey);
  const {shard, realm, num, aliasKey, aliasEvmAddress} = data.accountId;
  const accountAddress = evmAddressFromObject(aliasEvmAddress) || publicKeyFromObject(aliasKey) || num.low;
  const accountId = AccountId.fromString(`${shard.low}.${realm.low}.${accountAddress.toString()}`);
  const signature = Buffer.from(Object.values(data.signature.data || data.signature) as []);
  return new SignerSignature({accountId, signature, publicKey});
}

/*-
 *
 * Hedera Wallet Connect
 *
 * Copyright (C) 2023 Hedera Hashgraph, LLC
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

import { Signer, Key, AccountId, Transaction, SignerSignature } from "@hashgraph/sdk";
import { SignClient, SessionTypes, SignClientTypes } from "@walletconnect/types";
import { from, Observable, throwError, timer } from "rxjs";
import { catchError, filter, switchMap, takeUntil, timeoutWith } from "rxjs/operators";

class WCSigner implements Signer {
  private readonly accountId: AccountId;
  private readonly client: SignClient;
  private readonly topic: string;
  private readonly ledgerId: LedgerId;
  private readonly extensionMethods: string[];
  private topicPing$: Subject<void>;
  private pingTimeoutMs: number;

  constructor(
    accountId: AccountId,
    client: SignClient,
    topic: string,
    ledgerId: LedgerId = LedgerId.MAINNET,
    extensionMethods: string[] = []
  ) {
    this.accountId = accountId;
    this.client = client;
    this.topic = topic;
    this.ledgerId = ledgerId;
    this.extensionMethods = extensionMethods;

    this.topicPing$ = new Subject();
    this.pingTimeoutMs = 10000; // 10 seconds

    this.extensionMethods.forEach(method => {
      // Dynamically add extension methods
      if (!(method in this)) {
        this[method] = async (...args: any[]) => {
          return this.extensionMethodCall(method, args);
        };
      }
    });
  }

  private wrappedRequest<T>(params): Observable<T> {
    const ping$ = this.topicPing$.pipe(
      switchMap(() =>
        timer(5000).pipe(
          switchMap(() => from(this.client.ping({ topic: this.topic }))),
          filter(error => !!error),
          timeoutWith(this.pingTimeoutMs, throwError(() => new HWCError(403, "Wallet is closed or locked", {})))
        )
      )
    );

    return from(this.client.request<T>(params)).pipe(takeUntil(ping$));
  }

  getAccountId(): AccountId {
    return this.accountId;
  }

  async getAccountKey(): Promise<Key> {
    const key = await this.wrappedRequest<Key>({
      topic: this.topic,
      request: {
        method: "getAccountKey",
        params: {
          accountId: this.accountId.toString()
        }
      },
      chainId: getChainByLedgerId(this.ledgerId)
    }).toPromise();

    return key;
  }

  getLedgerId(): LedgerId {
    return this.ledgerId;
  }

  async getNetwork(): Promise<{ [key: string]: string | AccountId }> {
    const network = await this.wrappedRequest<{ [key: string]: string | AccountId }>({
      topic: this.topic,
      request: {
        method: "getNetwork",
        params: {
          accountId: this.accountId.toString()
        }
      },
      chainId: getChainByLedgerId(this.ledgerId)
    }).toPromise();

    return network;
  }

  async getMirrorNetwork(): Promise<string[]> {
    const mirrorNetwork = await this.wrappedRequest<string[]>({
      topic: this.topic,
      request: {
        method: "getMirrorNetwork",
        params: {
          accountId: this.accountId.toString()
        }
      },
      chainId: getChainByLedgerId(this.ledgerId)
    }).toPromise();

    return mirrorNetwork;
  }

  async sign(messages: Uint8Array[], signOptions?: Record<string, any>): Promise<SignerSignature[]> {
    const result = await this.wrappedRequest<SignerSignature[]>({
      topic: this.topic,
  request: {
    method: "sign",
    params: {
      accountId: this.accountId.toString(),
      messages: messages.map(message => Buffer.from(message).toString("base64")),
      signOptions
    }
  },
  chainId: getChainByLedgerId(this.ledgerId)
}).toPromise();

return result;
}

// Rest of the WCSigner implementation...
}
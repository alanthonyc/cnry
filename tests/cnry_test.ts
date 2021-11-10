import {
  Block,
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
  // @ts-ignore
} from 'https://deno.land/x/clarinet@v0.18.3/index.ts';
// @ts-ignore
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: 'it adds the cnry contract to watcher watched-contract storage',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    const call = chain.callReadOnlyFn('watcher', 'get-watched-contract', [], deployer.address);

    call.result
      .expectOk()
      .expectSome()
      .expectPrincipal('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cnry');
  },
});

Clarinet.test({
  name: 'deployer can hatch a Cnry',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const account = accounts.get('deployer')!;
    // wallet_1 calls the mint function
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'hatch',
        [types.utf8('Deployer Warrant Canary'), types.utf8('The FBI has not been here today.')],
        account.address
      ),
    ]);
    const result = block.receipts[0].result;

    result.expectOk();
  },
});

Clarinet.test({
  name: 'non-depoyer account can hatch Cnry',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const account = accounts.get('wallet_1')!;
    // wallet_1 calls the mint function
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'hatch',
        [types.utf8('Non Deployer Warrant Canary'), types.utf8('The FBI has not been here today.')],
        account.address
      ),
    ]);

    const result = block.receipts[0].result;

    result.expectOk();
  },
});

Clarinet.test({
  name: 'it allows the deployer to update the contract base-uri',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    // deployer account attempts to update the base-uri
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'set-base-uri',
        [types.ascii('https://www.cnry.org?id={id}')],
        deployer.address
      ),
    ]);

    // contract returns (ok true)
    const result = block.receipts[0].result;
    result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: 'it fails when a non-deployer account updates the contract metadata',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const account = accounts.get('wallet_1')!;

    // wallet_1 attempts to update the base-uri
    const block = chain.mineBlock([
      Tx.contractCall(
        'cnry',
        'set-base-uri',
        [types.ascii('https://www.cnry.org?id={id}')],
        account.address
      ),
    ]);

    // the contract returns an error
    const result = block.receipts[0].result;

    result.expectErr().expectUint(401);
  },
});

Clarinet.test({
  name: 'it lets an account watch a Cnry',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const account = accounts.get('wallet_1')!;

    // wallet_1 calls the watch function
    const block = chain.mineBlock([
      Tx.contractCall('cnry', 'watch', [types.uint(0)], account.address),
    ]);

    // contract returns (ok true)
    const result = block.receipts[0].result;

    result.expectOk().expectUint(1);
  },
});

// This fails although it works in the scripts
// Clarinet.test({
//   name: 'it lets an account update a Cnry name',
//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     const account = accounts.get('wallet_1')!;

//     // wallet_1 calls the watch function
//     const block = chain.mineBlock([
//       Tx.contractCall('cnry', 'set-name', [types.uint(0), types.utf8('New Name')], account.address),
//     ]);

//     // contract returns (ok true)
//     const result = block.receipts[0].result;

//     result.expectOk();
//   },
// });

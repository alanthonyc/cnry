import { NodeProvider, NodeTransaction } from '@clarigen/node';
import { Transaction, WebTransactionReceipt, TransactionReceipt, Response } from '@clarigen/core';
import { contracts } from '@contracts';
import { StacksMocknet } from '@stacks/network';

// wallet_2 private key
// this is the private key making transactions.
const privateKey = '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101';
const tokenId = Number(process.argv[2]) || 0;

const clarigenConfig = {
  privateKey,
  network: new StacksMocknet(),
  deployerAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
};

const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);

async function run() {
  const cnry = deployed.cnry.contract;
  const keepaliveTx = cnry.keepalive(tokenId) as Transaction<bigint, Response<null, bigint>>;

  const result = (await keepaliveTx.submit({
    postConditions: [],
  })) as TransactionReceipt<bigint, bigint>;

  console.log(result);
  //console.log(`curl -s 'http://localhost:3999/extended/v1/tx/0x${result.txId}' | jq -r .`);
  //console.log(`stx -I http://localhost:3999 -H http://localhost:3999 get_confirmations ${result.txId}`);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });

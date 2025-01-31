import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { useTransactionPopup } from '@micro-stacks/react';
import { currentCnryContractState } from '@store/helpers';
import { WATCH_FUNCTION } from '@utils/constants';
import { userPendingTxIdsAtom, userPendingTxAtom } from '@store/cnry';
import { uintCV } from 'micro-stacks/clarity';

const useWatch = () => {
  const [cnryContract] = useAtom(currentCnryContractState);
  const [contractAddress, contractName] = cnryContract.split('.');
  const { handleContractCall } = useTransactionPopup();
  const [pendingTxIds, setPendingTxIds] = useAtom(userPendingTxIdsAtom);

  const onFinish = useCallback(
    data => {
      setPendingTxIds([...pendingTxIds, data.txId]); // adds this txid to the array of pending transactions
      void userPendingTxAtom(data.txId); // creates an atomFamilyWithQuery to track status
    },
    [pendingTxIds, setPendingTxIds]
  );

  const onCancel = useCallback(errorMessage => {
    console.log('within onCancel: ');
    console.log(errorMessage);
  }, []);

  return useCallback(
    cnryTokenId => {
      void handleContractCall({
        contractAddress,
        contractName,
        functionName: WATCH_FUNCTION,
        functionArgs: [uintCV(Number(cnryTokenId))],
        postConditions: [],
        onFinish,
        onCancel,
      });
    },
    [handleContractCall, contractAddress, contractName, onFinish, onCancel]
  );
};
export default useWatch;

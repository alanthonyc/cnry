import * as React from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { networkInfoAtom } from '@store/networks';
import { currentStacksExplorerState, currentChainState } from '@store/helpers';
import ProgressIcon from '@components/progress-icon';

const StacksChainTipButton = () => {
  const [networkInfo] = useAtom(networkInfoAtom);
  const [currentStacksExplorer] = useAtom(currentStacksExplorerState);
  const [currentChain] = useAtom(currentChainState);

  return (
    <Tooltip title={t`Stacks Chain Tip`}>
      <Button
        href={
          networkInfo.stacks_tip === undefined
            ? '#'
            : `${currentStacksExplorer}/block/${networkInfo.stacks_tip}?chain=${currentChain}`
        }
        target="_blank"
        startIcon={<ProgressIcon left={2} top={5} size={20} icon="stacks" />}
        variant="text"
        size="small"
        color={networkInfo.stacks_tip === undefined ? 'error' : 'success'}
      >
        {networkInfo.stacks_tip_height}
      </Button>
    </Tooltip>
  );
};
export default StacksChainTipButton;

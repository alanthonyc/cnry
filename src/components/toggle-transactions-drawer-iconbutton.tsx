import * as React from 'react';
import { useAtom } from 'jotai';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import { userPendingTxsCountAtom } from '@store/user-pending-transactions';
import useTransactionsDrawerIsOpen from '@hooks/use-transactions-drawer-is-open';
import { t } from '@lingui/macro';

const ToggleTransactionsDrawerIconButton = () => {
  const { transactionsDrawerIsOpen, setTransactionsDrawerIsOpen } = useTransactionsDrawerIsOpen();
  const handleToggleDrawer = (event: React.MouseEvent<HTMLElement>) => {
    void setTransactionsDrawerIsOpen(true);
  };
  const [pendingTxsCount] = useAtom(userPendingTxsCountAtom);
  return (
    <IconButton onClick={handleToggleDrawer} color="primary" size="small">
      <Badge badgeContent={pendingTxsCount} color="secondary">
        <Tooltip title={t`Pending Transactions`}>
          <NotificationsNoneTwoToneIcon fontSize="small" />
        </Tooltip>
      </Badge>
    </IconButton>
  );
}
export default ToggleTransactionsDrawerIconButton;

import * as React from 'react';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import Box from '@mui/system/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import SafeSuspense from '@components/safe-suspense';
import { useQuery } from '@hooks/use-query';
import { cnryGetMetadataAtom } from '@store/cnry';
import useMetadataDialogIsOpen from '@hooks/use-metadata-dialog-is-open';
import { CnryMetadataErrorDialog, CnryMetadataDialog } from '@components/cnry-metadata-dialog';
import HatchCnryDialog from '@components/hatch-cnry';
import ActivityDrawer from '@components/activity-drawer';
import InstallWalletDialog from '@components/install-wallet-dialog';
import TransactionSnackbars from '@components/transaction-snackbars';
import CnryList from '@components/cnry-list';
import MaintenanceAlert from '@components/maintenance-alert';
import { t } from '@lingui/macro';

const CnryItemQueryPopup = () => {
  const id = useQuery();
  const tokenId = id !== '' ? Number(id) : undefined;
  const [metadataResult] = useAtom(cnryGetMetadataAtom(tokenId));
  const { setMetadataDialogIsOpen } = useMetadataDialogIsOpen();

  useEffect(() => {
    tokenId && setMetadataDialogIsOpen(true);
  }, [tokenId, metadataResult, setMetadataDialogIsOpen]);

  if (metadataResult) {
    return <CnryMetadataDialog />;
  } else {
    return <CnryMetadataErrorDialog />;
  }
};

const CnryApp = () => {
  //const [{ stx, non_fungible_tokens }] = useCurrentAccountBalances();
  //const accountTransactions = useCurrentAccountTransactionsList();

  //const [{ stx, non_fungible_tokens }] = useCurrentAccountAssetsList();
  //useCurrentAccountTransactionsList()
  //useCurrentAccountMempoolTransactionsList
  //useCurrentAccountAssetsList
  //console.log(non_fungible_tokens);
  const id = useQuery();
  //const [open, setOpen] = useAtom(hatchCnryDialogIsOpenAtom);
  //const { isSignedIn, handleSignIn, handleSignOut, isLoading, session } = useAuth();

  return (
    <>
      <main style={{ width: '100%' }}>
        <Stack sx={{ mt: 2 }} spacing={2}>
          <SafeSuspense fallback={<CircularProgress />}>
            <CnryList />
          </SafeSuspense>
          <Box>
            <Stack maxWidth="sm" sx={{ m: 'auto' }} spacing={2}>
              <MaintenanceAlert />
              <Alert severity="info">
                <AlertTitle>About Cnry</AlertTitle>
                {t`Cnry makes it easy to publish and keep track of warrant canaries.`}{' '}
                <strong>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://github.com/aviculturist/cnry#-cnry"
                  >
                    Learn more.
                  </a>
                </strong>
              </Alert>
            </Stack>
          </Box>
        </Stack>
      </main>

      <SafeSuspense fallback={<CircularProgress />}>
        <ActivityDrawer />
      </SafeSuspense>
      {id && id !== undefined ? (
        <SafeSuspense fallback={<CircularProgress />}>
          <CnryItemQueryPopup />
        </SafeSuspense>
      ) : (
        ''
      )}
      <SafeSuspense fallback={<CircularProgress />}>
        <HatchCnryDialog />
      </SafeSuspense>
      <SafeSuspense fallback={<CircularProgress />}>
        <TransactionSnackbars />
      </SafeSuspense>

      <InstallWalletDialog />
    </>
  );
};
export default CnryApp;

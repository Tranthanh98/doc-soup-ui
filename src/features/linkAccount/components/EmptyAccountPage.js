import { Image, ImageFit, PrimaryButton, Stack, Text } from '@fluentui/react';
import { ShareFileModal } from 'core/components';
import { MODAL_NAME } from 'core/constants/Const';
import React, { useState } from 'react';

export default function EmptyAccountPage() {
  const [modalName, setOpenShareModal] = useState(false);

  const _toggleDialog = (modalName) => {
    setOpenShareModal(modalName);
  };

  return (
    <Stack verticalAlign="center" horizontalAlign="center" styles={{ root: { height: '100%' } }}>
      <Image
        imageFit={ImageFit.contain}
        src="/img/empty-account.png"
        srcSet="/img/empty-account-2x.png 2x, /img/empty-account-3x.png 3x"
        alt="Doc-soup"
        styles={{ root: { marginBottom: 30 } }}
      />
      <Text styles={{ root: { fontSize: 20, fontWeight: 'bold', marginBottom: 14 } }}>No Account</Text>
      <Text styles={{ root: { fontSize: 16, marginBottom: 40, textAlign: 'center' } }}>
        Connect your account and share the document.
      </Text>
      <PrimaryButton
        iconProps={{ iconName: 'share-svg' }}
        styles={{
          root: { minWidth: 120, borderRadius: 2 },
          label: { fontSize: 16, fontWeight: 500, letterSpacing: '0.5px' },
        }}
        onClick={() => _toggleDialog(MODAL_NAME.SHARE_FILE)}
      >
        Share
      </PrimaryButton>
      <ShareFileModal isOpen={modalName === MODAL_NAME.SHARE_FILE} onToggle={_toggleDialog} />
    </Stack>
  );
}

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomModal, CustomText } from 'features/shared/components';
import { Stack, Text } from '@fluentui/react';
import { copyToClipboard } from 'features/shared/lib/utils';
import { success } from 'features/shared/components/ToastMessage';
import CustomButton from '../CustomButton';

const wrapperStyles = {
  root: {
    maxWidth: 420,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 48,
  },
};
const linkStyles = {
  root: {
    maxWidth: 420,
    overflow: 'hidden',
    textAlign: 'center',
  },
};
const subTextStyles = {
  root: {
    textAlign: 'center',
  },
};
export default function CreatedLinkModal(props) {
  const { isOpen, onToggle, createdLink } = props;
  const [isCopied, setIsCopied] = useState();

  const _toggleHideModal = () => {
    setIsCopied(false);
    onToggle();
  };

  const _copyToClipboard = () => {
    copyToClipboard(createdLink?.link);
    setIsCopied(true);
    onToggle();
    success('Link copied to clipboard.');
  };
  return (
    <CustomModal isOpen={isOpen} onDismiss={_toggleHideModal}>
      <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }} styles={wrapperStyles}>
        <CustomText block variant="xLargePlus" color="textSuccess">
          Your link has been created
        </CustomText>
        <CustomText block color="textSecondary" styles={subTextStyles}>
          Copy and paste the link below into an email or wherever you want to send it.
        </CustomText>
        <Text block variant="mediumPlus" styles={linkStyles}>
          {createdLink?.link}
        </Text>
        <CustomButton primary size="medium" text={isCopied ? 'Copied!' : 'Copy link'} onClick={_copyToClipboard} />
      </Stack>
    </CustomModal>
  );
}
CreatedLinkModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  createdLink: PropTypes.shape({
    link: PropTypes.string,
    linkName: PropTypes.string,
  }),
};
CreatedLinkModal.defaultProps = {
  createdLink: {},
};

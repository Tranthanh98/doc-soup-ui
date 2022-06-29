import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  getTheme,
  mergeStyleSets,
  Stack,
  FontWeights,
  IconButton,
  Text,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import CustomButton from '../CustomButton';

const theme = getTheme();
const classNames = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    {
      flex: '1 1 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      paddingTop: theme.spacing.l1,
      paddingRight: theme.spacing.m,
      paddingBottom: theme.spacing.m,
      paddingLeft: 24,
    },
  ],
  body: {
    position: 'relative',
    flex: '4 4 auto',
    padding: 24,
    paddingTop: 0,
    overflow: 'auto',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        padding: 15,
      },
    },
  },
});
const modalStyles = (isFull) => ({
  main: {
    selectors: isFull
      ? {
          [BREAKPOINTS_RESPONSIVE.mdDown]: {
            minWidth: '100%',
            minHeight: '100%',
            borderRadius: 0,
          },
        }
      : {},
  },
  scrollableContent: {
    maxHeight: '95vh',
  },
});
const closeButtonIconStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.bold,
    margin: 4,
    height: 'auto',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
const stackFooterStyles = {
  root: {
    marginTop: 32,
  },
};

export default function CustomModal(props) {
  const {
    title,
    isOpen,
    children,
    onDismiss,
    primaryButtonText,
    primaryButtonProps,
    cancelButtonProps,
    modalProps,
    footerLeft,
    isSubmitting,
    onPrimaryButtonClick,
    isFull,
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      isBlocking
      styles={{ ...modalStyles(isFull), ...modalProps?.styles }}
      {...modalProps}
    >
      <div className={classNames.header}>
        <Text variant="xLarge">{title}</Text>
        <IconButton
          styles={closeButtonIconStyles}
          iconProps={{ iconName: 'Cancel' }}
          ariaLabel="Close popup modal"
          onClick={onDismiss}
        />
      </div>
      <div className={classNames.body}>
        {children}
        {(footerLeft || (onPrimaryButtonClick && primaryButtonText) || primaryButtonProps) && (
          <Stack
            wrap
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            tokens={{ childrenGap: 8 }}
            styles={stackFooterStyles}
          >
            <Stack.Item grow={1}>{footerLeft}</Stack.Item>
            <Stack grow={1} horizontal horizontalAlign="end" tokens={{ childrenGap: 12 }}>
              {isSubmitting && <Spinner size={SpinnerSize.medium} />}
              <CustomButton text="Cancel" onClick={onDismiss} size="large" {...cancelButtonProps} />
              <CustomButton
                primary
                text={primaryButtonText}
                for="upload-file-input"
                size="large"
                onClick={onPrimaryButtonClick}
                {...primaryButtonProps}
              />
            </Stack>
          </Stack>
        )}
      </div>
    </Modal>
  );
}
CustomModal.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  footerLeft: PropTypes.node,
  onPrimaryButtonClick: PropTypes.func,
  primaryButtonText: PropTypes.string,
  isSubmitting: PropTypes.bool,
  modalProps: PropTypes.oneOfType([PropTypes.object]),
  primaryButtonProps: PropTypes.oneOfType([PropTypes.object]),
  cancelButtonProps: PropTypes.oneOfType([PropTypes.object]),
  isFull: PropTypes.bool,
};
CustomModal.defaultProps = {
  title: '',
  primaryButtonText: 'OK',
  footerLeft: undefined,
  onPrimaryButtonClick: undefined,
  cancelButtonProps: undefined,
  isSubmitting: false,
  primaryButtonProps: undefined,
  modalProps: undefined,
  isFull: true,
};

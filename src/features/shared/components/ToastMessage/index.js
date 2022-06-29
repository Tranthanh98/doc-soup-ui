import { Icon, mergeStyleSets, Stack, Text } from '@fluentui/react';
import React from 'react';
import { toast } from 'react-toastify';

const iconStyle = {
  root: { width: 36, height: 36 },
};

const textStyle = {
  root: { color: 'white', marginLeft: 10 },
};

const classes = mergeStyleSets({
  toastContent: {
    minHeight: '48px !important',
  },
});

const baseToast = (message, iconName) => {
  return toast(
    <Stack horizontal verticalAlign="center">
      <Text variant="medium" styles={textStyle}>
        {message}
      </Text>
    </Stack>,
    {
      icon: <Icon iconName={iconName} styles={iconStyle} />,
      style: {
        width: 'max-content',
        height: 'fit-content',
        padding: '0 14px',
        maxWidth: 'calc(100vw - 60px)',
        wordBreak: 'break-word',
      },
      className: classes.toastContent,
    }
  );
};

export const success = (message) => {
  return baseToast(message, 'success-toast-svg');
};

export const error = (message) => {
  return baseToast(message, 'error-toast-svg');
};

const ToastMessage = { success, error };
export default ToastMessage;

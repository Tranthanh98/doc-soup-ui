import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogType, DialogFooter, createTheme, ThemeProvider } from '@fluentui/react';
import { LIGHT_THEME } from 'core/constants/Theme';
import CustomButton from '../CustomButton';

export default function AlertComponent({ title, subText, content, actionText, onClose, hideFooter }) {
  const [isHidden, setIsHidden] = useState(false);
  const theme = createTheme(LIGHT_THEME);
  const _handelDismiss = () => {
    onClose();
    setIsHidden(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        hidden={isHidden}
        onDismiss={_handelDismiss}
        modalProps={{ isBlocking: true }}
        dialogContentProps={{
          type: DialogType.normal,
          title,
          subText,
        }}
      >
        {content}
        {!hideFooter && (
          <DialogFooter>
            <CustomButton primary size="medium" onClick={_handelDismiss} text={actionText} />
          </DialogFooter>
        )}
      </Dialog>
    </ThemeProvider>
  );
}
AlertComponent.propTypes = {
  title: PropTypes.string,
  subText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  actionText: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  hideFooter: PropTypes.bool,
};
AlertComponent.defaultProps = {
  title: 'Alert',
  subText: '',
  actionText: 'OK',
  content: undefined,
  hideFooter: false,
};

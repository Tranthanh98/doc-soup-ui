import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogType, DialogFooter, createTheme, ThemeProvider } from '@fluentui/react';
import { LIGHT_THEME } from 'core/constants/Theme';
import CustomButton from '../CustomButton';

export default function ConfirmComponent(props) {
  const { minWidth, title, subText, content, yesAction, noAction, yesText, noText, yesButtonProps, noButtonProps } =
    props;
  const [isHidden, setIsHidden] = useState(false);
  const theme = createTheme(LIGHT_THEME);
  const _handelDismiss = () => {
    noAction();
    setIsHidden(true);
  };
  const _handelYes = () => {
    yesAction();
    setIsHidden(true);
  };
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        hidden={isHidden}
        onDismiss={_handelDismiss}
        modalProps={{ isBlocking: true }}
        minWidth={minWidth}
        dialogContentProps={{
          type: DialogType.normal,
          title,
          subText,
        }}
      >
        {content}
        <DialogFooter>
          <CustomButton size="medium" onClick={_handelDismiss} text={noText} {...noButtonProps} />
          <CustomButton primary size="medium" onClick={_handelYes} text={yesText} {...yesButtonProps} />
        </DialogFooter>
      </Dialog>
    </ThemeProvider>
  );
}

ConfirmComponent.propTypes = {
  minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  subText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  yesText: PropTypes.string,
  noText: PropTypes.string,
  yesAction: PropTypes.func.isRequired,
  noAction: PropTypes.func.isRequired,
  yesButtonProps: PropTypes.oneOfType([PropTypes.object]),
  noButtonProps: PropTypes.oneOfType([PropTypes.object]),
};

ConfirmComponent.defaultProps = {
  minWidth: 373,
  title: 'Confirm',
  subText: '',
  content: undefined,
  yesText: 'Yes',
  noText: 'No',
  yesButtonProps: undefined,
  noButtonProps: undefined,
};

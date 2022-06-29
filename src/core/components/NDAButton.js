import React from 'react';
import { ThemeContext, TooltipHost, DefaultButton } from '@fluentui/react';
import PropTypes from 'prop-types';

export default function NDAButton(props) {
  const { isDisplayTooltip } = props;
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <TooltipHost hidden={!isDisplayTooltip} content="Download signed NDA">
          <DefaultButton
            styles={{
              root: {
                minWidth: 39,
                color: `${theme.palette.orangeLight} !important`,
                backgroundColor: theme.palette.themeLighterAlt,
                border: `1.2px solid`,
                borderColor: theme.palette.themePrimary,
                borderRadius: '10px !important',
                padding: 2,
                height: '20px !important',
              },
              label: { lineHeight: 0, fontSize: 12, fontWeight: 'normal' },
            }}
            allowDisabledFocus
            text="NDA"
            {...props}
          />
        </TooltipHost>
      )}
    </ThemeContext.Consumer>
  );
}
NDAButton.propTypes = {
  isDisplayTooltip: PropTypes.bool,
};
NDAButton.defaultProps = {
  isDisplayTooltip: true,
};

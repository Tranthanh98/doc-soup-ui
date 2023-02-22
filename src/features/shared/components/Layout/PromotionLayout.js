import React from 'react';
import { FontWeights, Icon, Stack, Text, ThemeContext } from '@fluentui/react';
import PropTypes from 'prop-types';
import { CustomText } from 'features/shared/components';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const planTierWrapper = (theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    padding: '20px 30px',
    backgroundColor: theme.palette.themeLighterAlt,
    overflowY: 'auto',
  },
});

const planContentStyles = {
  root: {
    width: '100%',
    marginTop: 48,
    flexGrow: 1,
  },
};

const titleStyles = {
  root: {
    fontSize: 36,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
  },
};

const footerStyles = {
  root: {
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      flexFlow: 'column nowrap',
      alignItems: 'flex-start',
    },
  },
};

export default function PlanLayout({ title, onPrevious, children, propsTitles }) {
  return (
    <ThemeContext.Consumer>
      {(theme) => {
        return (
          <Stack styles={planTierWrapper(theme)} tokens={{ childrenGap: 28 }}>
            <Stack>
              <Icon
                styles={{ root: { cursor: 'pointer', width: 28, height: 28 } }}
                iconName="arrow-back"
                onClick={onPrevious}
              />
            </Stack>
            <Stack
              styles={{ root: { marginTop: 48, width: '100%' } }}
              horizontal
              horizontalAlign="center"
              verticalAlign="center"
            >
              <Stack
                styles={{ root: { width: '100%', maxWidth: 1024 } }}
                horizontal
                horizontalAlign="center"
                verticalAlign="center"
              >
                <Text styles={titleStyles} {...propsTitles}>
                  {title}
                </Text>
              </Stack>
            </Stack>
            <Stack styles={planContentStyles} horizontal horizontalAlign="center" verticalAlign="start">
              {children}
            </Stack>
            <Stack styles={footerStyles} horizontal horizontalAlign="space-between" verticalAlign="center">
              <CustomText color="textSecondary">©2004–2022 ePapyrus Inc. All Rights Reserved</CustomText>
              <CustomText color="textSecondary">support@epapyrus.com</CustomText>
            </Stack>
          </Stack>
        );
      }}
    </ThemeContext.Consumer>
  );
}

PlanLayout.propTypes = {
  title: PropTypes.string.isRequired,
  onPrevious: PropTypes.func.isRequired,
  propsTitles: PropTypes.oneOfType([PropTypes.object]),
};

PlanLayout.defaultProps = {
  propsTitles: {},
};

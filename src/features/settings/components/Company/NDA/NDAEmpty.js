import React from 'react';
import { ThemeContext, Stack, Text } from '@fluentui/react';

const emptyStyles = (theme) => ({
  root: {
    background: theme.palette.neutralLight,
    paddingLeft: theme.spacing.m,
    paddingTop: theme.spacing.l2,
    paddingBottom: theme.spacing.l2,
  },
});
const textEmptyStyles = (theme) => ({
  root: {
    color: theme.palette.neutralSecondaryAlt,
  },
});

export default function NDAEmpty() {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Stack verticalAlign="center" styles={emptyStyles(theme)}>
          <Text styles={textEmptyStyles(theme)}>You currently don’t have any active NDAs.</Text>
        </Stack>
      )}
    </ThemeContext.Consumer>
  );
}

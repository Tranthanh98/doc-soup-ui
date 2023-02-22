import { Stack, Text, ThemeContext } from '@fluentui/react';
import React from 'react';

function EmptyDataRoom() {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Stack styles={{ root: { padding: '18px 16px', backgroundColor: theme.palette.neutralLight } }}>
          <Text>This folder is empty</Text>
        </Stack>
      )}
    </ThemeContext.Consumer>
  );
}

export default EmptyDataRoom;

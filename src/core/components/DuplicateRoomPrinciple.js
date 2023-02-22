import React from 'react';
import { ThemeContext, Stack } from '@fluentui/react';
import { CustomText } from 'features/shared/components';
import Resource from 'core/constants/Resource';

const stackStyles = (theme) => ({
  root: {
    background: theme.palette.neutralLight,
    width: 350,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default function DuplicateRoomPrinciple() {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <>
          <Stack tokens={{ padding: 12 }} styles={stackStyles(theme)}>
            <CustomText block variant="smallPlus" color="textSecondary" styles={{ root: { marginBottom: 10 } }}>
              {Resource.DUPLICATE_DATA_ROOM}
            </CustomText>
            <CustomText block variant="small" color="textSecondary">
              ∙ Content in the Trash
            </CustomText>
            <CustomText block variant="small" color="textSecondary">
              ∙ Content you don&rsquo;t have access to
            </CustomText>
          </Stack>
        </>
      )}
    </ThemeContext.Consumer>
  );
}

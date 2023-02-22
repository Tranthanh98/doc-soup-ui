import React from 'react';
import { createTheme, Stack, ThemeContext } from '@fluentui/react';
import { RED_BUTTON_THEME } from 'core/constants/Theme';
import { CustomText } from 'features/shared/components';
import Resource from 'core/constants/Resource';
import PersonalItem from './PersonalItem';

const personaWrapperStyles = (theme) => ({
  root: {
    backgroundColor: theme.palette.neutralLight,
    padding: '16px 20px',
    marginBottom: 12,
  },
});
export default function ConfirmRemoveCollaboratorDialog(props) {
  const { dataRoom, user, onConfirm } = props;
  return window.confirm({
    minWidth: 440,
    title: Resource.WARNING_DELETE_USER_DATA_ROOM.format(user.fullName, dataRoom.name),
    yesButtonProps: { text: 'Yes, remove  collaborator', theme: createTheme(RED_BUTTON_THEME) },
    noText: 'Cancel',
    subText: (
      <ThemeContext.Consumer>
        {(theme) => (
          <>
            <Stack styles={personaWrapperStyles(theme)}>
              <PersonalItem item={user} />
            </Stack>
            <CustomText block color="textSecondary">
              {Resource.DELETE_DATAROOM_USER_MESSAGE}
            </CustomText>
            <br />
          </>
        )}
      </ThemeContext.Consumer>
    ),
    yesAction: onConfirm,
  });
}

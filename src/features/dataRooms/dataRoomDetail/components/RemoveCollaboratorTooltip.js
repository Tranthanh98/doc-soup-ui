import React from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  ThemeProvider,
  TooltipHost,
  Persona,
  PersonaSize,
  Text,
  FontWeights,
  PrimaryButton,
} from '@fluentui/react';
import { RED_BUTTON_THEME } from 'core/constants/Theme';

export default function RemoveCollaboratorTooltip(props) {
  const { children, user, onClickRemove } = props;
  const isOwner = user?.isOwner;

  const renderToolTipContent = () => (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8, padding: 8 }}>
      <Persona hidePersonaDetails size={PersonaSize.size32} text={user?.fullName} />
      <Stack.Item>
        <Text block styles={{ root: { fontWeight: FontWeights.semibold, color: 'inherit' } }}>
          {user?.fullName}
        </Text>
        <Text block variant="smallPlus" styles={{ root: { color: 'inherit' } }}>
          {user?.email}
        </Text>
      </Stack.Item>
      {!isOwner && (
        <ThemeProvider theme={RED_BUTTON_THEME} style={{ background: 'transparent' }}>
          <PrimaryButton title="Remove" text="Remove" onClick={() => onClickRemove(user)} />
        </ThemeProvider>
      )}
    </Stack>
  );

  return <TooltipHost tooltipProps={{ onRenderContent: renderToolTipContent }}>{children}</TooltipHost>;
}
RemoveCollaboratorTooltip.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onClickRemove: PropTypes.func.isRequired,
};

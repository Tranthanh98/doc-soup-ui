import React from 'react';
import { Icon, Persona, PersonaSize, SearchBox, Stack, Text, ThemeContext } from '@fluentui/react';
import { CustomText } from 'features/shared/components';
import { LIGHT_THEME } from 'core/constants/Theme';
import PropTypes from 'prop-types';
import Resource from 'core/constants/Resource';

const stackStyles = (theme) => ({
  root: {
    background: theme.palette.neutralLight,
    width: 350,
    borderRadius: 4,
  },
});

const textHeaderDes = {
  root: {
    marginBottom: 10,
    fontSize: 13,
    letterSpacing: -0.5,
    color: `${LIGHT_THEME.palette.neutralSecondaryAlt}`,
  },
};

const textHeaderTitle = {
  root: {
    marginBottom: 10,
    fontSize: 13,
    letterSpacing: -0.5,
    color: `${LIGHT_THEME.palette.neutralSecondaryAlt}`,
    fontWeight: 500,
  },
};

const headerTitleSelectUser = {
  root: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 12,
    letterSpacing: -0.5,
    lineHeight: 1,
    color: `${LIGHT_THEME.palette.neutralPrimary}`,
  },
};

const usernameStyles = {
  root: {
    fontSize: 14,
    letterSpacing: -0.5,
    fontWeight: 500,
    color: `${LIGHT_THEME.palette.neutralPrimary}`,
  },
};

const emailStyles = {
  root: {
    fontSize: 13,
    letterSpacing: -0.5,
    fontWeight: 500,
    color: `${LIGHT_THEME.palette.neutralPrimary}`,
  },
};

const iconStyles = {
  root: {
    margin: '24px auto',
    transform: `rotate(-90deg) scaleY(-1)`,
  },
  icon: {
    fill: `${LIGHT_THEME.palette.neutralQuaternaryAlt}`,
  },
};

export default function HeaderFormTransferData(props) {
  const { user, transferUser, onRemove, searchUser } = props;

  return (
    <ThemeContext.Consumer>
      {(theme) => {
        return (
          <>
            <Stack tokens={{ padding: 12 }} styles={stackStyles(theme)}>
              <CustomText block variant="smallPlus" color="textSecondary" styles={textHeaderDes}>
                {Resource.TRANSFER_USER_DATA}
              </CustomText>
              <CustomText block variant="small" color="textSecondary" styles={textHeaderTitle}>
                {Resource.WARNING_TRANSFER_USER_DATA}
              </CustomText>
            </Stack>
            <Stack>
              <Text styles={headerTitleSelectUser}> Selected User </Text>
              <Stack tokens={{ padding: '12px 16px' }} styles={stackStyles(theme)}>
                <Stack horizontal verticalAlign="center">
                  <Persona
                    hidePersonaDetails
                    size={PersonaSize.size32}
                    initialsColor={theme.palette.greenLight}
                    text={user.fullName}
                  />
                  <Stack styles={{ root: { paddingLeft: 8 } }}>
                    <Text styles={usernameStyles}> {user.fullName}</Text>
                    <Text style={emailStyles}> {user.email}</Text>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Stack verticalAlign="center">
              <Icon styles={iconStyles} iconName="arrow-back" />
            </Stack>
            {transferUser ? (
              <Stack style={{ marginBottom: 20 }}>
                <Text styles={{ root: { marginBottom: 8 } }}>Transfer all data to</Text>
                <Stack tokens={{ padding: '12px 16px' }} styles={stackStyles(theme)}>
                  <Stack horizontal verticalAlign="center">
                    <Persona
                      hidePersonaDetails
                      size={PersonaSize.size32}
                      initialsColor={theme.palette.greenLight}
                      text={transferUser?.fullName}
                    />
                    <Stack styles={{ root: { paddingLeft: 8, flexGrow: 1 } }}>
                      <Text styles={usernameStyles}> {transferUser?.fullName}</Text>
                      <Text style={emailStyles}> {transferUser?.email}</Text>
                    </Stack>

                    <Stack>
                      <Icon
                        iconName="CircleAdditionSolid"
                        styles={{
                          root: {
                            transform: 'rotate(45deg)',
                            fontSize: 24,
                            color: LIGHT_THEME.palette.gray,
                            cursor: 'pointer',
                          },
                        }}
                        onClick={onRemove}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            ) : (
              <SearchBox
                placeholder="Search"
                iconProps={{ iconName: 'search-svg' }}
                onSearch={searchUser}
                onChange={(_, value) => searchUser(value)}
              />
            )}
          </>
        );
      }}
    </ThemeContext.Consumer>
  );
}
HeaderFormTransferData.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object]).isRequired,
  transferUser: PropTypes.oneOfType([PropTypes.object]),
  onRemove: PropTypes.func.isRequired,
  searchUser: PropTypes.func.isRequired,
};

HeaderFormTransferData.defaultProps = {
  transferUser: undefined,
};

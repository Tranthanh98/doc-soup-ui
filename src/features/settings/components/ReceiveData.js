import { Persona, PersonaSize, Stack, Text, ThemeContext } from '@fluentui/react';
import { LIGHT_THEME } from 'core/constants/Theme';
import React from 'react';

import PropTypes from 'prop-types';

const stackStyles = {
  root: {
    width: 350,
    maxHeight: 192,
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'auto',
    '&:last-child': {
      paddingBottom: `0px !important`,
    },
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

export default function ReceiveData(props) {
  const { users, transferUser, handleSelectTransferUser } = props;
  return (
    <ThemeContext.Consumer>
      {(theme) => {
        return (
          <Stack tokens={{ padding: '12px 0px' }} styles={stackStyles}>
            {users?.length > 0 ? (
              users?.map((user, index) => {
                return (
                  <Stack
                    horizontal
                    verticalAlign="center"
                    key={index}
                    onClick={() => handleSelectTransferUser && handleSelectTransferUser(user)}
                    styles={{
                      root: {
                        cursor: 'pointer',
                        padding: '8px 20px',
                        '&:hover': {
                          backgroundColor: `${theme.palette.themeLighterAlt}`,
                        },
                        backgroundColor:
                          transferUser?.userId === user?.userId ? theme.palette.themeLighterAlt : undefined,
                      },
                    }}
                  >
                    <Persona hidePersonaDetails size={PersonaSize.size32} text={user.fullName} />
                    <Stack styles={{ root: { paddingLeft: 8 } }}>
                      <Text styles={usernameStyles}> {user.fullName}</Text>
                      <Text style={emailStyles}> {user.email}</Text>
                    </Stack>
                  </Stack>
                );
              })
            ) : (
              <Stack
                styles={{ root: { padding: '20px 0' } }}
                horizontal
                horizontalAlign="center"
                verticalAlign="center"
              >
                <Text>Not users found</Text>
              </Stack>
            )}
          </Stack>
        );
      }}
    </ThemeContext.Consumer>
  );
}
ReceiveData.propTypes = {
  users: PropTypes.oneOfType([PropTypes.array]).isRequired,
  transferUser: PropTypes.oneOfType([PropTypes.object]),
  handleSelectTransferUser: PropTypes.func.isRequired,
};

ReceiveData.defaultProps = {
  transferUser: undefined,
};

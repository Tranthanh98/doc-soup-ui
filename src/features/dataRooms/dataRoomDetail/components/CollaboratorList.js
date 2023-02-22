import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { Stack, ThemeContext, Facepile, PersonaSize, OverflowButtonType, IconButton } from '@fluentui/react';
import { ACTION_LIMITATION, FEATURE_KEYS } from 'core/constants/Const';
import withLimitationFeature from 'features/shared/HOCs/withLimitationFeature';
import { error } from 'features/shared/components/ToastMessage';
import AddCollaboratorModal from './AddCollaboratorModal';
import RemoveCollaboratorTooltip from './RemoveCollaboratorTooltip';
import ConfirmRemoveCollaboratorDialog from './ConfirmRemoveCollaboratorDialog';

const inviteWrapperStyles = (theme) => ({
  root: { borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}` },
});
const inviteButtonStyles = (theme) => ({
  root: { paddingBottom: 6 },
  icon: {
    width: 24,
    height: 24,
    fill: theme.palette.white,
    background: theme.palette.neutralQuaternary,
    borderRadius: 7,
  },
  iconHovered: {
    background: theme.palette.neutralQuaternaryAlt,
  },
});
const facepileStyles = {
  root: { marginBottom: -2 },
  member: { marginRight: 6 },
  itemButton: {
    cursor: 'pointer',
    height: 32,
  },
};
const facepilePersonaStyles = (props, user) => {
  const borderStyles = `2px solid ${props.theme.palette.themePrimary}`;
  return {
    root: {
      alignItems: 'stretch',
      height: '100%',
    },
    coin: {
      height: '100%',
      borderBottom: user.isOwner && borderStyles,
      background: 'transparent',
      borderRadius: 0,
    },
    initials: {
      selectors: {
        '&:hover': {
          border: borderStyles,
          lineHeight: 20,
        },
      },
    },
  };
};

const InviteUserButton = withLimitationFeature(ACTION_LIMITATION.DISABLED, [FEATURE_KEYS.TotalAssetsInSpace])(
  IconButton
);

class CollaboratorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitedUsers: [],
      companyUsers: [],
      isOpenAddModal: false,
      isSubmitting: false,
    };
  }

  componentDidMount() {
    this._listAllCompanyUsers();
  }

  _toggleDialog = () => {
    this.setState((state) => ({ isOpenAddModal: !state.isOpenAddModal }));
  };

  _listAllCompanyUsers = () => {
    const { getToken } = this.context;
    const { dataRoom } = this.props;
    new RestService()
      .setPath(`/company/${dataRoom?.companyId}/user`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          this.setState({ companyUsers: res.data }, this._listAllInvitedUsers());
        }
      })
      .catch((err) => error(err.message));
  };

  _listAllInvitedUsers = () => {
    const { getToken } = this.context;
    const { dataRoom } = this.props;
    new RestService()
      .setPath(`/data-room/${dataRoom.id}/user`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const dataRoomOwner = {
            personaName: dataRoom.ownerFullName,
            fullName: dataRoom.ownerFullName,
            email: dataRoom.ownerEmail,
            userId: dataRoom.accountId,
            isOwner: true,
          };
          let invitedUsers = res.data.map((e) => ({ ...e, personaName: e.fullName }));
          invitedUsers = [dataRoomOwner, ...invitedUsers];

          const invitedUsersObject = invitedUsers.reduce((obj, user) => {
            return { ...obj, [user.userId]: user };
          }, {});

          this.setState((state) => ({
            invitedUsers,
            companyUsers: state.companyUsers.map((user) => ({ ...user, invited: invitedUsersObject[user.userId] })),
          }));
        }
      });
  };

  _addUsers = (users, addUserSuccessed) => {
    this.setState({ isSubmitting: true });
    const { getToken } = this.context;
    const { dataRoom } = this.props;
    const addPromises = users.map((user) =>
      new RestService().setPath(`/data-room/${dataRoom.id}/user/${user?.userId}`).setToken(getToken()).post({})
    );
    Promise.all(addPromises)
      .then(() => {
        this._listAllInvitedUsers();
        addUserSuccessed();
      })
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => this.setState({ isSubmitting: false }));
  };

  _confirmRemoveUser = (user) => {
    const { getToken } = this.context;
    const { dataRoom } = this.props;
    new RestService()
      .setPath(`/data-room/${dataRoom.id}/user/${user?.userId}`)
      .setToken(getToken())
      .delete()
      .then(() => this._listAllInvitedUsers())
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _initRemoveUser = (user) => {
    const { dataRoom } = this.props;
    ConfirmRemoveCollaboratorDialog({
      dataRoom,
      user,
      onConfirm: () => this._confirmRemoveUser(user),
    });
  };

  _renderPersonaCoin = (user, defaultRenderer) => (
    <RemoveCollaboratorTooltip user={user} onClickRemove={this._initRemoveUser}>
      {defaultRenderer({ ...user })}
    </RemoveCollaboratorTooltip>
  );

  render() {
    const { invitedUsers, companyUsers, isOpenAddModal, isSubmitting } = this.state;
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <Stack horizontal verticalAlign="center" styles={inviteWrapperStyles(theme)}>
            <Facepile
              showTooltip={false}
              personaSize={PersonaSize.size24}
              personas={invitedUsers}
              maxDisplayablePersonas={5}
              styles={facepileStyles}
              getPersonaProps={(user) => ({
                imageShouldFadeIn: true,
                hidePersonaDetails: true,
                styles: (props) => facepilePersonaStyles(props, user),
              })}
              overflowButtonType={OverflowButtonType.descriptive}
              overflowButtonProps={{
                ariaLabel: 'More users',
                onClick: () => console.log('overflow icon clicked'),
              }}
              onRenderPersona={this._renderPersonaCoin}
              onRenderPersonaCoin={this._renderPersonaCoin}
              ariaDescription="To move through the items use left and right arrow keys."
              ariaLabel="List of personas"
            />
            <InviteUserButton
              iconProps={{ iconName: 'plus-svg' }}
              title="Invite Collaborator"
              ariaLabel="Invite Collaborator"
              styles={inviteButtonStyles(theme)}
              onClick={this._toggleDialog}
            />
            <AddCollaboratorModal
              {...this.props}
              isOpen={isOpenAddModal}
              users={companyUsers}
              invitedUsers={invitedUsers}
              isSubmitting={isSubmitting}
              onToggle={this._toggleDialog}
              onSubmitAdd={this._addUsers}
            />
          </Stack>
        )}
      </ThemeContext.Consumer>
    );
  }
}
CollaboratorList.propTypes = {
  dataRoom: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
CollaboratorList.contextType = GlobalContext;
export default CollaboratorList;

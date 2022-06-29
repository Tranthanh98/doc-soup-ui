/* eslint-disable max-lines */
import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import {
  Stack,
  SearchBox,
  PrimaryButton,
  Text,
  FontWeights,
  ThemeContext,
  Separator,
  TextField,
  CommandBar,
  IconButton,
} from '@fluentui/react';
import * as Yup from 'yup';
import {
  MODAL_NAME,
  USER_ROLES,
  REGEX,
  USER_ROLE_OPTIONS,
  COMPANY_USER_STATUS,
  COMPANY_USER_STATUS_NAME,
} from 'core/constants/Const';
import { CustomModal, CustomText, ModalForm, ToastMessage } from 'features/shared/components';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { success } from 'features/shared/components/ToastMessage';
import fileHelper from 'features/shared/lib/fileHelper';
import Resource from 'core/constants/Resource';
import HeaderFormTransferData from '../../HeaderFormTransferData';
import ReceiveData from '../../ReceiveData';
import UserList from './UserList';

const stackItemStyles = (theme) => ({
  root: {
    padding: 20,
    paddingBottom: 0,
    width: '100%',
    backgroundColor: theme.palette.grayLight,
    [BREAKPOINTS_RESPONSIVE.md]: {
      padding: `20px 30px`,
    },
  },
});
const wrapperForm = {
  root: {
    [BREAKPOINTS_RESPONSIVE.md]: {
      maxWidth: 648,
      width: '100%',
      margin: 'auto',
    },
    [BREAKPOINTS_RESPONSIVE.sm]: {
      maxWidth: 300,
      margin: 'auto',
    },
  },
};

const searchAreaStyle = {
  root: {
    position: 'relative',
  },
};

const searchBoxStyle = {
  root: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0,
    minWidth: 240,
    height: 30,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '100%',
      top: 42,
    },
  },
};

const renderRoleDescription = () => (
  <CustomText variant="small" color="textSecondary">
    This role will be applied to everyone listed above
  </CustomText>
);

const addUserFormSchema = {
  formTitle: 'Add users',
  submitBtnName: 'Send invite',
  cancleBtnName: 'Cancel',
  validateOnBlur: true,
  formSchema: [
    {
      inputProps: {
        label: 'Email address',
        id: 'email',
        name: 'email',
        type: 'text',
        placeholder: 'email1@example.com, email2@example.com',
        required: true,
        minLength: 3,
        maxLength: 200,
        autoFocus: true,
        styles: {
          fieldGroup: {
            minWidth: 492,
            height: 40,
            [BREAKPOINTS_RESPONSIVE.mdDown]: {
              minWidth: 282,
            },
          },
        },
      },
      validationSchema: Yup.string()
        .required()
        .test('email', 'Please check the formatting of email', (value) => {
          const emails = value?.replace(/\s/g, '')?.split(',');
          let isAllEmailValid = true;
          emails?.forEach((email) => {
            if (!email.match(REGEX.EMAIL)) {
              isAllEmailValid = false; // check is an valid email
            }
          });
          return isAllEmailValid;
        }),
    },
    {
      inputProps: {
        label: 'Role',
        id: 'role',
        name: 'role',
        type: 'select',
        options: USER_ROLE_OPTIONS,
        defaultSelectedKey: USER_ROLES.c_member,
        required: true,
        styles: { dropdown: { width: 194 } },
      },
      initialValue: USER_ROLES.c_member,
      onRenderBottom: renderRoleDescription,
    },
  ],
};

const addUsersBtnStyle = {
  root: {
    width: 95,
    height: 40,
    borderRadius: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: `SourceHanSansKR`,
    letterSpacing: -0.5,
  },
};

const titleUsersStyles = {
  root: {
    fontWeight: FontWeights.semibold,
    color: `${LIGHT_THEME.palette.neutralPrimary}`,
  },
};

const CONFIRM_TEXT = 'TRANSFER';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      users: [],
      account: {},
      selectedUser: {},
      searchText: '',
      selectedStatus: COMPANY_USER_STATUS.ACTIVE,
      transferUser: null,
      confirmText: '',
    };
    this._allUsers = [];
  }

  componentDidMount() {
    this._getCompany();
  }

  renderTopForm = (user, transferUser, onRemove) => {
    return (
      <HeaderFormTransferData
        user={user}
        transferUser={transferUser}
        onRemove={onRemove}
        searchUser={this._handleSearchTextTransferUser}
      />
    );
  };

  _handleSearchTextTransferUser = (keyword) => {
    console.log('search textx:', keyword);
    this.setState({ searchText: keyword?.toLowerCase() });
  };

  _toggleDialog = (name) => {
    this.setState({ modalName: name, transferUser: null, confirmText: '' });
  };

  _getCompany = () => {
    const { getToken } = this.context;
    new RestService()
      .setPath('/account')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          this.setState({ account: res.data }, () => this._listUsers([COMPANY_USER_STATUS.ACTIVE]));
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _confirmAddUsers = (postData) => {
    const { getToken } = this.context;

    const { account, selectedStatus } = this.state;

    new RestService()
      .setPath(`/company/${account.activeCompanyId}/user`)
      .setToken(getToken())
      .post(postData)
      .then(() => {
        ToastMessage.success('User invited successfully.');
        this._listUsers(selectedStatus);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _askToAddUser = (values) => {
    const emails = values.email?.replace(/\s/g, '')?.split(',');
    this._toggleDialog();
    window.confirm({
      minWidth: 400,
      title: 'Are you sure you want to add these new teammates?',
      yesButtonProps: { text: 'Yes, invite them' },
      noText: 'Cancel',
      subText: (
        <>
          {emails.map((email, index) => (
            <React.Fragment key={index}>
              &bull; {email}
              <br />
            </React.Fragment>
          ))}
          <Text block styles={{ root: { color: 'inherit', marginTop: 24, marginBottom: 30 } }}>
            {Resource.INVITE_USER_TO_COMPANY}
          </Text>
        </>
      ),
      yesAction: () => this._confirmAddUsers({ role: values.role, emails }),
    });
  };

  _searchUser = (keyword) => {
    const { allUsers } = this.state;

    if (!keyword) {
      this.setState({ users: [...allUsers] });
      return;
    }

    const filterByProps = (key) => allUsers.filter((e) => e[key]?.toLowerCase()?.includes(keyword.toLowerCase()));

    let searchUser = filterByProps('fullName');
    if (!searchUser.length) {
      searchUser = filterByProps('email');
    }
    this.setState({ users: searchUser });
  };

  _checkIsActiveUer = (user) => {
    return parseInt(user.isActive, 10) !== 0;
  };

  _transferData = () => {
    const { account, selectedUser, transferUser, confirmText, selectedStatus } = this.state;

    const { getToken } = this.context;

    if (confirmText !== CONFIRM_TEXT) {
      return;
    }

    new RestService()
      .setPath(`/company/${account.activeCompanyId}/user/${selectedUser.userId}/transfer-data-to`)
      .setToken(getToken())
      .post({
        destinationAccountId: transferUser.userId,
      })
      .then(() => {
        success('We are processing the data transfer request. It may take up to 3 minutes to complete.');
        this._toggleDialog(undefined);
        this._listUsers(selectedStatus);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _openTransferDataModal = (user) => {
    this._toggleDialog(MODAL_NAME.TRANSFER_DATA);
    this.setState({ selectedUser: user });
  };

  _removeSelectedUser = (users, user) => {
    const resultUser = [];
    for (let index = 0; index < users?.length; index++) {
      const element = users[index];
      if (!(element === user)) {
        resultUser.push(element);
      }
    }
    return resultUser;
  };

  _listUsers = (status) => {
    const { account } = this.state;
    const { getToken } = this.context;

    this.setState({ users: [], allUsers: [], selectedStatus: status });

    if (account.activeCompanyId) {
      new RestService()
        .setPath(`/company/${account.activeCompanyId}/user`)
        .setToken(getToken())
        .get()
        .then((res) => {
          let users = [];

          if (status.includes(COMPANY_USER_STATUS.INVITED)) {
            users = res.data.filter((i) => !i.userId);
          } else {
            users = res.data.filter((i) => status.includes(i.status) && i.userId);
          }

          this._allUsers = res.data;

          this.setState({ users, allUsers: users });
        })
        .catch((err) => RestServiceHelper.handleError(err));
    }
  };

  handleSelectTransferUser = (user) => {
    this.setState({ transferUser: user, searchText: '' });
  };

  _handleRemoveTransferUser = () => {
    this.setState({ transferUser: undefined, confirmText: '' });
  };

  _handleExportUserList = () => {
    const { getToken } = this.context;
    const { account } = this.state;
    new RestService()
      .setPath(`company/${account.activeCompanyId}/export-user-list`)
      .setToken(getToken())
      .setResponseType('arraybuffer')
      .get()
      .then((response) => {
        fileHelper.download(
          response.data,
          response.headers['content-type'],
          `export-user-list-${account.activeCompanyId}.csv`
        );
      })
      .catch((err) => {
        window.alert('Export visits failed: ', err.message);
      });
  };

  render() {
    const { allUsers, modalName, users, selectedUser, account, transferUser, searchText, confirmText, selectedStatus } =
      this.state;

    const { isMobile } = this.context;

    let activeUsers = [];
    let statusName = '';

    if (!searchText) {
      activeUsers = this._allUsers.filter((i) => i.status === COMPANY_USER_STATUS.ACTIVE);
    } else {
      activeUsers = this._allUsers.filter(
        (i) =>
          i.status === COMPANY_USER_STATUS.ACTIVE &&
          (i.email.toLowerCase().includes(searchText) || i.fullName.toLowerCase().includes(searchText))
      );
    }

    if (selectedStatus && selectedStatus.length > 0) {
      if (selectedStatus.includes(COMPANY_USER_STATUS.ACTIVE)) {
        statusName = COMPANY_USER_STATUS_NAME.ACTIVE;
      } else {
        statusName = selectedStatus.includes(COMPANY_USER_STATUS.INVITED)
          ? COMPANY_USER_STATUS_NAME.INVITED
          : COMPANY_USER_STATUS_NAME.INACTIVE;
      }
    }

    return (
      <ThemeContext.Consumer>
        {(theme) => {
          return (
            <Stack styles={stackItemStyles(theme)}>
              <Stack.Item styles={wrapperForm}>
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                  <Text block variant="mediumPlus" styles={titleUsersStyles}>
                    Users/{statusName} ({allUsers?.length || 0})
                  </Text>
                  <Stack horizontal verticalAlign="center">
                    <CommandBar
                      styles={{
                        root: { marginRight: 10, height: '100%' },
                      }}
                      buttonAs={(props) => {
                        return (
                          <IconButton
                            {...props}
                            iconProps={{
                              iconName: 'More',
                              styles: { root: { color: LIGHT_THEME.palette.neutralPrimary, fontWeight: 600 } },
                            }}
                            styles={{
                              rootHovered: {
                                background: LIGHT_THEME.palette.neutralLight,
                              },
                              root: {
                                background: LIGHT_THEME.palette.grayLight,
                              },
                            }}
                          />
                        );
                      }}
                      items={[
                        {
                          key: 'More',
                          text: 'More',
                          iconOnly: true,
                          iconProps: { iconName: 'more-svg', styles: { root: { width: 20 } } },
                          menuIconProps: { style: { display: 'none' } },
                          subMenuProps: {
                            items: [
                              {
                                key: 'exportUserLIst',
                                text: 'Export user list',
                                onClick: this._handleExportUserList,
                              },
                            ],
                          },
                        },
                      ]}
                    />
                    <PrimaryButton
                      text="Add Users"
                      title="Add Users"
                      onClick={() => this._toggleDialog(MODAL_NAME.ADD_USER)}
                      styles={addUsersBtnStyle}
                    />
                  </Stack>
                </Stack>
                <br />
                <Stack horizontalAlign="space-between" styles={searchAreaStyle}>
                  <UserList
                    users={users}
                    allUsers={this._allUsers}
                    isActiveUser={this._checkIsActiveUer}
                    transferData={this._openTransferDataModal}
                    onChangeStatus={this._listUsers}
                    companyId={account.activeCompanyId}
                  />
                  <SearchBox
                    iconProps={{ iconName: 'search-svg' }}
                    placeholder="Search"
                    styles={searchBoxStyle}
                    onChange={(_, value) => this._searchUser(value)}
                    onSearch={this._searchUser}
                  />
                </Stack>
                <ModalForm
                  isOpen={modalName === MODAL_NAME.ADD_USER}
                  isCancel
                  formData={addUserFormSchema}
                  onToggle={this._toggleDialog}
                  onSubmit={this._askToAddUser}
                />
                <CustomModal
                  isOpen={modalName === MODAL_NAME.TRANSFER_DATA}
                  isCancel
                  onDismiss={this._toggleDialog}
                  title="Transfer user data"
                  primaryButtonText={isMobile ? 'Transfer' : 'Transfer user data'}
                  onPrimaryButtonClick={this._transferData}
                  primaryButtonProps={{
                    disabled: confirmText !== CONFIRM_TEXT,
                    styles: {
                      root: {
                        backgroundColor: LIGHT_THEME.palette.red,
                      },
                      rootDisabled: {
                        backgroundColor: LIGHT_THEME.palette.lightRed,
                        cursor: 'no-drop',
                      },
                    },
                  }}
                  isFull={false}
                >
                  {this.renderTopForm(selectedUser, transferUser, this._handleRemoveTransferUser)}
                  {!transferUser ? (
                    <ReceiveData
                      handleSelectTransferUser={this.handleSelectTransferUser}
                      users={this._removeSelectedUser(activeUsers, selectedUser)}
                      transferUser={transferUser}
                    />
                  ) : (
                    <Stack>
                      <Separator />
                      <CustomText styles={{ root: { fontSize: 13 } }} style={{ marginTop: 10 }}>
                        {Resource.TYPE_TEXT_TO_TRANSFER}
                      </CustomText>
                      <CustomText
                        styles={{ root: { fontSize: 13 } }}
                        style={{ marginTop: 8, marginBottom: 12 }}
                        color="red"
                      >
                        {Resource.WARNING_CONFIRM_TRANSFER}
                      </CustomText>
                      <TextField
                        onChange={({ target }) => this.setState({ confirmText: target.value })}
                        value={confirmText}
                        name="enter confirm text"
                      />
                    </Stack>
                  )}
                </CustomModal>
              </Stack.Item>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
Users.contextType = GlobalContext;
export default Users;

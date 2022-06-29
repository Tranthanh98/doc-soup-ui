import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  List,
  SearchBox,
  Separator,
  FontWeights,
  Text,
  Checkbox,
  makeStyles,
  IconButton,
} from '@fluentui/react';
import { CustomModal, CustomText } from 'features/shared/components';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import PersonalItem from '../PersonalItem';

const getClassNames = makeStyles((theme) => ({
  itemWrapper: {
    padding: '8px 0',
    '&:hover': { backgroundColor: theme.palette.neutralLight },
  },
  selectedItem: {},
  removeButtonStyles: {
    i: {
      width: 28,
      height: 28,
      fill: theme.palette.neutralQuaternary,
    },
    seletors: {
      '&:hover': {
        backgroundColor: 'none',
        i: { fill: theme.palette.red },
      },
    },
  },
}));
const noUserWrapperStyles = {
  root: {
    height: '65%',
  },
};
const stackContainerStyles = {
  root: {
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        flexDirection: 'column',
      },
    },
  },
};
const separatorStyles = {
  root: {
    padding: '0 20px',
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        padding: 0,
        '::after': {
          top: '50%',
          left: 0,
          width: 'auto',
          height: 1,
        },
      },
    },
  },
};
const usersWrapperStyles = {
  root: {
    selectors: {
      [BREAKPOINTS_RESPONSIVE.lgUp]: {
        minWidth: 300,
      },
      [BREAKPOINTS_RESPONSIVE.xlUp]: {
        minWidth: 440,
      },
    },
  },
};
export default function AddCollaboratorModal(props) {
  const classNames = getClassNames();
  const { isOpen, isSubmitting, dataRoom, users: usersProps, onToggle, onSubmitAdd } = props;
  const [selectedUsers, setSelectedUsers] = useState({});
  const [users, setUsers] = useState(usersProps);
  const selectedUsersList = Object.values(selectedUsers);

  useEffect(() => {
    setUsers(usersProps);
  }, [usersProps]);

  const _deselectUser = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      const newSelectedUsers = { ...prevSelectedUsers };
      delete newSelectedUsers[user.userId];
      return newSelectedUsers;
    });
  };

  const _changeSelectUser = (user) => {
    if (user.checked) {
      setSelectedUsers((prevSelectedUsers) => {
        return {
          ...prevSelectedUsers,
          [user.userId]: { ...user },
        };
      });
    } else {
      _deselectUser(user);
    }
  };

  const _searchUser = (keyword) => {
    if (!keyword) {
      setUsers(usersProps);
      return;
    }

    const lowCaseKeyword = keyword.toLowerCase();
    const searchByKey = (key) => usersProps.filter((e) => e[key]?.toLowerCase()?.includes(lowCaseKeyword));

    let searchedUsers = searchByKey('fullName'); // search by fullName of user
    if (!searchedUsers.length) {
      searchedUsers = searchByKey('email'); // search by email of user
    }
    setUsers(searchedUsers);
  };

  const _addUserSuccessed = () => {
    setSelectedUsers({});
    onToggle();
  };

  const _submitUser = () => {
    onSubmitAdd(selectedUsersList, _addUserSuccessed);
  };

  const onRenderUserItem = (item) => {
    return (
      <Stack
        wrap
        data-is-focusable
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between"
        className={classNames.itemWrapper}
      >
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 22 }}>
          <Checkbox
            disabled={item.invited}
            checked={!!(selectedUsers[item.userId] || item.invited)}
            onChange={(event, checked) => _changeSelectUser({ ...item, checked })}
          />
          <PersonalItem item={item} />
        </Stack>
        {item.invited && <Text variant="small">Invited users</Text>}
      </Stack>
    );
  };

  const onRenderSelectedUserItem = (item) => {
    return (
      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between"
        tokens={{ childrenGap: 22 }}
        className={`${classNames.itemWrapper} ${classNames.selectedItem}`}
      >
        <PersonalItem item={item} />
        <IconButton
          className={classNames.removeButtonStyles}
          iconProps={{ iconName: 'clear-svg' }}
          title="Remove"
          ariaLabel="Remove"
          onClick={() => _deselectUser(item)}
        />
      </Stack>
    );
  };

  return (
    <CustomModal
      title={`Add collaborators to ${dataRoom.name}`}
      isOpen={isOpen}
      onDismiss={onToggle}
      isSubmitting={isSubmitting}
      primaryButtonProps={{
        text: 'Add users',
        onClick: _submitUser,
        disabled: isSubmitting || !selectedUsersList.length,
      }}
    >
      <Stack horizontal styles={stackContainerStyles}>
        <Stack.Item grow disableShrink styles={usersWrapperStyles}>
          <SearchBox
            placeholder="Search"
            iconProps={{ iconName: 'search-svg' }}
            styles={{ root: { marginBottom: 16 } }}
            onSearch={_searchUser}
            onChange={(event, value) => _searchUser(value)}
          />
          <List items={[...users]} onRenderCell={onRenderUserItem} />
        </Stack.Item>
        <Separator vertical styles={separatorStyles} />
        <Stack.Item grow disableShrink styles={usersWrapperStyles}>
          <CustomText
            block
            variant="mediumPlus"
            color="textSecondary"
            styles={{ root: { fontWeight: FontWeights.semibold, marginBottom: 26 } }}
          >
            User to add
          </CustomText>
          {selectedUsersList.length > 0 ? (
            <List items={selectedUsersList} onRenderCell={onRenderSelectedUserItem} />
          ) : (
            <Stack verticalAlign="center" horizontalAlign="center" styles={noUserWrapperStyles}>
              <CustomText block variant="smallPlus" color="textSecondary">
                No users currently selected.
              </CustomText>
            </Stack>
          )}
        </Stack.Item>
      </Stack>
    </CustomModal>
  );
}
AddCollaboratorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onSubmitAdd: PropTypes.func.isRequired,
  dataRoom: PropTypes.oneOfType([PropTypes.object]).isRequired,
  users: PropTypes.oneOfType([PropTypes.array]),
  isSubmitting: PropTypes.bool,
};
AddCollaboratorModal.defaultProps = {
  users: [],
  isSubmitting: false,
};

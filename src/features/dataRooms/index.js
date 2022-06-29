/* eslint-disable max-lines */
import React, { Component } from 'react';
import { getTheme, Stack, Text, FontWeights, PrimaryButton, Dropdown, FontSizes } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { DataRoomList } from 'features/dataRooms/components';
import { ModalForm, EmptyContent } from 'features/shared/components';
import { ACTION_LIMITATION, DATAROOM_LIST_TYPE, FEATURE_KEYS, MODAL_NAME, PAGE_PATHS } from 'core/constants/Const';
import dataRoomHelper from 'features/shared/lib/dataRoomHelper';
import { LinkOfDataRoomModal, DuplicateRoomPrinciple } from 'core/components';
import withLimitationFeature from 'features/shared/HOCs/withLimitationFeature';

const theme = getTheme();
const stackControlStyles = {
  root: {
    paddingBottom: theme.spacing.l2,
  },
};
const pageTitleStyles = {
  root: {
    fontWeight: FontWeights.bold,
    minWidth: 150,
  },
};
const createRoomBtnStyles = {
  root: { textAlign: 'center', height: 40, width: 140 },
  label: { fontWeight: 500 },
};
const dropdownStyles = {
  root: { height: 40, width: 150 },
  title: { height: 40, maxWidth: 150 },
  dropdownOptionText: { fontSize: 13 },
};

const renderPrinciple = () => <DuplicateRoomPrinciple />;
const formSchemaAddRoom = {
  formTitle: 'Create room',
  submitBtnName: 'OK',
  cancleBtnName: 'Cancel',
  formSchema: [
    {
      inputProps: {
        label: 'Room name',
        id: 'name',
        name: 'name',
        placeholder: 'Please enter a room name',
        type: 'text',
        required: true,
        minLength: 3,
        maxLength: 256,
        description: '',
        autoFocus: true,
      },
    },
  ],
};

const createRoomBtnCustomStyles = {
  root: {
    height: 44,
    padding: '0 12px 0 8px',
  },
  label: {
    fontSize: FontSizes.size16,
  },
  icon: {
    width: 26,
    height: 26,
    margin: 0,
  },
};

const CreateDataRoomButton = withLimitationFeature(ACTION_LIMITATION.DISABLED, [FEATURE_KEYS.TotalAssetsInSpace])(
  PrimaryButton
);

class DataRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalName: '',
      dataRooms: undefined,
      deletedRoom: undefined,
      selectedRoom: undefined,
      selectedDataRoomType: DATAROOM_LIST_TYPE.mine,
      dataRoomListTypes: [
        {
          key: 'mine',
          text: 'My Space',
        },
      ],
    };
  }

  componentDidMount() {
    this._getCompanyInfo();
    this._listRooms();
  }

  _getCompanyInfo = () => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/company/current-active`)
      .setToken(getToken())
      .get()
      .then((res) => {
        const dataRoomListTypes = [
          {
            key: DATAROOM_LIST_TYPE.mine,
            text: 'My Space',
          },
          {
            key: DATAROOM_LIST_TYPE.collaborate,
            text: `${res.data?.name} Spaces`,
          },
        ];
        this.setState({ dataRoomListTypes });
      });
  };

  _listRooms = (filter = DATAROOM_LIST_TYPE.mine) => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/data-room?filter=${filter}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          res.data.sort((a, b) => b.id - a.id); // sort data rooms with descending id
          this.setState({ dataRooms: res.data, modalName: '' });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _disabledEnableAllLinkOfDataRoom = (disabledAllLink, dataRoomId) => {
    const { getToken } = this.context;
    const { selectedDataRoomType } = this.state;
    new RestService()
      .setPath(`/data-room/${dataRoomId}/link-status`)
      .setToken(getToken())
      .put({ disabled: disabledAllLink })
      .then(() => {
        this._listRooms(selectedDataRoomType);
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _toggleDialog = (name) => {
    this.setState({ modalName: name });
  };

  _addRoom = (values, formProps) => {
    const { getToken } = this.context;
    new RestService()
      .setPath('/data-room')
      .setToken(getToken())
      .post(values)
      .then((res) => {
        if (res.data) {
          const { history } = this.props;
          history.push(`/${PAGE_PATHS.dataRooms}/${res.data}`);
        }
      })
      .catch((err) => RestServiceHelper.handleError(err, formProps))
      .finally(() => {
        formProps.setSubmitting(false);
        this._toggleDialog();
      });
  };

  _confirmDeleteRoom = () => {
    const { deletedRoom } = this.state;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/data-room/${deletedRoom.id}`)
      .setToken(getToken())
      .delete()
      .then(() => this._listRooms())
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _initDeleteRoom = (room) => {
    this.setState({ deletedRoom: room });
    window.confirm({
      title: `Are you sure you want to delete ${room.name}?`,
      subText: (
        <>
          Your teammates will lose access to this room, and any active links they have <b>will be deleted</b>.
        </>
      ),
      yesAction: () => this._confirmDeleteRoom(),
    });
  };

  _duplicateRoom = (values, formProps) => {
    const { selectedRoom } = this.state;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/data-room/${selectedRoom.id}/duplicate`)
      .setToken(getToken())
      .post(values)
      .then(() => this._listRooms())
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => formProps.setSubmitting(false));
  };

  _enterDuplicatedRoomName = (room) => {
    this.setState({ selectedRoom: room, modalName: MODAL_NAME.DUPLICATE_DATA_ROOM });
  };

  _initShareRoom = (item) => {
    this.setState({ modalName: MODAL_NAME.DATAROOM_LINK_LIST, shareRoom: item });
  };

  _activeRoom = (room) => {
    console.log(room);
  };

  _onChangeDataRoomListType = (_event, value) => {
    this._listRooms(value.key);
    this.setState({ selectedDataRoomType: value.key });
  };

  _renderPrimaryButton = () => (
    <CreateDataRoomButton
      styles={createRoomBtnCustomStyles}
      iconProps={{ iconName: 'white-plus-svg' }}
      text="Create Room"
      ariaLabel="Create Room"
      onClick={() => this._toggleDialog(MODAL_NAME.ADD_DATA_ROOM)}
    />
  );

  render() {
    const { modalName, dataRooms, shareRoom, selectedRoom, dataRoomListTypes, selectedDataRoomType } = this.state;
    return (
      <>
        <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: 8 }} styles={stackControlStyles}>
          <Text variant="xLarge" styles={pageTitleStyles}>
            Data Rooms
          </Text>

          <Stack className="hiddenMdDown" horizontal tokens={{ childrenGap: 20 }}>
            <Dropdown
              name="dataRoomListType"
              options={dataRoomListTypes}
              onChange={this._onChangeDataRoomListType}
              defaultSelectedKey={selectedDataRoomType}
              styles={dropdownStyles}
            />
            <CreateDataRoomButton
              styles={createRoomBtnStyles}
              iconProps={{ iconName: 'white-plus-svg' }}
              text="Create Room"
              ariaLabel="Create Room"
              onClick={() => this._toggleDialog(MODAL_NAME.ADD_DATA_ROOM)}
            />
          </Stack>

          <Stack className="hiddenLgUp" horizontalAlign="end" tokens={{ childrenGap: 20 }}>
            <CreateDataRoomButton
              styles={{ ...createRoomBtnStyles, root: { width: 120 } }}
              text="Create Room"
              ariaLabel="Create Room"
              onClick={() => this._toggleDialog(MODAL_NAME.ADD_DATA_ROOM)}
            />
            <Dropdown
              name="dataRoomListType"
              options={dataRoomListTypes}
              onChange={this._onChangeDataRoomListType}
              defaultSelectedKey={selectedDataRoomType}
              styles={dropdownStyles}
            />
          </Stack>
        </Stack>
        {dataRooms && dataRooms.length < 1 ? (
          <EmptyContent
            title="No Data Room"
            subTitle="You have not created any Data Room yet."
            onRenderPrimaryButton={this._renderPrimaryButton}
          />
        ) : (
          <DataRoomList
            items={dataRooms}
            onDeleteItem={this._initDeleteRoom}
            onDuplicateItem={this._enterDuplicatedRoomName}
            onActiveItem={this._activeRoom}
            onShareItem={this._initShareRoom}
            onDisabledEnableAllLinkOfDataRoom={this._disabledEnableAllLinkOfDataRoom}
          />
        )}
        <ModalForm
          isOpen={modalName === MODAL_NAME.ADD_DATA_ROOM}
          isCancel
          formData={formSchemaAddRoom}
          onToggle={this._toggleDialog}
          onSubmit={this._addRoom}
        />
        <ModalForm
          isOpen={modalName === MODAL_NAME.DUPLICATE_DATA_ROOM}
          isCancel
          formData={dataRoomHelper.formSchemaDuplicateRoom(selectedRoom, renderPrinciple)}
          onToggle={this._toggleDialog}
          onSubmit={this._duplicateRoom}
          noSame={false}
        />
        <LinkOfDataRoomModal
          dataRoomId={shareRoom}
          isOpen={modalName === MODAL_NAME.DATAROOM_LINK_LIST}
          onToggle={this._toggleDialog}
          shareDocument={shareRoom}
        />
      </>
    );
  }
}
DataRoom.contextType = GlobalContext;
export default DataRoom;

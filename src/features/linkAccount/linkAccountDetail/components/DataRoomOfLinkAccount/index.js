/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { ModalForm, EmptyContent } from 'features/shared/components';
import { MODAL_NAME, PAGE_PATHS, TIME_OUT } from 'core/constants/Const';
import dataRoomHelper from 'features/shared/lib/dataRoomHelper';
import { DuplicateRoomPrinciple, ExportVisitsModal, LinkOfDataRoomModal } from 'core/components';
import { withRouter } from 'react-router-dom';
import { success } from 'features/shared/components/ToastMessage';
import fileHelper from 'features/shared/lib/fileHelper';
import DataRoomList from './DataRoomList';

const renderPrinciple = () => <DuplicateRoomPrinciple />;

class DataRoomOfLinkAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalName: '',
      dataRooms: undefined,
      selectedRoom: undefined,
    };

    this._exportVisitsTimer = null;
  }

  componentDidMount() {
    this._listRooms();
  }

  _listRooms = () => {
    const { getToken } = this.context;
    const { linkAccountId } = this.props;
    new RestService()
      .setPath(`/link/link-account/${linkAccountId}/data-room`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          this.setState({ dataRooms: res.data, modalName: '' });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _toggleDialog = (name) => {
    this.setState({ modalName: name });
  };

  _duplicateRoom = (values, formProps) => {
    const { selectedRoom } = this.state;
    const { getToken } = this.context;
    const { history } = this.props;
    new RestService()
      .setPath(`/data-room/${selectedRoom.id}/duplicate`)
      .setToken(getToken())
      .post(values)
      .then((res) => {
        history.push(`/${PAGE_PATHS.dataRooms}/${res.data}`);
      })
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => formProps.setSubmitting(false));
  };

  _enterDuplicatedRoomName = (room) => {
    this.setState({ selectedRoom: room, modalName: MODAL_NAME.DUPLICATE_DATA_ROOM });
  };

  _initShareRoom = (item) => {
    this.setState({ modalName: MODAL_NAME.DATAROOM_LINK_LIST, shareRoom: item });
  };

  _onCancelExportVisitsEmail = () => {
    this._toggleDialog();
    clearTimeout(this._exportVisitsTimer);
    this._exportVisits(false);
  };

  _onExportDataRoomVisits = (room) => {
    this.setState({ selectedRoom: room, modalName: MODAL_NAME.EXPORT_VISITS_MODAL });
    this._exportVisitsTimer = window.setTimeout(() => {
      this._exportVisits(false);
      this._toggleDialog();
    }, TIME_OUT.EXPORT_DATA_ROOM_VISITS);
  };

  _onSendExportVisitEmail = () => {
    clearTimeout(this._exportVisitsTimer);
    this._toggleDialog();
    this._exportVisits(true);
  };

  _exportVisits = (isEmail) => {
    if (!isEmail) {
      success('Your export is now ready to download');
    }

    const { selectedRoom } = this.state;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/data-room/${selectedRoom.id}/export-viewer?email=${isEmail}`)
      .setToken(getToken())
      .get()
      .then((response) => {
        if (response.data) {
          fileHelper.download(
            response.data,
            response.headers['content-type'],
            `export-vistit-${selectedRoom.name}.csv`
          );
        }
      })
      .catch((err) => {
        RestServiceHelper.handleError(err);
      });
  };

  render() {
    const { modalName, dataRooms, shareRoom, selectedRoom } = this.state;
    return (
      <>
        {dataRooms && dataRooms.length < 1 ? (
          <EmptyContent title="No Data Room" subTitle="You don't have any Spaces for this account yet!" />
        ) : (
          <DataRoomList
            items={dataRooms}
            onDuplicateItem={this._enterDuplicatedRoomName}
            onShareItem={this._initShareRoom}
            onExportVisits={this._onExportDataRoomVisits}
          />
        )}

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
          onRefresh={this._listRooms}
        />
        <ExportVisitsModal
          isOpen={modalName === MODAL_NAME.EXPORT_VISITS_MODAL}
          isCancel
          onToggle={this._onCancelExportVisitsEmail}
          onExportVisitEmail={this._onSendExportVisitEmail}
        />
      </>
    );
  }
}
DataRoomOfLinkAccount.propTypes = {
  linkAccountId: PropTypes.number.isRequired,
};

DataRoomOfLinkAccount.contextType = GlobalContext;
export default withRouter(DataRoomOfLinkAccount);

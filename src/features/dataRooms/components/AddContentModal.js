import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import eventBus from 'features/shared/lib/eventBus';
import domainEvents from 'features/shared/domainEvents';
import { CustomModal, CustomButton } from 'features/shared/components';
import { SelectFileForm } from 'features/content/components';
import { BUTTON_DARK_THEME } from 'core/constants/Theme';

class AddContentModal extends Component {
  constructor(props) {
    super(props);
    this.folderSelection = undefined;
    this.fileSelection = undefined;
    this.state = {
      selectedFolders: [],
      selectedFiles: [],
      isSubmitting: false,
      isAddSuccess: false,
    };
  }

  componentWillUnmount() {
    eventBus.unsubscribe(this);
  }

  _toggleHideModal = () => {
    const { onToggle } = this.props;
    onToggle('');
  };

  _selectItems = (selectedFolders = [], selectedFiles = []) => {
    this.setState({ selectedFolders, selectedFiles });
  };

  _addContent = () => {
    const { dataRoom } = this.props;
    const { selectedFolders, selectedFiles } = this.state;
    const { getToken } = this.context;
    const directoryIds = selectedFolders.map((e) => e.id);
    const fileIds = selectedFiles.map((e) => e.id);

    this.setState({ isSubmitting: true, isAddSuccess: false });
    new RestService()
      .setPath(`/data-room/${dataRoom.id}`)
      .setToken(getToken())
      .post({ directoryIds, fileIds })
      .then(() => {
        this.setState({
          isAddSuccess: true,
          selectedFolders: [],
          selectedFiles: [],
        });
        this.folderSelection?.setAllSelected(false);
        this.fileSelection?.setAllSelected(false);
        eventBus.publish(domainEvents.DATA_ROOM_ONCHANGE_DOMAINEVENT, {
          action: domainEvents.ACTION.UPDATE,
          receivers: [domainEvents.DES.DATA_ROOM_DETAIL_PAGE],
        });
        this._toggleHideModal();
      })
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => this.setState({ isSubmitting: false }));
  };

  render() {
    const { isSubmitting, selectedFolders, selectedFiles, isAddSuccess } = this.state;
    const { isOpen, onOpenUploadFileModal } = this.props;
    return (
      <CustomModal
        title="Add Content"
        isOpen={isOpen}
        onDismiss={this._toggleHideModal}
        isSubmitting={isSubmitting}
        primaryButtonProps={{
          iconProps: isAddSuccess ? { iconName: 'CheckMark' } : undefined,
          text: 'Continue',
          onClick: this._addContent,
          disabled: !(selectedFolders.length || selectedFiles.length) || isSubmitting,
        }}
        footerLeft={
          onOpenUploadFileModal && (
            <ThemeProvider theme={BUTTON_DARK_THEME}>
              <CustomButton primary size="large" text="Upload" title="Upload" onClick={onOpenUploadFileModal} />
            </ThemeProvider>
          )
        }
      >
        <SelectFileForm onSelectItems={this._selectItems} />
      </CustomModal>
    );
  }
}
AddContentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onOpenUploadFileModal: PropTypes.func.isRequired,
  dataRoom: PropTypes.oneOfType([PropTypes.object]),
};
AddContentModal.defaultProps = {
  dataRoom: {},
};
AddContentModal.contextType = GlobalContext;
export default AddContentModal;

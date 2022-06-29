/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';
import { withRouter } from 'react-router-dom';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { ThemeProvider, Pivot, PivotItem } from '@fluentui/react';
import { CustomModal, CreatedLinkModal, CustomButton } from 'features/shared/components';
import { LINK_TYPE, PAGE_PATHS, STRING, WATERMARK_SETTINGS } from 'core/constants/Const';
import { BUTTON_DARK_THEME, BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import WatermarkBiz from 'core/biz/WatermarkBiz';
import LinkBiz from 'core/biz/LinkBiz';
import { success } from 'features/shared/components/ToastMessage';
import SelectFileForm from './SelectFileForm';
import CreateLinkForm from './CreateLinkForm';
import {
  CreateLinkStrategy,
  CreateLinkForDataRoom,
  CreateLinkForFile,
  CreateLinkForMultiDocument,
} from './CreateLinkStrategy';

const pivotStyles = {
  // root: { minWidth: '60vw' },
  link: { flexGrow: 1, marginRight: 0 },
  linkIsSelected: { marginRight: 0 },
  itemContainer: { paddingTop: 16 },
};
const shareModalStyles = {
  main: {
    width: 708,
    [BREAKPOINTS_RESPONSIVE.xlUp]: {
      width: 780,
    },
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      borderRadius: 0,
    },
  },
  scrollableContent: {
    overflowY: 'initial',
  },
};

class ShareFileModal extends Component {
  constructor(props) {
    super(props);
    this._initCreateLinkValues = {
      name: '',
      allowDownload: false,
      allowExpired: false,
      expiredAt: '',
      allowPasscode: false,
      passcode: '',
      allowWatermark: false,
      requiredNDA: false,
      accessControl: false,
      allowViewer: false,
      requireEmailAuthentication: false,
      allowedViewers: [],
      watermark: {
        type: WATERMARK_SETTINGS.type.TEXT,
        opacity: WATERMARK_SETTINGS.transparencyOptions[0].key,
        align: WATERMARK_SETTINGS.positionOptions[0].key,
        rotate: WATERMARK_SETTINGS.rotationOptions[0].key,
        text: WatermarkBiz.getPreviewWatermarkText(
          WATERMARK_SETTINGS.formatTags.reduce((total, tag) => total + tag, '')
        ),
        size: WATERMARK_SETTINGS.fontSizeOptions[0].key,
        color: WATERMARK_SETTINGS.fontColors[14].color,
        isTiled: false,
      },
      linkAccountsId: undefined,
    };
    this.state = {
      selectedPivotKey: '0',
      isSubmitting: false,
      selectedFolders: [],
      selectedFiles: [],
      selectedDataRoom: undefined,
      createLinkValues: this._initCreateLinkValues,
      linkAccountName: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shareDocument !== prevState.shareDocument) {
      const state = { selectedPivotKey: '1', selectedFiles: [], selectedFolders: [], selectedDataRoom: undefined };
      const { shareDocument, linkValuesInfo } = nextProps;

      const { createLinkValues } = prevState;

      if (linkValuesInfo && !createLinkValues.id) {
        return { createLinkValues: { ...linkValuesInfo } };
      }
      if (nextProps.linkType === LINK_TYPE.DATA_ROOM) {
        state.selectedDataRoom = shareDocument;
        return state;
      }
      if (shareDocument.isFile) {
        state.selectedFiles = [shareDocument];
        return state;
      }
      state.selectedFolders = [shareDocument];
      return state;
    }
    return null;
  }

  _getDefaultWatermark = () => {
    const { getToken } = this.context;
    new RestService()
      .setPath('/setting/watermark/default')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data && res.data?.text !== '{}') {
          const { id, isDefault } = res.data;
          const defaultWatermark = { id, isDefault, ...JSON.parse(res.data.text) };
          this.setState((state) => ({ createLinkValues: { ...state.createLinkValues, watermark: defaultWatermark } }));
        } else {
          this._createDefaultWatermark();
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _createDefaultWatermark = () => {
    const { createLinkValues } = this.state;
    const { getToken } = this.context;
    const formData = new FormData();
    const watermarkData = { ...createLinkValues.watermark, id: undefined };
    // formData.append('image', new Blob());
    formData.append('isDefault', true);
    formData.append('text', JSON.stringify(watermarkData));
    new RestService() // call api to create default watermark
      .setPath('/setting/watermark/')
      .setToken(getToken())
      .post(formData)
      .then((res) => {
        if (res.data) {
          const defaultWatermark = { ...watermarkData, id: res.data, isDefault: true };
          this.setState((state) => ({ createLinkValues: { ...state.createLinkValues, watermark: defaultWatermark } }));
        }
      })
      .catch((err) => {
        RestServiceHelper.handleError(err);
        this.setState({ isSubmitting: false });
      });
  };

  _selectItems = (selectedFolders = [], selectedFiles = []) => {
    this.setState({ selectedFolders, selectedFiles });
  };

  _handleChangeInput = (event, value) => {
    const { linkAccountName } = this.state;
    const name = event.target.name || event.target.getAttribute('name');
    this.setState((state) => {
      const linkValues = state.createLinkValues;
      if (name === 'requiredNDA' && value) {
        linkValues.requireEmailAuthentication = true;
      }
      if (name === 'requireEmailAuthentication' && !value) {
        linkValues.requiredNDA = false;
      }
      if (name === 'allowWatermark' && value) {
        this._getDefaultWatermark();
      }
      if (name === 'watermark' && value) {
        return {
          createLinkValues: { ...linkValues, [name]: { ...value, isDefault: false } },
        };
      }
      if (name === 'ndaId' && value) {
        return {
          createLinkValues: { ...linkValues, [name]: value.key },
        };
      }

      let errorMessage;
      if (name === 'linkAccountsId' && !value && !linkAccountName) {
        errorMessage = 'Please enter the account name';
      }
      if (name === 'passcode' && !value) {
        errorMessage = 'Can’t be blank';
      }

      return {
        createLinkValues: { ...linkValues, [name]: value },
        errors: {
          ...state.errors,
          [name]: errorMessage,
        },
      };
    });
  };

  _createLinkStratery = (strategy, createLinkValues) => {
    const { getToken } = this.context;
    const { onRefreshAllLink, history } = this.props;
    const token = getToken();
    const createLinkStrategy = new CreateLinkStrategy();
    createLinkStrategy.strategy = strategy;
    return createLinkStrategy
      .create({ token, createLinkValues })
      .then((createdLink) => {
        this.setState({ createdLink });
        if (onRefreshAllLink) {
          onRefreshAllLink();
        }
        if (createdLink.dataRoomId) {
          history.push({ pathname: `/${PAGE_PATHS.dataRooms}/${createdLink.dataRoomId}`, state: { createdLink } });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => this.setState({ isSubmitting: false }));
  };

  /**
   * Make strategy to share documents
   * @param {number | undefined} customWatermarkId
   */
  _handleShareDocument = (customWatermarkId) => {
    const { selectedFiles, selectedFolders, selectedDataRoom, createLinkValues } = this.state;
    const values = { ...createLinkValues, customWatermarkId };
    if (selectedDataRoom) {
      const createLinkForDataRoom = new CreateLinkForDataRoom();
      return this._createLinkStratery(createLinkForDataRoom, { ...values, resourceId: selectedDataRoom?.id });
    }
    if (selectedFiles.length === 1 && selectedFolders.length === 0) {
      const createLinkForFile = new CreateLinkForFile();
      return this._createLinkStratery(createLinkForFile, { ...values, resourceId: selectedFiles[0]?.id });
    }
    let dataRoomName = STRING.DEFAULT_DATA_ROOM_NAME;
    if (selectedFolders.length === 1 && selectedFiles.length === 0) {
      dataRoomName = selectedFolders[0]?.name;
    }
    const createLinkForMultiDocument = new CreateLinkForMultiDocument();
    return this._createLinkStratery(createLinkForMultiDocument, {
      ...values,
      selectedFolders,
      selectedFiles,
      dataRoomName,
    });
  };

  _updateShareLink = (customWatermarkId) => {
    const { getToken } = this.context;
    const { createLinkValues } = this.state;
    const { onRefreshAllLink } = this.props;

    const linkData = LinkBiz.generateDataToCreateLink({
      ...createLinkValues,
      customWatermarkId,
    });

    new RestService()
      .setPath(`/link/${createLinkValues.id}/setting`)
      .setToken(getToken())
      .put(linkData)
      .then(() => {
        this.setState({
          isSubmitting: false,
        });
        if (onRefreshAllLink) {
          onRefreshAllLink();
        }
        success('Update link successful');
        this._toggleHideModal();
      })
      .catch((e) => {
        RestServiceHelper.handleError(e);
      });
  };

  _handleUpdateWatermark = () => {
    const { createLinkValues } = this.state;
    const { getToken } = this.context;
    this.setState({ isSubmitting: true });

    // update or create watermark
    if (createLinkValues.allowWatermark) {
      const formData = new FormData();
      const watermarkData = { ...createLinkValues.watermark, id: createLinkValues.watermarkId };
      // formData.append('image', new Blob());
      formData.append('text', JSON.stringify(watermarkData));

      let watermarkService = null;
      if (createLinkValues.watermarkId) {
        watermarkService = new RestService()
          .setPath(`/setting/watermark/${createLinkValues.watermarkId}`)
          .setToken(getToken())
          .put(formData);
      } else {
        watermarkService = new RestService().setPath('/setting/watermark/').setToken(getToken()).post(formData);
      }

      watermarkService
        .then((res) => {
          this._updateShareLink(res.data);
        })
        .catch((err) => {
          RestServiceHelper.handleError(err);
          this.setState({ isSubmitting: false });
        });
    } else {
      this._updateShareLink();
    }
  };

  _createWatermark = () => {
    const { createLinkValues } = this.state;
    const { getToken } = this.context;
    this.setState({ isSubmitting: true });
    if (createLinkValues?.id) {
      this._handleUpdateWatermark();
      return;
    }
    if (!createLinkValues.allowWatermark) {
      this._handleShareDocument();
      return;
    }

    if (createLinkValues?.watermark?.isDefault) {
      this._handleShareDocument(createLinkValues?.watermark?.id);
      return;
    }

    const formData = new FormData();
    const watermarkData = { ...createLinkValues.watermark, id: undefined };
    // formData.append('image', new Blob());
    formData.append('text', JSON.stringify(watermarkData));
    new RestService() // call api to create custom watermark
      .setPath('/setting/watermark/')
      .setToken(getToken())
      .post(formData)
      .then((res) => {
        if (res.data) {
          this._handleShareDocument(res.data); // share document with custom watermark
        }
      })
      .catch((err) => {
        RestServiceHelper.handleError(err);
        this.setState({ isSubmitting: false });
      });
  };

  _handleContinue = async () => {
    const { selectedPivotKey, createLinkValues, linkAccountName } = this.state;
    this.setState({ errors: {} });
    if (selectedPivotKey === '0') {
      this.setState({ selectedPivotKey: '1' });
      return;
    }

    let cancelContinue = false;

    if (!createLinkValues.linkAccountsId) {
      if (!linkAccountName) {
        this.setState((state) => ({
          errors: {
            ...state.errors,
            linkAccountsId: 'Please enter the account name',
          },
        }));
        cancelContinue = true;
      }
      if (!cancelContinue) {
        const linkAccountId = await this._createNewLinkAccount();
        if (linkAccountId) {
          this.setState({ createLinkValues: { ...createLinkValues, linkAccountsId: linkAccountId } });
        } else {
          return;
        }
      }
    }

    if (createLinkValues.allowExpired && !createLinkValues.expiredAt) {
      window.alert('Please add the expired date!');
      cancelContinue = true;
    }

    if (createLinkValues.allowPasscode && !createLinkValues.passcode) {
      this.setState((state) => ({
        errors: {
          ...state.errors,
          passcode: 'Can’t be blank',
        },
      }));
      cancelContinue = true;
    }

    if (createLinkValues.requiredNDA && !createLinkValues.ndaId) {
      window.alert('Please select a NDA');
      cancelContinue = true;
    }

    if (!cancelContinue) {
      this._createWatermark();
    }
  };

  _createNewLinkAccount = async () => {
    const { getToken } = this.context;
    const { linkAccountName } = this.state;

    const request = new RestService().setPath('/link/link-account').setToken(getToken()).post({
      name: linkAccountName,
    });

    try {
      const response = await request;
      return response.data;
    } catch (e) {
      RestServiceHelper.handleError(e);
      return null;
    }
  };

  _toggleHideModal = () => {
    const { onToggle } = this.props;
    onToggle('');
    this.setState({
      createdLink: undefined,
      selectedPivotKey: '0',
      createLinkValues: this._initCreateLinkValues,
      linkAccountName: '',
      errors: {},
    });
  };

  _setSelectedPivot = (item) => {
    const { selectedFolders, selectedFiles } = this.state;
    if (selectedFolders.length || selectedFiles.length) {
      this.setState({ selectedPivotKey: item.props.itemKey });
    } else {
      this.setState({ selectedPivotKey: '0' });
    }
  };

  _setLinkAccountName = (value) => {
    const { errors } = this.state;

    this.setState({
      linkAccountName: value,
      errors: {
        ...errors,
        linkAccountsId: !value ? 'Please enter the account name' : null,
      },
    });
  };

  render() {
    const {
      selectedPivotKey,
      isSubmitting,
      selectedFolders,
      selectedFiles,
      selectedDataRoom,
      createLinkValues,
      createdLink,
      errors,
    } = this.state;
    const { isMobile } = this.context;
    const { isOpen, shareDocument, onOpenUploadFileModal, title } = this.props;
    if (!isOpen) {
      return null;
    }
    if (createdLink) {
      return <CreatedLinkModal isOpen createdLink={createdLink} onToggle={this._toggleHideModal} />;
    }
    return (
      <CustomModal
        title={title}
        isOpen={isOpen}
        onDismiss={this._toggleHideModal}
        isSubmitting={isSubmitting}
        primaryButtonProps={{
          text: 'Continue',
          onClick: this._handleContinue,
          disabled: !(selectedFolders.length || selectedFiles.length || selectedDataRoom) || isSubmitting,
          styles: { root: { height: '44px !important', padding: '0 42px' } },
        }}
        cancelButtonProps={{
          styles: { root: { height: '44px !important', padding: '0 21px' } },
        }}
        footerLeft={
          selectedPivotKey === '0' &&
          onOpenUploadFileModal && (
            <ThemeProvider theme={BUTTON_DARK_THEME}>
              <CustomButton
                primary
                size="large"
                text={isMobile ? undefined : 'Upload'}
                title="Upload"
                iconProps={
                  isMobile
                    ? { iconName: 'download-svg', styles: { root: { width: 20, transform: 'rotate(180deg)' } } }
                    : undefined
                }
                onClick={onOpenUploadFileModal}
                styles={{ root: { minWidth: 44, height: '44px !important', padding: isMobile ? 0 : '0 28px' } }}
              />
            </ThemeProvider>
          )
        }
        modalProps={{ styles: shareModalStyles }}
      >
        {shareDocument ? (
          <CreateLinkForm
            values={createLinkValues}
            onChange={this._handleChangeInput}
            onSetLinkAccountName={this._setLinkAccountName}
            errors={errors}
            documentId={shareDocument?.refId || shareDocument?.id}
          />
        ) : (
          <Pivot
            aria-label="Share Pivot"
            styles={pivotStyles}
            selectedKey={selectedPivotKey}
            onLinkClick={this._setSelectedPivot}
          >
            <PivotItem headerText="1. Select Files" itemKey="0">
              <SelectFileForm onSelectItems={this._selectItems} />
            </PivotItem>
            <PivotItem headerText="2. Create Link" itemKey="1">
              <CreateLinkForm
                values={createLinkValues}
                onChange={this._handleChangeInput}
                documentId={shareDocument?.id}
                onSetLinkAccountName={this._setLinkAccountName}
                errors={errors}
              />
            </PivotItem>
          </Pivot>
        )}
      </CustomModal>
    );
  }
}
ShareFileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onOpenUploadFileModal: PropTypes.func,
  linkType: PropTypes.oneOf([0, 1]),
  shareDocument: PropTypes.oneOfType([PropTypes.object]),
  onRefreshAllLink: PropTypes.func,
  title: PropTypes.string,
  linkValuesInfo: PropTypes.oneOfType([PropTypes.object]),
};
ShareFileModal.defaultProps = {
  onOpenUploadFileModal: undefined,
  linkType: LINK_TYPE.FILE,
  shareDocument: undefined,
  onRefreshAllLink: undefined,
  linkValuesInfo: undefined,
  title: 'Share',
};
ShareFileModal.contextType = GlobalContext;
export default withRouter(ShareFileModal);

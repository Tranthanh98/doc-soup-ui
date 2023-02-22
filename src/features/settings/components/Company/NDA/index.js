import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import eventBus from 'features/shared/lib/eventBus';
import domainEvents from 'features/shared/domainEvents';
import { Stack, Text, FontWeights, PrimaryButton, ThemeContext } from '@fluentui/react';
import { ModalForm } from 'features/shared/components';
import { PreviewFileModal } from 'core/components';
import { MODAL_NAME } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import NDAEmpty from './NDAEmpty';
import NDAList from './NDAList';
import UploadNDAModal from './UploadNDAModal';

const titleStyles = {
  root: {
    fontWeight: FontWeights.semibold,
  },
};
const stackItemStyles = (theme) => ({
  root: {
    padding: 20,
    paddingBottom: 0,
    width: '100%',
    backgroundColor: theme.palette.grayLight,
    [BREAKPOINTS_RESPONSIVE.md]: {
      padding: `20px 0px`,
    },
    [BREAKPOINTS_RESPONSIVE.sm]: {
      padding: `20px 0px`,
    },
  },
});
const wrapperForm = {
  root: {
    [BREAKPOINTS_RESPONSIVE.md]: {
      maxWidth: 390,
      margin: 'auto',
    },
    [BREAKPOINTS_RESPONSIVE.sm]: {
      maxWidth: 282,
      margin: 'auto',
    },
  },
};
const uploadNDABtnStyle = {
  root: {
    width: 100,
    height: 40,
    borderRadius: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: `SourceHanSansKR`,
    letterSpacing: -0.5,
  },
};
const getRenameNDAFormSchema = (name) => ({
  formTitle: 'Rename NDA',
  submitBtnName: 'OK',
  cancleBtnName: 'Cancel',
  formSchema: [
    {
      inputProps: {
        label: 'Name',
        id: 'newName',
        name: 'newName',
        placeholder: 'Please enter a NDA name',
        type: 'text',
        required: true,
        minLength: 3,
        maxLength: 200,
        description: '',
        autoFocus: true,
      },
      initialValue: name,
    },
  ],
});

class NDAManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalName: '',
      ndaList: undefined,
      dataNDA: undefined,
      docId: undefined,
    };
  }

  componentDidMount() {
    this._listNDA();
    eventBus.subscribe(this, domainEvents.FILE_ONCHANGE_DOMAINEVENT, (event) => {
      this._handleEvent(event);
    });
  }

  componentWillUnmount() {
    eventBus.unsubscribe(this);
  }

  _listNDA = () => {
    const { getToken } = this.context;
    new RestService()
      .setPath('/setting/nda')
      .setToken(getToken())
      .get()
      .then((res) => {
        this.setState({ ndaList: res.data, dataNDA: undefined });
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _toggleDialog = (name) => {
    this.setState({ modalName: name, dataNDA: undefined, docId: undefined });
  };

  _confirmDeleteNDA = () => {
    const { dataNDA } = this.state;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/setting/nda/${dataNDA?.id}`)
      .setToken(getToken())
      .delete()
      .then(() => this._listNDA())
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _initDeleteNDA = (nda) => {
    this.setState({ dataNDA: nda });
    window.confirm({
      title: `Are you sure you want to remove ${nda.displayName}?`,
      subText: 'Your NDA will be removed',
      yesAction: () => this._confirmDeleteNDA(),
    });
  };

  _renameNDA = (values, formProps) => {
    const { getToken } = this.context;
    const { dataNDA } = this.state;
    new RestService()
      .setPath(`/setting/nda/${dataNDA?.id}/rename`)
      .setToken(getToken())
      .put({ ...values, nda: true })
      .then(() => {
        this._listNDA();
        this._toggleDialog();
      })
      .catch((err) => RestServiceHelper.handleError(err, formProps))
      .finally(() => formProps.setSubmitting(false));
  };

  _initRenameNDA = (nda = {}) => {
    this.setState({ dataNDA: nda, modalName: MODAL_NAME.RENAME_NDA });
  };

  _replaceNDAwithNewUpload = (nda) => {
    this.setState({ dataNDA: nda, modalName: MODAL_NAME.UPLOAD_NDA });
  };

  _previewNDA = (nda) => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/setting/nda/${nda.id}/preview`)
      .setToken(getToken())
      .get()
      .then((res) => {
        this.setState({ docId: res.data, modalName: MODAL_NAME.PREVIEW_FILE });
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  /* Events */
  _handleEvent = (event) => {
    const { action, receivers } = event.message;
    const { dataNDA } = this.state;
    if (receivers === undefined || receivers.includes(domainEvents.DES.SETTINGS_NDA_PAGE)) {
      switch (action) {
        case domainEvents.ACTION.UPLOADED:
          if (dataNDA && dataNDA.id) {
            this._confirmDeleteNDA(); // replace NDA with New Upload
            break;
          }
          this._listNDA();
          break;
        default:
          break;
      }
    }
  };
  /* End Events */

  render() {
    const { ndaList, modalName, dataNDA, docId } = this.state;
    const isEmptyNDA = ndaList && ndaList.length < 1;
    return (
      <ThemeContext.Consumer>
        {(theme) => {
          return (
            <Stack styles={stackItemStyles(theme)}>
              <Stack.Item styles={wrapperForm}>
                <Stack
                  grow
                  horizontal
                  horizontalAlign="space-between"
                  verticalAlign="center"
                  styles={{ root: { marginBottom: 32 } }}
                >
                  <Text block variant="mediumPlus" styles={titleStyles}>
                    Non-Disclosure Agreements
                  </Text>
                  <PrimaryButton
                    text="Upload"
                    styles={uploadNDABtnStyle}
                    disabled={!ndaList}
                    onClick={() => this._toggleDialog(MODAL_NAME.UPLOAD_NDA)}
                  />
                </Stack>
                {isEmptyNDA ? (
                  <NDAEmpty />
                ) : (
                  <NDAList
                    items={ndaList}
                    onReplaceItem={this._replaceNDAwithNewUpload}
                    onDeleteItem={this._initDeleteNDA}
                    onRenameItem={this._initRenameNDA}
                    onPreviewItem={this._previewNDA}
                  />
                )}
                <UploadNDAModal isOpen={modalName === MODAL_NAME.UPLOAD_NDA} onToggle={this._toggleDialog} />
                <ModalForm
                  isOpen={modalName === MODAL_NAME.RENAME_NDA}
                  isCancel
                  formData={getRenameNDAFormSchema(dataNDA?.displayName)}
                  onToggle={this._toggleDialog}
                  onSubmit={this._renameNDA}
                />
                <PreviewFileModal
                  title="Preview NDA"
                  isOpen={modalName === MODAL_NAME.PREVIEW_FILE}
                  docId={docId}
                  onToggle={this._toggleDialog}
                />
              </Stack.Item>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
NDAManagement.contextType = GlobalContext;
export default NDAManagement;

/* eslint-disable max-lines */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import FileHelper from 'features/shared/lib/fileHelper';
import TrackService from 'features/shared/services/trackService';
import { ThemeProvider, PrimaryButton, Text, Stack } from '@fluentui/react';
import { ErrorPage, LoadingPage, CustomModal, AutoForm, CustomText } from 'features/shared/components';
import { PreviewDataRoom, PreviewHeader } from 'features/linkView/components';
import { MODAL_NAME, STRING, WEB_SOCKET_ACTION, WEB_SOCKET_DESTINATION, WEB_SOCKET_TOPIC } from 'core/constants/Const';
import { BUTTON_DARK_THEME, LIGHT_THEME } from 'core/constants/Theme';
import { PreviewFileFrame } from 'core/components';
import { ERROR_MESSAGE } from 'core/constants/Resource';
import { error } from 'features/shared/components/ToastMessage';
import SockJsClient from 'features/shared/lib/SockJsClient';

const textStyles = { root: { color: LIGHT_THEME.palette.neutralSecondaryAlt } };

class LinkView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      modalName: '',
      secureValues: {},
      linkCreator: {},
      allowDownloadFile: false,
      isDownloadedNDA: false,
      currentUser: undefined,
    };
    this._verifyValues = {};
    this._verifyFormData = {
      formTitle: 'Add Folder',
      submitBtnName: 'Continue',
      submitBtnAlign: 'center',
      formSchema: [],
    };
    this.webSocketRef = createRef();
  }

  async componentDidMount() {
    const params = new URL(document.location).searchParams;
    const errorMessage = params.get('errorMessage');
    if (errorMessage) {
      error(ERROR_MESSAGE[errorMessage]);
    }
    await this._getClientInfo();
  }

  componentWillUnmount() {
    this.webSocketRef.current = null;
  }

  _sendMessage = (viewerId, fileId, destination) => {
    const chatMessage = {
      viewerId,
      fileId,
      isViewing: true,
    };

    const payload = {
      dataBody: chatMessage,
      action: WEB_SOCKET_ACTION.VISIT_LINK,
    };

    if (this.webSocketRef.current) {
      this.webSocketRef.current.sendMessage(destination, JSON.stringify(payload));
    } else {
      alert('Disconnected to server, please check your network.');
    }
  };

  _toggleDialog = (name) => {
    this.setState({ modalName: name });
  };

  _downloadNDA = async (downloadToken, formProps) => {
    const { match } = this.props;
    const { linkId } = match.params;
    const { secureValues, downloadNDAToken: downloadNDATokenState } = this.state;

    const token = downloadToken || downloadNDATokenState;
    if (!token) {
      this._submitVerifyLink(formProps.values, formProps);
      return;
    }

    const clientInfo = await TrackService.getTrackPayload();
    this.setState({ isDownloadedNDA: undefined });
    new RestService()
      .setPath(`/view-link/${linkId}/nda/${token}`)
      .setHeaders({
        'x-viewerId': secureValues.viewerId,
        'x-deviceId': clientInfo.app.deviceId,
        'x-ip': clientInfo.os.ip,
      })
      .setResponseType('arraybuffer')
      .get()
      .then((res) => {
        FileHelper.download(res.data, res.headers['content-type'], STRING.NDA_DOWNLOAD_FILE_NAME);
        this.setState({ isDownloadedNDA: true, downloadNDAToken: token });
      })
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => formProps.setSubmitting(false));
  };

  _verifyEmail = (clientInfo, userId, token) => {
    const { match } = this.props;
    const { linkId } = match.params;

    const header = {
      'x-deviceId': clientInfo.app.deviceId,
      'x-latitude': clientInfo?.location?.coords?.latitude || 0,
      'x-longitude': clientInfo?.location?.coords?.longitude || 0,
      'x-ip': clientInfo.os.ip,
      'account-id': userId,
      'x-token': token,
    };

    new RestService()
      .setPath(`/view-link/${linkId}/from-email`)
      .setHeaders(header)
      .get()
      .then((res) => {
        if (res.data) {
          const { secure, creatorFullName, creatorEmail, download } = res.data;
          this.setState({
            secureValues: res.data,
            linkCreator: { fullName: creatorFullName, email: creatorEmail },
            allowDownloadFile: download,
          });
          if (secure) {
            // show modal to verify link
            this._toggleDialog(MODAL_NAME.VERIFY_LINK);
          }
        }
      })
      .catch(() => {
        window.open(`/view/${linkId}?errorMessage=ERROR_DIFFERENT_DEVICE`, '_self');
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  _onSubmit = async (values, formProps) => {
    const { secureValues } = this.state;
    const { secure } = secureValues;
    if (secure && secure.nda) {
      await this._signNDA();
    } else {
      await this._submitVerifyLink(values, formProps);
    }
  };

  _submitVerifyLink = async (values, formProps) => {
    const { match } = this.props;
    const { linkId } = match.params;
    const { secureValues } = this.state;
    const clientInfo = await TrackService.getTrackPayload();
    this._verifyValues = values;
    new RestService()
      .setPath(`/view-link/${linkId}/verify`)
      .setHeaders({
        'x-viewerId': secureValues.viewerId,
        'x-deviceId': clientInfo.app.deviceId,
        'x-ip': clientInfo.os.ip,
      })
      .post({
        linkId,
        deviceId: clientInfo.app.deviceId,
        viewerId: secureValues.viewerId,
        name: values.name ? values.name : '',
        email: values.email ? values.email : '',
        passcode: values.passcode ? values.passcode : '',
      })
      .then((res) => {
        if (res.data) {
          const { downloadToken, ready, requireVerifyEmail } = res.data;

          if (requireVerifyEmail) {
            this.setState({ secureValues: res.data });
            this._toggleDialog(MODAL_NAME.VALIDATION_EMAIL);
          }

          if (ready) {
            this.setState({ secureValues: res.data });
            return;
          }

          if (downloadToken) {
            this._downloadNDA(downloadToken, formProps);
          }

          if (requireVerifyEmail) {
            this.setState({ secureValues: res.data });
            this._toggleDialog(MODAL_NAME.VALIDATION_EMAIL);
          }
        }
      })
      .catch((err) => {
        if (formProps) {
          RestServiceHelper.handleError(err, formProps, false);
          formProps.setSubmitting(false);
        }
      });
  };

  _signNDA = async () => {
    const { match } = this.props;
    const { linkId } = match.params;
    const { secureValues } = this.state;
    const clientInfo = await TrackService.getTrackPayload();
    new RestService()
      .setPath(`/view-link/${linkId}/signNDA`)
      .setHeaders({
        'x-viewerId': secureValues.viewerId,
        'x-deviceId': clientInfo.app.deviceId,
        'x-ip': clientInfo.os.ip,
      })
      .post({
        signedNDA: true,
      })
      .then((res) => {
        if (res.data) {
          this.setState({ secureValues: res.data });
          this._toggleDialog(MODAL_NAME.VALIDATION_EMAIL);
        }
      })
      .catch((err) => {
        RestServiceHelper.handleError(err);
      });
  };

  _getVerifyFormData = (secure, linkCreatorFullName) => {
    const { isDownloadedNDA, currentUser, linkCreator } = this.state;

    const _verifyFormData = {
      formTitle: 'NDA',
      submitBtnName: 'Continue',
      submitBtnAlign: 'center',
      formSchema: [],
    };
    if (secure.nda) {
      _verifyFormData.formSchema = [
        {
          inputProps: {
            label: 'Name',
            id: 'name',
            name: 'name',
            type: 'text',
            maxLength: 200,
            autoFocus: true,
            matches: /^[aA-zZ\s\d]+$/,
            matchError: 'You can only use English only',
          },
        },
        {
          initialValue: currentUser ? currentUser.email : '',
          inputProps: {
            label: 'Email',
            id: 'email',
            name: 'email',
            type: 'email',
            maxLength: 200,
          },
        },
        {
          inputWrapperProps: {
            horizontal: false,
          },
          inputProps: {
            label: 'I agree to the NDA',
            id: 'agreeNDA',
            name: 'agreeNDA',
            type: 'checkbox',
            required: true,
            disabled: !isDownloadedNDA,
          },
          onRenderPrefix: (formProps, error) => {
            const isError = Boolean(formProps.errors.name) || Boolean(formProps.errors.email);
            return (
              <ThemeProvider theme={BUTTON_DARK_THEME}>
                <Stack style={{ paddingBottom: 12, marginTop: error?.passcode ? -12 : 0 }}>
                  <PrimaryButton
                    text="Download NDA"
                    type="button"
                    disabled={isDownloadedNDA === undefined || isError}
                    iconProps={{ iconName: isDownloadedNDA ? 'CheckMark' : 'download-svg' }}
                    styles={{ root: { width: '100%', marginTop: 5, marginBottom: 7 }, textContainer: { flexGrow: 0 } }}
                    onClick={() => this._downloadNDA(undefined, formProps)}
                  />
                </Stack>
              </ThemeProvider>
            );
          },
        },
      ];
    }

    if ((secure.email || secure.hasAllowViewers) && !secure.nda) {
      _verifyFormData.formSchema = [
        {
          initialValue: currentUser ? currentUser.email : '',
          inputProps: {
            label: 'Email Address',
            id: 'email',
            name: 'email',
            type: 'email',
            maxLength: 200,
          },
          smallText: ` This information will only be shared with ${linkCreatorFullName}.`,
          onRenderSuffixes: secure.passcode
            ? undefined
            : (_, error) => {
                return (
                  <CustomText style={{ paddingTop: error?.email ? 16 : 4 }} color="neutralSecondaryAlt">
                    This information will only be shared with {linkCreator.fullName}.
                  </CustomText>
                );
              },
        },
      ];
    }

    if (secure.passcode) {
      const indexInsert = _verifyFormData.formSchema.length - 1 > 1 ? _verifyFormData.formSchema.length - 1 : 1;
      _verifyFormData.formSchema.splice(indexInsert || 1, 0, {
        inputProps: {
          label: 'Password',
          id: 'passcode',
          name: 'passcode',
          type: 'password',
          maxLength: 200,
        },
        onRenderSuffixes:
          (secure.email || secure.hasAllowViewers) && !secure.nda
            ? (_, error) => {
                return (
                  <CustomText style={{ paddingTop: error?.email ? 16 : 4 }} color="neutralSecondaryAlt">
                    This information will only be shared with {linkCreator.fullName}.
                  </CustomText>
                );
              }
            : undefined,
      });
    }
    return _verifyFormData;
  };

  _getClientInfo = async () => {
    const clientInfo = await TrackService.getTrackPayload();
    const { getUserInfo, authenticated } = this.context;
    let userId;
    if (authenticated) {
      const user = await getUserInfo();
      userId = user.id;
      this.setState({ currentUser: user });
    }

    if (clientInfo.errors) {
      window.alert('Please enable and allow location service to view this document.', {
        title: 'Noted',
        onClose: () => this._getLinkInfo(clientInfo, userId),
      });
    } else {
      const params = new URL(document.location).searchParams;
      const token = params.get('token');
      if (token) {
        this._verifyEmail(clientInfo, userId, token);
      } else {
        this._getLinkInfo(clientInfo, userId);
      }
    }
  };

  _getLinkInfo = (clientInfo, userId) => {
    const { match } = this.props;
    const { linkId } = match.params;

    const header = {
      'x-deviceId': clientInfo.app.deviceId,
      'x-latitude': clientInfo?.location?.coords?.latitude || 0,
      'x-longitude': clientInfo?.location?.coords?.longitude || 0,
      'x-ip': clientInfo.os.ip,
      'account-id': userId,
    };

    new RestService()
      .setPath(`/view-link/${linkId}`)
      .setHeaders(header)
      .get()
      .then((res) => {
        if (res.data) {
          const { secure, creatorFullName, creatorEmail, download } = res.data;
          this.setState({
            secureValues: res.data,
            linkCreator: { fullName: creatorFullName, email: creatorEmail },
            allowDownloadFile: download,
          });
          if (secure) {
            // show modal to verify link
            this._toggleDialog(MODAL_NAME.VERIFY_LINK);
          }
        }
      })
      .catch((error) => {
        const fieldErrors = error.response.data.fieldErrors || {};
        this.setState({
          linkCreator: { fullName: fieldErrors?.creatorFullName, email: fieldErrors?.creatorEmail },
        });
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  _closeValidationEmailModal = () => {
    const { match } = this.props;
    const { linkId } = match.params;
    window.open(`/view/${linkId}`, '_self');
  };

  _receiveMessage = (payload, viewerId, fileId) => {
    if (payload.action === WEB_SOCKET_ACTION.REFRESH_ALL_VIEWER) {
      this._sendMessage(viewerId, fileId, WEB_SOCKET_DESTINATION.ADD_VIEWER);
    }
  };

  render() {
    const { isLoading, modalName, secureValues, linkCreator, allowDownloadFile } = this.state;

    if (isLoading) {
      return <LoadingPage />;
    }
    if (secureValues.directories && secureValues.files) {
      return (
        <PreviewDataRoom
          {...this.props}
          {...secureValues}
          folders={secureValues.directories}
          files={secureValues.files}
          linkCreator={linkCreator}
          allowDownloadFile={allowDownloadFile}
        />
      );
    }

    if (secureValues?.requireVerifyEmail) {
      return (
        <CustomModal
          title={`${secureValues?.creatorFullName} shared this document with you`}
          isOpen={modalName === MODAL_NAME.VALIDATION_EMAIL}
          onDismiss={this._closeValidationEmailModal}
          modalProps={{ styles: { main: { maxWidth: 428 } } }}
        >
          <Stack>
            <Text styles={textStyles}>
              Please verify that you own the entered email address. We emailed a link to access this document to{' '}
            </Text>
            <Text styles={textStyles} style={{ fontWeight: 500 }}>
              {secureValues?.visitorEmail}
            </Text>

            <Stack horizontal style={{ marginTop: 16 }}>
              <Text styles={textStyles}>Wrong email address? &nbsp; </Text>

              <Text
                onClick={() => this._closeValidationEmailModal()}
                styles={{
                  root: { color: LIGHT_THEME.palette.orangeLight, cursor: 'pointer' },
                }}
              >
                Re-enter email
              </Text>
            </Stack>
          </Stack>
        </CustomModal>
      );
    }

    // eslint-disable-next-line no-unreachable
    if (secureValues?.docId) {
      return (
        <div style={{ height: '100vh' }}>
          <PreviewFileFrame fileInfo={secureValues} />
          <SockJsClient
            url={process.env.REACT_APP_SOCKET_URL}
            ref={this.webSocketRef}
            headers={{}}
            onMessage={(payload) => this._receiveMessage(payload, secureValues.viewerId, secureValues.fileId)}
            topics={[WEB_SOCKET_TOPIC.VIEW_LINK, WEB_SOCKET_TOPIC.REFRESH_ALL_VIEWER]}
            onConnect={() =>
              this._sendMessage(secureValues.viewerId, secureValues.fileId, WEB_SOCKET_DESTINATION.ADD_VIEWER)
            }
            options={{ sessionId: () => `${secureValues.viewerId}_${secureValues.fileId}` }}
            onDisconnect={() => {}}
            autoReconnect
          />
        </div>
      );
    }

    if (secureValues?.secure) {
      if (
        secureValues.secure.passcode ||
        secureValues.secure.email ||
        secureValues.secure.nda ||
        secureValues.secure.hasAllowViewers
      ) {
        return (
          <CustomModal
            title={`${linkCreator.fullName} shared this document with you`}
            isOpen={modalName === MODAL_NAME.VERIFY_LINK}
            onDismiss={this._toggleDialog}
            modalProps={{ styles: { main: { maxWidth: 448 } } }}
          >
            <Stack styles={{ root: { marginBottom: 16 } }}>
              <CustomText color="neutralSecondaryAlt">Please enter your info to continue.</CustomText>
            </Stack>
            <AutoForm
              formData={this._getVerifyFormData(secureValues.secure, linkCreator.fullName)}
              onSubmit={(values, formProps) => this._onSubmit(values, formProps)}
              validateOnChange
            />
          </CustomModal>
        );
      }
      if (!secureValues.ready) {
        this._submitVerifyLink(secureValues.secure, undefined);
        return <LoadingPage />;
      }
    }
    return (
      <>
        <PreviewHeader linkCreator={linkCreator} />
        <ErrorPage.DocumentNotAvailable linkCreator={linkCreator} />
      </>
    );
  }
}
LinkView.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
LinkView.contextType = GlobalContext;
export default LinkView;

import { Stack, StackItem, Text, getTheme, FontWeights } from '@fluentui/react';
import { CustomDetailsList, CustomModal, CustomButton } from 'features/shared/components';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import RestService from 'features/shared/services/restService';
import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import PropTypes from 'prop-types';
import { ShareFileModal } from 'core/components';
import { ACTION_LIMITATION, FEATURE_KEYS, LINK_STATUS, LINK_TYPE, MODAL_NAME } from 'core/constants/Const';
import LinkBiz from 'core/biz/LinkBiz';
import withLimitationFeature from 'features/shared/HOCs/withLimitationFeature';
import columnsSchema from './columnsSchema';

class LinkOfDataRoomModal extends Component {
  state = {
    isSubmitting: false,
    linkList: undefined,
    modalName: '',
  };

  componentDidMount() {
    const { shareDocument } = this.props;
    if (shareDocument?.id) {
      this._getLinkList();
    }
  }

  componentDidUpdate(prevProps) {
    const { shareDocument } = this.props;
    if (shareDocument !== prevProps.shareDocument) {
      this._initModal();
      this._getLinkList();
    }
  }

  _initModal = () => {
    this.setState({ linkList: undefined });
  };

  _getLinkList = () => {
    const { shareDocument } = this.props;
    const { getToken } = this.context;

    new RestService()
      .setPath(`/data-room/${shareDocument.id}/link`)
      .setToken(getToken())
      .get()
      .then((res) => {
        const linkList = res.data.map((x) => ({ ...x, disabled: x.status > LINK_STATUS.ACTIVE }));
        this.setState({ linkList, isSubmitting: false });
      })
      .catch((err) => restServiceHelper.handleError(err));
  };

  _toggleDialog = () => {
    this.setState({ modalName: '', linkInfo: undefined });
  };

  _onChangeStatusOfLink = async (linkId, value) => {
    const { getToken } = this.context;
    try {
      await new RestService().setPath(`/link/${linkId}/status`).setToken(getToken()).put({ disabled: !value });
      this._getLinkList();
    } catch (err) {
      console.log(err);
    }
  };

  _handleEditLinkSetting = (row) => {
    const { getToken } = this.context;

    if (row.watermarkId) {
      new RestService()
        .setPath(`/setting/watermark/${row.watermarkId}`)
        .setToken(getToken())
        .get()
        .then((res) => {
          const watermarkValue = JSON.parse(res.data.text);

          const linkInfo = LinkBiz.parseLinkDataToViewModel(row, watermarkValue);

          this.setState({ linkInfo, modalName: MODAL_NAME.CREATE_LINK });
        })
        .catch((err) => restServiceHelper.handleError(err));
    } else {
      const linkInfo = LinkBiz.parseLinkDataToViewModel(row);

      this.setState({ linkInfo, modalName: MODAL_NAME.CREATE_LINK });
    }
  };

  _handleDeleteLink = (row) => {
    const { getToken } = this.context;
    const { onRefresh } = this.props;
    new RestService()
      .setPath(`/link/${row.id}`)
      .setToken(getToken())
      .delete()
      .then(() => {
        this._getLinkList();
        if (typeof onRefresh === 'function') {
          onRefresh();
        }
      })
      .catch((err) => restServiceHelper.handleError(err));
  };

  _getMenuProps = (row) => {
    const theme = getTheme();
    return {
      items: [
        {
          key: 'setting',
          text: 'Edit link settings',
          onClick: () => this._handleEditLinkSetting(row),
        },
        {
          key: 'delete',
          text: <span style={{ color: theme.palette.red }}>Delete link</span>,
          onClick: () => {
            window.confirm({
              title: `Delete this link?`,
              yesText: 'Ok',
              noText: 'Cancel',
              yesAction: () => this._handleDeleteLink(row),
            });
          },
        },
      ],
    };
  };

  _getPrimaryButton = () => {
    const { linkList, isSubmitting } = this.state;
    // eslint-disable-next-line react/prop-types
    const { isAllow } = this.props;

    if (linkList && linkList?.length > 0) {
      return {
        text: 'Create new link',
        onClick: () => this.setState({ modalName: MODAL_NAME.CREATE_LINK }),
        disabled: isSubmitting || !isAllow,
        iconProps: { iconName: 'plus-svg' },
      };
    }
    return null;
  };

  render() {
    const { onToggle, isOpen, shareDocument } = this.props;
    const { isSubmitting, linkList, modalName, linkInfo } = this.state;

    const _columnsSchema = columnsSchema(this._onChangeStatusOfLink);

    const CreateLinkButton = withLimitationFeature(ACTION_LIMITATION.DISABLED, [FEATURE_KEYS.TotalAssetsInSpace])(
      CustomButton
    );

    return (
      <CustomModal
        title="Share this Data Room"
        isOpen={isOpen}
        onDismiss={onToggle}
        isSubmitting={isSubmitting}
        primaryButtonProps={this._getPrimaryButton()}
      >
        {linkList === undefined || linkList?.length > 0 ? (
          <CustomDetailsList
            striped
            isStickyHeader={false}
            columns={_columnsSchema}
            items={linkList}
            onGetMenuActions={this._getMenuProps}
          />
        ) : (
          <Stack verticalAlign="center" styles={{ root: { height: '100%' } }}>
            <Stack
              horizontalAlign="center"
              tokens={{ childrenGap: 14 }}
              styles={{ root: { width: 812, maxWidth: '100%', marginTop: 44 } }}
            >
              <Stack.Item>
                <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
                  You do not have any links yet.
                </Text>
              </Stack.Item>
              <StackItem styles={{ root: { textAlign: 'center' } }}>
                <Text styles={{ root: { fontSize: 16 } }}>
                  Links are a way to share a Data Room with others in a secure way.
                </Text>
                <br />
                <Text styles={{ root: { fontSize: 16 } }}>
                  You can disable a link, set custom access settings and more.
                </Text>
              </StackItem>
              <Stack.Item styles={{ root: { paddingTop: 14 } }}>
                <CreateLinkButton
                  styles={{ label: { fontSize: 16, fontWeight: 500 }, icon: { width: 26 } }}
                  primary
                  size="medium"
                  iconProps={{ iconName: 'plus-svg' }}
                  text="Create Shareable Link"
                  onClick={() => this.setState({ modalName: MODAL_NAME.CREATE_LINK })}
                />
              </Stack.Item>
            </Stack>
            <Stack horizontalAlign="end" style={{ marginTop: 60 }}>
              <CustomButton text="Cancel" onClick={onToggle} size="large" />
            </Stack>
          </Stack>
        )}

        <ShareFileModal
          linkType={LINK_TYPE.DATA_ROOM}
          shareDocument={shareDocument}
          isOpen={modalName === MODAL_NAME.CREATE_LINK}
          onToggle={this._toggleDialog}
          linkValuesInfo={linkInfo}
          onRefreshAllLink={this._getLinkList}
        />
      </CustomModal>
    );
  }
}

LinkOfDataRoomModal.contextType = GlobalContext;

LinkOfDataRoomModal.propTypes = {
  shareDocument: PropTypes.oneOfType([PropTypes.object]),
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
};

LinkOfDataRoomModal.defaultProps = {
  shareDocument: undefined,
  onRefresh: undefined,
};

export default withLimitationFeature(ACTION_LIMITATION.PASS_PROP, [FEATURE_KEYS.TotalAssetsInSpace])(
  LinkOfDataRoomModal
);

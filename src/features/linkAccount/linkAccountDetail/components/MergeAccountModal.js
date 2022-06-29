import { CustomModal, CustomText } from 'features/shared/components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoCompleteLinkAccount from 'features/shared/components/AutoCompleteLinkAccount';
import RestService from 'features/shared/services/restService';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import GlobalContext from 'security/GlobalContext';
import { withRouter } from 'react-router-dom';
import { PAGE_PATHS } from 'core/constants/Const';
import { Stack, Text } from '@fluentui/react';
import Resource from 'core/constants/Resource';

class MergeAccountModal extends Component {
  state = {
    destinationAccount: undefined,
    accountName: '',
  };

  _onSelectAccount = (_e, selectedId) => {
    this.setState({ destinationAccount: selectedId });
  };

  _handleMergeAccount = () => {
    const { onDismiss, sourceAccountName } = this.props;
    const { accountName } = this.state;

    window.confirm({
      title: `Account consolidation`,
      yesText: 'Confirm, merge account',
      noText: 'Cancel',
      subText: (
        <Stack tokens={{ childrenGap: 12 }} styles={{ root: { marginBottom: 36 } }}>
          <Text>{Resource.CONFIRM_MERGE_ACCOUNT.format(sourceAccountName, accountName)}</Text>
          <CustomText color="red">{Resource.WARNING_CONFIRM_MERGE_ACCOUNT}</CustomText>
        </Stack>
      ),
      yesAction: this._confirmMergeAccount,
    });
    onDismiss();
  };

  _confirmMergeAccount = () => {
    const { sourceAccountId, history } = this.props;
    const { getToken } = this.context;
    const { destinationAccount } = this.state;

    new RestService()
      .setPath(`/link/link-account/${sourceAccountId}/merge`)
      .setToken(getToken())
      .post({
        destinationLinkAccountId: destinationAccount,
      })
      .then(() => {
        history.replace(`/${PAGE_PATHS.account}/${destinationAccount}`);
      })
      .catch((err) => restServiceHelper.handleError(err));
  };

  render() {
    const { destinationAccount, accountName } = this.state;

    const { isOpen, onDismiss } = this.props;

    return (
      <CustomModal
        isOpen={isOpen}
        onDismiss={onDismiss}
        title="Merge Account name into…"
        primaryButtonProps={{
          text: 'Merge account',
          onClick: this._handleMergeAccount,
          disabled: !destinationAccount,
        }}
        modalProps={{
          styles: {
            main: {
              width: 380,
            },
          },
        }}
      >
        <Stack style={{ marginBottom: 36 }}>
          <AutoCompleteLinkAccount
            url="/link/link-account/suggestion-search?keyword="
            onSelect={this._onSelectAccount}
            name="linkAccountsId"
            selectedValue={destinationAccount}
            inputProps={{
              label: 'Account',
              autoFocus: true,
              required: true,
              autoComplete: 'false',
              styles: {
                fieldGroup: {
                  height: 40,
                },
              },
            }}
            onSetLinkAccountName={(value) => this.setState({ accountName: value })}
            allowCreateNewAccount={false}
            customContextMenuItem={(items, onClickItem) => {
              if (items?.length === 0) {
                return [
                  {
                    key: 'no-item',
                    text: `No match for "${accountName}"`,
                    disabled: true,
                  },
                ];
              }
              return items.map((i) => ({
                key: i.id,
                text: i.name,
                onClick: () => onClickItem(i),
              }));
            }}
          />
        </Stack>
      </CustomModal>
    );
  }
}

MergeAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  sourceAccountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sourceAccountName: PropTypes.string,
};

MergeAccountModal.defaultProps = {
  sourceAccountName: '',
};

MergeAccountModal.contextType = GlobalContext;

export default withRouter(MergeAccountModal);

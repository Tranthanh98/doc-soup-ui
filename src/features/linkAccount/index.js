import { Checkbox, mergeStyles, Shimmer, ShimmerElementType, Stack, Text } from '@fluentui/react';
import React, { Component } from 'react';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { CustomDetailsList } from 'features/shared/components';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import { success } from 'features/shared/components/ToastMessage';
import Resource from 'core/constants/Resource';
import { pageTitleStyles, wrapperFilterStyles, archivedContactStyles, filterTabStyles } from './configs/styles';
import FilterTab from './components/FilterTab';
import columnSchema, { contributorConfig } from './configs/columnSchema';
import { statusAccountTabList, typeAccountTabList } from './configs/filterTabOptions';
import EmptyAccountPage from './components/EmptyAccountPage';

const wrapperClass = mergeStyles({
  padding: 2,
  selectors: {
    '& > .ms-Shimmer-container': {
      margin: '5px 0',
    },
  },
});

function getShimmerElements() {
  return [
    { type: ShimmerElementType.line, width: 245, height: 50 },
    { type: ShimmerElementType.gap, width: 16 },
    { type: ShimmerElementType.line, width: 245, height: 50 },
    { type: ShimmerElementType.gap, width: 16 },
    { type: ShimmerElementType.line, width: 100, height: 50 },
    { type: ShimmerElementType.gap, width: 16 },
    { type: ShimmerElementType.line, width: 50, height: 50 },
    { type: ShimmerElementType.gap, width: 16 },
    { type: ShimmerElementType.line, width: 50, height: 50 },
  ];
}

export default class LinkAccount extends Component {
  state = {
    linkAccountStatus: statusAccountTabList[0].key,
    linkAccountType: typeAccountTabList[0].key,
    isIncludeArchived: false,
    linkAccounts: [],
    isLoading: true,
  };

  componentDidMount() {
    this._getLinkAccounts();
  }

  _getLinkAccounts = () => {
    this.setState({ isLoading: true });

    const { getToken } = this.context;
    const { linkAccountStatus, linkAccountType, isIncludeArchived } = this.state;

    let url = `/link/link-account?mode=${linkAccountType}&status=${linkAccountStatus}`;

    if (!isIncludeArchived) {
      url = url.concat(`&archived=${isIncludeArchived}`);
    }
    new RestService()
      .setPath(url)
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        this.setState({
          linkAccounts: data.items,
          totalAccount: data.totalLinkAccount,
        });
      })
      .catch((err) => {
        restServiceHelper.handleError(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  _handleChangeAccountStatus = (status) => {
    this.setState({ linkAccountStatus: status }, this._getLinkAccounts);
  };

  _handleChangeLinkAccountTypes = (type) => {
    this.setState({ linkAccountType: type }, this._getLinkAccounts);
  };

  _handleChangeArchived = (e) => {
    const { checked } = e.target;
    this.setState({ isIncludeArchived: checked }, this._getLinkAccounts);
  };

  _handleChangeArchivedContact = (data, isArchived) => {
    const { getToken } = this.context;

    new RestService()
      .setPath(`/link/link-account/${data.id}/status`)
      .setToken(getToken())
      .put({
        archived: isArchived,
      })
      .then(() => {
        if (isArchived) {
          success('Account archived successfully');
        } else {
          success('Account unarchived successfully');
        }
        this._getLinkAccounts();
      })
      .catch((err) => restServiceHelper.handleError(err));
  };

  _getMenuAction = (row) => {
    const { isMobile } = this.context;
    if (isMobile) {
      return undefined;
    }

    const menuList = [];

    if (row.archived) {
      menuList.push({
        key: 'unarchivedAccount',
        text: 'Unarchived Account',
        onClick: () => {
          window.confirm({
            title: `Are you sure you want to unarchive this account?`,
            yesText: 'Unarchive Account',
            noText: 'Cancel',
            yesAction: () => this._handleChangeArchivedContact(row, false),
          });
        },
      });
    } else {
      menuList.push({
        key: 'ArchivedAccount',
        text: 'Archived Account',
        onClick: () => {
          window.confirm({
            title: `Are you sure you want to archive this account?`,
            yesText: 'Archive Account',
            noText: 'Cancel',
            // eslint-disable-next-line max-len
            subText: Resource.ARCHIVE_ACCOUNT,
            yesAction: () => this._handleChangeArchivedContact(row, true),
          });
        },
      });
    }

    return {
      items: menuList,
    };
  };

  _renderContent = () => {
    const { linkAccountStatus, linkAccountType, isIncludeArchived, linkAccounts, totalAccount } = this.state;
    const { isMobile, isDesktop } = this.context;

    const columnConfig = [...columnSchema({ isMobile, isDesktop })];

    if (!isMobile) {
      columnConfig.splice(1, 0, contributorConfig);
    }

    if (totalAccount > 0) {
      return (
        <>
          <Stack styles={wrapperFilterStyles} style={{ marginTop: 36 }}>
            <Stack styles={filterTabStyles} horizontal verticalAlign="center" tokens={{ childrenGap: 16 }}>
              <Stack.Item grow>
                <FilterTab
                  tabs={statusAccountTabList}
                  selectedKey={linkAccountStatus}
                  itemStyles={{ root: { minWidth: 100, [BREAKPOINTS_RESPONSIVE.mdDown]: { minWidth: 0 } } }}
                  onSelect={this._handleChangeAccountStatus}
                />
              </Stack.Item>
              <Stack.Item grow>
                <FilterTab
                  tabs={typeAccountTabList}
                  selectedKey={linkAccountType}
                  itemStyles={{ root: { minWidth: 100, [BREAKPOINTS_RESPONSIVE.mdDown]: { minWidth: 0 } } }}
                  onSelect={this._handleChangeLinkAccountTypes}
                />
              </Stack.Item>
            </Stack>
            <Stack styles={archivedContactStyles}>
              <Checkbox
                name="archived"
                checked={isIncludeArchived}
                label="Include archived accounts"
                onChange={this._handleChangeArchived}
              />
            </Stack>
          </Stack>
          <Stack styles={{ root: { paddingTop: 12, width: '100%' } }}>
            <CustomDetailsList
              isStickyHeader={false}
              columns={columnConfig}
              items={linkAccounts}
              onGetMenuActions={isDesktop ? this._getMenuAction : undefined}
            />
          </Stack>
        </>
      );
    }
    return <EmptyAccountPage />;
  };

  render() {
    const { totalAccount, isLoading } = this.state;

    return (
      <Stack styles={{ root: { height: '100%' } }}>
        <Text variant="xLarge" styles={pageTitleStyles}>
          Account ({totalAccount})
        </Text>
        {isLoading ? (
          <Stack style={{ marginTop: 36 }} className={wrapperClass}>
            <Shimmer shimmerElements={getShimmerElements()} />
            <Shimmer shimmerElements={getShimmerElements()} />
            <Shimmer shimmerElements={getShimmerElements()} />
            <Shimmer shimmerElements={getShimmerElements()} />
            <Shimmer shimmerElements={getShimmerElements()} />
          </Stack>
        ) : (
          this._renderContent()
        )}
      </Stack>
    );
  }
}

LinkAccount.contextType = GlobalContext;

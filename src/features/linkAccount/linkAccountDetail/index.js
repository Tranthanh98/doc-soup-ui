/* eslint-disable max-len */
import { Icon, Pivot, PivotItem, Stack, Text } from '@fluentui/react';
import { LIGHT_THEME } from 'core/constants/Theme';
import { CustomIconButton } from 'features/shared/components';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import { millisecondsToStr } from 'features/shared/lib/utils';
import RestService from 'features/shared/services/restService';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalContext from 'security/GlobalContext';
import formatDuration from 'format-duration';
import { success } from 'features/shared/components/ToastMessage';
import Resource from 'core/constants/Resource';
import { VisitorsOfLinkAccount, DataRoomOfLinkAccount, LinksOfLinkAccount } from './components';
import MergeAccountModal from './components/MergeAccountModal';

const pageTitleStyles = {
  root: {
    fontWeight: 500,
    minWidth: 150,
  },
};

const menuIconStyles = {
  root: {
    width: 40,
    height: 40,
  },
};

const countViewStyles = {
  root: {
    color: LIGHT_THEME.palette.neutralSecondaryAlt,
    paddingRight: 20,
    marginRight: 20,
    borderRight: `1px solid ${LIGHT_THEME.palette.neutralQuaternaryAlt}`,
    fontSize: 14,
  },
};

const viewerIconStyle = {
  root: {
    width: 20,
    height: 20,
    fill: LIGHT_THEME.palette.neutralSecondaryAlt,
    marginRight: 10,
  },
};

const durationIconStyle = {
  root: {
    width: 15,
    height: 15,
    marginLeft: 20,
    marginRight: 10,
    color: LIGHT_THEME.palette.neutralSecondaryAlt,
  },
};

const durationStyle = {
  root: {
    color: LIGHT_THEME.palette.neutralSecondaryAlt,
    fontSize: 14,
  },
};

function LinkAccountDetail() {
  const [linkAccount, setLinkAccount] = useState({});
  const [isOpenMergeModal, setOpenMergeModal] = useState(false);
  const { id } = useParams();
  const context = useContext(GlobalContext);
  const { getToken } = context;

  const _getLinkAccount = () => {
    new RestService()
      .setPath(`/link/link-account/${id}`)
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        setLinkAccount(data);
      })
      .catch((err) => {
        restServiceHelper.handleError(err);
      });
  };

  useEffect(() => {
    _getLinkAccount();
  }, [id]);

  const _archiveAccount = () => {
    new RestService()
      .setPath(`/link/link-account/${id}/status`)
      .setToken(getToken())
      .put({
        archived: !linkAccount.archived,
      })
      .then(() => {
        if (!linkAccount.archived) {
          success('Account archived successfully');
        } else {
          success('Account unarchived successfully');
        }
        _getLinkAccount();
      })
      .catch((err) => restServiceHelper.handleError(err));
  };

  const menuProps = [
    {
      key: linkAccount.archived ? 'unarchivedAccount' : 'archiveAccount',
      text: linkAccount.archived ? 'Unarchived Account' : 'Archive account',
      onClick: () => {
        window.confirm({
          title: `Are you sure you want to ${linkAccount.archived ? 'Unarchived' : 'Archive'} this account?`,
          yesText: 'Archive Account',
          noText: 'Cancel',
          subText: linkAccount.archived
            ? `By unarchiving this account, it will be added to your account list and search.`
            : Resource.ARCHIVE_ACCOUNT,
          yesAction: () => _archiveAccount(),
        });
      },
    },
    {
      key: 'mergeAccount',
      text: <Text style={{ color: LIGHT_THEME.palette.red }}>Merge into other account</Text>,
      onClick: () => setOpenMergeModal(true),
    },
  ];

  return (
    <Stack>
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between" style={{ marginBottom: 8 }}>
        <Stack vertical tokens={{ childrenGap: 6 }}>
          <Text variant="xLarge" styles={pageTitleStyles}>
            {linkAccount.name}
          </Text>
          <Text variant="small" style={{ color: LIGHT_THEME.palette.neutralSecondaryAlt }}>
            Active {millisecondsToStr(new Date() - new Date(linkAccount.lastActivity))}
          </Text>
        </Stack>

        <CustomIconButton
          className="more-button"
          menuIconProps={{ iconName: 'more-svg' }}
          menuProps={{
            shouldFocusOnMount: true,
            alignTargetEdge: false,
            items: menuProps,
          }}
          styles={menuIconStyles}
          title="More"
          ariaLabel="More"
        />
      </Stack>
      <Stack horizontal verticalAlign="center" horizontalAlign="end" style={{ marginBottom: 22 }}>
        <Icon iconName="eye-open-svg" styles={viewerIconStyle} />
        <Text variant="mediumPlus" styles={countViewStyles}>
          {linkAccount.totalVisit || 0}
        </Text>
        <Icon iconName="SkypeCircleClock" styles={durationIconStyle} />
        <Text variant="mediumPlus" styles={durationStyle}>
          {formatDuration(parseInt(linkAccount.totalDuration || 0, 10))}
        </Text>
      </Stack>
      <Pivot aria-label="Link account detail pivot" styles={{ root: { marginTop: 20 } }}>
        <PivotItem headerText="Visitors">
          <VisitorsOfLinkAccount idLinkAccount={id} />
        </PivotItem>
        <PivotItem headerText="Data Rooms">
          <DataRoomOfLinkAccount linkAccountId={id} />
        </PivotItem>
        <PivotItem headerText="Links">
          <LinksOfLinkAccount />
        </PivotItem>
      </Pivot>
      <MergeAccountModal
        sourceAccountId={id}
        sourceAccountName={linkAccount.name}
        isOpen={isOpenMergeModal}
        onDismiss={() => setOpenMergeModal(false)}
      />
    </Stack>
  );
}

export default LinkAccountDetail;

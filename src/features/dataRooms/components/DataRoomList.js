import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { Toggle, Stack } from '@fluentui/react';
import { CustomDetailsList, CustomText } from 'features/shared/components';
import GlobalContext from 'security/GlobalContext';
import dataRoomHelper from 'features/shared/lib/dataRoomHelper';
import withLimitationFeature from 'features/shared/HOCs/withLimitationFeature';
import { ACTION_LIMITATION, FEATURE_KEYS } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import useLimitationFeature from 'features/shared/hooks/useLimitationFeature';

const ToggleWithLimit = withLimitationFeature(ACTION_LIMITATION.DISABLED, [FEATURE_KEYS.TotalAssetsInSpace])(Toggle);

export default function DataRoomList(props) {
  const { items, onDeleteItem, onDuplicateItem, onShareItem, onDisabledEnableAllLinkOfDataRoom } = props;
  const context = useContext(GlobalContext);
  const { isDesktop, isMobile } = context;
  const [isAllow] = useLimitationFeature([FEATURE_KEYS.TotalAssetsInSpace]);

  const personaMenuRef = useRef(null);

  const renderDisabledEnableAllLink = (item, _onChange) => (
    <ToggleWithLimit
      checked={!item.disabledAllLink}
      onText="On"
      offText="Off"
      styles={{ root: { marginBottom: 0 } }}
      onChange={(event, checked) => _onChange(event, checked, item.id)}
    />
  );

  const _onChangeDisabledEnableAllLinkOfDataRoom = (event, checked, dataRoomId) => {
    onDisabledEnableAllLinkOfDataRoom(!checked, dataRoomId);
  };

  const _notMobileColumnsSchema = [
    {
      key: 'sharedWithAccount',
      name: 'Shared With Account',
      fieldName: 'sharedWithAccount',
      ariaLabel: 'Shared With Account',
      minWidth: 180,
      isRowHeader: true,
      isSortable: false,
      isSortedDescending: false,
      data: 'string',
      onRender: (item) => dataRoomHelper.renderSharedWithAccount(item, onShareItem),
    },
    {
      key: 'createdDate',
      name: 'Date',
      fieldName: 'createdDate',
      ariaLabel: 'Date',
      minWidth: 80,
      isSortable: true,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'string',
      styles: { cellTitle: { justifyContent: 'flex-end' } },
      onRender: dataRoomHelper.renderDate,
    },
  ];

  const _defaultColumnsSchema = [
    {
      key: 'name',
      name: 'Room Name',
      fieldName: 'name',
      ariaLabel: 'Room Name',
      minWidth: 100,
      isRowHeader: true,
      isSortable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'string',
      isPadded: true,
      onRender: dataRoomHelper.renderRoomName,
    },
    {
      key: 'disabledAllLink',
      name: 'Active',
      fieldName: 'disabledAllLink',
      ariaLabel: 'Active',
      minWidth: isDesktop ? 104 : 70,
      isRowHeader: true,
      isSortedDescending: false,
      data: 'string',
      styles: { cellTitle: { paddingLeft: 52, [BREAKPOINTS_RESPONSIVE.lgDown]: { paddingLeft: 22 } } },
      onRender: (item) => (
        <Stack
          styles={{
            root: {
              paddingLeft: 40,
              [BREAKPOINTS_RESPONSIVE.lgDown]: { paddingLeft: 12 },
            },
          }}
        >
          {renderDisabledEnableAllLink(item, _onChangeDisabledEnableAllLinkOfDataRoom)}
        </Stack>
      ),
    },
    {
      key: 'owner',
      name: 'Owner',
      fieldName: 'owner',
      ariaLabel: 'Owner',
      minWidth: 45,
      isRowHeader: true,
      isSortedDescending: false,
      data: 'string',
      onRender: (item) => dataRoomHelper.renderOwnerName(item, personaMenuRef),
    },
  ];

  // eslint-disable-next-line react/no-multi-comp
  const _getMenuProps = (row) => ({
    items: [
      {
        key: 'duplicate',
        text: 'Duplicate',
        onClick: () => onDuplicateItem(row),
        disabled: !isAllow,
      },
      {
        key: 'delete',
        text: (
          <CustomText variant="smallPlus" color="textDanger">
            Delete
          </CustomText>
        ),
        onClick: () => onDeleteItem(row),
      },
    ],
  });

  const dataRoomColumnsSchema = [..._defaultColumnsSchema];
  if (!isMobile) {
    dataRoomColumnsSchema.splice(1, 0, ..._notMobileColumnsSchema);
  }

  return (
    <CustomDetailsList
      striped
      isStickyHeader={false}
      isShareable={isDesktop}
      columns={dataRoomColumnsSchema}
      items={items}
      actionIconName="more-svg"
      onGetMenuActions={isDesktop ? _getMenuProps : null}
      onShareItem={onShareItem}
    />
  );
}
DataRoomList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  onDeleteItem: PropTypes.func.isRequired,
  onDuplicateItem: PropTypes.func.isRequired,
  onShareItem: PropTypes.func.isRequired,
  onDisabledEnableAllLinkOfDataRoom: PropTypes.func.isRequired,
};
DataRoomList.defaultProps = {
  items: undefined,
};

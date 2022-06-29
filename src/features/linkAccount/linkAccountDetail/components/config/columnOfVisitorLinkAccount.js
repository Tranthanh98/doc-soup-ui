import React from 'react';
import { mergeStyleSets, Persona, PersonaSize, Stack, Text } from '@fluentui/react';
import { NDAButton } from 'core/components';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import format from 'format-duration';
import { millisecondsToStr } from 'features/shared/lib/utils';

const classNames = mergeStyleSets({
  cellName: {
    padding: '0 !important',
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 20,
    paddingRight: 10,
  },
  nameItem: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    '&:hover': { color: 'none', textDecoration: 'none' },
  },
});

const renderName = (item) => {
  let osNameOrEmail = item.email;
  const deviceInfomations = item.device ? item.device.split(' - ') : '';
  if (deviceInfomations && deviceInfomations.length > 0) {
    if (!item.contactId) {
      if (item.isPreview) {
        osNameOrEmail = item.linkCreatorEmail;
      } else {
        osNameOrEmail = `${deviceInfomations[0]} visitor`;
      }
    }
  }
  return (
    <Stack horizontal verticalAlign="center" styles={{ root: { width: '100%' } }}>
      <Persona
        hidePersonaDetails
        size={PersonaSize.size40}
        initialsColor={LIGHT_THEME.palette.greenLight}
        text={item.name}
      />
      <Text
        variant="medium"
        className={classNames.nameItem}
        style={{ marginLeft: 12, marginRight: 6, maxWidth: '100%' }}
      >
        {osNameOrEmail}
      </Text>
      {item?.signedNDA && <NDAButton isDisplayTooltip={false} />}
    </Stack>
  );
};

const columnConfig = (isMobile) => [
  {
    key: 'email',
    name: 'Name',
    fieldName: 'email',
    ariaLabel: 'Name',
    minWidth: 120,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    isSortedDescending: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    onRender: renderName,
    styles: {
      cellTitle: {
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          maxWidth: '90% !important',
        },
      },
      cellName: {
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          maxWidth: '90% !important',
        },
      },
    },
  },

  {
    key: 'duration',
    name: 'Total Time Spent',
    fieldName: 'duration',
    ariaLabel: 'Total Time Spent',
    minWidth: isMobile ? 97 : 150,
    isSortable: true,
    className: classNames.cellName,
    data: 'string',
    styles: { cellTitle: { justifyContent: 'flex-end' } },
    onRender: (item) => {
      const { duration } = item;
      return (
        <Text variant="medium" className={classNames.cellItemRow}>
          {format(duration)}
        </Text>
      );
    },
  },
  {
    key: 'visits',
    name: 'Visits',
    fieldName: 'visits',
    ariaLabel: 'Visits',
    minWidth: 50,
    isSortable: true,
    className: classNames.cellName,
    styles: { cellTitle: { justifyContent: 'flex-end' } },
    data: 'number',
    onRender: (item) => <Text>{item.visits}</Text>,
  },
];

const locationColumnConfig = {
  key: 'location',
  name: 'Last Location',
  fieldName: 'location',
  ariaLabel: 'Last Location',
  minWidth: 180,
  isSortedDescending: false,
  // className: classNames.cellName,
  data: 'string',
  onRender: (item) => <Text>{item.location}</Text>,
};

const lastVisitColumnConfig = {
  key: 'viewedAt',
  name: 'Last visit',
  fieldName: 'viewedAt',
  ariaLabel: 'Last visit',
  minWidth: 100,
  isSortable: true,
  className: classNames.cellName,
  data: 'string',
  styles: { cellTitle: { justifyContent: 'flex-end' } },
  onRender: (item) => {
    const { viewedAt } = item;
    return (
      <Text variant="medium" className={classNames.cellItemRow}>
        {millisecondsToStr(new Date() - new Date(viewedAt))}
      </Text>
    );
  },
};

export { locationColumnConfig, lastVisitColumnConfig };

export default columnConfig;

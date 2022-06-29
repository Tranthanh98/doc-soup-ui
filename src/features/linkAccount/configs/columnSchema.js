import {
  Icon,
  mergeStyleSets,
  Persona,
  PersonaSize,
  Stack,
  Text,
  TooltipDelay,
  TooltipHost,
  Link,
} from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { PAGE_PATHS } from 'core/constants/Const';
import React from 'react';
import { millisecondsToStr } from 'features/shared/lib/utils';

const classNames = mergeStyleSets({
  cellName: {
    padding: '10px 8px 10px 0 !important',
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 16,
  },
  linkItem: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    color: 'none',
    '&:hover': { color: 'none', textDecoration: 'none' },
  },
  visitorItem: {
    [BREAKPOINTS_RESPONSIVE.lgUp]: {
      paddingRight: '20px !important',
    },
    [BREAKPOINTS_RESPONSIVE.xlUp]: {
      paddingRight: '40px !important',
    },
  },
});

const renderName = (item) => {
  return (
    <TooltipHost
      content={item.name}
      delay={TooltipDelay.zero}
      calloutProps={{ gapSpace: 6 }}
      styles={{ root: { width: '100%' } }}
    >
      <Stack grow horizontal verticalAlign="center" styles={{ root: { cursor: 'pointer' } }}>
        <Icon
          iconName="Link12"
          styles={{ root: { marginRight: 6, fontSize: 20, [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' } } }}
        />
        <Link href={`/${PAGE_PATHS.account}/${item.id}`} className={classNames.linkItem}>
          <Text>{item.name}</Text>
        </Link>
      </Stack>
    </TooltipHost>
  );
};

const renderListTooltip = (listString) => {
  const displayListString = [...listString];
  displayListString.splice(0, 3);
  return displayListString.map((name, index) => {
    return (
      <Stack key={index}>
        <Text style={{ color: LIGHT_THEME.palette.white }}>
          {index + 1}. {name}
        </Text>
      </Stack>
    );
  });
};

const renderContributors = ({ contributors }) => {
  if (!contributors) {
    return null;
  }

  const contributorList = contributors?.split(',');
  const _defaultPersona = (name, paddingLeft = 0) => (
    <TooltipHost
      styles={{ root: { display: 'flex', alignItems: 'center', cursor: 'pointer' } }}
      delay={TooltipDelay.zero}
      content={name}
    >
      <Persona
        hidePersonaDetails
        size={PersonaSize.size40}
        styles={{ root: { cursor: 'pointer', paddingLeft } }}
        text={name}
      />
    </TooltipHost>
  );

  return (
    <Stack horizontal horizontalAlign="start" verticalAlign="center">
      {_defaultPersona(contributorList[0])}
      {contributorList[1] ? _defaultPersona(contributorList[1], 8) : null}
      {contributorList[1] ? _defaultPersona(contributorList[2], 8) : null}
      {contributorList.length > 3 ? (
        <TooltipHost
          styles={{ root: { display: 'flex', alignItems: 'center', cursor: 'pointer' } }}
          delay={TooltipDelay.zero}
          tooltipProps={{ onRenderContent: () => renderListTooltip(contributorList) }}
        >
          <Text
            style={{
              marginLeft: 8,
            }}
            onClick={() => {}}
          >
            +{contributorList.length - 3}
          </Text>
        </TooltipHost>
      ) : null}
    </Stack>
  );
};

const contributorConfig = {
  key: 'contributors',
  name: 'Contributors',
  fieldName: 'contributors',
  ariaLabel: 'Contributors',
  minWidth: 170,
  onRender: renderContributors,
  styles: {
    cellTitle: {
      [BREAKPOINTS_RESPONSIVE.lg]: {
        maxWidth: '200px !important',
      },
    },
    root: {
      [BREAKPOINTS_RESPONSIVE.lg]: {
        minWidth: '130px !important',
      },
    },
    cellName: {
      [BREAKPOINTS_RESPONSIVE.lg]: {
        maxWidth: '200px !important',
      },
    },
  },
};

const columnSchema = (props) => [
  {
    key: 'accountName',
    name: 'Account',
    fieldName: 'accountName',
    ariaLabel: 'Account',
    minWidth: 80,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    className: classNames.cellName,
    onRender: renderName,
    styles: {
      cellName: {
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          minWidth: '70px !important',
        },
      },
      cellTitle: {
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          minWidth: '70px !important',
        },
      },
    },
  },
  {
    key: 'lastActivity',
    name: 'Last Activity',
    fieldName: 'lastActivity',
    ariaLabel: 'Last Activity',
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    className: classNames.cellName,
    minWidth: !props?.isDesktop && 70,
    maxWidth: 80,
    onRender: (item) => <Text>{millisecondsToStr(new Date() - new Date(item.lastActivity))}</Text>,
    styles: {
      cellTitle: {
        justifyContent: 'flex-end',
      },
      cellName: {
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          maxWidth: '70px !important',
        },
      },
      root: {
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          minWidth: '70px !important',
        },
      },
    },
  },
  {
    key: 'totalVisit',
    name: 'Visits',
    fieldName: 'totalVisit',
    ariaLabel: 'Visits',
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    minWidth: !props?.isDesktop && 39,
    maxWidth: 55,
    className: classNames.cellName,
    styles: {
      cellTitle: {
        justifyContent: 'flex-end',
      },
      cellName: {
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          minWidth: '40px !important',
        },
      },
    },
    onRender: (item) => <Text>{item.totalVisit || 0}</Text>,
  },
  {
    key: 'totalVisitor',
    name: 'Visitors',
    fieldName: 'totalVisitor',
    ariaLabel: 'Visitors',
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    minWidth: !props?.isDesktop && 60,
    maxWidth: 75,
    className: `${classNames.cellName} ${classNames.visitorItem}`,
    styles: {
      cellTitle: {
        justifyContent: 'flex-end',
        [BREAKPOINTS_RESPONSIVE.lgUp]: {
          paddingRight: 20,
        },
        [BREAKPOINTS_RESPONSIVE.xlUp]: {
          paddingRight: 40,
        },
      },
      cellName: {
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          minWidth: '50px !important',
        },
      },
    },
    onRender: (item) => <Text>{item.totalVisitor || 0}</Text>,
  },
];

export { contributorConfig };
export default columnSchema;

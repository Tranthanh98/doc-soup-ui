import React from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  Icon,
  Text,
  ThemeContext,
  CollapseAllVisibility,
  DefaultButton,
  Image,
  ImageFit,
} from '@fluentui/react';
import { CustomDetailsList } from 'features/shared/components';
import { Link } from 'react-router-dom';
import { PAGE_PATHS } from 'core/constants/Const';
import * as dayjs from 'dayjs';
import format from 'format-duration';
import { BREAKPOINTS_RESPONSIVE, DARK_THEME, LIGHT_THEME } from 'core/constants/Theme';
import BarChart from './ContactChart';

const rowFileContainer = {
  root: {
    minHeight: 60,
    cursor: 'pointer',
    selectors: {
      ':hover': {
        backgroundColor: DARK_THEME.palette.neutralDark,
      },
    },
  },
};

const renderFileDisplayName = (item, headerProps) => {
  const imageSrc = headerProps.thumbnailSrc[item.fileId];
  return (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
      <Stack.Item disableShrink>
        <Link to={`/${PAGE_PATHS.fileDetail}/${item.fileId}`}>
          <Image
            imageFit={ImageFit.centerContain}
            src={imageSrc || '/img/default-pdf-thumbnail.png'}
            srcSet={imageSrc || '/img/default-pdf-thumbnail-2x.png 2x, /img/default-pdf-thumbnail-3x.png 3x'}
            width={36}
            height={36}
          />
        </Link>
      </Stack.Item>
      <Stack.Item styles={{ root: { overflow: 'hidden', whiteSpace: 'nowrap' } }}>
        <Link to={`/${PAGE_PATHS.fileDetail}/${item.fileId}`}>
          <Text>{item.fileDisplayName}</Text>
        </Link>
      </Stack.Item>
    </Stack>
  );
};

const renderLastActivity = (item) => <Text>{dayjs(new Date(item.lastActivity)).format('YYYY.MM.DD')}</Text>;

const renderTimeSpent = (item) => <Text>{format(item.timeSpent)}</Text>;

const expandBtnStyles = (theme, isCollapsed) => {
  const rootHoveredOrPressedExpanded = {
    backgroundColor: 'transparent',
    color: theme.palette.orangeLight,
    fill: theme.palette.orangeLight,
  };

  const rootHoveredOrPressedCollapsed = {
    backgroundColor: 'transparent',
    fill: LIGHT_THEME.palette.neutralSecondaryAlt,
  };

  const rootStyles = {
    alignSelf: 'end',
    border: 0,
    backgroundColor: theme.palette.noBackground,
    selectors: {
      '&:hover': {
        color: 'inherit',
      },
    },
  };
  if (isCollapsed) {
    return {
      root: { ...rootStyles },
      rootHovered: { ...rootHoveredOrPressedCollapsed },
      rootPressed: { ...rootHoveredOrPressedCollapsed },
    };
  }
  return {
    root: {
      ...rootStyles,
      color: theme.palette.orangeLight,
      fill: theme.palette.orangeLight,
    },
    rootHovered: { ...rootHoveredOrPressedExpanded },
    rootPressed: { ...rootHoveredOrPressedExpanded },
  };
};

const renderGroupHeader = (props) => {
  if (props) {
    const { group, onToggleCollapse, theme, columns } = props;
    const _toggleCollapse = () => {
      onToggleCollapse(group);
    };
    return (
      <Stack horizontal verticalAlign="center" styles={rowFileContainer}>
        <Stack styles={{ root: { width: columns[0].calculatedWidth + 20, padding: '0px 8px 0px 12px' } }}>
          {renderFileDisplayName(group, props)}
        </Stack>
        <Stack grow horizontal verticalAlign="center" horizontalAlign="end">
          <Stack
            horizontalAlign="end"
            styles={{ root: { width: columns[1].currentWidth + 20, ...columns[1]?.styles?.root } }}
          >
            {renderTimeSpent(group)}
          </Stack>
          <Stack
            horizontalAlign="end"
            styles={{ root: { width: columns[2].currentWidth + 20, ...columns[2]?.styles?.root } }}
          >
            <Text>{group.visits}</Text>
          </Stack>
          <Stack
            horizontalAlign="end"
            styles={{ root: { width: columns[3].currentWidth + 20, ...columns[3]?.styles?.root } }}
          >
            {renderLastActivity(group)}
          </Stack>
          <Stack
            grow
            horizontalAlign="end"
            styles={{ root: { minWidth: columns[4].currentWidth + 20, paddingRight: 10 } }}
          >
            <DefaultButton styles={expandBtnStyles(theme, group.isCollapsed)} onClick={_toggleCollapse}>
              <Icon
                iconName={group.isCollapsed ? 'black-circle-chart-svg' : 'white-circle-chart-svg'}
                styles={{ root: { width: 24, height: 24 } }}
              />
              <Icon
                iconName={group.isCollapsed ? 'chevron-down-svg' : 'chevron-up-svg'}
                styles={{ root: { width: 12, height: 24, marginLeft: 4 } }}
              />
            </DefaultButton>
          </Stack>
        </Stack>
      </Stack>
    );
  }
  return null;
};

const columnsStyles = {
  root: {
    padding: '0px 8px 0px 12px',
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        display: 'none',
      },
    },
  },
  cellTitle: {
    justifyContent: 'flex-end',
  },
};
const columnsSchema = [
  {
    key: 'fileDisplayName',
    name: 'Name',
    fieldName: 'fileDisplayName',
    ariaLabel: 'Name',
    isRowHeader: true,
    minWidth: 220,
    isSortable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    onRender: renderFileDisplayName,
  },
  {
    key: 'timeSpent',
    name: 'Time Spent',
    fieldName: 'timeSpent',
    ariaLabel: 'Time Spent',
    minWidth: 100,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    onRender: renderTimeSpent,
    styles: columnsStyles,
  },
  {
    key: 'visits',
    name: 'Visits',
    fieldName: 'visits',
    ariaLabel: 'Visits',
    minWidth: 82,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    styles: columnsStyles,
  },
  {
    key: 'lastActivity',
    name: 'Last Visited',
    fieldName: 'lastActivity',
    ariaLabel: 'Last Visited',
    minWidth: 90,
    isSortable: true,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    onRender: renderLastActivity,
    styles: columnsStyles,
  },
  {
    key: 'action',
    name: '',
    fieldName: 'action',
    width: 43,
    minWidth: 43,
  },
];

export default function FileList(props) {
  const { items, isFullBody, onSort } = props;

  const renderGroupFooter = (footerProps) => {
    return <BarChart file={{ ...footerProps.group }} />;
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Stack className="fileListSwapper" style={{ maxHeight: 500 }}>
          <CustomDetailsList
            columns={columnsSchema}
            items={items}
            groups={items}
            isStickyHeader={false}
            isFullBody={isFullBody}
            detailListProps={{
              groupProps: {
                onRenderHeader: (headerProps) => renderGroupHeader({ ...headerProps, ...props, theme }),
                onRenderFooter: renderGroupFooter,
                collapseAllVisibility: CollapseAllVisibility.hidden,
              },
              onRenderRow: () => null,
              onColumnHeaderClick: (_e, column) => onSort(_e, column, columnsSchema),
            }}
          />
        </Stack>
      )}
    </ThemeContext.Consumer>
  );
}
FileList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  isFullBody: PropTypes.bool,
  onSort: PropTypes.func.isRequired,
};
FileList.defaultProps = {
  items: [],
  isFullBody: true,
};

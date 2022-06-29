/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  mergeStyleSets,
  ScrollablePane,
  Sticky,
  StickyPositionType,
  ScrollbarVisibility,
  MarqueeSelection,
  ShimmeredDetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Selection,
  Text,
  Checkbox,
  TooltipHost,
  Icon,
  Stack,
} from '@fluentui/react';
import { CustomText } from 'features/shared/components';
import { LIGHT_THEME } from 'core/constants/Theme';
import CustomDetailRow from './CustomDetailRow';
import CustomIconButton from '../CustomIconButton';
import CustomPagination from '../CustomPagination';

const titleStyles = {
  root: {
    marginTop: 16,
    marginBottom: 8,
  },
};
const classNames = mergeStyleSets({
  listWrapper: {
    position: 'relative',
  },
  cellAction: {
    padding: '0 !important',
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center',
  },
  width100: {
    div: {
      'div.ms-GroupedList': {
        width: '100%',
      },
    },
  },
});

function _copyAndSort(items, columnKey, isSortedDescending) {
  const key = columnKey;
  return items.slice(0).sort((a, b) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

const detailsListStyles = (isFullBody) => ({
  contentWrapper: !isFullBody
    ? {
        maxHeight: 500,
        overflowY: 'auto',
      }
    : {},
});

class CustomDetailsList extends Component {
  constructor(props) {
    super(props);
    this._selection = new Selection({
      getKey: this._getKey,
      canSelectItem: (item) => {
        const { canSelectItem } = this.props;
        return canSelectItem && canSelectItem(item);
      },
      onSelectionChanged: () => {
        const { onSelectItems } = this.props;
        onSelectItems(this._selection);
        this.setState({ selectionDetails: this._getSelectionDetails() });
      },
    });

    this.state = {
      items: [],
      isSorted: false,
      selectionDetails: this._getSelectionDetails(),
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.items && state.isSorted) {
      return {
        items: state.items,
        isSorted: false,
      };
    }
    if (props.items !== state.items) {
      return {
        items: props.items,
      };
    }
    return null;
  }

  _renderShareBtn = (item) => (
    <CustomIconButton
      className="action-btn-overlay"
      iconProps={{ iconName: 'share-svg' }}
      styles={{
        root: { paddingLeft: 2, paddingRight: 6, display: 'none' },
        icon: { width: 28 },
        rootHovered: {
          svg: { fill: '#363636' },
        },
      }}
      title="Share"
      ariaLabel="Share"
      onClick={() => this._shareItem(item)}
    />
  );

  _renderActionsBtn = (item) => {
    const { actionIconName, onGetMenuActions } = this.props;
    if (!onGetMenuActions(item)) {
      return null;
    }
    return (
      <CustomIconButton
        className="action-btn-overlay"
        styles={{
          root: { paddingRight: 28 },
          menuIcon: { width: 28 },
          rootHovered: {
            svg: { fill: '#363636' },
          },
        }}
        menuIconProps={{ iconName: actionIconName }}
        title="Actions"
        ariaLabel="Actions"
        menuProps={onGetMenuActions(item)}
      />
    );
  };

  _onRenderRow = (props) => <CustomDetailRow rowProps={props} {...this.props} />;

  _onColumnClick = (ev, column) => {
    const { columns } = this.props;
    const { items } = this.state;
    const newColumns = columns.slice();
    const currColumn = newColumns.filter((currCol) => column?.key === currCol?.key)[0];
    if (currColumn && currColumn.isSortable) {
      newColumns.forEach((newCol) => {
        if (newCol === currColumn) {
          currColumn.isSortedDescending = !currColumn?.isSortedDescending;
          currColumn.isSorted = true;
        } else {
          const col = newCol;
          col.isSorted = false;
          col.isSortedDescending = true;
        }
      });
      const newItems = _copyAndSort(items, currColumn.fieldName, currColumn.isSortedDescending);
      this.setState({
        items: newItems,
        isSorted: true,
      });
    }
  };

  _onRenderCheckBox = (props) => (
    <div style={{ pointerEvents: 'none' }}>
      <Checkbox {...props} />
    </div>
  );

  _shareItem = (item) => {
    const { onShareItem } = this.props;
    onShareItem(item);
  };

  _getColumns = () => {
    const { columns, isShareable, onGetMenuActions } = this.props;
    let currColumns = columns.map((i) => ({
      ...i,
      styles: {
        ...i.styles,
        cellTitle: { cursor: 'pointer', '&:hover': { backgroundColor: '#fff' }, ...i.styles?.cellTitle },
      },
    }));
    if (isShareable) {
      currColumns = [
        ...currColumns,
        {
          key: 'share',
          name: '',
          fieldName: 'share',
          minWidth: 35,
          className: classNames.cellAction,
          onRender: this._renderShareBtn,
        },
      ];
    }
    if (onGetMenuActions) {
      currColumns = [
        ...currColumns,
        {
          key: 'actions',
          name: '',
          fieldName: 'actions',
          minWidth: 35,
          className: classNames.cellAction,
          onRender: this._renderActionsBtn,
        },
      ];
    }
    return currColumns;
  };

  _getKey(item) {
    return item && item.id;
  }

  _getSelectionDetails() {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return `1 item selected: ${this._selection.getSelection()[0].name}`;
      default:
        return `${selectionCount} items selected`;
    }
  }

  render() {
    const {
      pagingOptions,
      isPagination,
      detailListProps,
      title,
      compact,
      isModalSelection,
      isSelectionDetails,
      isStickyHeader,
      maxHeight,
      groups,
      isFullBody,
    } = this.props;
    const { items, selectionDetails } = this.state;
    const currColumns = this._getColumns();
    const shimmeredDetailsListProps = { renderedWindowsAhead: 0, renderedWindowsBehind: 0 };
    let baseDetailList = isModalSelection ? (
      <MarqueeSelection selection={this._selection}>
        <ShimmeredDetailsList
          items={items || []}
          compact={compact}
          columns={currColumns}
          groups={groups}
          getKey={this._getKey}
          enableShimmer={!items}
          ariaLabelForShimmer="Content is being fetched"
          listProps={shimmeredDetailsListProps}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.multiple}
          selection={this._selection}
          selectionPreservedOnEmptyClick
          enterModalSelectionOnTouch
          ariaLabelForSelectionColumn={undefined}
          ariaLabelForSelectAllCheckbox={undefined}
          checkButtonAriaLabel="select row"
          onRenderCheckbox={this._onRenderCheckBox}
          onColumnHeaderClick={this._onColumnClick}
          onRenderRow={this._onRenderRow}
          onRenderDetailsHeader={(headerProps, defaultRender) => {
            return (
              <Sticky stickyPosition={StickyPositionType.Header}>
                {defaultRender({
                  ...headerProps,
                  onRenderColumnHeaderTooltip: (customProps) => {
                    if (!customProps?.column) {
                      return customProps.children;
                    }
                    return (
                      <TooltipHost
                        {...customProps}
                        className={customProps.hostClassName}
                        content={null}
                        // eslint-disable-next-line react/no-children-prop
                        children={
                          <Stack
                            onClick={(e) => headerProps.onColumnClick(e, customProps.column)}
                            horizontal
                            verticalAlign="center"
                            styles={{
                              ...customProps.styles,
                              root: {
                                ...customProps.root,
                                padding: '0 8px 0 12px',
                                display: 'flex',
                              },
                            }}
                            className={customProps.children?.props?.className}
                          >
                            <CustomText
                              styles={{ root: { fontSize: 13, fontWeight: 500, lineSpacing: '-0.5px' } }}
                              color="neutralSecondaryAlt"
                            >
                              {customProps.content}
                            </CustomText>
                            {customProps.column?.isSorted ? (
                              <Icon
                                styles={{
                                  root: {
                                    color: LIGHT_THEME.palette.orangeLight,
                                    fontWeight: 600,
                                    fontSize: 8,
                                    paddingLeft: 8,
                                  },
                                }}
                                iconName={
                                  customProps.column?.isSortedDescending ? 'ChevronUpSmall' : 'ChevronDownSmall'
                                }
                              />
                            ) : null}
                          </Stack>
                        }
                      />
                    );
                  },
                })}
              </Sticky>
            );
          }}
          {...detailListProps}
        />
      </MarqueeSelection>
    ) : (
      <ShimmeredDetailsList
        items={items || []}
        compact={compact}
        columns={currColumns}
        groups={groups}
        getKey={this._getKey}
        setKey="none"
        enableShimmer={!items}
        ariaLabelForShimmer="Content is being fetched"
        listProps={shimmeredDetailsListProps}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        onColumnHeaderClick={this._onColumnClick}
        onRenderRow={this._onRenderRow}
        className={classNames.width100}
        detailsListStyles={detailsListStyles(isFullBody)}
        onRenderDetailsHeader={(headerProps, defaultRender) => {
          return (
            <Sticky stickyPosition={StickyPositionType.Header}>
              {defaultRender({
                ...headerProps,
                onRenderColumnHeaderTooltip: (customProps) => {
                  return (
                    <TooltipHost
                      {...customProps}
                      styles={{ root: { cursor: 'pointer' } }}
                      content={null}
                      // eslint-disable-next-line react/no-children-prop
                      children={
                        <Stack
                          onClick={(e) => headerProps.onColumnClick(e, customProps.column)}
                          horizontal
                          verticalAlign="center"
                          styles={{
                            ...customProps.styles,
                            root: {
                              ...customProps.root,
                              padding: '0 8px 0 12px',
                              display: 'flex',
                            },
                          }}
                          className={customProps.children?.props?.className}
                        >
                          <CustomText
                            styles={{ root: { fontSize: 13, fontWeight: 500, lineSpacing: '-0.5px' } }}
                            color="neutralSecondaryAlt"
                          >
                            {customProps.content}
                          </CustomText>
                          {customProps?.column?.isSorted ? (
                            <Icon
                              styles={{
                                root: {
                                  color: LIGHT_THEME.palette.orangeLight,
                                  fontWeight: 600,
                                  fontSize: 8,
                                  paddingLeft: 8,
                                },
                              }}
                              iconName={customProps?.column?.isSortedDescending ? 'ChevronUpSmall' : 'ChevronDownSmall'}
                            />
                          ) : null}
                        </Stack>
                      }
                    />
                  );
                },
              })}
            </Sticky>
          );
        }}
        {...detailListProps}
      />
    );
    if (isStickyHeader) {
      baseDetailList = <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>{baseDetailList}</ScrollablePane>;
    }
    return (
      <>
        {title && (
          <Text variant="xLarge" block styles={titleStyles}>
            {title}
          </Text>
        )}
        {isSelectionDetails && <Text>{selectionDetails}</Text>}
        <div className={classNames.listWrapper} style={{ height: maxHeight }}>
          {baseDetailList}
        </div>
        {isPagination ? <CustomPagination {...pagingOptions} /> : null}
      </>
    );
  }
}
CustomDetailsList.propTypes = {
  title: PropTypes.string,
  compact: PropTypes.bool,
  striped: PropTypes.bool,
  isModalSelection: PropTypes.bool,
  isSelectionDetails: PropTypes.bool,
  isShareable: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  detailListProps: PropTypes.oneOfType([PropTypes.object]),
  columns: PropTypes.oneOfType([PropTypes.array]).isRequired,
  items: PropTypes.oneOfType([PropTypes.array]),
  groups: PropTypes.oneOfType([PropTypes.array]),
  onShareItem: PropTypes.func,
  onGetMenuActions: PropTypes.func,
  actionIconName: PropTypes.string,
  checkboxVisibility: PropTypes.number,
  onSelectItems: PropTypes.func,
  isStickyHeader: PropTypes.bool,
  canSelectItem: PropTypes.func,
  isPagination: PropTypes.bool,
  pagingOptions: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    onChangePageSize: PropTypes.func,
    onChangePageIndex: PropTypes.func,
  }),
  isFullBody: PropTypes.bool,
};
CustomDetailsList.defaultProps = {
  title: '',
  compact: false,
  striped: false,
  isModalSelection: false,
  isSelectionDetails: false,
  isShareable: false,
  maxHeight: undefined,
  detailListProps: undefined,
  items: undefined,
  groups: undefined,
  onShareItem: undefined,
  onGetMenuActions: undefined,
  actionIconName: 'more-svg',
  checkboxVisibility: undefined,
  onSelectItems: undefined,
  isStickyHeader: true,
  canSelectItem: undefined,
  pagingOptions: undefined,
  isPagination: false,
  isFullBody: true,
};
export default CustomDetailsList;

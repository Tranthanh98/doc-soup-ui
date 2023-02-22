/* eslint-disable max-lines */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext, Stack, Text, CollapseAllVisibility, Toggle, Icon, Separator } from '@fluentui/react';
import { CustomDetailsList, CustomIconButton, CustomText } from 'features/shared/components';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import { millisecondsToStr, sortGroupData } from 'features/shared/lib/utils';
import { PersonaLinkTag, ShareFileModal } from 'core/components';
import LinkBiz from 'core/biz/LinkBiz';
import FileBiz from 'core/biz/FileBiz';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import { LINK_TYPE } from 'core/constants/Const';
import { success } from 'features/shared/components/ToastMessage';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import columnsSchema from '../../../content/fileDetail/configs/columnConfigLinkOfFileList';
import StatisticLinkDetail from './StatisticLinkDetail';

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
  const iconStyles = {
    icon: {
      width: 12,
      height: 24,
      marginLeft: 8,
      marginRight: 8,
    },
  };
  if (isCollapsed) {
    return {
      ...iconStyles,
      root: { backgroundColor: 'transparent' },
      rootHovered: { ...rootHoveredOrPressedCollapsed },
      rootPressed: { ...rootHoveredOrPressedCollapsed },
    };
  }
  return {
    ...iconStyles,
    root: {
      backgroundColor: 'transparent',
      color: theme.palette.orangeLight,
      fill: theme.palette.orangeLight,
      selectors: {
        '&:hover': {
          color: 'inherit',
          fill: 'inherit',
        },
      },
    },
    rootHovered: { ...rootHoveredOrPressedExpanded },
    rootPressed: { ...rootHoveredOrPressedExpanded },
  };
};
const menuIconStyles = (theme) => {
  const commonStyles = {
    backgroundColor: 'unset',
    svg: { fill: theme.palette.neutralPrimaryAlt },
  };
  return {
    root: {
      display: 'none',
      backgroundColor: 'unset',
    },
    rootHovered: commonStyles,
    rootExpandedHovered: commonStyles,
    rootExpanded: commonStyles,
    rootPressed: commonStyles,
    menuIcon: { width: 28 },
  };
};
const linkGroupHeaderStyles = (groupIndex) => ({
  root: {
    '&:hover': { '.menu-button': { display: 'block' } },
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      marginTop: groupIndex > 0 ? 20 : undefined,
    },
  },
});

const renderGroupHeader = (props, _openLinkSettingModal, _onChangeStatusOfLink, onRenderName) => {
  if (props) {
    const { group, groupIndex, groups, onToggleCollapse, theme, columns, onDeleteLink, isExpandToShowViewer } = props;

    const _toggleCollapse = () => {
      onToggleCollapse(group);
    };

    return (
      <Stack verticalAlign="center">
        <Stack horizontal verticalAlign="center" tokens={{ padding: 10 }} styles={linkGroupHeaderStyles(groupIndex)}>
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 8 }}
            styles={{ root: { width: columns[0].calculatedWidth + 20, ...columns[0]?.styles?.root } }}
          >
            {typeof onRenderName === 'function' ? (
              onRenderName(group)
            ) : (
              <>
                <Stack styles={{ root: { width: 20, height: 20 } }}>
                  <Icon iconName="hyperlink-svg" styles={{ root: { width: 20, height: 20 } }} />
                </Stack>
                <Text nowrap style={{ width: '80%' }}>
                  {group.linkName}
                </Text>
              </>
            )}
          </Stack>
          <Stack.Item
            styles={{
              root: {
                width: columns[1].currentWidth + 20,
                [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' },
                ...columns[1]?.styles?.root,
              },
            }}
          >
            <PersonaLinkTag linkId={group.linkId} isCopyToClipboard createdBy={group.linkCreatorName} />
          </Stack.Item>
          <Stack.Item styles={{ root: { width: columns[2].currentWidth + 12, ...columns[2]?.styles?.root } }}>
            <Toggle
              onText="ON"
              offText="OFF"
              checked={!group.disabled}
              onChange={(_, value) => _onChangeStatusOfLink(group.linkId, value)}
              styles={{ root: { marginBottom: 0 } }}
            />
          </Stack.Item>
          <Stack.Item styles={{ root: { width: columns[3].currentWidth + 20, ...columns[3]?.styles?.root } }}>
            <Text nowrap>{millisecondsToStr(new Date() - new Date(group.createdDate))}</Text>
          </Stack.Item>
          <Stack.Item styles={{ root: { width: columns[4].currentWidth + 12, ...columns[4]?.styles?.root } }}>
            <Text>{group.activity}</Text>
          </Stack.Item>
          <Stack.Item grow styles={{ root: { width: columns[5].calculatedWidth + 20, ...columns[5]?.styles?.root } }}>
            <CustomIconButton
              className="menu-button"
              menuIconProps={{ iconName: 'more-svg' }}
              menuProps={{
                shouldFocusOnMount: true,
                alignTargetEdge: true,
                items: [
                  { key: 'newItem', text: 'Edit link setting', onClick: () => _openLinkSettingModal(group) },
                  {
                    key: 'rename',
                    text: <CustomText color="textDanger">Delete link</CustomText>,
                    onClick: () => {
                      window.confirm({
                        title: `Delete this link?`,
                        yesText: 'Ok',
                        noText: 'Cancel',
                        yesAction: () => onDeleteLink(group),
                      });
                    },
                  },
                ],
              }}
              styles={menuIconStyles(theme)}
              onClick={() => _openLinkSettingModal(group)}
              title="More"
              ariaLabel="More"
            />
          </Stack.Item>
          {isExpandToShowViewer === true ? (
            <Stack disableShrink horizontalAlign="end">
              <CustomIconButton
                iconProps={{ iconName: group.isCollapsed ? 'chevron-down-svg' : 'chevron-up-svg' }}
                styles={expandBtnStyles(theme, group.isCollapsed)}
                onClick={_toggleCollapse}
              />
            </Stack>
          ) : (
            <div style={{ width: 40, height: 40 }} />
          )}
        </Stack>
        <Stack.Item styles={{ root: { [BREAKPOINTS_RESPONSIVE.lgUp]: { display: 'none' } } }}>
          <PersonaLinkTag linkId={group.linkId} isCopyToClipboard width="100%" createdBy={group.linkCreatorName} />
        </Stack.Item>
        {groupIndex !== groups.length - 1 && group.isCollapsed && (
          <Separator
            styles={{
              root: { marginTop: '20px !important', [BREAKPOINTS_RESPONSIVE.lgUp]: { display: 'none' } },
              content: { padding: 0 },
            }}
          />
        )}
      </Stack>
    );
  }
  return null;
};
const renderRow = (rowItem) => {
  return (
    <Stack
      styles={{
        root: {
          [BREAKPOINTS_RESPONSIVE.mdDown]: { borderBottom: `1px solid ${LIGHT_THEME.palette.neutralQuaternaryAlt}` },
        },
      }}
    >
      <StatisticLinkDetail version={rowItem.version} item={rowItem.item} isStickyHeader={false} maxHeight={undefined} />
    </Stack>
  );
};

export default function LinkOfFileList(props) {
  const { linkList, refreshAllLink, pagingOptions, onRefreshAllLink, onRenderName, isExpandToShowViewer, version } =
    props;
  const context = useContext(GlobalContext);
  const { getToken, isMobile } = context;
  const [groups, setGroups] = useState([]);
  const [isOpenLinkSettingModal, setIsOpenLinkSettingModal] = useState(false);
  const [linkInfo, setLinkInfo] = useState(undefined);
  const [shareDocument, setShareDocument] = useState({});

  useEffect(() => {
    setGroups(FileBiz.standardizeLinksOfFile(linkList));
  }, [linkList]);

  const getLinkInfo = (row) => {
    if (row.watermarkId) {
      new RestService()
        .setPath(`/setting/watermark/${row.watermarkId}`)
        .setToken(getToken())
        .get()
        .then((resp) => {
          const watermarkValue = JSON.parse(resp.data.text);

          const link = LinkBiz.parseLinkDataToViewModel(row, watermarkValue);
          setLinkInfo(link);
        })
        .catch((err) => restServiceHelper.handleError(err));
    } else {
      const link = LinkBiz.parseLinkDataToViewModel(row);
      setLinkInfo(link);
    }
  };
  const _openLinkSettingModal = (group) => {
    setShareDocument(group);

    new RestService()
      .setPath(`/link/${group.linkId}/setting`)
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        const link = { ...data, id: data.linkId };
        getLinkInfo(link);
        setIsOpenLinkSettingModal(true);
      })
      .catch((err) => restServiceHelper.handleError(err));
  };

  const _toggleLinkSettingModal = () => {
    setIsOpenLinkSettingModal(false);
    setLinkInfo(undefined);
  };

  const _onChangeStatusOfLink = async (linkId, value) => {
    try {
      await new RestService().setPath(`/link/${linkId}/status`).setToken(getToken()).put({ disabled: !value });
      refreshAllLink();
    } catch (err) {
      console.log(err);
    }
  };

  const _handleSort = (_ev, column) => {
    const newGroups = sortGroupData({ sortedColumn: column, columns: columnsSchema, groups });
    setGroups(newGroups);
  };

  const onDeleteLink = (row) => {
    new RestService()
      .setPath(`/link/${row.linkId}`)
      .setToken(getToken())
      .delete()
      .then(() => {
        success('Delete link successfully');
        refreshAllLink();
      })
      .catch((err) => restServiceHelper.handleError(err));
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Stack className="viewerFileWrapper">
          <CustomDetailsList
            isStickyHeader={false}
            columns={columnsSchema}
            items={linkList}
            groups={groups}
            {...props}
            detailListProps={{
              groupProps: {
                onRenderHeader: (headerProps) =>
                  renderGroupHeader(
                    { ...headerProps, theme, onDeleteLink, isExpandToShowViewer },
                    _openLinkSettingModal,
                    _onChangeStatusOfLink,
                    onRenderName
                  ),
                collapseAllVisibility: CollapseAllVisibility.hidden,
              },
              onRenderRow: (item) => renderRow({ ...item, theme, version }),
              isHeaderVisible: !isMobile,
              onColumnHeaderClick: _handleSort,
            }}
            isPagination
            pagingOptions={pagingOptions}
          />
          <ShareFileModal
            title="Link Edit"
            linkType={LINK_TYPE.FILE}
            shareDocument={shareDocument}
            isOpen={isOpenLinkSettingModal}
            onToggle={_toggleLinkSettingModal}
            linkValuesInfo={linkInfo}
            onRefreshAllLink={onRefreshAllLink}
          />
        </Stack>
      )}
    </ThemeContext.Consumer>
  );
}

LinkOfFileList.propTypes = {
  linkList: PropTypes.oneOfType([PropTypes.array]),
  refreshAllLink: PropTypes.func,
  setRenderEmpty: PropTypes.func,
  pagingOptions: PropTypes.oneOfType([PropTypes.object]),
  onRefreshAllLink: PropTypes.func,
  onRenderName: PropTypes.func,
  isExpandToShowViewer: PropTypes.bool,
  version: PropTypes.number.isRequired,
};
LinkOfFileList.defaultProps = {
  refreshAllLink: true,
  setRenderEmpty: undefined,
  pagingOptions: undefined,
  onRefreshAllLink: undefined,
  onRenderName: undefined,
  linkList: undefined,
  isExpandToShowViewer: true,
};

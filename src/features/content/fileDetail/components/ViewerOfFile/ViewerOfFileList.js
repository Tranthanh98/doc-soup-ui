/* eslint-disable max-lines */
/* eslint max-lines: ["warn", {"max": 400, "skipBlankLines": true, "skipComments": true}] */
import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomButton, CustomDetailsList, FileDetailEmptyContent, CircleProgress } from 'features/shared/components';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import GlobalContext from 'security/GlobalContext';
import {
  CollapseAllVisibility,
  Stack,
  Text,
  ThemeContext,
  DefaultButton,
  Icon,
  TooltipHost,
  TooltipDelay,
  Link as FluentUILink,
  Persona,
  PersonaSize,
  Shimmer,
  ShimmerElementType,
  mergeStyles,
} from '@fluentui/react';
import { createGroupTable, millisecondsToStr, sortGroupData } from 'features/shared/lib/utils';
import format from 'format-duration';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import {
  PAGE_PATHS,
  ROWS_PER_PAGE,
  WEB_SOCKET_ACTION,
  WEB_SOCKET_TOPIC,
  WEB_SOCKET_DESTINATION,
  MODAL_NAME,
} from 'core/constants/Const';
import { useParams, Link } from 'react-router-dom';
import FileBiz from 'core/biz/FileBiz';
import fileHelper from 'features/shared/lib/fileHelper';
import { NDAButton } from 'core/components';
import SockJsClient from 'features/shared/lib/SockJsClient';
import columnsSchema from '../../configs/columnConfigViewerOfFileList';
import PageStatisticOfViewerOnFile from './PageStatisticOfViewerOnFile';
import LiveBadge from '../LiveBadge';

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

  const root = {
    border: 'none',
    backgroundColor: 'transparent',
    selectors: {
      '&:hover': {
        color: 'inherit',
        fill: 'inherit',
      },
    },
  };
  if (!isCollapsed) {
    return {
      root: {
        ...root,
        color: theme.palette.orangeLight,
        fill: theme.palette.orangeLight,
      },
      rootHovered: { ...rootHoveredOrPressedExpanded },
      rootPressed: { ...rootHoveredOrPressedExpanded },
    };
  }
  return {
    root,
    rootHovered: { ...rootHoveredOrPressedCollapsed },
    rootPressed: { ...rootHoveredOrPressedCollapsed },
  };
};

const emptyContentStyles = {
  root: { marginBottom: 30, fontSize: 20, [BREAKPOINTS_RESPONSIVE.mdDown]: { fontSize: 16 } },
};

const createLinkButtonStyles = {
  root: { width: 120, height: 44, borderRadius: 2, [BREAKPOINTS_RESPONSIVE.mdDown]: { height: 44 } },
  label: { fontSize: 16, fontWeight: 500 },
};

const renderPreviewTooltip = () => (
  <Stack horizontal tokens={{ padding: 8 }} styles={{ root: { maxWidth: 255 } }}>
    <span>
      The person that is visited this document owns or collaborates on the associated link. Tracking visits of
      users&lsquo; own links and Spaces can be disabled in
      <Link to={`/${PAGE_PATHS.settings}`}>
        <FluentUILink href="#" styles={(props) => ({ root: { color: props.theme.palette.orangeLight } })}>
          {' '}
          your company&lsquo;s settings.
        </FluentUILink>
      </Link>
    </span>
  </Stack>
);

const renderGroupHeader = (props) => {
  if (props) {
    const { group, onToggleCollapse, theme, columns, downloadNDAFile } = props;
    return (
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12, padding: 10 }}>
        <Stack
          horizontal
          disableShrink
          verticalAlign="center"
          styles={{ root: { width: columns[0].calculatedWidth + 20, ...columns[0]?.styles?.root } }}
          tokens={{ childrenGap: 8 }}
        >
          <Persona hidePersonaDetails size={PersonaSize.size40} initialsColor={15} text={group.name} />
          <Text>{group.name}</Text>
          <Stack horizontal tokens={{ childrenGap: 8 }} className="hiddenMdDown">
            {group.isPreview ? (
              <TooltipHost
                styles={{ root: { minWidth: 70 } }}
                delay={TooltipDelay.zero}
                tooltipProps={{ onRenderContent: renderPreviewTooltip }}
              >
                <Text style={{ color: LIGHT_THEME.palette.orangeLight }}>[Preview]*</Text>
              </TooltipHost>
            ) : null}
            {group.ndaId && group.signedNDA ? (
              <Stack.Item disableShrink>
                <NDAButton theme={theme} onClick={() => downloadNDAFile(group.viewerId)} />
              </Stack.Item>
            ) : null}
            {group.downloaded ? (
              <Icon
                iconName="downloaded-svg"
                styles={(styleProps) => ({ root: { fontSize: 20, color: styleProps.theme.palette.greenLight } })}
              />
            ) : null}
            {group.verifiedEmail ? (
              <TooltipHost delay={TooltipDelay.zero} calloutProps={{ gapSpace: 7 }} content="Email Verified">
                <Icon
                  iconName="VerifiedBrandSolid"
                  styles={(styleProps) => ({ root: { fontSize: 20, color: styleProps.theme.palette.greenLight } })}
                />
              </TooltipHost>
            ) : null}
          </Stack>
        </Stack>
        <Stack.Item styles={{ root: { width: columns[1].currentWidth, ...columns[1]?.styles?.root } }}>
          <Text>{millisecondsToStr(group.date)}</Text>
        </Stack.Item>
        <Stack.Item styles={{ root: { width: columns[2].currentWidth + 6, ...columns[2]?.styles?.root } }}>
          <Text>{group.deviceAndLocation}</Text>
        </Stack.Item>
        <Stack
          horizontal
          verticalAlign="center"
          tokens={{ childrenGap: 6 }}
          styles={{
            root: {
              width: columns[3].currentWidth,
              ...columns[3]?.styles?.root,
              [BREAKPOINTS_RESPONSIVE.xlUp]: {
                display: 'flex !important',
              },
            },
          }}
        >
          <Persona hidePersonaDetails size={PersonaSize.size24} text={group.linkCreator} />
          <Text>{group.sender}</Text>
        </Stack>
        <Stack
          horizontal
          horizontalAlign="end"
          verticalAlign="center"
          tokens={{ childrenGap: 8 }}
          styles={{
            root: {
              width: columns[4].currentWidth + 6,
              ...columns[4]?.styles?.rootGroup,
            },
          }}
        >
          {group.isViewing && <LiveBadge isShowTooltip />}
          <Stack.Item disableShrink>
            <Text>{format(group.duration)}</Text>
          </Stack.Item>
        </Stack>
        <Stack.Item styles={{ root: { width: columns[5].currentWidth, ...columns[5]?.styles?.root } }}>
          <TooltipHost
            delay={TooltipDelay.zero}
            calloutProps={{ gapSpace: 7 }}
            content={`Viewed: ${group.viewedRate}%`}
            styles={{ root: { width: 28 } }}
          >
            <CircleProgress
              percent={group.viewedRate}
              lineColor={
                parseInt(group.viewedRate, 10) === 100
                  ? `${LIGHT_THEME.palette.greenLight}`
                  : `${LIGHT_THEME.palette.themePrimary}`
              }
            />
          </TooltipHost>
        </Stack.Item>
        <Stack.Item styles={{ root: { minWidth: columns[6].currentWidth, ...columns[6]?.styles?.root } }}>
          <DefaultButton styles={expandBtnStyles(theme, group.isCollapsed)} onClick={() => onToggleCollapse(group)}>
            <Icon
              iconName={group.isCollapsed ? 'black-circle-chart-svg' : 'white-circle-chart-svg'}
              styles={{ root: { width: 24, height: 24 } }}
            />
            <Icon
              iconName={group.isCollapsed ? 'chevron-down-svg' : 'chevron-up-svg'}
              styles={{ root: { width: 12, height: 24, marginLeft: 4 } }}
            />
          </DefaultButton>
        </Stack.Item>
      </Stack>
    );
  }
  return null;
};

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

const wrapperClass = mergeStyles({
  padding: 2,
  selectors: {
    '& > .ms-Shimmer-container': {
      margin: '5px 0',
    },
  },
});

function ViewerOfFileList({ fileId, version, ...props }) {
  const [groups, setGroups] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: ROWS_PER_PAGE.FIVE,
    totalPages: 0,
  });
  const [isLoading, setLoading] = useState(true);

  const context = useContext(GlobalContext);

  const { getToken } = context;

  const params = useParams();

  const webSocketRef = useRef();

  const _setViewerActive = (groups, viewer) => {
    const group = groups.find((x) => x.viewerId === viewer.viewerId);
    if (group) {
      group.isViewing = viewer.isViewing;
      const newGroups = [...groups];
      setGroups(newGroups);
    }
  };

  const refreshAllViewer = () => {
    const refreshMessage = {
      dataBody: {
        isRefesh: true,
      },
      action: WEB_SOCKET_ACTION.REFRESH_ALL_VIEWER,
    };

    if (webSocketRef.current) {
      webSocketRef.current.sendMessage(WEB_SOCKET_DESTINATION.REFRESH_ALL_VIEWER, JSON.stringify(refreshMessage));
    } else {
      alert('Disconnected to server, please check your network.');
    }
  };

  const _getViewerOfFile = (id, viewerActive = undefined) => {
    setLoading(true);
    new RestService()
      .setPath(`/file/${id || params.id}/viewer?page=${pagination.page}&pageSize=${pagination.pageSize}`)
      .setToken(getToken())
      .get()
      .then((response) => {
        const { items, page, totalPages } = response.data;

        const displayItems = FileBiz.standardizeViewersOfFile(items);
        const groupData = createGroupTable(displayItems);
        if (viewerActive) {
          _setViewerActive(groupData, viewerActive);
        } else {
          setGroups(groupData);
        }

        setPagination({
          page,
          totalPages,
          pageSize: pagination.pageSize,
        });
      })
      .catch((error) => {
        RestServiceHelper.handleError(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    _getViewerOfFile(fileId);
  }, [fileId, pagination.page, pagination.pageSize]);

  const _handleDownloadNDAFile = (viewerId) => {
    const { getToken } = context;
    new RestService()
      .setPath(`/nda/download/${viewerId}`)
      .setToken(getToken())
      .setResponseType('arraybuffer')
      .get()
      .then((response) => {
        fileHelper.download(response.data, response.headers['content-type'], `download-visitor-${viewerId}-nda.zip`);
      })
      .catch((err) => {
        RestServiceHelper.handleError(err);
      });
  };

  const renderGroupFooter = (footerProps) => {
    const { group: item } = footerProps;
    let { device } = item;
    const deviceInfomations = item.device ? item.device.split(' - ') : '';
    if (deviceInfomations && deviceInfomations.length > 0) {
      if (deviceInfomations.length > 1) {
        device = `${deviceInfomations[deviceInfomations.length - 1]} - ${
          deviceInfomations[deviceInfomations.length - 2]
        }`;
      }
    }

    device = device.trim().replace(/^,/, '');

    const visitData = (
      <ThemeContext.Consumer>
        {(theme) => (
          <Stack
            styles={{
              root: {
                paddingBottom: 12,
                selectors: {
                  '> *': {
                    paddingTop: 12,
                    paddingBottom: 12,
                    borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
                  },
                },
              },
            }}
          >
            {item.isPreview || (item.ndaId && item.signedNDA) || item.downloaded || item.verifiedEmail ? (
              <Stack
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 8 }}
                styles={{
                  root: {
                    paddingBottom: 4,
                    [BREAKPOINTS_RESPONSIVE.lgUp]: { display: 'none' },
                  },
                }}
              >
                {item.isPreview && (
                  <TooltipHost
                    styles={{ root: { minWidth: 70, paddingBottom: 6 } }}
                    delay={TooltipDelay.zero}
                    tooltipProps={{ onRenderContent: renderPreviewTooltip }}
                  >
                    <Text style={{ color: LIGHT_THEME.palette.orangeLight }}>[Preview]*</Text>
                  </TooltipHost>
                )}
                {item.ndaId && item.signedNDA && (
                  <Stack.Item disableShrink style={{ paddingBottom: 4 }}>
                    <NDAButton onClick={() => _handleDownloadNDAFile(item.viewerId)} />
                  </Stack.Item>
                )}
                {item.downloaded && (
                  <Icon
                    iconName="downloaded-svg"
                    styles={(styleProps) => ({ root: { fontSize: 20, color: styleProps.theme.palette.greenLight } })}
                  />
                )}
                {item.verifiedEmail && (
                  <TooltipHost delay={TooltipDelay.zero} calloutProps={{ gapSpace: 7 }} content="Email Verified">
                    <Icon
                      iconName="VerifiedBrandSolid"
                      styles={(styleProps) => ({ root: { fontSize: 20, color: styleProps.theme.palette.greenLight } })}
                    />
                  </TooltipHost>
                )}
              </Stack>
            ) : null}
            <Text block className="hiddenLgUp">
              {millisecondsToStr(new Date() - new Date(item.viewedAt))}
            </Text>
            <Text
              styles={{
                root: {
                  [BREAKPOINTS_RESPONSIVE.xxl]: {
                    display: 'none',
                  },
                },
              }}
            >
              {item.locationName ? `${item.locationName.trim().replace(/^,/, '')} - ${device}` : `${device}`}
            </Text>
            <Stack.Item styles={{ root: { [BREAKPOINTS_RESPONSIVE.xlUp]: { display: 'none' } } }}>
              <Persona
                initialsColor={8}
                text={item.sender}
                size={PersonaSize.size24}
                coinProps={{
                  styles: { imageArea: { width: 20, height: 20 }, initials: { height: 20, lineHeight: 20 } },
                }}
              />
            </Stack.Item>
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 8 }}
              styles={{
                root: {
                  svg: { transform: 'scale(0.7)', margin: '0 -5px' },
                  height: 40,
                  [BREAKPOINTS_RESPONSIVE.xlUp]: { display: 'none' },
                },
              }}
            >
              <CircleProgress
                percent={item.viewedRate}
                lineColor={item.viewedRate === 100 ? LIGHT_THEME.palette.greenLight : LIGHT_THEME.palette.themePrimary}
              />
              <Text>{item.viewedRate}% viewed</Text>
              <Text>-</Text>
              {item.isViewing && <LiveBadge isShowTooltip />}
              <Stack.Item disableShrink>
                <Text>{format(item.duration)}</Text>
              </Stack.Item>
            </Stack>
          </Stack>
        )}
      </ThemeContext.Consumer>
    );
    return (
      <PageStatisticOfViewerOnFile
        item={item}
        fileId={fileId}
        getToken={getToken}
        onRenderVisitData={visitData}
        totalPages={pagination.totalPages}
        version={version}
      />
    );
  };

  const _receiveMessage = (payload) => {
    const { dataBody } = payload;
    if (fileId === dataBody.fileId && payload.action === WEB_SOCKET_ACTION.VISIT_LINK) {
      if (!groups.some((x) => x.viewerId === dataBody.viewerId)) {
        _getViewerOfFile(fileId, dataBody);
      } else if (groups.some((x) => x.viewerId === dataBody.viewerId && x.isViewing !== dataBody.isViewing)) {
        _setViewerActive(groups, dataBody);
      }
    }
  };

  const _handleSort = (_ev, column) => {
    const newGroups = sortGroupData({ sortedColumn: column, columns: columnsSchema, groups });
    setGroups(newGroups);
  };

  if (isLoading) {
    return (
      <Stack styles={{ root: { marginTop: 24 } }} className={wrapperClass}>
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
      </Stack>
    );
  }

  if (groups && groups?.length === 0) {
    const { isMobile } = context;
    return (
      <FileDetailEmptyContent
        imageUrl="/img/pages/emptyPageOverview.png"
        srcSet="/img/pages/emptyPageOverview2x.png 2x, /img/pages/emptyPageOverview3x.png 3x"
        offsetHeight="410px"
        content={
          <Stack horizontalAlign={isMobile ? 'center' : 'start'}>
            <Text block styles={emptyContentStyles}>
              Add a link to share your content
            </Text>
            <CustomButton
              primary
              styles={createLinkButtonStyles}
              splitButtonAriaLabel="Create link"
              text="Create link"
              title="Create link"
              onClick={() => props.onCreateLink(MODAL_NAME.CREATE_LINK)}
            />
          </Stack>
        }
      />
    );
  }
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Stack className="viewerFileWrapper">
          <CustomDetailsList
            isStickyHeader={false}
            columns={columnsSchema}
            items={groups}
            groups={groups}
            {...props}
            detailListProps={{
              listProps: {
                ignoreScrollingState: true,
              },
              groupProps: {
                onRenderHeader: (headerProps) =>
                  renderGroupHeader({ ...headerProps, theme, downloadNDAFile: _handleDownloadNDAFile }),
                onRenderFooter: (footerProps) => renderGroupFooter({ ...footerProps }),
                collapseAllVisibility: CollapseAllVisibility.hidden,
              },
              onRenderRow: () => null,
              useReducedRowRenderer: true,
              onColumnHeaderClick: _handleSort,
            }}
            isPagination
            pagingOptions={{
              ...pagination,
              onChangePageIndex: (page) => setPagination({ ...pagination, page }),
              onChangePageSize: (pageSize) => setPagination({ ...pagination, pageSize, page: 0 }),
            }}
          />

          <SockJsClient
            url={process.env.REACT_APP_SOCKET_URL}
            headers={{}}
            ref={webSocketRef}
            topics={[WEB_SOCKET_TOPIC.VIEW_LINK, WEB_SOCKET_TOPIC.REFRESH_ALL_VIEWER]}
            onMessage={_receiveMessage}
            onConnect={() => refreshAllViewer()}
            onDisconnect={() => console.log('WS chat disconnect')}
            autoReconnect
          />
        </Stack>
      )}
    </ThemeContext.Consumer>
  );
}
ViewerOfFileList.propTypes = {
  fileId: PropTypes.number,
  onCreateLink: PropTypes.func.isRequired,
  version: PropTypes.number,
};
ViewerOfFileList.defaultProps = {
  fileId: undefined,
  version: 0,
};
export default ViewerOfFileList;

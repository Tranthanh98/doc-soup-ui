/* eslint-disable max-lines */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomDetailsList, CircleProgress } from 'features/shared/components';
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
  Persona,
  PersonaSize,
} from '@fluentui/react';
import { createGroupTable, millisecondsToStr, sortGroupData } from 'features/shared/lib/utils';
import format from 'format-duration';
import { LIGHT_THEME, BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import LinkBiz from 'core/biz/LinkBiz';
import FileBiz from 'core/biz/FileBiz';
import fileHelper from 'features/shared/lib/fileHelper';
import { NDAButton } from 'core/components';
import columnsSchema from 'features/content/fileDetail/configs/columnConfigViewerOfLinkList';
import LiveBadge from 'features/content/fileDetail/components/LiveBadge';
import PageStatisticOfLinkOnFile from './PageStatisticOfLinkOnFile';

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
  return { root, rootHovered: { ...rootHoveredOrPressedCollapsed }, rootPressed: { ...rootHoveredOrPressedCollapsed } };
};

const renderGroupHeader = (props) => {
  if (props) {
    const { group, onToggleCollapse, theme, columns, downloadNDAFile } = props;
    const _toggleCollapse = () => {
      onToggleCollapse(group);
    };

    group.isViewing = LinkBiz.checkIsViewingLink(group.viewedAt);

    return (
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }} styles={{ root: { padding: '10px 20px' } }}>
        <Stack
          horizontal
          verticalAlign="center"
          styles={{ root: { width: columns[0]?.calculatedWidth, ...columns[0]?.styles?.root } }}
          tokens={{ childrenGap: 8 }}
        >
          <Persona hidePersonaDetails size={PersonaSize.size40} initialsColor={15} text={group.name} />
          <Text nowrap>{group.name}</Text>

          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} className="hiddenMdDown">
            <Stack.Item disableShrink>
              {group.isPreview ? <Text style={{ color: LIGHT_THEME.palette.orangeLight }}>[Preview]*</Text> : null}
            </Stack.Item>
            {group.ndaId && group.signedNDA ? (
              <Stack.Item disableShrink>
                <NDAButton theme={theme} onClick={() => downloadNDAFile(group.ndaId)} />
              </Stack.Item>
            ) : null}
            {group.downloaded && (
              <Icon
                iconName="downloaded-svg"
                styles={(styleProps) => ({
                  root: { fontSize: 20, color: styleProps.theme.palette.greenLight, marginTop: 5 },
                })}
              />
            )}
            {group.verifiedEmail ? (
              <TooltipHost delay={TooltipDelay.zero} calloutProps={{ gapSpace: 7 }} content="Email Verified">
                <Icon
                  iconName="VerifiedBrandSolid"
                  styles={(styleProps) => ({
                    root: { fontSize: 20, color: styleProps.theme.palette.greenLight, marginTop: 3 },
                  })}
                />
              </TooltipHost>
            ) : null}
          </Stack>
        </Stack>
        {columns[1] && (
          <Stack.Item
            disableShrink
            styles={{
              root: {
                width: columns[1].calculatedWidth,
                ...columns[1]?.styles?.root,
              },
            }}
          >
            <Text>{group.deviceAndLocation}</Text>
          </Stack.Item>
        )}
        <Stack.Item
          disableShrink
          styles={{
            root: {
              width: columns[2]?.currentWidth + 10,
              ...columns[2]?.styles?.root,
              [BREAKPOINTS_RESPONSIVE.mdDown]: {
                display: 'none',
              },
            },
          }}
        >
          <Text nowrap>{millisecondsToStr(group.date)}</Text>
        </Stack.Item>
        <Stack
          disableShrink
          horizontal
          horizontalAlign="end"
          verticalAlign="center"
          tokens={{ childrenGap: 8 }}
          styles={{
            root: {
              width: columns[3]?.calculatedWidth + 8,
              display: 'none',
              ...columns[3]?.styles?.rootGroup,
            },
          }}
        >
          {group.isViewing && <LiveBadge isShowTooltip />}
          <Stack.Item disableShrink>
            <Text>{format(group.duration)}</Text>
          </Stack.Item>
        </Stack>
        <Stack.Item
          styles={{
            root: {
              maxWidth: columns[4]?.calculatedWidth,
              paddingLeft: 50,
              display: 'none',
              ...columns[4]?.styles?.root,
            },
          }}
        >
          <TooltipHost
            delay={TooltipDelay.zero}
            calloutProps={{ gapSpace: 7 }}
            content={`Viewed: ${group.viewedRate}%`}
            styles={{ root: { width: 28 } }}
          >
            <CircleProgress
              percent={group.viewedRate}
              lineColor={group.viewedRate === 100 ? LIGHT_THEME.palette.greenLight : LIGHT_THEME.palette.themePrimary}
            />
          </TooltipHost>
        </Stack.Item>
        <Stack.Item
          grow
          styles={{
            root: {
              width: columns[5]?.calculatedWidth,
              minWidth: 50,
              ...columns[5]?.styles?.root,
              textAlign: 'right',
            },
          }}
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
        </Stack.Item>
      </Stack>
    );
  }
  return null;
};

function StatisticLinkDetail({ item, version, ...props }) {
  const [groups, setGroups] = useState([]);
  const context = useContext(GlobalContext);
  const { isMobile, isTablet, getToken } = context;

  const { linkId } = item;

  useEffect(() => {
    if (linkId) {
      new RestService()
        .setPath(`/link/${linkId}/viewer`)
        .setToken(getToken())
        .get()
        .then((response) => {
          const displayItems = FileBiz.standardizeViewersOfFile(response.data);
          const groupData = createGroupTable(displayItems);
          setGroups(groupData);
        });
    }
  }, [linkId]);

  const _handleDownloadNDAFile = (id) => {
    const { getToken } = context;
    new RestService()
      .setPath(`file/${id}/download`)
      .setToken(getToken())
      .setResponseType('arraybuffer')
      .get()
      .then((response) => {
        fileHelper.download(response.data, response.headers['content-type'], `download-nda.pdf`);
      })
      .catch((err) => {
        RestServiceHelper.handleError(err);
      });
  };

  const renderGroupFooter = (footerProps) => {
    const { group } = footerProps;
    return (
      <PageStatisticOfLinkOnFile
        totalPages={group.totalPages}
        linkItem={item}
        viewerId={group.viewerId}
        item={group}
        version={version}
        getToken={getToken}
        downloadNDAFile={_handleDownloadNDAFile}
      />
    );
  };

  const _getColumns = React.useMemo(() => {
    const columns = [...columnsSchema];
    if (isTablet) {
      columns.splice(3, 2);
    }
    if (isMobile) {
      columns.splice(1);
    }
    return columns;
  }, [isMobile, isTablet]);

  const _handleSort = (_ev, column) => {
    const newGroups = sortGroupData({ sortedColumn: column, columns: columnsSchema, groups });
    setGroups(newGroups);
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Stack
          styles={{
            root: {
              selectors: {
                [BREAKPOINTS_RESPONSIVE.lgUp]: {
                  border: `20px solid ${theme.palette.neutralLight}`,
                },
                [BREAKPOINTS_RESPONSIVE.mdDown]: {
                  border: `10px solid ${theme.palette.neutralLight}`,
                  marginTop: 15,
                },
              },
            },
          }}
        >
          <CustomDetailsList
            isStickyHeader={false}
            columns={_getColumns}
            items={groups}
            groups={groups}
            {...props}
            detailListProps={{
              groupProps: {
                onRenderHeader: (headerProps) =>
                  renderGroupHeader({ ...headerProps, theme, downloadNDAFile: _handleDownloadNDAFile }),
                onRenderFooter: (footerProps) => renderGroupFooter({ ...footerProps }),
                collapseAllVisibility: CollapseAllVisibility.hidden,
              },
              onRenderRow: () => null,
              onColumnHeaderClick: _handleSort,
            }}
          />
        </Stack>
      )}
    </ThemeContext.Consumer>
  );
}

StatisticLinkDetail.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  version: PropTypes.number.isRequired,
};

export default StatisticLinkDetail;

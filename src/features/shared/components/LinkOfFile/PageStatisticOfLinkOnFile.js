/* eslint-disable max-lines */
import {
  Separator,
  Stack,
  Text,
  ThemeContext,
  TooltipHost,
  TooltipDelay,
  Icon,
  Persona,
  Link,
  PersonaSize,
} from '@fluentui/react';
import PropTypes from 'prop-types';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { TIME_OUT, PAGE_PATHS } from 'core/constants/Const';
import format from 'format-duration';
import RestService from 'features/shared/services/restService';
import { CircleProgress, Chart } from 'features/shared/components';
import { NDAButton } from 'core/components';
import React, { Component } from 'react';
import { millisecondsToStr } from 'features/shared/lib/utils';
import GlobalContext from 'security/GlobalContext';
import LiveBadge from 'features/content/fileDetail/components/LiveBadge';
import PageImageHover from '../../../content/fileDetail/components/PageImageHover';

const iconStyles = (styleProps) => ({
  root: { fontSize: 20, color: styleProps.theme.palette.greenLight, paddingRight: 6 },
});

class PageStatisticOfLinkOnFile extends Component {
  state = {
    chartData: [],
    refreshDataIntervalId: undefined,
  };

  componentDidMount() {
    const { item } = this.props;
    this._fetchViewerStatistic();

    if (item?.isViewing) {
      const refreshDataIntervalId = setInterval(this._fetchViewerStatistic, TIME_OUT.INTERVAL_REFRESH_LINK_STATISTIC);
      this.setState({ refreshDataIntervalId });
    }
  }

  componentWillUnmount() {
    const { refreshDataIntervalId } = this.state;
    clearInterval(refreshDataIntervalId);
  }

  _fetchViewerStatistic = () => {
    const { linkItem, item } = this.props;
    const { getToken } = this.context;
    const { viewerId } = item;
    const { linkId } = linkItem;
    new RestService()
      .setPath(`/link/${linkId}/viewer/${viewerId}/statistic`)
      .setToken(getToken())
      .get()
      .then((response) => {
        this.setState({ chartData: response.data });
      });
  };

  _renderCustomLabel = (value) => {
    return format(value.value);
  };

  _handleGetThumbnail = (item) => {
    const { linkItem, viewerId, version } = this.props;
    const { getToken } = this.context;
    const { linkId } = linkItem;
    new RestService()
      .setPath(`/link/${linkId}/viewer/${viewerId}/statistic/${item.indexValue}/thumb?version=${version}`)
      .setToken(getToken())
      .setResponseType('arraybuffer')
      .get()
      .then((response) => {
        const URL = window.URL || window.webkitURL;
        const imageUrl = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg', encoding: 'UTF-8' }));
        if (this._refImg.current) {
          this._refImg.current.removeAttribute('width');
          this._refImg.current.removeAttribute('height');

          this._refImg.current.src = imageUrl;
        }
      });
  };

  _getChartProps = () => ({
    tooltip: (item) => {
      const { chartData } = this.state;
      const { linkItem, viewerId, version } = this.props;
      const { linkId } = linkItem;
      const totalPages = chartData?.length;
      return (
        <PageImageHover
          urlGetImage={`/link/${linkId}/viewer/${viewerId}/statistic/${item.indexValue}/thumb?version=${version}`}
          dataFooter={{
            leftTitle: 'Page',
            leftValue: `${item.data.page}/${totalPages}`,
            rightTitle: 'Duration',
            rightValue: format(item.data.duration),
          }}
        />
      );
    },
  });

  _renderLinkInfo(theme) {
    const { item, downloadNDAFile, linkItem } = this.props;
    const { linkAccountsId, linkName } = linkItem;

    let { device } = item;
    const deviceInfomations = item.device ? item.device.split(' - ') : '';
    if (deviceInfomations.length > 1) {
      device = `${deviceInfomations[deviceInfomations.length - 1]} - ${
        deviceInfomations[deviceInfomations.length - 2]
      }`;
    }

    return (
      <Stack tokens={{ padding: `${theme.spacing.m} 0` }}>
        <Stack styles={{ root: { [BREAKPOINTS_RESPONSIVE.lgUp]: { display: 'none' } } }}>
          <Stack
            horizontal
            verticalAlign="center"
            styles={{ root: { i: { width: 22, height: 22 } } }}
            tokens={{ childrenGap: 8 }}
          >
            {item.isPreview && <Text style={{ color: LIGHT_THEME.palette.orangeLight }}>[Preview]*</Text>}
            {item.ndaId && item.signedNDA && <NDAButton theme={theme} onClick={() => downloadNDAFile(item.ndaId)} />}
            {item.downloaded && (
              <TooltipHost delay={TooltipDelay.zero} calloutProps={{ gapSpace: 7 }} content="Downloaded">
                <Icon iconName="downloaded-svg" styles={iconStyles} />
              </TooltipHost>
            )}
            {item.verifiedEmail && (
              <TooltipHost delay={TooltipDelay.zero} calloutProps={{ gapSpace: 7 }} content="Email Verified">
                <Icon iconName="VerifiedBrandSolid" styles={iconStyles} />
              </TooltipHost>
            )}
          </Stack>
          {(item.isPreview || (item.ndaId && item.signedNDA) || item.verifiedEmail || item.downloaded) && <Separator />}
        </Stack>
        <Stack styles={{ root: { [BREAKPOINTS_RESPONSIVE.lgUp]: { display: 'none' } } }}>
          <Text>{millisecondsToStr(new Date() - new Date(item.viewedAt))}</Text>
          <Separator />
        </Stack>
        <Stack
          styles={{
            root: {
              [BREAKPOINTS_RESPONSIVE.xxl]: {
                display: 'none',
              },
            },
          }}
        >
          <Text>{item.locationName ? `${item.locationName.trim().replace(/^,/, '')} - ${device}` : `${device}`}</Text>
          <Separator />
        </Stack>
        {linkName && linkAccountsId && (
          <Stack styles={{ root: { [BREAKPOINTS_RESPONSIVE.xlUp]: { display: 'none' } } }}>
            <Stack horizontal verticalAlign="center">
              <Persona
                initialsColor={8}
                hidePersonaDetails
                text={linkName}
                size={PersonaSize.size24}
                coinProps={{
                  styles: { imageArea: { width: 20, height: 20 }, initials: { height: 20, lineHeight: 20 } },
                }}
                styles={{ root: { paddingRight: 8 } }}
              />
              <Link
                href={`/${PAGE_PATHS.account}/${linkAccountsId}`}
                target="_blank"
                styles={{ root: { overflow: 'hidden', color: 'inherit' } }}
              >
                <Text nowrap>{linkName}</Text>
              </Link>
            </Stack>
            <Separator />
          </Stack>
        )}
        <Stack styles={{ root: { [BREAKPOINTS_RESPONSIVE.xlUp]: { display: 'none' } } }}>
          <Stack
            horizontal
            verticalAlign="center"
            styles={{ root: { svg: { transform: 'scale(0.7)', margin: '0 -5px' }, height: 22 } }}
          >
            <CircleProgress
              percent={item.viewedRate}
              lineColor={item.viewedRate === 100 ? LIGHT_THEME.palette.greenLight : LIGHT_THEME.palette.themePrimary}
            />
            <Text styles={{ root: { paddingLeft: 8 } }}>{`${item.viewedRate}% viewed -`}</Text>
            {item.isViewing && (
              <Stack style={{ paddingLeft: 5 }}>
                <LiveBadge isShowTooltip />
              </Stack>
            )}
            <Text style={{ paddingLeft: 3 }}>{format(item.duration)}</Text>
          </Stack>
          <Separator />
        </Stack>
        <Text>Total Time Spent Per Page</Text>
      </Stack>
    );
  }

  render() {
    const { chartData } = this.state;
    const { item } = this.props;
    const isCollapsed = item?.isCollapsed;
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <Stack
            styles={{
              root: {
                background: theme.palette.grayLight,
                padding: '12px 70px 28px 70px',
                paddingTop: isCollapsed && '0 !important',
                paddingBottom: isCollapsed && '0 !important',
                transition: 'max-height 200ms',
                visibility: isCollapsed && 'hidden',
                maxHeight: isCollapsed ? 0 : 700,
                [BREAKPOINTS_RESPONSIVE.mdDown]: { padding: '12px 10px 28px' },
              },
            }}
          >
            {this._renderLinkInfo(theme)}
            <Chart.TotalTimeSpentPerPage data={chartData} chartProps={this._getChartProps()} />
          </Stack>
        )}
      </ThemeContext.Consumer>
    );
  }
}

PageStatisticOfLinkOnFile.propTypes = {
  linkItem: PropTypes.oneOfType([PropTypes.object]).isRequired,
  viewerId: PropTypes.number.isRequired,
  downloadNDAFile: PropTypes.func.isRequired,
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  version: PropTypes.number.isRequired,
};

PageStatisticOfLinkOnFile.contextType = GlobalContext;

export default PageStatisticOfLinkOnFile;

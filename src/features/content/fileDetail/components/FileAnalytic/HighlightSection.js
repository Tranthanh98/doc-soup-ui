import { Stack, Text, TooltipDelay, TooltipHost } from '@fluentui/react';
import PropTypes from 'prop-types';
import { BREAKPOINTS_RESPONSIVE, DARK_THEME, LIGHT_THEME } from 'core/constants/Theme';
import RestService from 'features/shared/services/restService';
import format from 'format-duration';
import React, { PureComponent } from 'react';
import GlobalContext from 'security/GlobalContext';
import LoadingIcon from 'assets/loading_gif.gif';
import AnalyticCircleProgress from 'features/shared/components/AnalyticCircleProgress';

const headerTitle = {
  root: {
    fontSize: '16px',
    fontWeight: '550',
  },
};

const visitTitle = {
  root: {
    fontSize: '20px',
    fontWeight: '550',
    textAlign: 'center',
  },
};

const centerBlock = {
  root: {
    paddingTop: 24,
    minHeight: 104,
  },
};

const smallTitle = {
  root: {
    fontSize: 12,
    color: DARK_THEME.palette.gray,
  },
};

const summaryStatisticsWrapperStyles = {
  root: {
    selectors: {
      [BREAKPOINTS_RESPONSIVE.lgDown]: {
        flexDirection: 'column',
        '> :not(:first-child)': {
          marginTop: 24,
          marginLeft: 0,
        },
      },
    },
  },
};
const topPageItemStyles = {
  root: {
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        flexDirection: 'column',
      },
    },
  },
};
const topPageImageWrapperStyles = {
  root: { border: `solid 1px ${LIGHT_THEME.palette.neutralQuaternary}`, marginRight: 16 },
};
const topPageIndexStyles = {
  root: {
    width: 20,
    height: 20,
    padding: 2,
    borderRadius: 4,
    backgroundColor: LIGHT_THEME.palette.neutralLight,
    color: LIGHT_THEME.palette.neutralSecondaryAlt,
    fontSize: 10,
    fontWeight: 500,
    textAlign: 'center',
  },
};

class HighlightSection extends PureComponent {
  constructor(props) {
    super(props);
    this._refImgs = {};
    this._createImageRef(props.summaryStatistics.map((x) => ({ page: x.topPage, version: x.version })));
  }

  componentDidMount() {
    const { fileId, summaryStatistics } = this.props;
    if (fileId !== undefined) {
      const topPages = summaryStatistics.map((x) => ({ page: x.topPage, version: x.version }));
      this._getThumbnailTopPage(fileId, topPages);
    }
  }

  _createImageRef = (topPages) => {
    if (topPages && topPages.length > 0) {
      topPages.forEach((topPage) => {
        this._refImgs[`${topPage.page}version${topPage.version}`] = React.createRef();
      });
    }
  };

  _getThumbnailTopPage = (fileId, topPageNumbers) => {
    const { getToken } = this.context;
    const { version } = this.props;

    if (topPageNumbers && topPageNumbers.length > 0) {
      topPageNumbers.forEach((topPageNumber) => {
        if (
          topPageNumber.version !== version &&
          this._refImgs[`${topPageNumber.page}version${topPageNumber.version}`].current
        ) {
          this._refImgs[`${topPageNumber.page}version${topPageNumber.version}`].current.src = '/img/document.png';
          this._refImgs[`${topPageNumber.page}version${topPageNumber.version}`].current.height = 105;
        } else {
          new RestService()
            .setPath(`/file/${fileId}/thumb/${topPageNumber.page}?version=${version}`)
            .setToken(getToken())
            .setResponseType('arraybuffer')
            .get()
            .then((response) => {
              if (response.data) {
                const URL = window.URL || window.webkitURL;
                const imageUrl = URL.createObjectURL(
                  new Blob([response.data], { type: 'image/jpeg', encoding: 'UTF-8' })
                );
                if (this._refImgs[`${topPageNumber.page}version${topPageNumber.version}`].current) {
                  this._refImgs[`${topPageNumber.page}version${topPageNumber.version}`].current.src = imageUrl;
                  this._refImgs[`${topPageNumber.page}version${topPageNumber.version}`].current.height = 105;
                }
              }
            });
        }
      });
    }
  };

  _getVisitStatistic = (summaryStatistics) => {
    if (summaryStatistics[0]?.visits) {
      return summaryStatistics[0].visits.toLocaleString();
    }
    return 0;
  };

  render() {
    const { summaryStatistics, version } = this.props;
    const percentHightlight = parseInt(summaryStatistics[0].avgViewed || 0, 10);
    return (
      <Stack>
        <Stack styles={{ root: { marginBottom: 34 } }}>
          <Text styles={headerTitle}>
            Latest Version Highlights <Text styles={smallTitle}>(Version {version})</Text>
          </Text>
        </Stack>

        {summaryStatistics && summaryStatistics.length > 0 ? (
          <Stack
            horizontal
            horizontalAlign="stretch"
            tokens={{ childrenGap: 24 }}
            styles={summaryStatisticsWrapperStyles}
          >
            <Stack horizontal>
              <Stack.Item>
                <Stack>
                  <Text>Core Metrics</Text>
                </Stack>

                <Stack styles={centerBlock}>
                  <AnalyticCircleProgress
                    percent={percentHightlight}
                    valueDisplay={percentHightlight}
                    lineColor={
                      percentHightlight === 100 ? LIGHT_THEME.palette.greenLight : LIGHT_THEME.palette.themePrimary
                    }
                  />
                </Stack>

                <Stack styles={{ root: { paddingTop: 8 } }}>
                  <Text style={{ textAlign: 'center' }} styles={smallTitle}>
                    AvgViewed
                  </Text>
                </Stack>
              </Stack.Item>
              <Stack styles={{ root: { paddingLeft: 60, paddingRight: 82 } }}>
                <Stack style={{ height: 20 }} />
                <Stack verticalAlign="center" styles={centerBlock}>
                  <Text styles={visitTitle}>{this._getVisitStatistic(summaryStatistics)}</Text>
                </Stack>
                <Stack styles={{ root: { paddingTop: 8 } }}>
                  <Text styles={smallTitle} style={{ textAlign: 'center' }}>
                    Visits
                  </Text>
                </Stack>
              </Stack>
            </Stack>

            <Stack>
              <Text>
                Top Pages <Text styles={smallTitle}>(by average time per page)</Text>
              </Text>
              <Stack horizontal styles={centerBlock} tokens={{ childrenGap: 24 }}>
                {summaryStatistics.map((summaryStatistic, index) => (
                  <Stack horizontal key={summaryStatistic.topPage} styles={topPageItemStyles}>
                    <Stack styles={topPageImageWrapperStyles}>
                      {summaryStatistic.version !== version ? (
                        <TooltipHost delay={TooltipDelay.zero} content="This page is the old version">
                          <img
                            ref={this._refImgs[`${summaryStatistic.topPage}version${summaryStatistic.version}`]}
                            alt="page"
                            src={LoadingIcon}
                            height={60}
                          />
                        </TooltipHost>
                      ) : (
                        <img
                          ref={this._refImgs[`${summaryStatistic.topPage}version${summaryStatistic.version}`]}
                          alt="page"
                          src={LoadingIcon}
                          height={60}
                        />
                      )}
                    </Stack>
                    <Stack verticalAlign="space-between" styles={{ root: { marginRight: 16 } }}>
                      <Text block className="hiddenMdDown" styles={topPageIndexStyles}>
                        {index + 1}
                      </Text>
                      <Text className="hiddenMdDown" styles={visitTitle}>
                        {format(summaryStatistic.topPageDuration)}
                      </Text>
                      <Text styles={smallTitle} style={{ marginTop: 8 }}>
                        Page: {summaryStatistic.topPage}
                      </Text>
                      <Text className="hiddenMdDown" styles={smallTitle}>
                        Visits: {summaryStatistic.topPageVisits}
                      </Text>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    );
  }
}

HighlightSection.contextType = GlobalContext;

HighlightSection.propTypes = {
  fileId: PropTypes.number.isRequired,
  version: PropTypes.number.isRequired,
  summaryStatistics: PropTypes.oneOfType([PropTypes.array]).isRequired,
};

export default HighlightSection;

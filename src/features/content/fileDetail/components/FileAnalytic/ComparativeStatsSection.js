/* eslint max-lines: ["warn", {"max": 400, "skipBlankLines": true, "skipComments": true}] */
import { DefaultButton, Stack, Text, TooltipDelay, TooltipHost } from '@fluentui/react';
import PropTypes from 'prop-types';
import { BAR_CHART_COLOR, DARK_THEME, LIGHT_THEME } from 'core/constants/Theme';
import RestService from 'features/shared/services/restService';
import React, { PureComponent } from 'react';
import GlobalContext from 'security/GlobalContext';
import { ResponsiveLine } from '@nivo/line';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import format from 'format-duration';
import PageImageHover from '../PageImageHover';

const headerTitle = {
  root: {
    fontSize: '16px',
    fontWeight: '550',
  },
};

const smallTitle = {
  root: {
    fontSize: 12,
    color: DARK_THEME.palette.gray,
  },
};

const chartWrapper = {
  root: {
    height: 280,
  },
};

const rectangleVersion = (backgroundColor) => ({
  root: {
    width: 20,
    height: 5,
    background: backgroundColor,
    marginRight: 10,
    marginTop: 2,
  },
});

class ComparativeStatsSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      percentVisitData: [],
      avgDurationData: [],
      dataVersions: new Map(),
    };
  }

  componentDidMount() {
    const { version } = this.props;
    for (let i = 1; i <= version; i++) {
      this._getPageReport(i);
    }
  }

  _getPageReport = (version) => {
    const { fileId, version: currentFileVersion } = this.props;
    const { getToken } = this.context;

    if (fileId !== undefined) {
      new RestService()
        .setPath(`/file/${fileId}/page-report?version=${version}`)
        .setToken(getToken())
        .get()
        .then((response) => {
          if (response.data && response.data.length) {
            const avgDurationDataTemp = this.buildAvgDurationData(version, response.data);
            const percentVisitDataTemp = this.buildPercentVisitData(version, response.data);

            const dataStats = {
              percentVisitData: percentVisitDataTemp,
              avgDurationData: avgDurationDataTemp,
            };

            this.setState((state) => {
              const dataVersions = new Map(state.dataVersions);
              dataVersions.set(version, dataStats);

              return { dataVersions };
            });
          }
        })
        .catch((err) => {
          restServiceHelper.handleError(err);
        })
        .finally(() => {
          if (currentFileVersion === version) {
            this._handleClickVersion(version);
          }
        });
    }
  };

  buildAvgDurationData = (version, data = []) => {
    const { version: fileVersion } = this.props;
    const avgDurationData = data
      .map((value) => ({ x: value.page, y: value.avgDuration, visits: value.percentVisit, version }))
      .sort((a, b) => a.x - b.x);

    return {
      id: version,
      color: fileVersion < 10 ? BAR_CHART_COLOR[version - 1] : Object.values(LIGHT_THEME.palette)[version - 1],
      data: avgDurationData,
    };
  };

  buildPercentVisitData = (version, data = []) => {
    const { version: fileVersion } = this.props;

    const percentVisitData = data
      .map((value) => ({ x: value.page, y: value.percentVisit, version }))
      .sort((a, b) => a.x - b.x);

    return {
      id: version,
      color: fileVersion < 10 ? BAR_CHART_COLOR[version - 1] : Object.values(LIGHT_THEME.palette)[version - 1],
      data: percentVisitData,
    };
  };

  _calGridValue = (chartData = []) => {
    const data = chartData.map((i) => i.data).flat();
    if (!data.length) {
      return [0];
    }

    const maxValue = Math.max(...data.map((value) => value.y));
    const temp = Math.floor(maxValue / 5);

    const gridValues = [0];

    for (let i = 1; i < 5; i++) {
      gridValues.push(gridValues[i - 1] + temp);
    }

    gridValues.push(maxValue);
    return [...gridValues];
  };

  _handleClickVersion = (version) => {
    const { avgDurationData, percentVisitData, dataVersions } = this.state;

    const index = avgDurationData.findIndex((i) => i.id === version);
    if (index !== -1) {
      const cloneAvgDurationData = [...avgDurationData];
      const clonePercentVisitData = [...percentVisitData];

      cloneAvgDurationData.splice(index, 1);
      clonePercentVisitData.splice(index, 1);

      this.setState({ avgDurationData: cloneAvgDurationData, percentVisitData: clonePercentVisitData });
    } else if (dataVersions.get(version)) {
      const avgDurationDataTemp = dataVersions.get(version).avgDurationData;
      const percentVisitDataTemp = dataVersions.get(version).percentVisitData;

      const cloneAvgData = [...avgDurationData];
      const clonePercentData = [...percentVisitData];

      cloneAvgData.push(avgDurationDataTemp);
      clonePercentData.push(percentVisitDataTemp);

      this.setState({
        percentVisitData: clonePercentData,
        avgDurationData: cloneAvgData,
      });
    }
  };

  render() {
    const { percentVisitData, avgDurationData, dataVersions } = this.state;
    const { fileId, version } = this.props;

    return (
      <Stack styles={{ root: { paddingTop: 44 } }}>
        <Stack
          wrap
          horizontal
          horizontalAlign="space-between"
          tokens={{ childrenGap: 16 }}
          styles={{ root: { marginBottom: 16 } }}
        >
          <Text styles={headerTitle}>Comparative Stats</Text>

          <Stack horizontal horizontalAlign="flex-end" styles={{ root: { maxWidth: 650, display: 'block' } }}>
            {[...Array(version).keys()].map((i) => {
              const isSelected = avgDurationData.some((m) => m.id === i + 1);
              const isDisabled = !dataVersions.get(i + 1);
              return (
                <TooltipHost
                  delay={TooltipDelay.zero}
                  content={isDisabled ? 'This version has no data' : `Version ${i + 1}`}
                >
                  <DefaultButton
                    key={i}
                    text={`Version ${i + 1}`}
                    disabled={isDisabled}
                    styles={{
                      root: {
                        height: 30,
                        width: 105,
                        color: isSelected && LIGHT_THEME.palette.themePrimary,
                        borderColor: isSelected ? 'inherit' : LIGHT_THEME.palette.neutralLight,
                        backgroundColor: isSelected ? 'inherit' : LIGHT_THEME.palette.neutralLight,
                      },
                    }}
                    onClick={() => this._handleClickVersion(i + 1)}
                  />
                </TooltipHost>
              );
            })}
          </Stack>
        </Stack>

        <Stack>
          <Stack wrap horizontal horizontalAlign="space-between" tokens={{ childrenGap: 16 }}>
            <Stack>
              <Text>
                Time Per Page <Text styles={smallTitle}>(by average time per page)</Text>
              </Text>
            </Stack>

            <Stack horizontal horizontalAlign="flex-end" styles={{ root: { maxWidth: 650 } }}>
              {avgDurationData.map((data) => {
                return (
                  <Stack
                    style={{ marginRight: 8 }}
                    key={data.id}
                    horizontal
                    horizontalAlign="stretch"
                    verticalAlign="center"
                  >
                    <Stack styles={rectangleVersion(data.color)} />
                    <Text styles={{ root: { fontSize: 12 } }}>Version {data.id}</Text>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>

          <Stack styles={chartWrapper}>
            <ResponsiveLine
              data={avgDurationData}
              yFormat=" >-.2f"
              xScale={{ type: 'point' }}
              margin={{ top: 25, right: 5, bottom: 25, left: 50 }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 15,
                tickRotation: 0,
                tickValues: avgDurationData.length ? this._calGridValue(avgDurationData) : [],
              }}
              useMesh
              tooltip={({ point }) => {
                if (point.data.version !== version) {
                  return null;
                }
                return (
                  <PageImageHover
                    urlGetImage={`/file/${fileId}/thumb/${point.data.x}?version=${version}`}
                    dataFooter={{
                      leftTitle: `Page - ${point.data.x}`,
                      leftValue: format(point.data.y * 1000),
                      rightTitle: 'Visits',
                      rightValue: point.data.visits,
                    }}
                  />
                );
              }}
              theme={{
                fontSize: 12,
                textColor: DARK_THEME.palette.gray,
                axis: {
                  domain: {
                    line: {
                      stroke: LIGHT_THEME.palette.gray,
                      strokeWidth: 1,
                    },
                  },
                },
              }}
              gridYValues={avgDurationData.length ? this._calGridValue(avgDurationData) : []}
              enableGridX={false}
              pointSize={8}
              pointBorderWidth={1}
              pointBorderColor={{ from: 'serieColor' }}
              pointColor={DARK_THEME.palette.neutralPrimary}
              colors={avgDurationData.map((x) => x.color)}
            />
          </Stack>
        </Stack>

        <Stack styles={{ root: { paddingTop: 40 } }}>
          <Stack wrap horizontal horizontalAlign="space-between" tokens={{ childrenGap: 16 }}>
            <Stack>
              <Text>
                Dropoff Report <Text styles={smallTitle}>(percent of visits reaching page)</Text>
              </Text>
            </Stack>

            <Stack horizontal horizontalAlign="flex-end" styles={{ root: { maxWidth: 650 } }}>
              {percentVisitData.map((data) => {
                return (
                  <Stack
                    style={{ marginRight: 8 }}
                    key={data.id}
                    horizontal
                    horizontalAlign="stretch"
                    verticalAlign="center"
                  >
                    <Stack styles={rectangleVersion(data.color)} />
                    <Text styles={{ root: { fontSize: 12 } }}>Version {data.id}</Text>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>

          <Stack styles={chartWrapper}>
            <ResponsiveLine
              data={percentVisitData}
              margin={{ top: 25, right: 5, bottom: 25, left: 40 }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 15,
                tickRotation: 0,
                tickValues: percentVisitData.length ? this._calGridValue(percentVisitData) : [],
              }}
              useMesh
              theme={{
                fontSize: 12,
                textColor: DARK_THEME.palette.gray,
                axis: {
                  domain: {
                    line: {
                      stroke: LIGHT_THEME.palette.gray,
                      strokeWidth: 1,
                    },
                  },
                },
              }}
              gridYValues={percentVisitData.length ? this._calGridValue(percentVisitData) : []}
              enableGridX={false}
              pointSize={8}
              pointBorderWidth={1}
              pointBorderColor={{ from: 'serieColor' }}
              pointColor={DARK_THEME.palette.neutralPrimary}
              colors={percentVisitData.map((x) => x.color)}
            />
          </Stack>
        </Stack>
      </Stack>
    );
  }
}

ComparativeStatsSection.propTypes = {
  fileId: PropTypes.number.isRequired,
  version: PropTypes.number,
};

ComparativeStatsSection.defaultProps = {
  version: 1,
};

ComparativeStatsSection.contextType = GlobalContext;

export default ComparativeStatsSection;

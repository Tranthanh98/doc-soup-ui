import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BAR_CHART_COLOR, DARK_THEME, LIGHT_THEME } from 'core/constants/Theme';
import { mergeStyles, Shimmer, ShimmerElementType, Stack, Text } from '@fluentui/react';
import { ResponsiveLine } from '@nivo/line';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import axios from 'axios';
import restServiceHelper from 'features/shared/lib/restServiceHelper';

const wrapContent = {
  root: {
    marginTop: 28,
    marginBottom: 28,
  },
};
const textEmptyStyle = {
  root: {
    padding: '23px 18px',
    backgroundColor: LIGHT_THEME.palette.neutralLight,
    fontSize: 14,
    letterSpacing: -0.5,
    color: LIGHT_THEME.palette.neutralPrimary,
  },
};

const chartWrap = {
  root: {
    height: 280,
    paddingBottom: 20,
    width: 'calc(100% - 40px)',
  },
};

const textHover = {
  root: { color: LIGHT_THEME.palette.neutralTertiary },
};

const pointHover = {
  root: { width: 75, height: 37, backgroundColor: 'rgba(30, 30, 30, 0.8)', borderRadius: 2 },
};

const getShimmerElements = () => {
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
};

const wrapperClass = mergeStyles({
  padding: 2,
  selectors: {
    '& > .ms-Shimmer-container': {
      margin: '5px 0',
    },
  },
});

export default function ContentChart(props) {
  const [visitsStatistic, setVisitsStatistic] = useState([]);
  const [isLoadingStatistic, setIsLoadingStatistic] = useState(false);
  const { userId, days, handleBlockEmptyContent } = props;
  const context = useContext(GlobalContext);
  const cancelTokenSource = axios.CancelToken.source();

  const _buildVisitsStatisticData = (data = []) => {
    const visitStatisticData = data
      .map((value) => ({
        i: data.indexOf(value),
        x: new Date(value.viewedAt).toLocaleString('en-us', { month: 'short', day: 'numeric' }),
        y: value.visits,
      }))
      .sort((a, b) => b.i - a.i);

    return {
      id: 'visitsStatistic',
      color: BAR_CHART_COLOR[0],
      data: visitStatisticData,
    };
  };

  const _getStatisticVisit = () => {
    const { getToken } = context;
    setIsLoadingStatistic(true);
    new RestService()
      .setPath(`/teams/visit/statistic/${userId}?numOfRecentDay=${days}`)
      .setToken(getToken())
      .setCancelToken(cancelTokenSource.token)
      .get()
      .then(({ data }) => {
        const tempResultData = data.filter((item) => item.visits !== 0);
        if (tempResultData.length === 0) {
          setVisitsStatistic([]);
          if (typeof handleBlockEmptyContent === 'function') {
            handleBlockEmptyContent(true);
          }
        } else {
          const visitsStatisticTemp = _buildVisitsStatisticData(data);

          const cloneVSData = [...visitsStatistic];

          cloneVSData.push(visitsStatisticTemp);
          setVisitsStatistic(cloneVSData);
          if (typeof handleBlockEmptyContent === 'function') {
            handleBlockEmptyContent(cloneVSData.length === 0);
          }
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.warn('The request is canceled');
        } else {
          restServiceHelper.handleError(err);
        }
      })
      .finally(() => setIsLoadingStatistic(false));
  };

  useEffect(() => {
    _getStatisticVisit();
  }, [days]);

  const _calGridValue = (chartData = []) => {
    const data = chartData.map((i) => i.data).flat();
    if (!data.length) {
      return [0];
    }
    const maxValue = Math.max(
      ...data.map((value) => {
        return value.y;
      })
    );
    const temp = Math.floor(maxValue / 5);

    const gridValues = [0];

    for (let i = 1; i < 5; i++) {
      gridValues.push(gridValues[i - 1] + temp);
    }

    gridValues.push(maxValue);
    return [...gridValues];
  };

  return isLoadingStatistic ? (
    <Stack styles={{ root: { marginTop: 24 } }} className={wrapperClass}>
      <Shimmer shimmerElements={getShimmerElements()} />
      <Shimmer shimmerElements={getShimmerElements()} />
      <Shimmer shimmerElements={getShimmerElements()} />
      <Shimmer shimmerElements={getShimmerElements()} />
      <Shimmer shimmerElements={getShimmerElements()} />
    </Stack>
  ) : (
    <Stack styles={wrapContent}>
      {visitsStatistic?.length > 0 ? (
        <Stack styles={chartWrap}>
          <ResponsiveLine
            data={visitsStatistic}
            yFormat=" >-.2f"
            xScale={{ type: 'point' }}
            margin={{ top: 25, right: 5, bottom: 50, left: 50 }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 15,
              tickRotation: 0,
              tickValues: visitsStatistic.length ? _calGridValue(visitsStatistic) : [],
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legendPosition: 'end',
              legendOffset: 30,
            }}
            useMesh
            tooltip={({ point }) => {
              return (
                <>
                  <Stack styles={pointHover} horizontal horizontalAlign="center" verticalAlign="center">
                    <Text styles={textHover}>
                      Visits
                      <Text styles={textHover} color="white">
                        {` ${point.data.y}`}
                      </Text>
                    </Text>
                  </Stack>
                  <Stack styles={{ root: { display: 'flex', justifyContent: 'center', width: 75 } }}>
                    <Stack
                      styles={{
                        root: {
                          width: 0,
                          height: 0,
                          borderLeft: '10px solid transparent',
                          borderRight: '10px solid transparent',
                          borderTop: '10px solid rgba(30, 30, 30, 0.8)',
                          marginLeft: 28,
                        },
                      }}
                    />
                  </Stack>
                </>
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
            gridYValues={visitsStatistic.length ? _calGridValue(visitsStatistic) : []}
            enableGridX={false}
            pointSize={8}
            pointBorderWidth={1}
            pointBorderColor={{ from: 'serieColor' }}
            pointColor={DARK_THEME.palette.neutralPrimary}
            colors={visitsStatistic.map((x) => x.color)}
          />
        </Stack>
      ) : (
        <Text styles={textEmptyStyle}>No visits in the last {days} days.</Text>
      )}
    </Stack>
  );
}
ContentChart.propTypes = {
  userId: PropTypes.string.isRequired,
  handleBlockEmptyContent: PropTypes.func.isRequired,
  days: PropTypes.number,
};
ContentChart.defaultProps = {
  days: 30,
};

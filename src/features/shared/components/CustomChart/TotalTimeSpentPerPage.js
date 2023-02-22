import React from 'react';
import PropTypes from 'prop-types';
import { Stack } from '@fluentui/react';
import { ResponsiveBar } from '@nivo/bar';
import format from 'format-duration';
import { DARK_THEME, LIGHT_THEME } from 'core/constants/Theme';
import { calculateDisplayValueXAxis } from 'features/shared/lib/utils';

const stylesChartWrapper = {
  root: {
    height: 170,
    selectors: {
      '> div': {
        position: 'relative',
        '> div': {
          position: 'initial !important',
          width: '100%',
          height: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
        },
      },
    },
  },
};

export default function TotalTimeSpentPerPage(props) {
  const { chartProps, data } = props;

  const _calcLeftTickValue = () => {
    const gridValues = [0];
    if (!data || data.length === 0) {
      return gridValues;
    }
    const maxValue = Math.max(...data.map((i) => i.duration));
    const temp = Math.floor(maxValue / 4);
    for (let i = 1; i < 4; i++) {
      gridValues.push(gridValues[i - 1] + temp);
    }
    gridValues.push(maxValue);

    return gridValues;
  };

  const _getChartProps = () => {
    const chartData = data?.sort((a, b) => a.page - b.page);
    const leftTickValue = _calcLeftTickValue();
    const bottomTickValues = calculateDisplayValueXAxis(chartData?.length);
    return {
      data: chartData || [],
      keys: ['duration'],
      indexBy: 'page',
      borderColor: { theme: 'background' },
      valueFormat: { enabled: false },
      margin: { bottom: 40, left: 60, top: 8, right: 16 },
      padding: 0.55,
      enableLabel: false,
      indexScale: {
        type: 'band',
        round: false,
      },
      groupMode: 'grouped',
      gridYValues: leftTickValue,
      ...(bottomTickValues?.length > 25 && { width: bottomTickValues.length * 70 }),
      colors: LIGHT_THEME.palette.themePrimary,
      theme: {
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
      },
      ...chartProps,
      axisLeft: {
        format: (v) => format(v),
        tickSize: 0,
        tickPadding: 14,
        tickValues: leftTickValue,
        ...chartProps?.axisLeft,
      },
      axisBottom: {
        enable: true,
        tickValues: bottomTickValues,
        ...chartProps?.axisBottom,
      },
    };
  };

  return (
    <Stack styles={{ root: { ...stylesChartWrapper.root } }}>
      <ResponsiveBar {..._getChartProps()} />
    </Stack>
  );
}
TotalTimeSpentPerPage.propTypes = {
  chartProps: PropTypes.oneOfType([PropTypes.object]),
  data: PropTypes.oneOfType([PropTypes.array]),
};
TotalTimeSpentPerPage.defaultProps = {
  chartProps: {},
  data: [],
};

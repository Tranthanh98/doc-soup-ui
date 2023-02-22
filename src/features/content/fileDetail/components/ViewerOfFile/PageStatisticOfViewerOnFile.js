import * as React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, ThemeContext } from '@fluentui/react';
import RestService from 'features/shared/services/restService';
import format from 'format-duration';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { TIME_OUT } from 'core/constants/Const';
import { Chart } from 'features/shared/components';
import PageImageHover from '../PageImageHover';

class LinkStatisticChart extends React.PureComponent {
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
    const { fileId, getToken, item } = this.props;
    const { viewerId } = item;
    new RestService()
      .setPath(`/file/${fileId}/viewer/${viewerId}/statistic`)
      .setToken(getToken())
      .get()
      .then((response) => {
        this.setState({ chartData: response.data });
      })
      .catch((err) => console.log(err));
  };

  _getChartProps = () => {
    return {
      tooltip: (item) => {
        const { fileId, version } = this.props;
        const { chartData } = this.state;
        const totalPages = chartData?.length;
        return (
          <PageImageHover
            urlGetImage={`/file/${fileId}/thumb/${item.data.page}?version=${version}`}
            dataFooter={{
              leftTitle: 'Page',
              leftValue: `${item.data.page}/${totalPages}`,
              rightTitle: 'Duration',
              rightValue: format(item.data.duration),
            }}
          />
        );
      },
    };
  };

  render() {
    const { chartData } = this.state;
    const { item, onRenderVisitData } = this.props;

    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <Stack
            styles={{
              root: {
                background: theme.palette.neutralLighter,
                padding: '8px 70px',
                transition: 'max-height 200ms',
                maxHeight: 700,
                ...(item?.isCollapsed && { maxHeight: 0, paddingTop: 0, paddingBottom: 0, visibility: 'hidden' }),
                selectors: {
                  [BREAKPOINTS_RESPONSIVE.sm]: {
                    padding: '0 3px',
                  },
                  [BREAKPOINTS_RESPONSIVE.md]: {
                    padding: '0 3px',
                  },
                },
              },
            }}
          >
            <Stack tokens={{ padding: `${theme.spacing.m} 0` }}>
              {onRenderVisitData}
              <Text>Total Time Spent Per Page</Text>
            </Stack>
            <Chart.TotalTimeSpentPerPage data={chartData} chartProps={this._getChartProps()} />
          </Stack>
        )}
      </ThemeContext.Consumer>
    );
  }
}

LinkStatisticChart.propTypes = {
  fileId: PropTypes.number.isRequired,
  getToken: PropTypes.func.isRequired,
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onRenderVisitData: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  version: PropTypes.number.isRequired,
};

export default LinkStatisticChart;

import * as React from 'react';
import { Stack, Text, ThemeContext, Separator } from '@fluentui/react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import RestService from 'features/shared/services/restService';
import { randomColor, calculateDisplayValueXAxis } from 'features/shared/lib/utils';
import GlobalContext from 'security/GlobalContext';
import { BAR_CHART_COLOR, BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import * as _ from 'lodash';
import format from 'format-duration';
import { Chart } from 'features/shared/components';
import ContactLinkList from './ContactLinkList';

const chartContainerStyles = {
  root: {
    width: '100%',
    paddingTop: 23,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: LIGHT_THEME.palette.neutralLighter,
    selectors: {
      [BREAKPOINTS_RESPONSIVE.lgUp]: {
        paddingLeft: 70,
        paddingRight: 29,
      },
    },
  },
};

const stylesContainer = (theme, isCollapsed) => {
  return {
    root: {
      marginTop: 15,
      border: `20px solid ${theme.palette.neutralLight}`,
      transition: 'max-height 200ms',
      maxHeight: 700,
      ...(isCollapsed && { maxHeight: 0, borderWidth: 0, visibility: 'hidden' }),
      selectors: {
        [BREAKPOINTS_RESPONSIVE.mdDown]: {
          borderWidth: 10,
        },
      },
    },
  };
};

class ContactChart extends React.PureComponent {
  state = {
    chartData: [],
    links: [],
    allData: [],
    allSelectedDatas: [],
  };

  componentDidMount() {
    const { file, match } = this.props;
    const { id } = match.params;
    const { getToken } = this.context;

    new RestService()
      .setPath(`/contact/${id}/statistic/${file?.fileId}`)
      .setToken(getToken())
      .get()
      .then((response) => {
        this.setState({ allData: response.data }, () => {
          this._buildChartData(response.data);
        });
      });
  }

  _renderCustomLabel = (value) => {
    return format(value.value);
  };

  _buildChartData = (data = []) => {
    const { allData } = this.state;
    const viewerGroupped = _.chain(data)
      .groupBy('viewerId')
      .map((value, key) => ({ viewerId: key, linkStatistic: value }))
      .value();

    const links = viewerGroupped.slice(0, 10).map((x, index) => ({
      viewerId: Number(x.viewerId),
      viewedAt: x.linkStatistic[0].viewedAt,
      linkName: x.linkStatistic[0].linkName,
      color: index < 10 ? BAR_CHART_COLOR[index] : randomColor(),
      selected: index < 3,
    }));

    const chartData = _.chain(data)
      .groupBy('page')
      .map((value, key) => ({ page: key, ...this._flattenLink(value) }))
      .value();

    const allSelectedDatas = allData.filter((x) => links.some((y) => y.selected && x.viewerId === y.viewerId));

    this.setState({ links, chartData, allSelectedDatas: [...allSelectedDatas] });
  };

  _flattenLink = (data = []) => {
    const result = {};
    for (let i = 0; i < data.length; i++) {
      if (data[i].duration > 0) {
        result[`${data[i].viewerId}`] = data[i].duration;
      }
    }

    if (Object.keys(result).length === 0) {
      return null;
    }

    return result;
  };

  _selectUnselectLink = (link) => {
    const { links, allData } = this.state;
    const linkInState = links.find((x) => x.viewerId === link.viewerId);
    linkInState.selected = !linkInState.selected;
    const allSelectedDatas = allData.filter((x) => links.some((y) => y.selected && x.viewerId === y.viewerId));
    this.setState({ links: [...links], allSelectedDatas: [...allSelectedDatas] });
  };

  _calGridValue = () => {
    const { allSelectedDatas } = this.state;
    if (!allSelectedDatas.length) {
      return [0];
    }

    const maxValue = Math.max(...allSelectedDatas.map((x) => x.duration));
    const temp = Math.floor(maxValue / 4);

    const gridValues = [0];

    for (let i = 1; i < 4; i++) {
      gridValues.push(gridValues[i - 1] + temp);
    }

    gridValues.push(maxValue);

    return gridValues;
  };

  _getChartProps = () => {
    const { links, chartData } = this.state;
    const bottomTickValues = calculateDisplayValueXAxis(chartData?.length);
    return {
      keys: links ? links.filter((x) => x.selected).map((x) => x.viewerId) : [],
      tooltip: ({ value, color }) => (
        <div style={{ backgroundColor: LIGHT_THEME.palette.white, padding: 10 }}>
          <strong color={color}> {format(value)} </strong>
        </div>
      ),
      axisLeft: {
        tickValues: this._calGridValue(),
      },
      axisBottom: {
        enable: true,
        tickValues: bottomTickValues,
      },
      gridYValues: this._calGridValue(),
      ...(bottomTickValues?.length > 25 && {
        width: (15 * links.length - 10) * chartData.length * links.length,
      }),
      innerPadding: 10,
      colors: links ? links.filter((x) => x.selected).map((x) => x.color) : [],
      labelSkipWidth: 12,
      labelSkipHeight: 12,
    };
  };

  render() {
    const { chartData, links } = this.state;
    const { file } = this.props;
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <Stack styles={stylesContainer(theme, file?.isCollapsed)}>
            <Stack styles={chartContainerStyles}>
              <Stack.Item className="hiddenLgUp">
                <Text>Time Spent: {format(file.timeSpent)}</Text>
                <Separator />
                <Text className="hiddenLgUp">Visits: {file.visits}</Text>
                <Separator />
              </Stack.Item>
              <Text styles={{ root: { marginBottom: 16 } }}>Total Time Spent Per Page</Text>
              <Chart.TotalTimeSpentPerPage data={chartData} chartProps={this._getChartProps()} />
            </Stack>
            <ContactLinkList items={links} onSelectUnselectLink={this._selectUnselectLink} />
          </Stack>
        )}
      </ThemeContext.Consumer>
    );
  }
}

ContactChart.propTypes = {
  file: PropTypes.oneOfType([PropTypes.object]).isRequired,
  match: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

ContactChart.contextType = GlobalContext;
export default withRouter(ContactChart);

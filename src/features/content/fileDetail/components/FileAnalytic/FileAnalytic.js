import { mergeStyles, Shimmer, ShimmerElementType, Stack, Text, ThemeContext } from '@fluentui/react';
import FileDetailEmptyContent from 'features/shared/components/FileDetailEmptyContent';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import RestService from 'features/shared/services/restService';
import ComparativeStatsSection from './ComparativeStatsSection';
import HighlightSection from './HighlightSection';
import VisitMap from './VisitMap';

const emptyContentStyles = {
  root: { fontSize: '20px', [BREAKPOINTS_RESPONSIVE.mdDown]: { fontSize: 16 } },
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

class FileAnalytic extends Component {
  state = {
    isRenderEmpty: true,
    isLoading: true,
    summaryStatistics: [],
  };

  componentDidMount() {
    const { fileId } = this.props;
    const { getToken } = this.context;
    if (fileId !== undefined) {
      this.setState({ isLoading: true });
      new RestService()
        .setPath(`/file/${fileId}/summary-statistic`)
        .setToken(getToken())
        .get()
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const summaryStatistics = response.data.sort((a, b) => a.topPageDuration > b.topPageDuration);
            this.setState({ summaryStatistics, isRenderEmpty: false });
          } else {
            this._setRenderEmpty(true);
          }
        })
        .catch(() => {
          this._setRenderEmpty(true);
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  _setRenderEmpty = (isRenderEmpty) => {
    this.setState({ isRenderEmpty });
  };

  _renderContent = () => {
    const { fileId, version } = this.props;
    const { isRenderEmpty, summaryStatistics } = this.state;
    return isRenderEmpty ? (
      <FileDetailEmptyContent
        imageUrl="/img/pages/emptyAnalytic.png"
        srcSet="/img/pages/emptyAnalytic2x.png 2x, /img/pages/emptyAnalytic3x.png 3x"
        offsetHeight="360px"
        content={
          <Stack.Item styles={{ root: { maxWidth: 430 } }}>
            <Text styles={emptyContentStyles}>
              We’d love to show you stats on your contents, but first you need some visit!
            </Text>
          </Stack.Item>
        }
      />
    ) : (
      <ThemeContext.Consumer>
        {() => (
          <Stack styles={{ root: { marginTop: 44, marginBottom: 12 } }}>
            <HighlightSection version={version} summaryStatistics={summaryStatistics} fileId={fileId} />
            <Stack className="separatorLine" style={{ marginTop: 28 }} />
            <ComparativeStatsSection version={version} fileId={fileId} />
            <Stack className="separatorLine" style={{ marginTop: 28 }} />
            <VisitMap fileId={fileId} />
          </Stack>
        )}
      </ThemeContext.Consumer>
    );
  };

  render() {
    const { isLoading } = this.state;
    return isLoading ? (
      <Stack styles={{ root: { marginTop: 24 } }} className={wrapperClass}>
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
      </Stack>
    ) : (
      this._renderContent()
    );
  }
}

FileAnalytic.contextType = GlobalContext;

FileAnalytic.propTypes = {
  fileId: PropTypes.number,
  version: PropTypes.number,
};
FileAnalytic.defaultProps = {
  fileId: undefined,
  version: 1,
};

export default FileAnalytic;

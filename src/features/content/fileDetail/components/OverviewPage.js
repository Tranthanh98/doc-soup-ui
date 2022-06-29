import { mergeStyles, Shimmer, ShimmerElementType, Stack, Text } from '@fluentui/react';
import { FileDetailEmptyContent } from 'features/shared/components';
import { ROWS_PER_PAGE } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import { createGroupTable } from 'features/shared/lib/utils';
import LinkOfFileList from 'features/shared/components/LinkOfFile/LinkOfFileList';

const emptyContentStyles = {
  root: {
    width: 350,
    fontSize: 20,
    [BREAKPOINTS_RESPONSIVE.mdDown]: { fontSize: 16 },
  },
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

export default class OverviewPage extends Component {
  state = {
    isRenderEmpty: false,
    isLoading: true,
    allLink: [],
    linkList: [],
    pagination: {
      page: 0,
      pageSize: ROWS_PER_PAGE.FIVE,
      totalPages: 0,
    },
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    this._getAllLinks();
  }

  componentDidUpdate(prevProps) {
    const { refreshAllLink, file } = this.props;
    if (prevProps.refreshAllLink !== refreshAllLink || prevProps.file !== file) {
      this._getAllLinks();
    }
  }

  _getAllLinks = () => {
    const { getToken } = this.context;
    const { file } = this.props;

    const { pagination } = this.state;

    if (file.id) {
      new RestService()
        .setPath(`/file/${file.id}/link?page=${pagination.page}&pageSize=${pagination.pageSize}`)
        .setToken(getToken())
        .get()
        .then((response) => {
          const { items, page, totalPages } = response.data;
          const linkList = createGroupTable(items);
          this.setState({
            allLink: linkList,
            linkList,
            pagination: {
              page,
              totalPages,
              pageSize: pagination.pageSize,
            },
          });

          if (linkList?.length === 0) {
            this.setState({ isRenderEmpty: true });
          }
        })
        .catch(() => {
          this.setState({ isRenderEmpty: true });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  };

  _handleSearch = (value) => {
    const { allLink } = this.state;
    if (!value || value === null || value === undefined) {
      this.setState({ linkList: allLink });
    } else {
      const links = allLink.filter((i) => i.linkName?.includes(value));
      const linkList = createGroupTable(links);
      this.setState({ linkList });
    }
  };

  _onChangePageIndex = (page) => {
    const { pagination } = this.state;

    this.setState({ pagination: { ...pagination, page } }, this._getAllLinks);
  };

  _onChangePageSize = (pageSize) => {
    const { pagination } = this.state;

    this.setState({ pagination: { ...pagination, page: 0, pageSize } }, this._getAllLinks);
  };

  _renderContent = () => {
    const { file, version } = this.props;
    const { isRenderEmpty, linkList, pagination } = this.state;
    return (
      <>
        {isRenderEmpty ? (
          <FileDetailEmptyContent
            imageUrl="/img/pages/emptyLinks.png"
            srcSet="/img/pages/emptyLinks2x.png 2x, /img/pages/emptyLinks3x.png 3x"
            offsetHeight="410px"
            content={
              <Text styles={emptyContentStyles}>
                All quiet. No recently created links or visits in the last 30 days
              </Text>
            }
          />
        ) : (
          <Stack style={{ marginTop: 20 }}>
            <LinkOfFileList
              fileId={file?.id}
              version={version}
              name="All Links"
              onSearch={this._handleSearch}
              linkList={linkList}
              refreshAllLink={this._getAllLinks}
              pagingOptions={{
                ...pagination,
                onChangePageSize: this._onChangePageSize,
                onChangePageIndex: this._onChangePageIndex,
              }}
              onRefreshAllLink={this._getAllLinks}
            />
          </Stack>
        )}
      </>
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

OverviewPage.contextType = GlobalContext;

OverviewPage.propTypes = {
  file: PropTypes.oneOfType([PropTypes.object]).isRequired,
  refreshAllLink: PropTypes.bool,
  version: PropTypes.number,
};

OverviewPage.defaultProps = {
  refreshAllLink: undefined,
  version: 0,
};

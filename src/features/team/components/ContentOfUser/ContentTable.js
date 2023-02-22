import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Shimmer, ShimmerElementType, Stack, Text } from '@fluentui/react';
import { LIGHT_THEME } from 'core/constants/Theme';
import { CustomDetailsList } from 'features/shared/components';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import axios from 'axios';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import columnsFileScheme from './ColumnsFileScheme';

const getShimmerElements = () => {
  return [
    { type: ShimmerElementType.circle, height: 24 },
    { type: ShimmerElementType.gap, width: 8 },
    { type: ShimmerElementType.line, height: 8 },
  ];
};

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

class ContentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      isLoading: false,
      imgSrcs: [],
    };
    this.cancelTokenSource = axios.CancelToken.source();
  }

  componentDidMount() {
    this._getContentsUser();
  }

  componentWillUnmount() {
    this.cancelTokenSource.cancel();
  }

  _getContentsUser = () => {
    const { userId, days } = this.props;
    const { getToken } = this.context;
    this.setState({ isLoading: true });
    new RestService()
      .setPath(`/teams/content/user/${userId}?numOfRecentDay=${days}`)
      .setToken(getToken())
      .setCancelToken(this.cancelTokenSource.token)
      .get()
      .then(({ data }) => {
        const { handleBlockEmptyContent } = this.props;
        this.setState({ files: data }, this._getThumbNails(data));
        if (typeof handleBlockEmptyContent === 'function') {
          handleBlockEmptyContent(data?.length === 0);
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.warn('The request is canceled');
        } else {
          restServiceHelper.handleError(err);
        }
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  _getThumbNails = (files = []) => {
    const { getToken } = this.context;
    files.forEach((f) => {
      new RestService()
        .setPath(`/file/${f.fileId}/thumb/1`)
        .setToken(getToken())
        .setResponseType('arraybuffer')
        .get()
        .then(({ data }) => {
          const { imgSrcs } = this.state;

          const URL = window.URL || window.webkitURL;

          const imageUrl = URL.createObjectURL(new Blob([data], { type: 'image/jpeg', encoding: 'UTF-8' }));

          const imgSrc = {
            id: f.fileId,
            src: imageUrl,
          };
          this.setState({ imgSrcs: [...imgSrcs, imgSrc] });
        });
    });
  };

  render() {
    const { files, isLoading, imgSrcs } = this.state;
    const { days } = this.props;
    return isLoading ? (
      <Stack tokens={{ childrenGap: 16 }}>
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <br />
      </Stack>
    ) : (
      <Stack styles={wrapContent}>
        {files?.length > 0 ? (
          <CustomDetailsList
            isStickyHeader={false}
            striped
            columns={columnsFileScheme(imgSrcs)}
            items={files}
            detailListProps={{ isHeaderVisible: true }}
          />
        ) : (
          <Text styles={textEmptyStyle}>No links created in the last {days} days.</Text>
        )}
      </Stack>
    );
  }
}
ContentTable.contextType = GlobalContext;

ContentTable.propTypes = {
  userId: PropTypes.string.isRequired,
  handleBlockEmptyContent: PropTypes.func.isRequired,
  days: PropTypes.number,
};
ContentTable.defaultProps = {
  days: 30,
};
export default ContentTable;

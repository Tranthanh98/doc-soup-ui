import React from 'react';
import PropTypes from 'prop-types';
import { ROWS_PER_PAGE } from 'core/constants/Const';
import { CustomDetailsList } from 'features/shared/components';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import { Shimmer, ShimmerElementType, Stack } from '@fluentui/react';
import axios from 'axios';
import columnTeamConfig from './ColumnTeamConfig';

const getShimmerElements = () => {
  return [
    { type: ShimmerElementType.circle, height: 24 },
    { type: ShimmerElementType.gap, width: 8 },
    { type: ShimmerElementType.line, height: 8 },
  ];
};

class TeammateTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      pagination: {
        page: 0,
        pageSize: ROWS_PER_PAGE.TEN,
        totalPages: 0,
      },
      isLoading: true,
    };
    this.cancelTokenSource = axios.CancelToken.source();
  }

  componentDidMount() {
    this._getListTeammate();
  }

  componentWillUnmount() {
    this.cancelTokenSource.cancel();
  }

  _getListTeammate() {
    const { days, handleTotalMember } = this.props;
    const { getToken } = this.context;
    const { pagination } = this.state;
    new RestService()
      .setPath(`/teams?numOfRecentDay=${days}&page=${pagination.page}&pageSize=${pagination.pageSize}`)
      .setToken(getToken())
      .setCancelToken(this.cancelTokenSource.token)
      .get()
      .then((res) => {
        const { items, totalPages, totalRows } = res.data;
        this.setState({ users: items, pagination: { ...pagination, totalPages } });
        handleTotalMember(totalRows);
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
  }

  render() {
    const { isAdmin, userInfo } = this.props;
    const { users, pagination, isLoading } = this.state;
    const { isMobile, isDesktop } = this.context;
    if (isLoading) {
      return (
        <Stack tokens={{ childrenGap: 16 }}>
          <Shimmer shimmerElements={getShimmerElements()} />
          <Shimmer shimmerElements={getShimmerElements()} />
          <Shimmer shimmerElements={getShimmerElements()} />
          <Shimmer shimmerElements={getShimmerElements()} />
          <Shimmer shimmerElements={getShimmerElements()} />
          <br />
        </Stack>
      );
    }

    return (
      <CustomDetailsList
        isStickyHeader={false}
        striped
        columns={columnTeamConfig(isMobile, isDesktop, userInfo, isAdmin)}
        items={users}
        detailListProps={{ isHeaderVisible: true }}
        isPagination
        pagingOptions={{
          ...pagination,
          onChangePageIndex: (page) =>
            this.setState((state) => ({ pagination: { ...state.pagination, page } }), this._getListTeammate),
          onChangePageSize: (pageSize) =>
            this.setState(
              (state) => ({ pagination: { ...state.pagination, pageSize, page: 0 } }),
              this._getListTeammate
            ),
        }}
      />
    );
  }
}

TeammateTable.contextType = GlobalContext;

TeammateTable.propTypes = {
  days: PropTypes.number,
  handleTotalMember: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  userInfo: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

TeammateTable.defaultProps = {
  days: 30,
};
export default TeammateTable;

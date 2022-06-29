import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stack } from '@fluentui/react';
import { PAGE_PATHS } from 'core/constants/Const';
import GlobalContext from 'security/GlobalContext';
import { SearchBox } from '../components';

import SearchDetail from './SearchDetail';

class SearchAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalResults: 0,
    };
  }

  _handleSubmitSearch = (keyword) => {
    const { history, match } = this.props;
    const { id } = match.params;
    this.setState({ totalResults: 0 });
    history.push(`/${PAGE_PATHS.search}/${id}?keyword=${keyword}`);
  };

  _getPath = () => {
    const { match } = this.props;
    const { id } = match.params;

    switch (id) {
      case 'content':
        return ['file', 'directory'];

      case 'link-account':
        return ['link/link-account'];

      default:
        return [id];
    }
  };

  _setTotalResults = (total) => {
    this.setState((state) => {
      const totalResults = state.totalResults + total;

      return { totalResults };
    });
  };

  render() {
    const { totalResults } = this.state;

    const { match } = this.props;
    const { id } = match.params;

    const paths = this._getPath();

    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('keyword');

    return (
      <Stack tokens={{ childrenGap: 48 }}>
        <Stack.Item>
          <SearchBox submit={this._handleSubmitSearch} keywordSearch={keyword} totalResults={totalResults} />
        </Stack.Item>

        {paths.map((path, index) => {
          return (
            <SearchDetail
              key={index}
              path={path}
              typeSearch={id}
              keyword={keyword}
              setAllResults={this._setTotalResults}
            />
          );
        })}
      </Stack>
    );
  }
}

SearchAll.contextType = GlobalContext;
SearchAll.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
export default SearchAll;

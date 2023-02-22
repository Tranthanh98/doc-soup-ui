import React, { Component } from 'react';
import { Stack } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { PAGE_PATHS } from 'core/constants/Const';
import { EmptySearch, SearchDataRoom, SearchContent, SearchLinks, SearchAccounts, SearchBox } from './components';
import SearchContact from './components/SearchContact';

const stackStyles = {
  root: {
    margin: '48px 0',
    ':not(:first-child)': {
      margin: '48px 0',
    },
  },
};

const tokens = {
  childrenGap: 48,
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      contentData: {
        items: [],
        page: 0,
        totalRows: 0,
      },
      directoryData: {
        items: [],
        page: 0,
        totalRows: 0,
      },
      dataRoomData: {
        items: [],
        page: 0,
        totalRows: 0,
      },
      accountData: {
        items: [],
        page: 0,
        totalRows: 0,
      },
      linkData: {
        items: [],
        page: 0,
        totalRows: 0,
      },
      contactData: {
        items: [],
        totalRows: 0,
      },
      totalResult: 0,
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const searchString = params.get('keyword');
    this.setState({ keyword: searchString });
    this._searchData();
  }

  _onSubmitSearch = (keyword) => {
    const { history } = this.props;
    history.push(`/${PAGE_PATHS.search}?keyword=${keyword}`);
    this.setState({ keyword, totalResult: 0 }, this._searchData);
  };

  _searchFiles = () => {
    const { getToken } = this.context;
    const params = new URLSearchParams(window.location.search);

    const keyword = params.get('keyword');

    return new RestService().setPath(`/file/search?keyword=${keyword}&page=0&pageSize=5`).setToken(getToken()).get();
  };

  _searchDirectory = () => {
    const { getToken } = this.context;
    const params = new URLSearchParams(window.location.search);

    const keyword = params.get('keyword');

    return new RestService()
      .setPath(`/directory/search?keyword=${keyword}&page=0&pageSize=5`)
      .setToken(getToken())
      .get();
  };

  _searchDataRoom = () => {
    const { getToken } = this.context;
    const params = new URLSearchParams(window.location.search);

    const keyword = params.get('keyword');

    return new RestService()
      .setPath(`/data-room/search?keyword=${keyword}&page=0&pageSize=5`)
      .setToken(getToken())
      .get();
  };

  _searchAccount = () => {
    const { getToken } = this.context;
    const params = new URLSearchParams(window.location.search);

    const keyword = params.get('keyword');

    return new RestService()
      .setPath(`/link/link-account/search?keyword=${keyword}&page=0&pageSize=5`)
      .setToken(getToken())
      .get();
  };

  _searchLinks = () => {
    const { getToken } = this.context;
    const params = new URLSearchParams(window.location.search);

    const keyword = params.get('keyword');

    return new RestService().setPath(`/link/search?keyword=${keyword}&page=0&pageSize=5`).setToken(getToken()).get();
  };

  _searchContact = () => {
    const { getToken } = this.context;
    const params = new URLSearchParams(window.location.search);

    const keyword = params.get('keyword');

    return new RestService().setPath(`/contact/search?keyword=${keyword}&page=0&pageSize=5`).setToken(getToken()).get();
  };

  _handleExtractResponse = (res, stateKey) => {
    if (res.status === 'fulfilled' && res.value.status === 200) {
      const { data } = res.value;
      this.setState((state) => ({
        totalResult: state.totalResult + data?.totalRows,
        [stateKey]: data,
      }));
    }
  };

  _searchData() {
    this.setState({
      contentData: {
        items: [],
        totalRows: 0,
      },
      directoryData: {
        items: [],
        totalRows: 0,
      },
      dataRoomData: {
        items: [],
        totalRows: 0,
      },
      accountData: {
        items: [],
        totalRows: 0,
      },
      linkData: {
        items: [],
        totalRows: 0,
      },
      contactData: {
        items: [],
        totalRows: 0,
      },
      totalResult: 0,
    });

    const contentQuery = this._searchFiles();

    const directoryQuery = this._searchDirectory();

    const dataRoomQuery = this._searchDataRoom();

    const accountQuery = this._searchAccount();

    const linkQuery = this._searchLinks();

    const contact = this._searchContact();

    Promise.allSettled([contentQuery, directoryQuery, dataRoomQuery, accountQuery, linkQuery, contact])
      .then((values) => {
        this._handleExtractResponse(values[0], 'contentData');
        this._handleExtractResponse(values[1], 'directoryData');
        this._handleExtractResponse(values[2], 'dataRoomData');
        this._handleExtractResponse(values[3], 'accountData');
        this._handleExtractResponse(values[4], 'linkData');
        this._handleExtractResponse(values[5], 'contactData');
      })
      .catch((err) => RestServiceHelper.handleError(err));
  }

  render() {
    const { keyword, totalResult, contentData, dataRoomData, accountData, linkData, directoryData, contactData } =
      this.state;

    const contentItems = {
      items: contentData?.items?.concat(directoryData?.items) || [],
      page: 0,
      totalRows: contentData?.totalRows + directoryData?.totalRows,
    };

    return (
      <>
        <SearchBox submit={this._onSubmitSearch} keywordSearch={keyword} totalResults={totalResult} />
        {totalResult > 0 ? (
          <Stack styles={stackStyles} tokens={tokens} disableShrink>
            <SearchContent data={contentItems} keyword={keyword} total={totalResult} />
            <SearchDataRoom data={dataRoomData} keyword={keyword} total={totalResult} />
            <SearchAccounts data={accountData} keyword={keyword} total={totalResult} />
            <SearchLinks data={linkData} keyword={keyword} total={totalResult} />
            <SearchContact data={contactData} keyword={keyword} total={totalResult} />
          </Stack>
        ) : (
          <EmptySearch />
        )}
      </>
    );
  }
}
Search.contextType = GlobalContext;
export default Search;

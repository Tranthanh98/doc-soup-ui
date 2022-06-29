import { Image, ImageFit, Stack, Text } from '@fluentui/react';
import { FILTER_LINK_TYPE, PAGE_PATHS, ROWS_PER_PAGE } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import LinkOfFileList from 'features/shared/components/LinkOfFile/LinkOfFileList';
import FilterTab from 'features/linkAccount/components/FilterTab';
import { FileDetailEmptyContent } from 'features/shared/components';
import { createGroupTable } from 'features/shared/lib/utils';
import RestService from 'features/shared/services/restService';
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import GlobalContext from 'security/GlobalContext';

const filterTabs = [
  {
    key: FILTER_LINK_TYPE.DATA_ROOM,
    name: 'Data Rooms',
  },

  {
    key: FILTER_LINK_TYPE.CONTENT,
    name: 'Contents',
  },
];

class LinksOfLinkAccount extends Component {
  state = {
    filter: FILTER_LINK_TYPE.DATA_ROOM,
    items: undefined,
    pagination: {
      page: 0,
      pageSize: ROWS_PER_PAGE.FIVE,
      totalPages: 0,
    },
    imageSrcs: [],
  };

  componentDidMount() {
    this._getLinksOfAccount();
  }

  _getLinksOfAccount = () => {
    const { match } = this.props;
    const { filter, pagination } = this.state;
    const { getToken } = this.context;

    this.setState({ items: undefined });

    // eslint-disable-next-line max-len
    const url = `/link/link-account/${match.params.id}/links?filter=${filter}&page=${pagination.page}&pageSize=${pagination.pageSize}`;

    new RestService()
      .setPath(url)
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        const { items, page, totalPages } = data;

        const refIds = [
          ...new Set(items.filter((i) => i.documentId).map((i) => ({ refId: i.refId, version: i.version }))),
        ];

        const itemsData = createGroupTable(items);
        this.setState(
          {
            items: itemsData,
            pagination: {
              page,
              totalPages,
              pageSize: pagination.pageSize,
            },
            imageSrcs: refIds.map((i) => ({ refId: i.refId, src: undefined, version: i.version })),
          },
          this._handleGetImage
        );
      })
      .catch(() => {
        this.setState({ items: [] });
      });
  };

  _handleGetImage = () => {
    const { getToken } = this.context;
    const { imageSrcs } = this.state;

    const promises = [];
    imageSrcs.forEach((i) => {
      const request = new RestService()
        .setPath(`/file/${i.refId}/thumb/1?version=${i.version}`)
        .setToken(getToken())
        .setResponseType('arraybuffer')
        .get();

      promises.push(request);
    });

    Promise.allSettled(promises).then((responses) => {
      responses.forEach((res) => {
        if (res.status === 'fulfilled') {
          const urlPathParam = res.value.config.url.split('/');

          const refId = parseInt(urlPathParam[2], 10);

          const URL = window.URL || window.webkitURL;

          const imageUrl = URL.createObjectURL(new Blob([res.value.data], { type: 'image/jpeg', encoding: 'UTF-8' }));

          this.setState((state) => {
            const item = state.imageSrcs.find((m) => m.refId === refId);
            if (item) {
              item.src = imageUrl;
            }

            return { imageSrcs: [...state.imageSrcs], items: [...state.items] };
          });
        }
      });
    });
  };

  _handleChangeFilter = (value) => {
    this.setState({ filter: value }, this._getLinksOfAccount);
  };

  _onChangePageIndex = (page) => {
    const { pagination } = this.state;

    this.setState({ pagination: { ...pagination, page } }, this._getLinksOfAccount);
  };

  _onChangePageSize = (pageSize) => {
    const { pagination } = this.state;

    this.setState({ pagination: { ...pagination, page: 0, pageSize } }, this._getLinksOfAccount);
  };

  _renderName = (item) => {
    const { imageSrcs } = this.state;
    return (
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
        <Stack.Item disableShrink>
          {item.documentId ? (
            <Link to={`/${PAGE_PATHS.fileDetail}/${item.refId}`} className="hover-underline">
              <Image
                src={imageSrcs.find((i) => i.refId === item.refId)?.src ?? '/img/pdf.svg'}
                height={36}
                width={36}
                imageFit={ImageFit.contain}
                alt="page"
              />
            </Link>
          ) : (
            <Link to={`/${PAGE_PATHS.dataRooms}/${item.refId}`} className="hover-underline">
              <Image
                imageFit={ImageFit.contain}
                src="/img/default-pdf-thumbnail.png"
                srcSet="/img/default-pdf-thumbnail-2x.png, /img/default-pdf-thumbnail-3x.png"
                alt="Logo"
                width={36}
                height={36}
                styles={{
                  root: {
                    marginRight: 8,
                  },
                }}
              />
            </Link>
          )}
        </Stack.Item>
        <Link
          to={item.documentId ? `/${PAGE_PATHS.fileDetail}/${item.refId}` : `/${PAGE_PATHS.dataRooms}/${item.refId}`}
          className="hover-underline"
        >
          <Text>{item.linkName}</Text>
        </Link>
      </Stack>
    );
  };

  render() {
    const { filter, items, pagination } = this.state;

    return (
      <Stack style={{ marginTop: 28 }} tokens={{ childrenGap: 28 }}>
        <Stack
          styles={{ root: { maxWidth: 200, [BREAKPOINTS_RESPONSIVE.mdDown]: { maxWidth: '100%' } } }}
          horizontal
          verticalAlign="center"
        >
          <FilterTab
            tabs={filterTabs}
            selectedKey={filter}
            itemStyles={{ root: { minWidth: 100, [BREAKPOINTS_RESPONSIVE.mdDown]: { minWidth: 0 } } }}
            onSelect={this._handleChangeFilter}
          />
        </Stack>
        <Stack>
          {items?.length === 0 ? (
            <FileDetailEmptyContent
              imageUrl="/img/pages/emptyLinks.png"
              srcSet="/img/pages/emptyLinks2x.png 2x, /img/pages/emptyLinks3x.png 3x"
              offsetHeight="410px"
              content={
                <Text styles={{ root: { fontSize: 20, [BREAKPOINTS_RESPONSIVE.mdDown]: { fontSize: 16 } } }}>
                  All quiet. No recently created links or visits in the last 30 days
                </Text>
              }
            />
          ) : (
            <LinkOfFileList
              linkList={items}
              onRefreshAllLink={this._getLinksOfAccount}
              refreshAllLink={this._getLinksOfAccount}
              onRenderName={this._renderName}
              isExpandToShowViewer={filter === FILTER_LINK_TYPE.CONTENT}
              pagingOptions={{
                ...pagination,
                onChangePageSize: this._onChangePageSize,
                onChangePageIndex: this._onChangePageIndex,
              }}
            />
          )}
        </Stack>
      </Stack>
    );
  }
}

LinksOfLinkAccount.contextType = GlobalContext;

export default withRouter(LinksOfLinkAccount);

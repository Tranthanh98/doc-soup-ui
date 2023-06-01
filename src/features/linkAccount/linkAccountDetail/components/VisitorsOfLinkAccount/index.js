import { Stack, Text } from '@fluentui/react';
import { ROWS_PER_PAGE } from 'core/constants/Const';
import { CustomDetailsList, FileDetailEmptyContent } from 'features/shared/components';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import RestService from 'features/shared/services/restService';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

import GlobalContext from 'security/GlobalContext';
import columnConfig, { lastVisitColumnConfig, locationColumnConfig } from '../config/columnOfVisitorLinkAccount';

function VisitorsOfLinkAccount() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: ROWS_PER_PAGE.FIVE,
    totalPages: 0,
  });
  const { id } = useParams();
  const context = useContext(GlobalContext);

  const { isMobile } = context;

  const _getVisitors = () => {
    const { getToken } = context;
    const url = `/link/link-account/${id}/visitor?page=${pagination.page}&pageSize=${pagination.pageSize}`;
    new RestService()
      .setPath(url)
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        setItems(data.items);
        setPagination({ ...pagination, totalPages: data.totalPages });
      })
      .catch((err) => restServiceHelper.handleError(err));
  };

  useEffect(() => {
    _getVisitors();
  }, [id, pagination.page]);

  const columnSchema = useMemo(() => {
    const config = [...columnConfig(isMobile)];

    if (!isMobile) {
      config.splice(1, 0, locationColumnConfig);

      config.splice(3, 0, lastVisitColumnConfig);
    }

    return config;
  }, [isMobile]);

  if (items && items?.length === 0) {
    return (
      <FileDetailEmptyContent
        imageUrl="/img/pages/emptyPageOverview.png"
        srcSet="/img/pages/emptyPageOverview2x.png 2x, /img/pages/emptyPageOverview3x.png 3x"
        offsetHeight="410px"
        content={
          <Stack.Item>
            <Text block styles={{ root: { fontSize: 20, [BREAKPOINTS_RESPONSIVE.mdDown]: { fontSize: 16 } } }}>
              Nobody has been visited this Link
            </Text>
          </Stack.Item>
        }
      />
    );
  }
  return (
    <Stack className="viewerFileWrapper">
      <CustomDetailsList
        isStickyHeader={false}
        isPagination
        columns={columnSchema}
        items={items}
        pagingOptions={{
          ...pagination,
          onChangePageIndex: (page) => setPagination({ ...pagination, page }),
          onChangePageSize: (pageSize) => setPagination({ ...pagination, pageSize, page: 0 }),
        }}
      />
    </Stack>
  );
}
export default VisitorsOfLinkAccount;

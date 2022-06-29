import { Stack } from '@fluentui/react';
import { ROWS_PER_PAGE } from 'core/constants/Const';
import { CustomDetailsList, CustomText } from 'features/shared/components';
import RestService from 'features/shared/services/restService';
import React, { useContext, useEffect, useState } from 'react';
import GlobalContext from 'security/GlobalContext';
import PropTypes from 'prop-types';
import {
  accountColumnSchema,
  columnContactSchema,
  contentColumnSchema,
  dataRoomColumnSchema,
  linksColumnSchema,
} from '../components/columnsSchema';

export default function SearchDetail({ path, keyword, typeSearch, setAllResults }) {
  const [totalResults, setTotalResults] = useState(0);
  const [imgSrcs, setImageSrcs] = useState([]);

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: ROWS_PER_PAGE.TEN,
    totalPages: 0,
  });

  const [title, setTitle] = useState('');
  const [columnSchema, setColumnSchema] = useState([]);

  const context = useContext(GlobalContext);

  const { getToken, isMobile } = context;

  const _handleGetImgSrc = (data) => {
    if (path === 'file') {
      setImageSrcs(data?.map((i) => ({ id: i.id })));
    }
  };

  const _getThumbnail = () => {
    const requests = imgSrcs?.map((file) => {
      return new RestService()
        .setPath(`/file/${file.id}/thumb/1`)
        .setToken(getToken())
        .setResponseType('arraybuffer')
        .get();
    });

    Promise.allSettled(requests).then((values) => {
      const srcs = [...imgSrcs];
      // eslint-disable-next-line no-restricted-syntax
      for (const res of values) {
        if (res.status === 'fulfilled') {
          const paths = res.value.config.url.split('/');
          const fileId = Number(paths[2]);

          const URL = window.URL || window.webkitURL;
          const imageUrl = URL.createObjectURL(new Blob([res.value.data], { type: 'image/jpeg', encoding: 'UTF-8' }));

          const item = srcs.find((i) => i.id === fileId);

          if (item) {
            item.src = imageUrl;
          }
        }
      }

      setImageSrcs(imgSrcs);
    });
  };

  useEffect(() => {
    if (items.length > 0) {
      _getThumbnail();
    }
  }, [items]);

  const _getData = () => {
    setAllResults(0);

    new RestService()
      .setPath(`${path}/search?keyword=${keyword}&page=${pagination.page}&pageSize=${pagination.pageSize}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.status === 200) {
          const { items: itemsData, page, totalPages, totalRows } = res.data;
          _handleGetImgSrc(itemsData);
          setItems(itemsData);
          setPagination({
            page,
            totalPages,
            pageSize: pagination.pageSize,
          });
          setTotalResults(totalRows);
          setAllResults(totalRows);
        } else {
          setAllResults(0);
        }
      })
      .catch(() => {
        setAllResults(0);
      });
  };

  const _handleGetContent = (type) => {
    switch (type) {
      case 'content': {
        const resultColumnSchema = [...contentColumnSchema(context, imgSrcs)];
        if (isMobile) {
          resultColumnSchema.splice(1, 2);
        }
        if (path === 'file') {
          setTitle('File');
        } else {
          setTitle('Folder');
        }
        setColumnSchema(resultColumnSchema);
        break;
      }

      case 'data-room': {
        const resultColumnSchema = [...dataRoomColumnSchema(isMobile)];
        if (isMobile) {
          resultColumnSchema.splice(1, 1);
        }
        setTitle('Data Rooms');
        setColumnSchema(resultColumnSchema);
        break;
      }

      case 'link-account': {
        const resultColumnSchema = [...accountColumnSchema(isMobile)];
        if (isMobile) {
          resultColumnSchema.splice(1, 1);
        }

        setTitle('Accounts');
        setColumnSchema(resultColumnSchema);
        break;
      }

      case 'link': {
        const resultColumnSchema = [...linksColumnSchema(isMobile)];
        if (isMobile) {
          resultColumnSchema.splice(1, 2);
        }
        setTitle('Links');
        setColumnSchema(resultColumnSchema);
        break;
      }

      case 'contact': {
        const resultColumnSchema = [...columnContactSchema(isMobile)];
        if (isMobile) {
          resultColumnSchema.splice(2, 1);
        }
        setTitle('Contacts');
        setColumnSchema(resultColumnSchema);
        break;
      }

      default:
        setTitle('');
        setColumnSchema([]);
        break;
    }
  };

  useEffect(() => {
    if (keyword?.length >= 3) {
      setItems([]);
      _getData();
    }
  }, [pagination.page, pagination.pageSize, keyword]);

  useEffect(() => {
    _handleGetContent(typeSearch);
  }, [typeSearch, imgSrcs, items]);

  const _onChangePageIndex = (page) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  const _onChangePageSize = (pageSize) => {
    setPagination({
      ...pagination,
      page: 0,
      pageSize,
    });
  };
  if (items.length === 0) {
    return null;
  }

  return (
    <Stack>
      <Stack.Item>
        <div style={{ marginBottom: 20 }}>
          <CustomText styles={{ root: { fontWeight: 500, fontSize: 16 } }}>{`${title} (${totalResults})`}</CustomText>
        </div>
        <CustomDetailsList
          isPagination
          columns={columnSchema}
          items={items}
          isFullBody
          isStickyHeader={false}
          pagingOptions={{
            ...pagination,
            onChangePageIndex: _onChangePageIndex,
            onChangePageSize: _onChangePageSize,
          }}
        />
      </Stack.Item>
    </Stack>
  );
}

SearchDetail.propTypes = {
  path: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
  typeSearch: PropTypes.string.isRequired,
  setAllResults: PropTypes.func.isRequired,
};

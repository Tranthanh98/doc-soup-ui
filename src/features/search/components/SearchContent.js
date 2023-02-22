import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FontWeights, Stack } from '@fluentui/react';
import { Link } from 'react-router-dom';
import { CustomDetailsList, CustomButton, CustomText } from 'features/shared/components';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { PAGE_PATHS } from 'core/constants/Const';
import { contentColumnSchema } from './columnsSchema';

const titleStyles = {
  root: {
    fontWeight: FontWeights.semibold,
  },
};
const buttonStyles = {
  root: {
    maxHeight: 30,
    borderRadius: 2,
    padding: '5px 16px',
  },
};

const stackStyles = {
  root: {
    marginTop: '20px',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      marginTop: 0,
    },
  },
};

const buttonContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '24px',
};

function SearchContent(props) {
  const { data, keyword } = props;

  const [thumbnailSrc, setThumbnailSrc] = React.useState(
    data?.items?.filter((i) => i.isFile).map((i) => ({ id: i.id, src: null }))
  );

  const context = React.useContext(GlobalContext);
  const { getToken, isMobile } = context;

  const getFileThumbnails = () => {
    const requests = thumbnailSrc?.map((file) => {
      return new RestService()
        .setPath(`/file/${file.id}/thumb/1`)
        .setToken(getToken())
        .setResponseType('arraybuffer')
        .get();
    });

    Promise.allSettled(requests).then((values) => {
      const imgSrcs = [...thumbnailSrc];
      // eslint-disable-next-line no-restricted-syntax
      for (const res of values) {
        if (res.status === 'fulfilled') {
          const paths = res.value.config.url.split('/');
          const fileId = Number(paths[2]);

          const URL = window.URL || window.webkitURL;
          const imageUrl = URL.createObjectURL(new Blob([res.value.data], { type: 'image/jpeg', encoding: 'UTF-8' }));

          const item = imgSrcs.find((i) => i.id === fileId);

          if (item) {
            item.src = imageUrl;
          }
        }
      }

      setThumbnailSrc(imgSrcs);
    });
  };

  React.useEffect(() => {
    getFileThumbnails();
  }, []);

  const contentData = useMemo(() => {
    return [...data.items.slice(0, 5)];
  }, [data]);

  const resultColumnSchema = useMemo(() => {
    const columns = [...contentColumnSchema(context, thumbnailSrc)];
    if (isMobile) {
      columns.splice(1, 2);
    }

    return columns;
  }, [isMobile, thumbnailSrc]);

  return data.items && data.items.length > 0 ? (
    <Stack.Item disableShrink>
      <CustomText variant="mediumPlus" styles={titleStyles}>{`Content (${data.totalRows})`}</CustomText>
      <Stack styles={stackStyles}>
        <CustomDetailsList isStickyHeader={false} columns={resultColumnSchema} items={contentData} />
      </Stack>
      {data.totalRows > 5 && (
        <div style={buttonContainerStyles}>
          <Link to={{ pathname: `/${PAGE_PATHS.search}/content`, search: `?keyword=${keyword}` }}>
            <CustomButton text="Load more" title="Load more" styles={buttonStyles} />
          </Link>
        </div>
      )}
    </Stack.Item>
  ) : null;
}

SearchContent.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.oneOfType([PropTypes.array]),
    page: PropTypes.number,
    totalRows: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  keyword: PropTypes.string,
};

SearchContent.defaultProps = {
  keyword: '',
};

export default SearchContent;

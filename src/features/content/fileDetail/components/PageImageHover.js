import { Stack } from '@fluentui/react';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import LoadingIcon from 'assets/loading_gif.gif';
import PropTypes from 'prop-types';
import RestService from 'features/shared/services/restService';
import { CustomText } from 'features/shared/components';
import GlobalContext from 'security/GlobalContext';
import { debounce } from 'lodash';
import axios from 'axios';

function PageImageHover({ footer, urlGetImage, dataFooter }) {
  const context = useContext(GlobalContext);
  const _refImg = useRef();

  const cancelTokenSource = axios.CancelToken.source();

  const _handleGetThumbnail = (url) => {
    const { getToken } = context;
    new RestService()
      .setPath(url)
      .setToken(getToken())
      .setResponseType('arraybuffer')
      .setCancelToken(cancelTokenSource.token)
      .get()
      .then((response) => {
        const URL = window.URL || window.webkitURL;
        const imageUrl = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg', encoding: 'UTF-8' }));
        if (_refImg.current) {
          _refImg.current.src = imageUrl;
          _refImg.current.onload = () => {
            _refImg.current.removeAttribute('width');
            _refImg.current.removeAttribute('height');
            URL.revokeObjectURL(imageUrl);
          };
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.warn('The request is canceled');
        }
      });
  };

  const debounceLoadImage = useCallback(
    debounce((pageNum) => _handleGetThumbnail(pageNum), 1000),
    []
  );

  useEffect(() => {
    if (_refImg.current) {
      _refImg.current.src = LoadingIcon;
    }

    debounceLoadImage(urlGetImage);
  }, [urlGetImage, debounceLoadImage]);

  useEffect(() => {
    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  return (
    <>
      <Stack
        styles={{
          root: {
            padding: '14px 16px 22px',
            width: 232,
            backgroundColor: 'rgba(30, 30, 30, 0.8)',
            borderRadius: 2,
          },
        }}
      >
        <img ref={_refImg} alt="page" src={LoadingIcon} width={200} height={50} style={{ objectFit: 'contain' }} />
        {footer ? (
          <Stack.Item grow>{footer}</Stack.Item>
        ) : (
          <Stack
            horizontal
            verticalAlign="center"
            horizontalAlign="space-between"
            tokens={{ childrenGap: 8 }}
            styles={{ root: { paddingTop: 4 } }}
          >
            <Stack.Item grow={1} styles={{ root: { textAlign: 'left' } }}>
              <CustomText block variant="smallPlus" color="gray">
                {dataFooter.leftTitle}
              </CustomText>
              <CustomText block variant="mediumPlus" color="white">
                {dataFooter.leftValue}
              </CustomText>
            </Stack.Item>
            <Stack.Item grow={1} styles={{ root: { textAlign: 'right' } }}>
              <CustomText block variant="smallPlus" color="gray">
                {dataFooter.rightTitle}
              </CustomText>
              <CustomText block variant="mediumPlus" color="white">
                {dataFooter.rightValue}
              </CustomText>
            </Stack.Item>
          </Stack>
        )}
        <Stack
          styles={{
            root: {
              position: 'absolute',
              bottom: -5,
              left: '50%',
              right: '50%',
              width: 5,
              height: 5,
              marginLeft: -5,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid rgba(30, 30, 30, 0.8)',
            },
          }}
        />
      </Stack>
    </>
  );
}

PageImageHover.propTypes = {
  urlGetImage: PropTypes.string.isRequired,
  footer: PropTypes.oneOfType([PropTypes.object]),
  dataFooter: PropTypes.shape({
    leftTitle: PropTypes.string,
    leftValue: PropTypes.oneOfType([PropTypes.any]),
    rightTitle: PropTypes.string,
    rightValue: PropTypes.oneOfType([PropTypes.any]),
  }),
};

PageImageHover.defaultProps = {
  footer: undefined,
  dataFooter: {
    leftTitle: 'Page',
    leftValue: '',
    rightTitle: 'Time Spent',
    rightValue: '',
  },
};

export default PageImageHover;

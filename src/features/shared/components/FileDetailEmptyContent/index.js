import { Image, ImageFit, Stack } from '@fluentui/react';
import React from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const verticalCenter = {
  root: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 60,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      marginRight: 0,
    },
  },
};

function FileDetailEmptyContent({ imageUrl, srcSet, content, offsetHeight }) {
  const context = React.useContext(GlobalContext);
  const { isMobile } = context;

  return (
    <Stack verticalAlign="center" styles={{ root: { height: `calc(100vh - ${offsetHeight})` } }}>
      <Stack horizontal={!isMobile} verticalAlign="center" horizontalAlign="center">
        <Stack.Item styles={verticalCenter}>
          <Image
            imageFit={ImageFit.contain}
            style={{ maxHeight: '100%' }}
            src={imageUrl}
            srcSet={srcSet}
            alt="No data"
          />
        </Stack.Item>
        <Stack
          verticalAlign="center"
          horizontalAlign="center"
          styles={{ root: { selectors: { [BREAKPOINTS_RESPONSIVE.mdDown]: { marginTop: '30px !important' } } } }}
        >
          {content}
        </Stack>
      </Stack>
    </Stack>
  );
}

FileDetailEmptyContent.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.object]),
  offsetHeight: PropTypes.string,
  srcSet: PropTypes.string,
};

FileDetailEmptyContent.defaultProps = {
  content: undefined,
  offsetHeight: '0px',
  srcSet: '',
};

export default FileDetailEmptyContent;

import React from 'react';
import PropTypes from 'prop-types';
import { EmptyContent } from 'features/shared/components';

export default function EmptyContentPage(props) {
  const { onPrimaryBtnClick } = props;
  return (
    <EmptyContent
      title="No Content"
      subTitle="Upload content to start sharing!"
      imageProps={{
        src: '/img/group-105.png',
        srcSet: '/img/group-105-2x.png 2x, /img/group-105-3x.png 3x',
      }}
      primaryButtonProps={{
        iconProps: { iconName: 'pin-svg' },
        text: 'Upload',
        onClick: onPrimaryBtnClick,
      }}
    />
  );
}
EmptyContentPage.propTypes = {
  onPrimaryBtnClick: PropTypes.func,
};
EmptyContentPage.defaultProps = {
  onPrimaryBtnClick: undefined,
};

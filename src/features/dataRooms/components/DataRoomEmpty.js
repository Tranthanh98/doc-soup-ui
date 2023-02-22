import React from 'react';
import PropTypes from 'prop-types';
import { EmptyContent } from 'features/shared/components';

export default function DataRoomEmpty(props) {
  const { onPrimaryButtonClick } = props;
  return (
    <EmptyContent
      title="This Space is empty"
      subTitle="Spaces allow you to share multiple documents with a single link.
Spaces make great virtual deal rooms, customer onboarding portals,
lightweight microsites, and more."
      imageProps={{
        src: '/img/no-content.svg',
        srcSet: undefined,
        alt: 'Empty data room content',
        width: 376,
        height: 280,
      }}
      primaryButtonProps={{
        onClick: onPrimaryButtonClick,
      }}
    />
  );
}
DataRoomEmpty.propTypes = {
  onPrimaryButtonClick: PropTypes.func.isRequired,
};

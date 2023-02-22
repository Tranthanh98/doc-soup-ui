import React from 'react';
import ErrorPageComponent from './ErrorPageComponent';

export default function Page404() {
  return (
    <ErrorPageComponent
      errorTypeOption={{
        src: '/img/page-not-found.png',
        srcSet: '/img/page-not-found2x.png 2x, /img/page-not-found3x.png 3x',
        alt: 'page not found',
      }}
      errorImageOption={{
        src: '"/img/screen-pc.png"',
        srcSet: '/img/screen-pc2x.png 2x, /img/screen-pc3x.png 3x',
        alt: 'screen pc',
      }}
      guideTitle="Check the URL and try again."
    />
  );
}

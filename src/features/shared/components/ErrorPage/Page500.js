import React from 'react';
import ErrorPageComponent from './ErrorPageComponent';

export default function Page500() {
  return (
    <ErrorPageComponent
      errorTypeOption={{
        src: '/img/internalError/500-error.png',
        srcSet: '/img/internalError/500-error2x.png 2x, /img/internalError/500-error3x.png 3x',
        alt: 'internal server error',
      }}
      errorImageOption={{
        src: '/img/internalError/illust-plug.png',
        srcSet: '/img/internalError/illust-plug2x.png 2x, /img/internalError/illust-plug3x.png 3x',
        alt: '500 error',
      }}
      guideTitle="It's our problem. I'll fix it soon."
    />
  );
}

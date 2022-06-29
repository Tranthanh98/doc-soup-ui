import React from 'react';
import { Stack, Image, ImageFit, ProgressIndicator } from '@fluentui/react';

const progressStyles = {
  root: {
    width: 120,
  },
  progressBar: {
    background: '#f79f1a',
  },
};

export default function LoadingPage() {
  return (
    <Stack
      verticalAlign="center"
      horizontalAlign="center"
      tokens={{ childrenGap: 16 }}
      styles={{ root: { height: '100vh' } }}
    >
      <Image
        imageFit={ImageFit.contain}
        loading="eager"
        shouldStartVisible
        src="/img/logo-black.png"
        srcSet="/img/logo2x-black.png 2x, /img/logo3x-black.png 3x"
        alt="Logo"
        width={200}
        height={52}
      />
      <ProgressIndicator styles={progressStyles} label="" description="" barHeight={2} />
    </Stack>
  );
}

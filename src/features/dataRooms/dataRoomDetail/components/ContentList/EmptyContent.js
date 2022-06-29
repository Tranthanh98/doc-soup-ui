import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, FontWeights, Image, ImageFit, FontSizes } from '@fluentui/react';
import { CustomButton } from 'features/shared/components';

const stackWrapperStyles = {
  root: {
    minHeight: '72vh',
  },
};

const boldText = {
  root: {
    fontWeight: FontWeights.bold,
  },
};

const subTextStyles = {
  root: {
    maxWidth: 442,
    textAlign: 'center',
    marginBottom: 30,
  },
};

const primaryBtnStyles = {
  root: {
    height: 44,
  },
  label: {
    fontSize: FontSizes.size16,
  },
  icon: {
    width: 26,
    height: 26,
  },
};

export default function EmptyContent(props) {
  const { imageProps, title, subTitle, primaryButtonProps } = props;
  return (
    <Stack grow horizontalAlign="center" verticalAlign="center" tokens={{ childrenGap: 8 }} styles={stackWrapperStyles}>
      <Image
        imageFit={ImageFit.contain}
        src="/img/empty-img.png"
        srcSet="/img/empty-img2x.png 2x, /img/empty-img3x.png 3x"
        alt="Empty"
        height={266}
        {...imageProps}
        styles={{
          root: {
            ...imageProps?.styles?.root,
            width: '100%',
            minWidth: 'auto',
            maxWidth: 439,
          },
        }}
      />
      <br />
      <Text block variant="xLarge" styles={boldText}>
        {title}
      </Text>
      <Text block variant="mediumPlus" styles={subTextStyles}>
        {subTitle}
      </Text>
      {primaryButtonProps && (
        <CustomButton
          primary
          size="large"
          iconProps={{ iconName: 'plus-svg' }}
          text="Add content"
          styles={primaryBtnStyles}
          {...primaryButtonProps}
        />
      )}
    </Stack>
  );
}
EmptyContent.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  imageProps: PropTypes.shape({
    src: PropTypes.string,
    srcSet: PropTypes.string,
    alt: PropTypes.string,
    styles: PropTypes.instanceOf(Object),
  }),
  primaryButtonProps: PropTypes.oneOfType([PropTypes.object]),
};
EmptyContent.defaultProps = {
  title: 'No Content',
  subTitle: 'You have not created any content yet.',
  imageProps: undefined,
  primaryButtonProps: undefined,
};

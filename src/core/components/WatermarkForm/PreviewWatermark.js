import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const previewWatermarkStyles = (theme) => ({
  root: {
    background: theme.palette.neutralLight,
    width: '100%',
    margin: 'auto',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '100%',
    },
  },
});
const previewPaperStyles = (theme, imageUrl) => ({
  root: {
    width: 240,
    height: 240,
    background: theme.palette.white,
    border: `2px solid ${theme.palette.neutralLight}`,
    backgroundImage: `url(${imageUrl || 'url(/img/background-watermark.png)'})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    overflow: 'hidden',
  },
});
const textStyles = (props) => ({
  root: {
    overflow: 'hidden',
    fontSize: props.fontSize?.key,
    color: props.fontColor.color,
    opacity: props.transparency?.key,
    transform: `rotate(-${props.rotation?.key}deg)`,
    ...props.position.styles[props.rotation?.key],
  },
});

export default function PreviewWatermark(props) {
  const { theme, options, imageUrl } = props;
  const { text, position, fontSize, fontColor, rotation, transparency } = options;
  return (
    <Stack horizontal horizontalAlign="center" styles={previewWatermarkStyles(theme)}>
      <Stack
        align="stretch"
        verticalAlign={position.vertical}
        horizontalAlign={position.horizontal}
        styles={previewPaperStyles(theme, imageUrl)}
      >
        <Text block styles={textStyles({ fontSize, fontColor, rotation, transparency, position })}>
          {text}
        </Text>
      </Stack>
    </Stack>
  );
}
PreviewWatermark.propTypes = {
  theme: PropTypes.oneOfType([PropTypes.object]).isRequired,
  imageUrl: PropTypes.string,
  options: PropTypes.shape({
    text: PropTypes.string,
    position: PropTypes.oneOfType([PropTypes.object]),
    fontSize: PropTypes.oneOfType([PropTypes.object]),
    fontColor: PropTypes.oneOfType([PropTypes.object]),
    rotation: PropTypes.oneOfType([PropTypes.object]),
    transparency: PropTypes.oneOfType([PropTypes.object]),
  }).isRequired,
};

PreviewWatermark.defaultProps = {
  imageUrl: 'url(/img/background-watermark.png)',
};

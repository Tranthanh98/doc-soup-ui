import React from 'react';
import PropTypes from 'prop-types';
import { TooltipHost, Stack } from '@fluentui/react';

const liveBadgeStyles = (level, opacity) => {
  const liveBadge = {
    color: 'transparent',
    padding: 3,
    borderRadius: '50%',
  };
  const size = 8 + 6 * level;
  return {
    root: {
      ...liveBadge,
      width: size,
      height: size,
      background: `rgba(12, 188, 130, ${opacity})`,
    },
  };
};
const renderLiveViewingTooltip = () => (
  <Stack tokens={{ padding: 8 }}>
    <span>This is a currently active visit.</span>
    <span>Open the stats to view it live.</span>
  </Stack>
);

export default function LiveBadge(props) {
  const { tooltipProps, isShowTooltip } = props;
  const liveBadge = (
    <Stack.Item styles={liveBadgeStyles(2, 0.1)}>
      <Stack.Item styles={liveBadgeStyles(1, 0.2)}>
        <Stack.Item styles={liveBadgeStyles(0, 1)}>.</Stack.Item>
      </Stack.Item>
    </Stack.Item>
  );
  if (isShowTooltip) {
    return (
      <TooltipHost tooltipProps={{ onRenderContent: renderLiveViewingTooltip }} {...tooltipProps}>
        {liveBadge}
      </TooltipHost>
    );
  }
  return liveBadge;
}
LiveBadge.propTypes = {
  tooltipProps: PropTypes.oneOfType([PropTypes.object]),
  isShowTooltip: PropTypes.bool,
};
LiveBadge.defaultProps = {
  tooltipProps: undefined,
  isShowTooltip: false,
};

import React from 'react';
import PropTypes from 'prop-types';
import { LIGHT_THEME } from 'core/constants/Theme';

export default function CircleProgress(props) {
  const { percent, lineColor } = props;
  const raidus = 10.7;
  const pathD = `M15.5 3.5 a ${raidus} ${raidus} 0 0 1 0 ${raidus * 2} a ${raidus} ${raidus} 0 0 1 0 -${raidus * 2}`;
  const cir = 2 * raidus * Math.PI;
  const calculatedPercentValue = cir - (cir * percent) / 100;
  return (
    <svg width="30" height="30" view-box="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <path style={{ fill: 'none', stroke: LIGHT_THEME.semanticColors.bodyDivider }} d={pathD} strokeWidth="7" />
      <path
        style={{
          fill: 'none',
          strokeDasharray: `${cir}, ${cir}`,
          strokeDashoffset: calculatedPercentValue,
        }}
        fillOpacity="0"
        stroke={lineColor}
        d={pathD}
        strokeWidth="7"
      />
    </svg>
  );
}
CircleProgress.propTypes = {
  percent: PropTypes.number.isRequired,
  lineColor: PropTypes.string,
};
CircleProgress.defaultProps = {
  lineColor: '#0078d4',
};

import React from 'react';
import PropTypes from 'prop-types';

export default function AnalyticCircleProgress(props) {
  const { percent, valueDisplay, lineColor, label, width, height, pathPosition, strokeWidth } = props;
  return (
    <div className="progress-chart" style={{ width, height }}>
      <svg viewBox={`0 0 ${pathPosition.lViewBox} ${pathPosition.rViewBox}`}>
        <path
          className="circle-bg"
          d={`M${pathPosition.px} ${pathPosition.py}
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831`}
          strokeWidth={strokeWidth}
        />
        <path
          className="circle"
          strokeDasharray={`${percent}, 100`}
          stroke={lineColor}
          d={`M${pathPosition.px} ${pathPosition.py}
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831`}
          strokeWidth={strokeWidth}
        />
        <text x="16" y="21.4" className="percentageValue">
          {valueDisplay}
        </text>
        {valueDisplay ? (
          <text x="27" y="21.4" className="percentage">
            %
          </text>
        ) : null}
      </svg>
      <span className="label">{label}</span>
    </div>
  );
}
AnalyticCircleProgress.propTypes = {
  percent: PropTypes.number.isRequired,
  valueDisplay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lineColor: PropTypes.string,
  label: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pathPosition: PropTypes.oneOfType([PropTypes.object]),
  strokeWidth: PropTypes.number,
};
AnalyticCircleProgress.defaultProps = {
  lineColor: '#0078d4',
  label: '',
  width: 72,
  height: 72,
  valueDisplay: undefined,
  pathPosition: {
    lViewBox: 37,
    rViewBox: 37,
    px: 18,
    py: 2.0845,
  },
  strokeWidth: 4.5,
};

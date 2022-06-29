import { IconButton, Stack, Text } from '@fluentui/react';
import { LIGHT_THEME } from 'core/constants/Theme';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TIME_VALUES } from 'core/constants/Const';

const btnControlStyles = {
  root: { width: 42, height: 16 },
  icon: {
    width: 18,
    height: 12,
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center',
    fill: LIGHT_THEME.palette.grayLightSecondary,
  },
};

const txtLabelStyle = {
  root: {
    fontSize: 16,
    fontWeight: '500',
    width: 42,
    height: 32,
    backgroundColor: LIGHT_THEME.palette.themePrimary,
    color: 'white',
    borderRadius: 2,
    margin: '4px 0px !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function ControlTime(props) {
  const [timeUnit, setTimeUnit] = useState('');

  const { hours, time, isToday, onChangeTimeValue } = props;

  const _getTimeUnit = () => {
    setTimeUnit(hours ? time.substring(0, time.indexOf(':')) : time.substring(time.indexOf(':') + 1));
  };

  const _increaseTime = () => {
    let timeValue = Number(timeUnit);

    let refreshValue = isToday ? new Date().getHours() : TIME_VALUES.MIN_HOURS_IN_DAY;

    if (hours) {
      timeValue = timeValue >= TIME_VALUES.MAX_HOURS_IN_DAY ? refreshValue : timeValue + 1;
    } else if (isToday && Number(time.substring(0, time.indexOf(':'))) === refreshValue) {
      refreshValue = new Date().getMinutes();
      timeValue = timeValue >= TIME_VALUES.MAX_MINUTES_IN_HOUR ? refreshValue : timeValue + 1;
    } else {
      timeValue = timeValue >= TIME_VALUES.MAX_MINUTES_IN_HOUR ? TIME_VALUES.MIN_MINUTES_IN_HOUR : timeValue + 1;
    }

    onChangeTimeValue(timeValue, hours);
  };

  const _reducedTime = () => {
    let timeValue = Number(timeUnit);

    let refreshValue = isToday ? new Date().getHours() : TIME_VALUES.MIN_HOURS_IN_DAY;

    if (hours) {
      timeValue = timeValue <= refreshValue ? TIME_VALUES.MAX_HOURS_IN_DAY : timeValue - 1;
    } else if (isToday && Number(time.substring(0, time.indexOf(':'))) === refreshValue) {
      refreshValue = new Date().getMinutes();
      timeValue = timeValue <= refreshValue ? TIME_VALUES.MAX_MINUTES_IN_HOUR : timeValue - 1;
    } else {
      timeValue = timeValue <= TIME_VALUES.MIN_MINUTES_IN_HOUR ? TIME_VALUES.MAX_MINUTES_IN_HOUR : timeValue - 1;
    }

    onChangeTimeValue(timeValue, hours);
  };

  useEffect(() => {
    _getTimeUnit();
  }, [time]);

  return (
    <Stack>
      <IconButton
        iconProps={{ iconName: 'chevron-up-svg' }}
        styles={btnControlStyles}
        onClick={() => _increaseTime()}
      />
      <Text styles={txtLabelStyle}>{timeUnit}</Text>
      <IconButton
        iconProps={{ iconName: 'chevron-down-svg' }}
        styles={btnControlStyles}
        onClick={() => _reducedTime()}
      />
    </Stack>
  );
}
ControlTime.propTypes = {
  hours: PropTypes.bool,
  time: PropTypes.string.isRequired,
  isToday: PropTypes.bool.isRequired,
  onChangeTimeValue: PropTypes.func,
};
ControlTime.defaultProps = {
  hours: false,
  onChangeTimeValue: undefined,
};

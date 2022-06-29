import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Callout, Icon, mergeStyleSets, Stack, Text } from '@fluentui/react';
import { CustomButton } from 'features/shared/components';
import { LIGHT_THEME } from 'core/constants/Theme';
import ControlTime from './ControlTime';

const classNames = mergeStyleSets({
  iconTime: {
    paddingLeft: 6,
    display: 'flex',
    alignItems: 'center',
  },
});

const btnTimePickerStyles = (time) => {
  return {
    root: {
      width: 116,
      height: 30,
      padding: '0px 4px',
      display: 'flex',
      justifyContent: 'flex-start',
      '&:active': {
        paddingRight: 0,
      },
    },
    rootHovered: {
      border: '1px solid black',
    },
    rootFocused: {
      border: `2px solid ${LIGHT_THEME.palette.themePrimary}`,
    },
    label: {
      fontSize: 14,
      fontWeight: '400',
      letterSpacing: -0.5,
      color: time ? LIGHT_THEME.palette.neutralPrimary : LIGHT_THEME.palette.silver,
      fontFamily: 'SourceHanSansKR',
    },
    labelHovered: { color: time ? LIGHT_THEME.palette.neutralPrimary : LIGHT_THEME.palette.silver },
    labelDisabled: {
      fontSize: 14,
      fontWeight: '500',
      letterSpacing: -0.5,
      fontFamily: 'SourceHanSansKR',
    },
  };
};

const headerStyle = {
  root: { padding: 10, paddingBottom: 6 },
};

const controlTimeStyle = {
  root: { padding: 12, paddingTop: 0, paddingBottom: 8 },
};

const doubleDotStyle = {
  root: {
    fontFamily: 'NotoSansCJKkr',
    fontSize: 25,
    fontWeight: '500',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1,
    letterSpacing: -0.5,
    textAlign: 'center',
    color: LIGHT_THEME.palette.neutralSecondaryAlt,
  },
};

const calloutTimeModelStyle = {
  root: {
    width: 140,
    border: `1px solid ${LIGHT_THEME.palette.neutralQuaternaryAlt}`,
    backgroundColor: 'white',
    boxShadow: 'none',
  },
};

const textHeaderStyle = {
  root: {
    fontFamily: 'SourceHanSansKR',
    fontSize: 13,
    fontWeight: 'normal',
    letterSpacing: -0.5,
    color: LIGHT_THEME.palette.neutralPrimary,
  },
};

export default function TimePickerCustom(props) {
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);
  const [time, setTime] = useState(undefined);
  const [isToday, setIsToday] = useState(false);
  const { selectedDate, disabled, placeholder, onSelectTime, expireTime, formatTime } = props;

  const _getTime = () => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      const hoursValue = `0${date.getHours()}`.slice(-2);
      const minutesValue = `0${date.getMinutes()}`.slice(-2);
      setTime(`${hoursValue}:${minutesValue}`);
    }
  };

  const _changeSelectDate = () => {
    const date = new Date(selectedDate);
    const today = new Date();

    const isTodayCheck =
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate();
    const hoursTodayValue = `0${today.getHours()}`.slice(-2);
    const minutesTodayValue = `0${today.getMinutes()}`.slice(-2);
    const hoursDateValue = `0${date.getHours()}`.slice(-2);
    const minutesDateValue = `0${date.getMinutes()}`.slice(-2);

    const timeValues = isTodayCheck
      ? `${hoursTodayValue}:${minutesTodayValue}`
      : `${hoursDateValue}:${minutesDateValue}`;

    setTime(timeValues);
    setIsToday(isTodayCheck);
  };

  useEffect(() => {
    _getTime();
  });

  useEffect(() => {
    _changeSelectDate();
  }, [selectedDate]);

  useEffect(() => {
    setTime(expireTime);
  }, [expireTime]);

  const _changeTimeValue = (value, hours) => {
    const resultValue = `0${value}`.slice(-2);
    setTime(
      hours
        ? `${resultValue}:${time.substring(time.indexOf(':') + 1)}`
        : `${time.substring(0, time.indexOf(':'))}:${resultValue}`
    );
    onSelectTime(
      hours
        ? `${resultValue}:${time.substring(time.indexOf(':') + 1)}`
        : `${time.substring(0, time.indexOf(':'))}:${resultValue}`
    );
  };

  const _toggleCallOutSelectTimeVisible = (calloutVisible = false) => {
    setIsCalloutVisible(calloutVisible);
  };

  return (
    <Stack horizontal verticalAlign="center" styles={{ root: { marginTop: 16 } }}>
      <CustomButton
        id="time-picker-button"
        onClick={() => _toggleCallOutSelectTimeVisible(true)}
        text={formatTime(selectedDate) || placeholder}
        disabled={disabled}
        styles={btnTimePickerStyles(time)}
      />
      <Icon
        iconName="time-svg"
        className={classNames.iconTime}
        styles={{ root: { stroke: LIGHT_THEME.palette.black, opacity: disabled ? 0.4 : 1 } }}
      />
      {isCalloutVisible && (
        <Callout
          onDismiss={() => _toggleCallOutSelectTimeVisible()}
          target="#time-picker-button"
          gapSpace={3}
          isBeakVisible={false}
          styles={calloutTimeModelStyle}
        >
          <Stack horizontal horizontalAlign="space-between" styles={headerStyle}>
            <Text styles={textHeaderStyle}>Hours</Text>
            <Text styles={textHeaderStyle}>Minutes</Text>
          </Stack>
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center" styles={controlTimeStyle}>
            <ControlTime hours time={time} onChangeTimeValue={_changeTimeValue} isToday={isToday} />
            <Text styles={doubleDotStyle}>:</Text>
            <ControlTime time={time} onChangeTimeValue={_changeTimeValue} isToday={isToday} />
          </Stack>
        </Callout>
      )}
    </Stack>
  );
}
TimePickerCustom.propTypes = {
  selectedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onSelectTime: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  expireTime: PropTypes.string,
  formatTime: PropTypes.func,
};
TimePickerCustom.defaultProps = {
  selectedDate: undefined,
  expireTime: undefined,
  disabled: true,
  placeholder: 'Select a time...',
  formatTime: undefined,
};

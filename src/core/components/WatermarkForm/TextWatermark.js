import React from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField, PrimaryButton } from '@fluentui/react';
import { WATERMARK_SETTINGS } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const watermarkTagBtnStyles = (theme) => {
  return {
    root: {
      height: 30,
      minWidth: 'auto',
      padding: '9px 16px',
      background: theme.palette.themeLighterAlt,
      color: theme.palette.neutralSecondaryAlt,
      borderRadius: 2,
    },
    label: {
      margin: 0,
      fontSize: theme.fonts.small.fontSize,
    },
  };
};

const textFieldStyles = (isEditWatermark) => ({
  fieldGroup: { height: 40 },
  subComponentStyles: {
    label: {
      root: {
        color: 'inherit',
        fontSize: 14,
        fontWeight: 'normal',
        [BREAKPOINTS_RESPONSIVE.lgUp]: !isEditWatermark
          ? {
              position: 'absolute',
              width: 150,
              left: -150,
              display: 'flex',
              justifyContent: 'flex-end',
              paddingRight: 24,
            }
          : null,
      },
    },
  },
});

const textWatermarkStyles = {
  root: {
    width: 390,
    margin: `auto`,
    position: 'relative',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '100%',
    },
  },
};
export default function TextWatermark(props) {
  const { onChange, onChangeFormatTag, theme, tag, isEditWatermark } = props;
  return (
    <Stack tokens={{ childrenGap: 8 }} styles={textWatermarkStyles}>
      <TextField
        autoFocus
        label="Text"
        name="text"
        styles={textFieldStyles(isEditWatermark)}
        value={tag}
        onChange={onChange}
      />
      <Stack wrap horizontal tokens={{ childrenGap: 8 }}>
        {WATERMARK_SETTINGS.formatTags.map((tag, index) => (
          <PrimaryButton
            key={index}
            styles={watermarkTagBtnStyles(theme)}
            text={tag}
            onClick={() => onChangeFormatTag(tag)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
TextWatermark.propTypes = {
  tag: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onChangeFormatTag: PropTypes.func.isRequired,
  isEditWatermark: PropTypes.bool,
};
TextWatermark.defaultProps = {
  tag: '',
  isEditWatermark: false,
};

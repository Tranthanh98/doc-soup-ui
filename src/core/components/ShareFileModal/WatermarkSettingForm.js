/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ThemeContext,
  Stack,
  Label,
  Checkbox,
  Dropdown,
  MessageBar,
  MessageBarType,
  ResponsiveMode,
  FontWeights,
} from '@fluentui/react';
import WatermarkBiz from 'core/biz/WatermarkBiz';
import { DropDownColorPicker } from 'features/shared/components';
import { WATERMARK_SETTINGS } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import FormShimmer from 'core/components/WatermarkForm/FormShimmer';
import PreviewWatermark from 'core/components/WatermarkForm/PreviewWatermark';
import TextWatermark from 'core/components/WatermarkForm/TextWatermark';
import SubmitButton from 'core/components/WatermarkForm/SubmitButton';

const labelStyles = {
  root: {
    fontWeight: 'normal',
    letterSpacing: -0.5,
    [BREAKPOINTS_RESPONSIVE.lgUp]: {
      fontSize: 13,
      fontWeight: FontWeights.semibold,
      color: '#6c6c6c',
    },
  },
};

const dropdownWatermarkStyle = {
  root: {
    width: '100%',
    position: 'relative',
  },
  label: {
    ...labelStyles.root,
  },
};

const responsiveStyles = {
  root: {
    flexFlow: 'row nowrap',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      flexFlow: 'column nowrap',
    },
  },
};

const itemStyles = {
  root: {
    width: '100%',
    marginLeft: '12px !important',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      marginLeft: '0px !important',
      marginTop: '12px',
    },
  },
  label: {
    ...labelStyles.root,
  },
};

class WatermarkSettingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      status: false,
      text: WatermarkBiz.getPreviewWatermarkText(WATERMARK_SETTINGS.formatTags.reduce((total, tag) => total + tag, '')),
      tag: WATERMARK_SETTINGS.formatTags.reduce((total, tag) => total + tag, ''),
      fontSize: WATERMARK_SETTINGS.fontSizeOptions[0],
      fontColor: WATERMARK_SETTINGS.fontColors[14],
      position: WATERMARK_SETTINGS.positionOptions[0],
      rotation: WATERMARK_SETTINGS.rotationOptions[0],
      transparency: WATERMARK_SETTINGS.transparencyOptions[0],
      isTiled: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultWatermark !== state.defaultWatermark && props.defaultWatermark.id) {
      const { defaultWatermark } = props;
      const result = {
        defaultWatermark: props.defaultWatermark,
        text: defaultWatermark.text,
        fontSize: WATERMARK_SETTINGS.fontSizeOptions.find((e) => e.key === defaultWatermark.size),
        fontColor: WATERMARK_SETTINGS.fontColors.find((e) => e.color === defaultWatermark.color),
        position: WATERMARK_SETTINGS.positionOptions.find((e) => e.key === defaultWatermark.align),
        rotation: WATERMARK_SETTINGS.rotationOptions.find((e) => e.key === defaultWatermark.rotate),
        transparency: WATERMARK_SETTINGS.transparencyOptions.find((e) => e.key === defaultWatermark.opacity),
        isTiled: defaultWatermark.isTiled,
      };

      if (defaultWatermark.tag !== undefined) {
        result.tag = defaultWatermark.tag;
      }

      return result;
    }
    return null;
  }

  _changeSubmitValues = (name, value) => {
    const { onChangeValues } = this.props;
    const { defaultWatermark, text, fontSize, fontColor, position, rotation, transparency, isTiled, tag } = this.state;
    const values = {
      ...defaultWatermark,
      type: WATERMARK_SETTINGS.type.TEXT,
      opacity: transparency.key,
      align: position.key,
      rotate: rotation.key,
      text,
      tag,
      size: fontSize.key,
      color: fontColor.color,
      isTiled,
      [name]: value,
    };
    if (onChangeValues) {
      onChangeValues(values);
    }
  };

  _changeTextAndTagInSubmitValues = (tag, text) => {
    const { onChangeValues } = this.props;
    const { defaultWatermark } = this.state;
    const values = {
      ...defaultWatermark,
      tag,
      text,
    };
    if (onChangeValues) {
      onChangeValues(values);
    }
  };

  _handleInputChange = (event, value) => {
    const name = event.target.name || event.target.getAttribute('name');
    if (name === 'text') {
      const newText = WatermarkBiz.getPreviewWatermarkText(value);
      this._changeTextAndTagInSubmitValues(value, newText);
      this.setState({ text: newText, tag: value });
    } else {
      this.setState({ [name]: value });
      this._changeSubmitValues(name, value);
    }
  };

  _handleFontColorChange = (fontColor) => {
    this.setState({ fontColor });
    this._changeSubmitValues('fontColor', fontColor);
  };

  _addTagFormat = (tag) => {
    this.setState((state) => {
      const newText = WatermarkBiz.getPreviewWatermarkText(state.tag + tag);
      this._changeTextAndTagInSubmitValues(state.tag + tag, newText);
      return {
        text: newText,
        tag: state.tag + tag,
      };
    });
  };

  _setSubmitting = (isSubmitting) => {
    this.setState({ isSubmitting });
  };

  _setStatus = (status) => {
    this.setState({ status });
  };

  _submitWatermark = (event) => {
    const { onSubmit } = this.props;
    const { defaultWatermark, text, fontSize, fontColor, position, rotation, transparency, isTiled, tag } = this.state;
    const values = {
      ...defaultWatermark,
      type: WATERMARK_SETTINGS.type.TEXT,
      opacity: transparency.key,
      align: position.key,
      rotate: rotation.key,
      text,
      tag,
      size: fontSize.key,
      color: fontColor.color,
      isTiled,
    };
    event.preventDefault();
    this._setSubmitting(true);
    this._setStatus(undefined);
    onSubmit(values, { setSubmitting: this._setSubmitting, setStatus: this._setStatus });
  };

  render() {
    const { status } = this.state;
    const { isEditWatermark, onCancel, imageUrl } = this.props;
    const { isSubmitting, text, fontSize, fontColor, position, rotation, transparency, isTiled, tag } = this.state;
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <FormShimmer {...this.props}>
            <form onSubmit={this._submitWatermark}>
              <Stack tokens={{ childrenGap: 12 }}>
                <Stack>
                  <PreviewWatermark
                    theme={theme}
                    options={{ text, position, fontSize, fontColor, rotation, transparency }}
                    imageUrl={imageUrl}
                  />
                </Stack>
                <Stack>
                  <TextWatermark
                    theme={theme}
                    tag={tag}
                    text={text}
                    onChange={this._handleInputChange}
                    onChangeFormatTag={this._addTagFormat}
                    isEditWatermark={isEditWatermark}
                  />
                </Stack>
                <Stack horizontal horizontalAlign="start">
                  <Checkbox
                    label="Tiled"
                    name="isTiled"
                    checked={isTiled}
                    onChange={this._handleInputChange}
                    styles={{ root: { marginTop: 8 } }}
                  />
                </Stack>
                <Stack horizontal styles={responsiveStyles}>
                  <Dropdown
                    placeholder="Select an option"
                    label="Font Size"
                    name="fontSize"
                    options={WATERMARK_SETTINGS.fontSizeOptions}
                    selectedKey={fontSize ? fontSize.key : undefined}
                    onChange={this._handleInputChange}
                    responsiveMode={ResponsiveMode.unknown}
                    styles={dropdownWatermarkStyle}
                  />
                  <Stack.Item styles={itemStyles}>
                    <Label styles={labelStyles}>Font color</Label>
                    <DropDownColorPicker
                      colors={WATERMARK_SETTINGS.fontColors}
                      selectedColor={fontColor}
                      onChangeColor={this._handleFontColorChange}
                    />
                  </Stack.Item>
                </Stack>
                <Stack horizontal styles={responsiveStyles}>
                  <Dropdown
                    placeholder="Select an option"
                    label="Rotation"
                    name="rotation"
                    options={WATERMARK_SETTINGS.rotationOptions}
                    selectedKey={rotation ? rotation.key : undefined}
                    onChange={this._handleInputChange}
                    responsiveMode={ResponsiveMode.unknown}
                    styles={dropdownWatermarkStyle}
                  />
                  <Dropdown
                    placeholder="Select an option"
                    label="Position"
                    name="position"
                    options={WATERMARK_SETTINGS.positionOptions}
                    selectedKey={position ? position.key : undefined}
                    disabled={isTiled}
                    onChange={this._handleInputChange}
                    responsiveMode={ResponsiveMode.unknown}
                    styles={itemStyles}
                  />
                </Stack>
                <Stack styles={{ root: { marginBottom: 12 } }}>
                  <Dropdown
                    placeholder="Select an option"
                    label="Transparency"
                    name="transparency"
                    options={WATERMARK_SETTINGS.transparencyOptions}
                    selectedKey={transparency ? transparency.key : undefined}
                    onChange={this._handleInputChange}
                    responsiveMode={ResponsiveMode.unknown}
                    styles={dropdownWatermarkStyle}
                  />
                </Stack>
                {status && (
                  <>
                    <MessageBar messageBarType={MessageBarType.success} isMultiline={false}>
                      Change watermark successfully!.
                    </MessageBar>
                  </>
                )}
                <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 12 }}>
                  <SubmitButton rightSubmitButton isSubmitting={isSubmitting} onCancel={onCancel} />
                </Stack>
              </Stack>
            </form>
          </FormShimmer>
        )}
      </ThemeContext.Consumer>
    );
  }
}

WatermarkSettingForm.propTypes = {
  onSubmit: PropTypes.func,
  defaultWatermark: PropTypes.shape({
    id: PropTypes.number,
    opacity: PropTypes.number,
    align: PropTypes.string,
    rotate: PropTypes.number,
    text: PropTypes.string,
    tag: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    isTiled: PropTypes.bool,
  }).isRequired,
  onCancel: PropTypes.func,
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChangeValues: PropTypes.func,
  isEditWatermark: PropTypes.bool,
  imageUrl: PropTypes.string,
};

WatermarkSettingForm.defaultProps = {
  onSubmit: () => {},
  onCancel: undefined,
  minWidth: undefined,
  onChangeValues: undefined,
  isEditWatermark: false,
  imageUrl: 'url(/img/background-watermark.png)',
};
export default WatermarkSettingForm;

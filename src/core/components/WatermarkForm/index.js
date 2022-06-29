/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext, Stack, Label, Text, Checkbox, Dropdown, MessageBar, MessageBarType } from '@fluentui/react';
import WatermarkBiz from 'core/biz/WatermarkBiz';
import { DropDownColorPicker } from 'features/shared/components';
import { WATERMARK_SETTINGS } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import PreviewWatermark from './PreviewWatermark';
import TextWatermark from './TextWatermark';
import SubmitButton from './SubmitButton';
import FormShimmer from './FormShimmer';

const inputWatermarkStyle = {
  root: {
    width: 390,
    margin: `auto`,
    position: 'relative',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '100%',
    },
  },
};

const labelWatermarkStyle = {
  root: {
    color: 'inherit',
    fontSize: 14,
    fontWeight: 'normal',
    [BREAKPOINTS_RESPONSIVE.lgUp]: {
      position: 'absolute',
      width: 150,
      left: -150,
      display: 'flex',
      justifyContent: 'flex-end',
      paddingRight: 24,
    },
  },
};

const dropdownWatermarkStyle = {
  ...inputWatermarkStyle,
  subComponentStyles: {
    label: {
      ...labelWatermarkStyle,
    },
  },
};

const checkboxTiledStyle = {
  root: {
    width: 390,
    margin: 'auto',
  },
};
class WatermarkForm extends Component {
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

  /**
   * render option component (text/ color/ fontSize/ position, ...)
   * @param {string} option
   */
  _renderSettingOptions = (option, theme, isEditWatermark = false) => {
    const { rightSubmitButton, onCancel, imageUrl } = this.props;
    const { isSubmitting, text, fontSize, fontColor, position, rotation, transparency, isTiled, tag } = this.state;
    switch (option) {
      case 'preview':
        return (
          <PreviewWatermark
            theme={theme}
            options={{ text, position, fontSize, fontColor, rotation, transparency }}
            imageUrl={imageUrl}
          />
        );
      case 'text':
        return (
          <TextWatermark
            theme={theme}
            tag={tag}
            text={text}
            onChange={this._handleInputChange}
            onChangeFormatTag={this._addTagFormat}
            isEditWatermark={isEditWatermark}
          />
        );
      case 'fontSize':
        return (
          <Dropdown
            placeholder="Select an option"
            label="Font size"
            name="fontSize"
            options={WATERMARK_SETTINGS.fontSizeOptions}
            selectedKey={fontSize ? fontSize.key : undefined}
            onChange={this._handleInputChange}
            styles={dropdownWatermarkStyle}
          />
        );
      case 'fontColor':
        return (
          <Stack.Item styles={inputWatermarkStyle}>
            <Label styles={labelWatermarkStyle}>Font color</Label>
            <DropDownColorPicker
              colors={WATERMARK_SETTINGS.fontColors}
              selectedColor={fontColor}
              onChangeColor={this._handleFontColorChange}
            />
          </Stack.Item>
        );
      case 'position':
        return (
          <Dropdown
            placeholder="Select an option"
            label="Position"
            name="position"
            options={WATERMARK_SETTINGS.positionOptions}
            selectedKey={position ? position.key : undefined}
            disabled={isTiled}
            onChange={this._handleInputChange}
            styles={dropdownWatermarkStyle}
          />
        );
      case 'rotation':
        return (
          <Dropdown
            placeholder="Select an option"
            label="Rotation"
            name="rotation"
            options={WATERMARK_SETTINGS.rotationOptions}
            selectedKey={rotation ? rotation.key : undefined}
            onChange={this._handleInputChange}
            styles={dropdownWatermarkStyle}
          />
        );
      case 'tiled':
        return (
          <Checkbox
            label="Tiled"
            name="isTiled"
            checked={isTiled}
            onChange={this._handleInputChange}
            styles={checkboxTiledStyle}
          />
        );
      case 'transparency':
        return (
          <Dropdown
            placeholder="Select an option"
            label="Transparency"
            name="transparency"
            options={WATERMARK_SETTINGS.transparencyOptions}
            selectedKey={transparency ? transparency.key : undefined}
            onChange={this._handleInputChange}
            styles={dropdownWatermarkStyle}
          />
        );
      case 'summary':
        return (
          <Text
            variant="smallPlus"
            styles={checkboxTiledStyle}
          >{`${position.text}, ${rotation.text}, ${fontSize.text}, ${transparency.text}`}</Text>
        );
      case 'submitButton':
        return <SubmitButton rightSubmitButton={rightSubmitButton} isSubmitting={isSubmitting} onCancel={onCancel} />;
      default:
        return null;
    }
  };

  render() {
    const { status } = this.state;
    const { settingOptionsSchema, isEditWatermark } = this.props;
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <FormShimmer {...this.props}>
            <form onSubmit={this._submitWatermark}>
              <Stack tokens={{ childrenGap: 16 }}>
                {settingOptionsSchema.map((option, index) => {
                  if (typeof option === 'string') {
                    return (
                      <React.Fragment key={index}>
                        {this._renderSettingOptions(option, theme, isEditWatermark)}
                      </React.Fragment>
                    );
                  }
                  if (typeof option === 'object') {
                    return (
                      <Stack horizontal tokens={{ childrenGap: 16 }} key={index}>
                        {option.map((item, index) => (
                          <Stack.Item grow key={index} styles={{ root: { width: '50%' } }}>
                            {this._renderSettingOptions(item, theme)}
                          </Stack.Item>
                        ))}
                      </Stack>
                    );
                  }
                  return null;
                })}
                {status && (
                  <>
                    <MessageBar messageBarType={MessageBarType.success} isMultiline={false}>
                      Change watermark successfully!.
                    </MessageBar>
                    <br />
                  </>
                )}
              </Stack>
            </form>
          </FormShimmer>
        )}
      </ThemeContext.Consumer>
    );
  }
}
WatermarkForm.propTypes = {
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
  rightSubmitButton: PropTypes.bool,
  onCancel: PropTypes.func,
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChangeValues: PropTypes.func,
  settingOptionsSchema: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])),
  isEditWatermark: PropTypes.bool,
  imageUrl: PropTypes.string,
};
WatermarkForm.defaultProps = {
  rightSubmitButton: false,
  onSubmit: () => {},
  onCancel: undefined,
  minWidth: undefined,
  onChangeValues: undefined,
  settingOptionsSchema: [
    'preview',
    'text',
    'fontSize',
    'fontColor',
    'position',
    'rotation',
    'tiled',
    'transparency',
    'submitButton',
  ],
  isEditWatermark: false,
  imageUrl: undefined,
};
export default WatermarkForm;

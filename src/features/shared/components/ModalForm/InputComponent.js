import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Checkbox,
  ChoiceGroup,
  Toggle,
  SpinButton,
  Stack,
  Dropdown,
  Icon,
  MaskedTextField,
} from '@fluentui/react';

const checkBoxStyles = (props) => ({
  root: {
    marginTop: props.theme.spacing.s2,
    marginBottom: props.theme.spacing.s2,
  },
});
const toggleStyles = {
  root: {
    marginBottom: 0,
  },
};
const fileStyles = {
  fieldGroup: {
    alignItems: 'center',
  },
};
const textFieldStyles = {
  fieldGroup: {
    minWidth: 282,
    height: 40,
  },
};

export default function InputComponent({ field, form: { setFieldValue }, ...props }) {
  const { name } = field;
  const { type } = props;

  const _handleChangeInput = (_event, value) => {
    setFieldValue(name, value);
  };

  const _handleChangeSelect = (_event, item) => {
    setFieldValue(name, item?.key);
  };

  switch (type) {
    case 'checkbox':
      return <Checkbox {...field} {...props} styles={checkBoxStyles} onChange={_handleChangeInput} />;
    case 'radio':
      return (
        <ChoiceGroup
          {...field}
          {...props}
          onChange={(event, option) => {
            setFieldValue(name, option.key);
          }}
        />
      );
    case 'switch':
      return <Toggle {...field} {...props} styles={toggleStyles} onChange={_handleChangeInput} />;
    case 'number':
      return <SpinButton {...field} {...props} onChange={_handleChangeInput} />;
    case 'file':
      return (
        <TextField
          styles={fileStyles}
          {...field}
          {...props}
          onChange={(event) => {
            const { value, files } = event.currentTarget;
            setFieldValue(name, value);
            setFieldValue(`${name}FILE_NAME_LIST`, files);
          }}
        />
      );
    case 'select':
      return (
        <Dropdown
          {...field}
          {...props}
          onChange={_handleChangeSelect}
          onRenderOption={(option) => {
            const isSelected = option.key === field?.value;
            return (
              <Stack horizontal tokens={{ childrenGap: 8 }}>
                {isSelected && <Icon iconName="CheckMark" />}
                <Stack.Item styles={{ root: { marginLeft: !isSelected && 22 } }}>{option.text}</Stack.Item>
              </Stack>
            );
          }}
        />
      );
    case 'mask':
      return <MaskedTextField styles={textFieldStyles} {...field} {...props} />;
    default:
      return <TextField styles={textFieldStyles} {...field} {...props} />;
  }
}

InputComponent.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.any]),
  }).isRequired,
  form: PropTypes.shape({ setFieldValue: PropTypes.func.isRequired }).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

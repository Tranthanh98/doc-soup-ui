import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { TextField, FontWeights } from '@fluentui/react';

const fieldTitleStyles = (props) => ({
  fieldGroup: { background: 'transparent', marginBottom: 16 },
  field: {
    fontSize: 20,
    fontWeight: FontWeights.bold,
    border: 0,
    padding: 0,
    selectors: {
      '&:hover, &:focus': { background: props.theme.palette.neutralLight },
    },
  },
});

export default function DataRoomNameField(props) {
  const textFieldRef = useRef();
  const { dataRoom, onSubmit } = props;
  const [name, setName] = useState('');
  let isSubmitted = false;

  const _handleChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const _handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitted) {
      isSubmitted = false;
      return;
    }
    onSubmit(name);
    isSubmitted = true;
    textFieldRef?.current?.blur();
  };

  return (
    <form onSubmit={_handleSubmit}>
      <TextField
        borderless
        name="name"
        componentRef={textFieldRef}
        value={name || dataRoom.name}
        styles={fieldTitleStyles}
        onChange={_handleChange}
        onBlur={_handleSubmit}
      />
    </form>
  );
}
DataRoomNameField.propTypes = {
  dataRoom: PropTypes.oneOfType([PropTypes.object]),
  onSubmit: PropTypes.func.isRequired,
};
DataRoomNameField.defaultProps = {
  dataRoom: {},
};

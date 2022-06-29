import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Spinner } from '@fluentui/react';
import { CustomButton } from 'features/shared/components';

export default function SubmitButton(props) {
  const { rightSubmitButton, isSubmitting, onCancel } = props;
  if (rightSubmitButton) {
    return (
      <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 8 }}>
        {isSubmitting && <Spinner ariaLive="assertive" labelPosition="left" />}
        {onCancel && (
          <CustomButton
            size="large"
            text="Cancel"
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            styles={{ root: { height: '44px !important' } }}
          />
        )}
        <CustomButton
          primary
          size="large"
          text="OK"
          type="submit"
          disabled={isSubmitting}
          styles={{ root: { height: '44px !important' } }}
        />
      </Stack>
    );
  }
  return (
    <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { width: 390, margin: 'auto' } }}>
      {isSubmitting && <Spinner ariaLive="assertive" labelPosition="left" />}
      <CustomButton primary size="medium" text="Change Watermark" type="submit" disabled={isSubmitting} />
    </Stack>
  );
}
SubmitButton.propTypes = {
  rightSubmitButton: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  onCancel: PropTypes.func,
};
SubmitButton.defaultProps = {
  rightSubmitButton: false,
  isSubmitting: false,
  onCancel: undefined,
};

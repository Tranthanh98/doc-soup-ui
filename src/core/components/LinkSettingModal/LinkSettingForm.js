import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, Checkbox, FontWeights, Separator, Toggle } from '@fluentui/react';
import { CustomText } from 'features/shared/components';
import { PersonaLinkTag } from 'core/components';

export default function LinkSettingForm(props) {
  const { values, onChange, linkId, name, onChangeLinkStatus, createdByName } = props;

  return (
    <>
      <Stack grow={1} tokens={{ childrenGap: 16 }}>
        <CustomText block color="textSecondary">
          Modifying permissions for
        </CustomText>
        <br />
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          tokens={{ childrenGap: 48 }}
          styles={{ root: { minWidth: 300 } }}
        >
          <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>{name}</Text>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 16 }}>
            <PersonaLinkTag width="auto" linkId={linkId} isCopyToClipboard createdBy={createdByName} />
            <Toggle
              name="disabled"
              checked={!values.disabled}
              styles={{ root: { marginBottom: 0 } }}
              onChange={(_event, value) => onChangeLinkStatus(value)}
            />
          </Stack>
        </Stack>
        <Separator horizontal styles={{ root: { marginTop: '0 !important' } }} />
        <Checkbox name="email" checked={values.email} label="Require email to review" onChange={onChange} />
        <Checkbox name="download" checked={values.download} label="Allow download" onChange={onChange} />
        <br />
        <Text variant="mediumPlus" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Uploading
        </Text>
        <Checkbox name="nda" checked={values.nda} label="Require NDA to review" onChange={onChange} />
      </Stack>
    </>
  );
}
LinkSettingForm.propTypes = {
  linkId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeLinkStatus: PropTypes.func.isRequired,
  values: PropTypes.shape({
    download: PropTypes.bool,
    email: PropTypes.bool,
    nda: PropTypes.bool,
    disabled: PropTypes.bool,
  }),
  createdByName: PropTypes.string,
};
LinkSettingForm.defaultProps = {
  values: {
    allowedViewers: [],
  },
  createdByName: '',
};

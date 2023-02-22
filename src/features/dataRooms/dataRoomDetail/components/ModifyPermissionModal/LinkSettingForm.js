import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Separator, Text, FontWeights, Checkbox, Dropdown } from '@fluentui/react';
import { PersonaLinkTag } from 'core/components';
import { CustomText } from 'features/shared/components';
import ListContentWithPermission from './ListContentWithPermission';

const linkNameStyles = {
  root: {
    maxWidth: 150,
    overflow: 'hidden',
    fontWeight: FontWeights.semibold,
  },
};

export default function LinkSettingForm(props) {
  const { linkData, ndas, values, aggregateContent, files, thumbnailSrcs, onChangeFormValues } = props;

  const _handleChangeInput = (event, value) => {
    const { name } = event.target;
    const settingValues = { ...values };
    if (name === 'requiredNDA' && value) {
      settingValues.requiredEmail = true;
    }
    if (name === 'requiredEmail' && !value) {
      settingValues.requiredNDA = false;
    }
    const newValues = { ...settingValues, [name]: value };
    onChangeFormValues(newValues);
  };

  return (
    <>
      <div>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" tokens={{ childrenGap: 16 }}>
          <Text styles={linkNameStyles} title={linkData?.name}>
            {linkData?.name}
          </Text>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 16 }}>
            <PersonaLinkTag linkId={linkData?.id} isCopyToClipboard createdBy={linkData.createdByName} />
          </Stack>
        </Stack>
        <Separator horizontal styles={{ root: { marginTop: '0 !important' } }} />
        {((aggregateContent && aggregateContent.length > 0) || (files && files.length > 0)) && (
          <ListContentWithPermission aggregateContent={aggregateContent} files={files} thumbnailSrcs={thumbnailSrcs} />
        )}
      </div>
      <Checkbox
        name="requiredEmail"
        checked={values.requiredEmail}
        label="Require email to view"
        onChange={_handleChangeInput}
      />
      <Checkbox
        name="allowDownload"
        checked={values.allowDownload}
        label="Allow download"
        onChange={_handleChangeInput}
      />
      <Checkbox
        name="requiredNDA"
        checked={values.requiredNDA}
        label="Require NDA to view"
        onChange={_handleChangeInput}
      />
      <Dropdown
        disabled={!values.requiredNDA}
        placeholder="No NDA set on this link"
        name="ndaId"
        options={ndas}
        onChange={(_event, item) => _handleChangeInput({ target: { name: 'ndaId' } }, item.key)}
        selectedKey={values.requiredNDA ? values?.ndaId || ndas[0]?.key : null}
        styles={{ root: { paddingTop: 0 }, title: { height: 30, lineHeight: 28 } }}
      />
      {values.requiredNDA ? null : (
        <Stack.Item>
          <CustomText block variant="small" color="textSecondary" styles={{ root: { marginBottom: 8 } }}>
            Viewers must enter their name, email, and agree to your NDA before viewing your document.
          </CustomText>
          <CustomText block variant="small" color="textSecondary">
            To require an NDA for this content, select an NDA to use in the link&lsquo;s settings.
          </CustomText>
        </Stack.Item>
      )}
    </>
  );
}
LinkSettingForm.propTypes = {
  linkData: PropTypes.oneOfType([PropTypes.object]),
  values: PropTypes.shape({
    active: PropTypes.bool,
    requiredEmail: PropTypes.bool,
    allowDownload: PropTypes.bool,
    requiredNDA: PropTypes.bool,
    ndaId: PropTypes.number,
  }),
  ndas: PropTypes.oneOfType([PropTypes.array]),
  aggregateContent: PropTypes.oneOfType([PropTypes.array, undefined]), // [folder1, file1, file2, folder2, ...]
  files: PropTypes.oneOfType([PropTypes.array, undefined]),
  thumbnailSrcs: PropTypes.oneOfType([PropTypes.object]),
  onChangeFormValues: PropTypes.func.isRequired,
};
LinkSettingForm.defaultProps = {
  linkData: {},
  values: {},
  ndas: [],
  files: undefined,
  aggregateContent: undefined,
  thumbnailSrcs: {},
};

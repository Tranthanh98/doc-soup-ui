import React from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField, DefaultButton } from '@fluentui/react';
import { CustomModal, CustomText } from 'features/shared/components';
import { WatermarkForm } from 'core/components';
import { WATERMARK_SETTINGS } from 'core/constants/Const';
import WatermarkSettingForm from './WatermarkSettingForm';

const modalSettingOptionsSchema = [
  'preview',
  'text',
  'tiled',
  ['fontSize', 'fontColor'],
  ['rotation', 'position'],
  'transparency',
  'submitButton',
];

export default function CustomWatermarkForm(props) {
  const { watermark, disabled, isOpenModal, onToggle, imageWatermarkUrl } = props;
  const _handleChangeValues = (values) => {
    const { onChangeWatermark } = props;
    const newValues = values;
    delete newValues.isDefault;
    onChangeWatermark({ target: { name: 'watermark' } }, newValues);
    onToggle();
  };
  if (disabled) {
    return (
      <Stack tokens={{ childrenGap: 8 }}>
        <TextField disabled label="Text" name="text" />
        <Stack wrap horizontal tokens={{ childrenGap: 8 }}>
          {WATERMARK_SETTINGS.formatTags.map((tag, index) => (
            <DefaultButton disabled key={index} text={tag} />
          ))}
        </Stack>
        <CustomText variant="smallPlus" color="textSecondaryAlt">
          Add a customizable watermark to your document.
        </CustomText>
      </Stack>
    );
  }
  return (
    <>
      <WatermarkForm
        settingOptionsSchema={['preview', 'text', 'summary']}
        defaultWatermark={watermark}
        isDataLoaded={!!watermark?.id}
        onChangeValues={_handleChangeValues}
        isEditWatermark
        imageUrl={imageWatermarkUrl}
      />
      <CustomModal title="Watermark settings" isOpen={isOpenModal} onDismiss={onToggle}>
        <WatermarkSettingForm
          minWidth={400}
          settingOptionsSchema={modalSettingOptionsSchema}
          defaultWatermark={watermark}
          isDataLoaded={!!watermark?.id}
          onSubmit={_handleChangeValues}
          onCancel={onToggle}
          imageUrl={imageWatermarkUrl}
        />
      </CustomModal>
    </>
  );
}
CustomWatermarkForm.propTypes = {
  isOpenModal: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onChangeWatermark: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  watermark: PropTypes.oneOfType([PropTypes.object]),
  imageWatermarkUrl: PropTypes.string,
};
CustomWatermarkForm.defaultProps = {
  disabled: true,
  watermark: {},
  imageWatermarkUrl: 'url(/img/background-watermark.png)',
};

import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Icon } from '@fluentui/react';
import { CustomDetailsList, CustomModal, CustomText } from 'features/shared/components';

const renderName = (item) => (
  <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
    <Stack.Item disableShrink>
      <Icon iconName="pdf-svg" styles={{ root: { width: 24, height: 24 } }} />
    </Stack.Item>
    <CustomText>{item.name}</CustomText>
  </Stack>
);

const columnsSchema = [
  {
    key: 'name',
    fieldName: 'name',
    data: 'string',
    onRender: renderName,
  },
];

export default function ConfirmUploadFileModal(props) {
  const { onImport, isOpenModal, onToggle, files } = props;

  return (
    <>
      <CustomModal
        title="Confirm upload"
        isOpen={isOpenModal}
        onDismiss={onToggle}
        primaryButtonProps={{
          text: 'Import',
          onClick: () => onImport(),
        }}
      >
        <Stack style={{ width: 450 }}>
          <CustomText color="textSecondary">You are importing {files.length} files</CustomText>

          <Stack style={{ marginTop: 20 }}>
            <CustomDetailsList
              detailListProps={{ isHeaderVisible: false }}
              maxHeight="250px"
              striped
              columns={columnsSchema}
              items={files}
            />
          </Stack>
        </Stack>
      </CustomModal>
    </>
  );
}
ConfirmUploadFileModal.propTypes = {
  isOpenModal: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  files: PropTypes.oneOfType([PropTypes.array]).isRequired,
  onImport: PropTypes.func.isRequired,
};

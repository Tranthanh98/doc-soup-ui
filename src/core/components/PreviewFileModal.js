import React from 'react';
import PropTypes from 'prop-types';
import { CustomModal } from 'features/shared/components';
import PreviewFileFrame from './PreviewFileFrame';

export default function PreviewFileModal(props) {
  const { title, isOpen, docId, onToggle } = props;
  return (
    <CustomModal title={title} isOpen={isOpen} onDismiss={onToggle}>
      <div style={{ width: '80vw', height: '80vh' }}>
        <PreviewFileFrame fileInfo={{ docId }} isFilePreview />
      </div>
    </CustomModal>
  );
}
PreviewFileModal.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  docId: PropTypes.string,
};
PreviewFileModal.defaultProps = {
  title: '',
  docId: '',
};

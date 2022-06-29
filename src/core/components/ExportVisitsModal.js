import React from 'react';
import PropTypes from 'prop-types';
import { ImageFit, Stack, Text, Image } from '@fluentui/react';
import { CustomModal } from 'features/shared/components';
import { LIGHT_THEME } from 'core/constants/Theme';
import Resource from 'core/constants/Resource';

const textContainerStyles = {
  root: { padding: 12, backgroundColor: LIGHT_THEME.palette.neutralLight, borderRadius: 4, maxWidth: 332 },
};
const textStyles = { root: { fontSize: 13, color: LIGHT_THEME.palette.neutralSecondaryAlt } };

export default function ExportVisitsModal(props) {
  const { isOpen, isSubmitting, onToggle, onExportVisitEmail } = props;
  return (
    <CustomModal
      title="Export Visits"
      isOpen={isOpen}
      onDismiss={onToggle}
      isSubmitting={isSubmitting}
      primaryButtonProps={{
        text: 'Email me later',
        onClick: onExportVisitEmail,
        disabled: isSubmitting,
      }}
    >
      <Stack verticalAlign="center" horizontalAlign="center">
        <Stack styles={textContainerStyles}>
          <Text styles={textStyles}>{Resource.EXPORT_VISIT_DESCRIPTION}</Text>
        </Stack>
        <Image
          style={{ paddingTop: 34 }}
          imageFit={ImageFit.contain}
          src="/img/gif/loading.gif"
          srcSet="/img/gif/loading.gif 2x, /img/gif/loading.gif 3x"
          alt="loading"
          width={200}
          height={120}
          styles={{ root: { margin: '0 auto 16px auto' } }}
        />
      </Stack>
    </CustomModal>
  );
}

ExportVisitsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onExportVisitEmail: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};
ExportVisitsModal.defaultProps = {
  isSubmitting: false,
};

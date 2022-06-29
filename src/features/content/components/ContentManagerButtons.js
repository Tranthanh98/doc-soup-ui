import React from 'react';
import PropTypes from 'prop-types';
import { CommandBar, PrimaryButton, Stack } from '@fluentui/react';
import { MODAL_NAME } from 'core/constants/Const';
import { LIGHT_THEME, BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

export default function ContentManagerButtons(props) {
  const { onAddBtnClick, onToggleDialog, isMobile } = props;

  return (
    <Stack disableShrink horizontal verticalAlign="center" horizontalAlign="space-between">
      <Stack.Item disableShrink align="stretch">
        <CommandBar
          onReduceData={() => undefined}
          items={[
            {
              key: 'addFolder',
              text: 'Add Folder',
              title: 'Add Folder',
              ariaLabel: 'addFolder',
              iconOnly: true,
              iconProps: {
                iconName: 'folder-plus-svg',
                styles: {
                  root: {
                    width: 20,
                    height: 18,
                    [BREAKPOINTS_RESPONSIVE.mdDown]: { svg: { width: 16, height: 14 } },
                  },
                },
              },
              onClick: onAddBtnClick,
            },
            {
              key: 'share',
              text: 'Share',
              title: 'Share',
              ariaLabel: 'share',
              iconOnly: true,
              iconProps: {
                iconName: 'share-svg',
                styles: {
                  root: {
                    width: 20,
                    color: LIGHT_THEME.semanticColors.buttonText,
                    [BREAKPOINTS_RESPONSIVE.mdDown]: { svg: { width: 16, height: 16 } },
                  },
                },
              },
              onClick: () => onToggleDialog(MODAL_NAME.SHARE_FILE),
            },
          ]}
          styles={{
            root: { width: 'auto !important', maxHeight: 40, marginRight: 10, button: { marginRight: 10 } },
          }}
        />
      </Stack.Item>
      <Stack.Item>
        <PrimaryButton
          iconProps={isMobile ? undefined : { iconName: 'Upload' }}
          text="Upload"
          title="Upload"
          styles={{
            root: {
              minWidth: 100,
              borderRadius: 4,
            },
          }}
          onClick={() => onToggleDialog(MODAL_NAME.UPLOAD_FILE)}
        />
      </Stack.Item>
    </Stack>
  );
}
ContentManagerButtons.propTypes = {
  onAddBtnClick: PropTypes.func.isRequired,
  onToggleDialog: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

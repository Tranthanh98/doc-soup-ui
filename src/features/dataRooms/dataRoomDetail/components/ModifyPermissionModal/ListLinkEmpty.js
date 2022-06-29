import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, FontWeights } from '@fluentui/react';
import { CustomButton } from 'features/shared/components';
import withLimitationFeature from 'features/shared/HOCs/withLimitationFeature';
import { ACTION_LIMITATION, FEATURE_KEYS } from 'core/constants/Const';

const CreateLinkButton = withLimitationFeature(ACTION_LIMITATION.DISABLED, [FEATURE_KEYS.TotalAssetsInSpace])(
  CustomButton
);

export default function ListLinkEmpty(props) {
  const { onBtnPrimaryClick } = props;
  return (
    <Stack horizontalAlign="center" tokens={{ childrenGap: 8, padding: 72 }} styles={{ root: { maxWidth: 600 } }}>
      <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        You do not have any links yet.
      </Text>
      <Text variant="mediumPlus">
        Links are a way to share a Space with others in a secure way. You can disable a link, set custom access settings
        and more.
      </Text>
      <br />
      {onBtnPrimaryClick && (
        <CreateLinkButton
          primary
          size="large"
          iconProps={{ iconName: 'plus-svg' }}
          text="Create Shareable Link"
          title="Create Shareable Link"
          onClick={onBtnPrimaryClick}
        />
      )}
    </Stack>
  );
}
ListLinkEmpty.propTypes = {
  onBtnPrimaryClick: PropTypes.func,
};
ListLinkEmpty.defaultProps = {
  onBtnPrimaryClick: undefined,
};

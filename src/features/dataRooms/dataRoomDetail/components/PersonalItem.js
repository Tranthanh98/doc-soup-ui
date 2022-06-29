import React from 'react';
import PropTypes from 'prop-types';
import { Stack, FontWeights, Text, Persona, PersonaSize } from '@fluentui/react';

export default function PersonalItem({ item }) {
  return (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
      <Stack.Item>
        <Persona hidePersonaDetails size={PersonaSize.size32} text={item.fullName} />
      </Stack.Item>
      <Stack.Item>
        <Text block styles={{ root: { fontWeight: FontWeights.semibold } }}>
          {item.fullName}
        </Text>
        <Text block variant="smallPlus">
          {item.email}
        </Text>
      </Stack.Item>
    </Stack>
  );
}
PersonalItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]),
};
PersonalItem.defaultProps = {
  item: {},
};

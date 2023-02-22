import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, FontSizes, FontWeights, Icon, Stack, Text, ResponsiveMode } from '@fluentui/react';
import { CustomIconButton } from 'features/shared/components';

const breadcrumbStyles = {
  itemLink: {
    fontSize: FontSizes.size14,
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        background: 'transparent',
      },
    },
  },
};

export default function CustomBreadcrumb(props) {
  const { items, styles, responsiveMode } = props;
  const isMdDown = window.innerWidth < 768;

  if (isMdDown && responsiveMode <= ResponsiveMode.medium) {
    const currentItem = items[items.length - 1];
    const previousItem = items[items.length - 2];
    return (
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <CustomIconButton
          menuIconProps={{ iconName: 'ChevronLeftSmall' }}
          title="Back"
          styles={{ menuIcon: { fontSize: 16 } }}
          {...previousItem}
          text={undefined}
        />
        <Stack.Item disableShrink>
          <Icon iconName="folder-open-svg" styles={{ root: { width: 24 } }} />
        </Stack.Item>
        <Text styles={{ root: { fontWeight: FontWeights.semibold, overflow: 'hidden' } }}>{currentItem?.text}</Text>
      </Stack>
    );
  }

  return (
    <Breadcrumb
      {...props}
      maxDisplayedItems={5}
      items={items}
      styles={{ ...breadcrumbStyles, ...styles }}
      dividerAs={() => <Icon iconName="chevron-right-svg" styles={{ root: { width: 8 } }} />}
    />
  );
}
CustomBreadcrumb.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object]),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      href: PropTypes.string,
      isCurrentItem: PropTypes.bool,
    })
  ),
  responsiveMode: PropTypes.number,
};
CustomBreadcrumb.defaultProps = {
  styles: undefined,
  items: [],
  responsiveMode: ResponsiveMode.medium,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, Persona, PersonaSize, FontWeights } from '@fluentui/react';
import { millisecondsToStr } from 'features/shared/lib/utils';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { CustomDetailsList, CustomText } from 'features/shared/components';

const circleColorStyles = {
  root: {
    width: 12,
    height: 12,
    borderRadius: 12,
  },
};

const linkNameStyles = (isSelected) => ({
  root: {
    alignItems: 'center',
    textAlign: 'right',
    cursor: 'pointer',
    color: isSelected ? LIGHT_THEME.palette.neutralPrimary : LIGHT_THEME.palette.gray,
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        fontSize: 12,
        fontWeight: FontWeights.semibold,
      },
    },
  },
});

export default function ContactLinkList(props) {
  const { items, onSelectUnselectLink } = props;
  return (
    <CustomDetailsList
      columns={[
        {
          key: 'linkName',
          name: 'Account',
          fieldName: 'linkName',
          ariaLabel: 'linkName',
          isRowHeader: true,
          minWidth: 200,
          isSortable: true,
          isSorted: true,
          isSortedDescending: false,
          sortAscendingAriaLabel: 'Sorted A to Z',
          sortDescendingAriaLabel: 'Sorted Z to A',
          // eslint-disable-next-line react/no-multi-comp
          onRender: (item) => {
            const { color, linkName, selected, viewedAt } = item;
            return (
              <Stack
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 12 }}
                onClick={() => onSelectUnselectLink(item)}
              >
                <Stack
                  styles={circleColorStyles}
                  style={{
                    paddingLeft: 10,
                    marginLeft: 9,
                    marginRight: 8,
                    backgroundColor: item ? color : LIGHT_THEME.palette.white,
                  }}
                />
                <Persona className="hiddenMdDown" hidePersonaDetails size={PersonaSize.size40} text={linkName} />
                <Stack.Item>
                  <Text block styles={linkNameStyles(selected)}>
                    {linkName}
                  </Text>
                  <CustomText className="hiddenLgUp" variant="small" color="textSecondary">
                    {millisecondsToStr(new Date() - new Date(viewedAt))}
                  </CustomText>
                </Stack.Item>
              </Stack>
            );
          },
          styles: {
            cellName: {
              paddingLeft: 40,
            },
          },
        },
        {
          key: 'viewedAt',
          name: 'Last Visited',
          fieldName: 'viewedAt',
          ariaLabel: 'Last Visited',
          minWidth: 90,
          isRowHeader: true,
          isSortable: true,
          sortAscendingAriaLabel: 'Sorted A to Z',
          sortDescendingAriaLabel: 'Sorted Z to A',
          data: 'string',
          className: 'hiddenMdDown',
          isPadded: true,
          // eslint-disable-next-line react/no-multi-comp
          onRender: (item) => {
            const { selected, viewedAt } = item;
            return (
              <Text className="hiddenMdDown" block styles={linkNameStyles(selected)}>
                {millisecondsToStr(new Date() - new Date(viewedAt))}
              </Text>
            );
          },
          styles: {
            root: {
              selectors: {
                [BREAKPOINTS_RESPONSIVE.mdDown]: {
                  display: 'none',
                },
              },
            },
          },
        },
      ]}
      items={items}
      isStickyHeader={false}
    />
  );
}
ContactLinkList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  onSelectUnselectLink: PropTypes.func.isRequired,
};
ContactLinkList.defaultProps = {
  items: undefined,
};

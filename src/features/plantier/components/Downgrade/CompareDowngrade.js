/* eslint-disable react/no-multi-comp */
import { Icon, Text, Stack, mergeStyleSets } from '@fluentui/react';
import { FEATURE_NAME } from 'core/constants/Const';
import { LIGHT_THEME, BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { CustomDetailsList } from 'features/shared/components';
import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';

const FORBIDDEN = -1;
const UNLIMITED = 0;

const headerTitleStyles = { root: { fontSize: 16, fontWeight: 500, lineHeight: 16 } };
const currentPlanStyles = {
  root: { fontSize: 13, color: LIGHT_THEME.palette.neutralTertiaryAlt, lineHeight: 24, fontWeight: 'normal' },
};
const textCenterStyles = { root: { width: '100%', textAlign: 'center' } };

const classNames = mergeStyleSets({
  cellName: {
    padding: '0 !important',
    display: 'flex !important',
    justifyContent: 'center',
    paddingLeft: 16,
  },
});

export default function CompareDowngrade({ selectedPlan, currentPlan }) {
  const { isMobile } = useContext(GlobalContext);

  const columnConfig = useMemo(() => {
    const columns = [
      {
        key: 'featureKey',
        name: '',
        fieldName: 'featureKey',
        ariaLabel: '',
        className: classNames.cellName,
        minWidth: 150,
        onRender: (item) => FEATURE_NAME[item.featureKey],
        styles: {
          cellTitle: {
            [BREAKPOINTS_RESPONSIVE.lg]: {
              maxWidth: '150px !important',
            },
          },
          root: {
            [BREAKPOINTS_RESPONSIVE.lg]: {
              minWidth: '130px !important',
            },
          },
          cellName: {
            [BREAKPOINTS_RESPONSIVE.lg]: {
              maxWidth: '150px !important',
            },
          },
        },
      },
      {
        key: 'currentPlan',
        name: currentPlan.name,
        minWidth: 130,
        onRenderHeader: () => {
          return (
            <Stack verticalAlign="center" horizontalAlign="center">
              <Text styles={headerTitleStyles}>{currentPlan.name}</Text>
              <Text styles={currentPlanStyles}>(Your current plan)</Text>
            </Stack>
          );
        },
        fieldName: 'currentPlan',
        ariaLabel: currentPlan.name,
        onRender: (item) => {
          const { currentUnit, currentLimit } = item;
          if (currentLimit === FORBIDDEN) {
            return (
              <Stack styles={textCenterStyles}>
                <Icon iconName="Clear" styles={{ root: { color: LIGHT_THEME.palette.red, fontWeight: 'bolder' } }} />
              </Stack>
            );
          }

          if (currentLimit === UNLIMITED) {
            return <Stack styles={textCenterStyles}>Unlimited</Stack>;
          }

          return (
            <Stack styles={textCenterStyles}>
              {currentLimit} {currentUnit}
            </Stack>
          );
        },
        styles: {
          cellTitle: {
            justifyContent: 'center',
          },
        },
      },
    ];

    if (!isMobile) {
      columns.push({
        key: 'selectedPlan',
        name: selectedPlan.name,
        fieldName: 'selectedPlan',
        ariaLabel: selectedPlan.name,
        minWidth: 120,
        onRenderHeader: () => {
          const { name } = selectedPlan;
          return (
            <Stack verticalAlign="center" horizontalAlign="center" styles={headerTitleStyles}>
              <Text styles={headerTitleStyles}>{name}</Text>
            </Stack>
          );
        },
        styles: {
          cellTitle: {
            justifyContent: 'center',
          },
        },
        onRender: (item) => {
          const { selectedUnit, selectedLimit } = item;
          if (selectedLimit === FORBIDDEN) {
            return (
              <Stack styles={textCenterStyles}>
                <Icon iconName="Clear" styles={{ root: { color: LIGHT_THEME.palette.red, fontWeight: 'bolder' } }} />
              </Stack>
            );
          }

          if (selectedLimit === UNLIMITED) {
            return <Stack styles={textCenterStyles}>Unlimited</Stack>;
          }
          return (
            <Stack styles={textCenterStyles}>
              {selectedLimit} {selectedUnit}
            </Stack>
          );
        },
      });
    }

    return columns;
  });

  const items = useMemo(() => {
    return selectedPlan.limits?.map((i) => {
      const current = currentPlan.limits.find((k) => k.featureKey === i.featureKey);

      return {
        featureKey: i.featureKey,
        currentLimit: current.limit,
        currentUnit: current.unit,
        selectedLimit: i.limit,
        selectedUnit: i.unit,
      };
    });
  });

  return (
    <CustomDetailsList
      striped
      isStickyHeader={false}
      columns={columnConfig}
      items={items}
      detailListProps={{ onRenderDetailsHeader: (headerProps, defaultRender) => defaultRender(headerProps) }}
    />
  );
}

CompareDowngrade.propTypes = {
  selectedPlan: PropTypes.oneOfType([PropTypes.object]).isRequired,
  currentPlan: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

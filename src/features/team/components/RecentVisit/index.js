import { FontWeights, Label, Pivot, PivotItem, Stack, Text, TooltipHost } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentChart from './ContentChart';

const pivotStatusStyles = {
  root: {
    fontSize: 13,
    fontWeight: FontWeights.semibold,
    borderBottom: 'none',
    justifyContent: 'flex-end',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
  },
  link: {
    height: 30,
    margin: 0,
    padding: 0,
    color: LIGHT_THEME.palette.neutralSecondaryAlt,
    fontSize: 'inherit',
    fontWeight: 'inherit',
    backgroundColor: 'transparent',
    borderColor: `${LIGHT_THEME.palette.neutralQuaternary} transparent`,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    lineHeight: 30,
    minWidth: 100,
    width: 100,
    selectors: {
      '&:first-child': {
        borderLeft: `1px solid ${LIGHT_THEME.palette.neutralQuaternary}`,
        borderRight: `1px solid ${LIGHT_THEME.palette.neutralQuaternary}`,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
      },
      '&:last-child': {
        borderLeft: `1px solid ${LIGHT_THEME.palette.neutralQuaternary}`,
        borderRight: `1px solid ${LIGHT_THEME.palette.neutralQuaternary}`,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
      },
    },
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: 100,
    },
  },
  linkIsSelected: {
    color: `${LIGHT_THEME.palette.white} !important`,
    borderColor: `${LIGHT_THEME.palette.neutralPrimaryAlt} !important`,
    margin: 0,
    borderWidth: 0,
    backgroundColor: `${LIGHT_THEME.palette.neutralPrimaryAlt} !important`,
    selectors: {
      '& > span': {
        '&:hover': { backgroundColor: 'transparent' },
      },
    },
  },
  itemContainer: {
    marginTop: 11,
  },
};

const contentArea = {
  root: {
    position: 'relative',
  },
};

const titleOfContent = {
  root: {
    position: 'absolute',
    maxWidth: 'calc(100% - 120px)',
    minHeight: 30,
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: -0.5,
    display: 'flex',
    alignItems: 'center',
    color: LIGHT_THEME.palette.neutralPrimary,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      minHeight: 60,
    },
  },
};

const calloutProps = { gapSpace: 0 };
const hostStyles = {
  root: {
    width: '100%',
    backgroundColor: 'none',
  },
};
const hostBtnStyles = {
  root: {
    width: '100%',
    height: '100%',
    border: 'none',
    color: LIGHT_THEME.palette.neutralTertiaryAlt,
    backgroundColor: 'none',
    fontSize: 13,
    cursor: 'pointer',
    letterSpacing: -0.5,
  },
};

const titleTipHost = {
  root: {
    padding: '12px 16px',
    width: 176,
    color: LIGHT_THEME.palette.white,
    letterSpacing: -0.5,
    fontSize: 13,
    textAlign: 'center',
  },
};

export default function RecentVisit() {
  const { userId } = useParams();
  const [emptyContent, setEmptyContent] = useState(true);

  const _handleEmptyContent = (isEmptyContent) => {
    setEmptyContent(isEmptyContent);
  };

  return (
    <Stack styles={contentArea}>
      <Text styles={titleOfContent}>Recent Visit Stats</Text>
      <Pivot aria-label="Base example Pivot" defaultSelectedKey="thirtyDays" styles={pivotStatusStyles}>
        <PivotItem
          headerText="Last 7 Days"
          itemKey="sevenDays"
          headerButtonProps={{
            disabled: emptyContent,
          }}
          onRenderItemLink={
            emptyContent
              ? () => (
                  <TooltipHost
                    content={
                      <Stack>
                        <Text styles={titleTipHost}>No visits in the last 7 days.</Text>
                      </Stack>
                    }
                    calloutProps={calloutProps}
                    styles={hostStyles}
                  >
                    <Label styles={hostBtnStyles}>Last 7 Days</Label>
                  </TooltipHost>
                )
              : undefined
          }
        >
          <ContentChart days={7} userId={userId} handleBlockEmptyContent={_handleEmptyContent} />
        </PivotItem>
        <PivotItem headerText="Last 30 days" itemKey="thirtyDays">
          <ContentChart days={30} userId={userId} handleBlockEmptyContent={_handleEmptyContent} />
        </PivotItem>
      </Pivot>
    </Stack>
  );
}

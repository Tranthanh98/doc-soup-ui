/* eslint-disable max-lines */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, Persona, PersonaSize, TooltipHost, TooltipDelay } from '@fluentui/react';
import { CustomDetailsList } from 'features/shared/components';
import { millisecondsToStr } from 'features/shared/lib/utils';
import { NDAButton } from 'core/components';
import { Link, useHistory } from 'react-router-dom';
import { PAGE_PATHS } from 'core/constants/Const';
import GlobalContext from 'security/GlobalContext';
import { LIGHT_THEME, BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const twoLinkNameStyles = {
  root: {
    display: 'inline-block',
    maxWidth: 150,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
};

const linkNameStyles = {
  root: {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
};

const renderLastActivity = (item) => (
  <Stack styles={{ root: { width: '100%' } }} horizontal horizontalAlign="end">
    <Text>{millisecondsToStr(new Date() - new Date(item.lastActivity))}</Text>
  </Stack>
);

const renderVisits = (item) => (
  <Stack styles={{ root: { width: '100%' } }} horizontal horizontalAlign="end">
    <Text>{item.visits}</Text>
  </Stack>
);

export default function ContactList(props) {
  const { items, onUpdateArchivedStatus, userId } = props;
  const context = useContext(GlobalContext);
  const { isDesktop, isTablet, isMobile } = context;

  const history = useHistory();

  const renderContactName = (item) => (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} styles={{ root: { width: '100%' } }}>
      <Link to={{ pathname: `/${PAGE_PATHS.contacts}/${item.contactId}`, contactName: item.contactName }}>
        <Persona hidePersonaDetails size={PersonaSize.size40} text={item.contactName} />
      </Link>
      <Stack.Item styles={{ root: { overflow: 'hidden' } }}>
        <Link to={{ pathname: `/${PAGE_PATHS.contacts}/${item.contactId}`, contactName: item.contactName }}>
          <Text>{item.contactName}</Text>
        </Link>
      </Stack.Item>
      {item.signedNDA ? (
        <Stack.Item disableShrink>
          <NDAButton isDisplayTooltip={false} />
        </Stack.Item>
      ) : null}
    </Stack>
  );

  const renderListTooltip = (listString) => {
    const displayListString = [...listString];
    displayListString.splice(0, 2);
    return displayListString.map((i, index) => {
      return (
        <Stack
          key={index}
          styles={{ root: { cursor: 'pointer', '&:hover': { textDecoration: 'underline' } } }}
          onClick={() => history.push(`${PAGE_PATHS.account}/${i.id}`)}
        >
          <Text style={{ color: LIGHT_THEME.palette.white }}>
            {index + 1}. {i?.name}
          </Text>
        </Stack>
      );
    });
  };

  const renderContributors = (item) => {
    if (!item.linkCreators) {
      return null;
    }
    const contributors = item.linkCreators.split(',');
    return (
      <Stack horizontal>
        <Persona hidePersonaDetails size={PersonaSize.size40} text={contributors[0]} />
        {contributors[1] ? (
          <Persona
            hidePersonaDetails
            size={PersonaSize.size40}
            styles={{ root: { cursor: 'pointer', paddingLeft: 8 } }}
            text={contributors[1]}
          />
        ) : null}
        {contributors[2] ? (
          <Persona
            hidePersonaDetails
            size={PersonaSize.size40}
            styles={{ root: { cursor: 'pointer', paddingLeft: 8 } }}
            text={contributors[2]}
          />
        ) : null}

        {contributors.length > 3 ? (
          <TooltipHost
            styles={{ root: { display: 'flex', alignItems: 'center' } }}
            delay={TooltipDelay.zero}
            tooltipProps={{ onRenderContent: () => renderListTooltip(contributors) }}
          >
            <Text
              styles={linkNameStyles}
              style={{
                marginLeft: 8,
              }}
              onClick={() => {}}
            >
              +{contributors.length - 3}
            </Text>
          </TooltipHost>
        ) : null}
      </Stack>
    );
  };

  const renderAccounts = (item) => {
    if (!item.linkNames) {
      return null;
    }

    try {
      const linkAccounts = JSON.parse(item.linkNames);

      if (!linkAccounts || linkAccounts?.length === 0) {
        return null;
      }

      linkAccounts.sort(function (a, b) {
        return a.id - b.id;
      });

      return (
        <Stack horizontal>
          <Text
            title={linkAccounts[0]?.name}
            onClick={() => history.push(`${PAGE_PATHS.account}/${linkAccounts[0]?.id}`)}
            styles={twoLinkNameStyles}
          >
            {linkAccounts[0]?.name}
          </Text>
          {linkAccounts[1] ? (
            <Text
              title={linkAccounts[1]?.name}
              onClick={() => history.push(`${PAGE_PATHS.account}/${linkAccounts[1]?.id}`)}
              styles={twoLinkNameStyles}
            >
              , {linkAccounts[1]?.name}
            </Text>
          ) : null}
          {linkAccounts.length > 2 ? (
            <TooltipHost
              styles={{ root: { minWidth: 40 } }}
              delay={TooltipDelay.zero}
              tooltipProps={{ onRenderContent: () => renderListTooltip(linkAccounts) }}
              calloutProps={{ styles: { root: { marginBottom: -5 } } }}
            >
              <Text
                styles={linkNameStyles}
                style={{
                  marginLeft: 5,
                }}
              >
                +{linkAccounts.length - 2}
              </Text>
            </TooltipHost>
          ) : null}
        </Stack>
      );
    } catch (e) {
      return null;
    }
  };

  const accountColumn = {
    key: 'linkNames',
    name: 'Account',
    fieldName: 'linkNames',
    ariaLabel: 'Account',
    minWidth: 200,
    isRowHeader: true,
    isSortable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    data: 'string',
    isPadded: true,
    onRender: renderAccounts,
  };

  const contributorColumnSchema = {
    key: 'linkCreators',
    name: 'Contributors',
    fieldName: 'linkCreators',
    ariaLabel: 'Contributors',
    minWidth: 180,
    isRowHeader: true,
    isSortedDescending: false,
    data: 'string',
    isPadded: true,
    onRender: renderContributors,
  };

  const _columnsSchema = [
    {
      key: 'contactName',
      name: 'Name/Email',
      fieldName: 'contactName',
      ariaLabel: 'Name/Email',
      minWidth: 170,
      isRowHeader: true,
      isSortable: true,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'string',
      isPadded: true,
      onRender: renderContactName,
    },
    {
      key: 'lastActivity',
      name: 'Last Activity',
      fieldName: 'lastActivity',
      ariaLabel: 'Last Activity',
      minWidth: 85,
      isSortable: true,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'string',
      styles: { cellTitle: { justifyContent: 'flex-end' } },
      onRender: renderLastActivity,
    },
    {
      key: 'visits',
      name: 'Visits',
      fieldName: 'visits',
      ariaLabel: 'Visits',
      minWidth: 72,
      isSortable: true,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      isPadded: true,
      data: 'string',
      styles: { cellTitle: { justifyContent: 'flex-end', paddingRight: 32 } },
      onRender: renderVisits,
    },
  ];

  const _getMenuProps = (row) => {
    const { accountId, archived } = row;
    if (!row || userId !== accountId) {
      return null;
    }

    return {
      items: [
        {
          key: 'archived',
          text: archived ? 'Unarchive Contact' : 'Archive Contact',
          onClick: () => onUpdateArchivedStatus(row),
        },
      ],
    };
  };

  const contactColumnsSchema = [..._columnsSchema];
  if (isDesktop) {
    contactColumnsSchema.splice(1, 0, accountColumn, contributorColumnSchema);
  }

  if (isTablet) {
    contactColumnsSchema.splice(1, 0, contributorColumnSchema);
  }

  if (isMobile) {
    contactColumnsSchema.pop();
  }

  return (
    <CustomDetailsList
      striped
      isStickyHeader={false}
      columns={contactColumnsSchema}
      items={items}
      onGetMenuActions={isDesktop ? _getMenuProps : null}
      detailListProps={{
        detailsListStyles: {
          root: {
            [BREAKPOINTS_RESPONSIVE.mdDown]: {
              paddingTop: 9,
            },
          },
        },
      }}
    />
  );
}
ContactList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  onUpdateArchivedStatus: PropTypes.func.isRequired,
  userId: PropTypes.string,
};
ContactList.defaultProps = {
  items: [],
  userId: undefined,
};

import { CollapseAllVisibility, DetailsRow, Icon, mergeStyleSets, Stack, Text, ThemeContext } from '@fluentui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CustomDetailsList } from 'features/shared/components';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import { createGroupTable } from 'features/shared/lib/utils';
import { TIME_FORMAT, PROCESS_STATUS } from 'core/constants/Const';
import dayjs from 'dayjs';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { success } from 'features/shared/components/ToastMessage';
import PropTypes from 'prop-types';
import columnsSchema from '../../configs/billingInfoColumnSchema';

const _getIconStatus = (status) => {
  if (status === PROCESS_STATUS.PAID) {
    return <Icon iconName="CheckMark" styles={{ root: { fontSize: 20, color: LIGHT_THEME.palette.greenLight } }} />;
  }
  return <Icon iconName="ChromeClose" styles={{ root: { fontSize: 14, color: LIGHT_THEME.palette.red } }} />;
};

const classNames = mergeStyleSets({
  cellName: {
    display: 'flex !important',
    alignItems: 'center',
    paddingLeft: '20px !important',
  },
});

const renderGroupHeader = (props) => {
  const { group, sendEmailInvoice } = props;

  return (
    <Stack
      horizontal
      verticalAlign="center"
      tokens={{ childrenGap: 8 }}
      styles={{ root: { padding: '16px 20px', backgroundColor: LIGHT_THEME.palette.neutralLight } }}
    >
      <Text styles={{ root: { margin: '0 120px 0 0px', fontWeight: 500 } }}>
        {dayjs(group.createdDate).format(TIME_FORMAT.YEAR_MONTH_DAY_SLASH)}
      </Text>
      <Stack
        className="hiddenMdDown"
        styles={{ root: { marginRight: 40 } }}
        horizontal
        tokens={{ childrenGap: 4 }}
        verticalAlign="center"
      >
        <Text>{PROCESS_STATUS[group.status]}</Text>
        {_getIconStatus(group.status)}
      </Stack>
      <Stack className="hiddenMdDown">
        {group.sentInvoice ? (
          <Text styles={{ root: { fontWeight: 500 } }}>Email Sent</Text>
        ) : (
          <Text
            onClick={() => sendEmailInvoice(group.id)}
            styles={{ root: { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' } }}
          >
            Email Invoice
          </Text>
        )}
      </Stack>
    </Stack>
  );
};

// eslint-disable-next-line react/no-multi-comp
export default function BillingHistory({ totalUsers }) {
  const context = useContext(GlobalContext);
  const { getToken, isMobile } = context;

  const [billingList, setBillingList] = useState();
  const _getBilling = () => {
    new RestService()
      .setPath('/billing')
      .setToken(getToken())
      .get()
      .then((res) => {
        const sortedData = res.data.sort((a, b) => {
          if (dayjs(a.createdDate).isBefore(b.createdDate)) {
            return 1;
          }
          if (dayjs(a.createdDate).isAfter(b.createdDate)) {
            return -1;
          }
          return 0;
        });

        const data = createGroupTable(sortedData);

        data.forEach((i) => {
          // eslint-disable-next-line no-param-reassign
          i.isCollapsed = false;
        });

        setBillingList(data);
      })
      .catch((err) => {
        restServiceHelper.handleError(err);
      });
  };

  useEffect(() => {
    _getBilling();
  }, []);

  const _sendEmailInvoice = (paymentHistoryId) => {
    new RestService()
      .setPath(`/billing/${paymentHistoryId}/send-invoice`)
      .setToken(getToken())
      .post({})
      .then(() => {
        success('Your invoice is on its way to your email');
        _getBilling();
      })
      .catch((err) => {
        restServiceHelper.handleError(err);
      });
  };

  const columnSchemaConfig = useMemo(() => {
    const config = [...columnsSchema(totalUsers)];

    if (!isMobile) {
      config.splice(1, 0, {
        key: 'quantity',
        name: 'QTY',
        fieldName: 'quantity',
        ariaLabel: 'QTY',
        isRowHeader: true,
        className: classNames.cellName,
        styles: {
          cellTitle: {
            justifyContent: 'end',
            [BREAKPOINTS_RESPONSIVE.mdDown]: {},
          },
        },
        onRender: ({ invoice }) => {
          const invoiceObject = invoice ? JSON.parse(invoice) : null;
          if (!invoiceObject) {
            return null;
          }
          const { initialSeat, seat } = invoiceObject;
          return (
            <Stack className="hiddenMdDown" horizontalAlign="end" styles={{ root: { height: '100%', width: '100%' } }}>
              <Text style={{ marginBottom: 10 }}>{initialSeat > 0 ? 1 : seat}</Text>
              {initialSeat > 0 && seat > 0 ? <Text>{seat}</Text> : null}
            </Stack>
          );
        },
      });

      config.splice(2, 0, {
        key: 'price',
        name: 'Unit Price',
        fieldName: 'price',
        ariaLabel: 'Unit Price',
        isRowHeader: true,
        className: classNames.cellName,
        styles: {
          cellTitle: {
            justifyContent: 'end',
            [BREAKPOINTS_RESPONSIVE.mdDown]: {},
          },
        },
        onRender: ({ invoice }) => {
          const invoiceObject = invoice ? JSON.parse(invoice) : null;
          if (!invoiceObject) {
            return null;
          }
          const { unitPrice, initialSeat, totalInitialFee, seat } = invoiceObject;

          return (
            <Stack className="hiddenMdDown" horizontalAlign="end" styles={{ root: { width: '100%', height: '100%' } }}>
              <Text style={{ marginBottom: 10 }}>${initialSeat > 0 ? totalInitialFee : unitPrice}</Text>
              {initialSeat > 0 && seat > 0 ? <Text style={{ marginBottom: 10 }}>${unitPrice}</Text> : null}
            </Stack>
          );
        },
      });
    }

    return config;
  }, [isMobile]);

  return (
    <ThemeContext.Consumer>
      {(theme) => {
        return (
          <Stack tokens={{ childrenGap: 12 }}>
            <Text variant="mediumPlus" styles={{ root: { fontWeight: 500 } }}>
              Payment History
            </Text>
            <Stack>
              <CustomDetailsList
                isStickyHeader={false}
                columns={columnSchemaConfig}
                items={billingList}
                groups={billingList}
                detailListProps={{
                  groupProps: {
                    onRenderHeader: (headerProps) =>
                      renderGroupHeader({ ...headerProps, theme, sendEmailInvoice: _sendEmailInvoice }),
                    collapseAllVisibility: CollapseAllVisibility.hidden,
                  },
                  // eslint-disable-next-line react/no-multi-comp
                  onRenderRow: (item) => <DetailsRow styles={{ root: { minHeight: 72 } }} {...item} />,
                }}
              />
            </Stack>
          </Stack>
        );
      }}
    </ThemeContext.Consumer>
  );
}

BillingHistory.propTypes = {
  setCurrentBillingInfo: PropTypes.func.isRequired,
  totalUsers: PropTypes.number.isRequired,
};

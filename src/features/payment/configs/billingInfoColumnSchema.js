/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import { mergeStyleSets, Stack, Text } from '@fluentui/react';
import React from 'react';

import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const classNames = mergeStyleSets({
  cellName: {
    display: 'flex !important',
    alignItems: 'center',
    paddingLeft: '20px !important',
  },
});

const renderPlanDescription = (invoice) => {
  const invoiceObject = invoice ? JSON.parse(invoice) : null;
  if (!invoiceObject) {
    return null;
  }

  const { initialSeat, planTierName, subType, seat } = invoiceObject;

  return (
    <>
      <Text style={{ marginBottom: 10 }}>
        {planTierName} {subType}
      </Text>
      {initialSeat > 0 && seat > 0 ? <Text style={{ marginBottom: 10 }}>Additional cost per person</Text> : null}
      <Text styles={{ root: { fontWeight: 500 } }}>Total:</Text>
    </>
  );
};

const billingInfoColumnSchema = () => [
  {
    key: 'description',
    name: 'Description',
    fieldName: 'description',
    ariaLabel: 'Description',
    minWidth: 150,
    isRowHeader: true,
    className: classNames.cellName,
    styles: {
      cellTitle: {
        paddingLeft: 20,
      },
    },
    onRender: ({ invoice }) => {
      return <Stack>{renderPlanDescription(invoice)}</Stack>;
    },
  },
  {
    key: 'totalAmount',
    name: 'Amount',
    fieldName: 'totalAmount',
    ariaLabel: 'Amount',
    isRowHeader: true,
    className: classNames.cellName,
    maxWidth: 130,
    styles: {
      cellTitle: {
        justifyContent: 'end',
        [BREAKPOINTS_RESPONSIVE.mdDown]: {},
      },
    },
    onRender: (item) => {
      const { totalAmount, invoice } = item;
      const invoiceObject = invoice ? JSON.parse(invoice) : null;
      if (!invoiceObject) {
        return null;
      }

      const { totalSeatPrice, initialSeat, seat, totalInitialFee } = invoiceObject;
      return (
        <Stack
          horizontalAlign="end"
          styles={{
            root: {
              width: '100%',
            },
          }}
        >
          <Text styles={{ root: { marginBottom: 10 } }}>${initialSeat > 0 ? totalInitialFee : totalSeatPrice}</Text>
          {initialSeat > 0 && seat > 0 ? <Text style={{ marginBottom: 10 }}>${totalSeatPrice}</Text> : null}
          <Text styles={{ root: { fontWeight: 500 } }}>{`$${totalAmount.toFixed(2)}`}</Text>
        </Stack>
      );
    },
  },
];

export default billingInfoColumnSchema;

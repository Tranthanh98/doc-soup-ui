/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { DetailsRow, DetailsRowFields } from '@fluentui/react';
import { DragConsumer, DropConsumer } from 'features/shared/components';
import DropRowWrapper from './DropRowWrapper';

export default function CustomDetailRow(props) {
  const { rowProps, striped, checkboxVisibility, dragable, dropable, dragType, dropAccept, isCanSelectItems, styles } =
    props;

  const _renderRowFields = (fieldProps) => (
    <span data-selection-disabled>
      <DetailsRowFields {...fieldProps} />
    </span>
  );

  if (rowProps) {
    const isOddRowStyle = rowProps.itemIndex % 2 === 1 && striped;
    const customStyles = ({ theme }) => {
      const disabledColor = isCanSelectItems === false ? theme.palette.neutralTertiary : 'inherit';
      return {
        ...styles,
        isRowHeader: { color: disabledColor, justifyContent: 'flex-start' },
        root: {
          ...styles?.root,
          backgroundColor: 'transparent',
          borderBottom: 'none',
          selectors: {
            ...styles?.root?.selectors,
            '&:hover': {
              backgroundColor: theme.palette.themeLighterAlt,
              ...styles?.root?.selectors['&:hover'],
              color: disabledColor,
              '.is-row-header': { color: disabledColor },
            },
            '&:focus': {
              backgroundColor: 'inherit',
              '.is-row-header': { color: disabledColor },
            },
          },
        },
        fields: {
          color: disabledColor,
          minHeight: 60,
        },
        group: {
          selectors: {
            '&:hover': {
              backgroundColor: theme.palette.themeLighterAlt,
            },
          },
        },
      };
    };
    let rowComponent = (
      <DetailsRow
        {...rowProps}
        className="details-row"
        rowFieldsAs={_renderRowFields}
        checkboxVisibility={checkboxVisibility}
        styles={customStyles}
      />
    );
    if (dropable) {
      rowComponent = (
        <DropConsumer cloneChildren {...props} {...rowProps} accept={dropAccept}>
          <DropRowWrapper isOddRowStyle={isOddRowStyle}>
            <DetailsRow
              {...rowProps}
              rowFieldsAs={_renderRowFields}
              checkboxVisibility={checkboxVisibility}
              styles={customStyles}
            />
          </DropRowWrapper>
        </DropConsumer>
      );
    }
    if (dragable) {
      rowComponent = (
        <DragConsumer {...props} {...rowProps} type={dragType}>
          {rowComponent}
        </DragConsumer>
      );
    }
    return rowComponent;
  }
  return null;
}
CustomDetailRow.propTypes = {
  rowProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
  striped: PropTypes.bool,
  dragable: PropTypes.bool,
  dropable: PropTypes.bool,
  dragType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  dropAccept: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  isCanSelectItems: PropTypes.bool,
  styles: PropTypes.oneOfType([PropTypes.object]),
  checkboxVisibility: PropTypes.number,
};
CustomDetailRow.defaultProps = {
  dragable: false,
  dropable: false,
  striped: false,
  dragType: '',
  dropAccept: '',
  isCanSelectItems: true,
  styles: {},
  checkboxVisibility: 1,
};

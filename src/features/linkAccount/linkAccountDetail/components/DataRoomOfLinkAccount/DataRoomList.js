import React, { useContext, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { CustomDetailsList } from 'features/shared/components';
import GlobalContext from 'security/GlobalContext';
import useLimitationFeature from 'features/shared/hooks/useLimitationFeature';
import { FEATURE_KEYS } from 'core/constants/Const';
import { defaultColumnsSchema, notMobileColumnsSchema } from '../config/columnSchemaOfDataRoomList';

export default function DataRoomList(props) {
  const { items, onDuplicateItem, onShareItem, onExportVisits } = props;
  const context = useContext(GlobalContext);
  const { isDesktop, isMobile } = context;

  const [isAllow] = useLimitationFeature([FEATURE_KEYS.TotalAssetsInSpace]);

  const personaMenuRef = useRef(null);

  const dataRoomColumnsSchema = useMemo(() => {
    const columnSchema = [...defaultColumnsSchema(personaMenuRef)];
    if (!isMobile) {
      columnSchema.splice(1, 0, ...notMobileColumnsSchema(onShareItem));
    }

    return columnSchema;
  }, [isMobile, defaultColumnsSchema, notMobileColumnsSchema]);

  // eslint-disable-next-line react/no-multi-comp
  const _getMenuProps = (row) => ({
    items: [
      {
        key: 'exportVisits',
        text: 'Export Visits',
        onClick: () => onExportVisits(row),
        disabled: !isAllow,
      },
      {
        key: 'duplicate',
        text: 'Duplicate Space',
        onClick: () => onDuplicateItem(row),
        disabled: !isAllow,
      },
    ],
  });

  return (
    <CustomDetailsList
      striped
      isStickyHeader={false}
      isShareable={isDesktop}
      columns={dataRoomColumnsSchema}
      items={items}
      actionIconName="more-svg"
      onGetMenuActions={isDesktop ? _getMenuProps : null}
      onShareItem={onShareItem}
    />
  );
}
DataRoomList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  onExportVisits: PropTypes.func.isRequired,
  onDuplicateItem: PropTypes.func.isRequired,
  onShareItem: PropTypes.func.isRequired,
};
DataRoomList.defaultProps = {
  items: undefined,
};

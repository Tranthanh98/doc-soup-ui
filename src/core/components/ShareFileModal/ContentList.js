import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Icon, Stack, Persona, PersonaSize } from '@fluentui/react';
import { CustomDetailsList } from 'features/shared/components';
import toLocalTime from 'features/shared/lib/utils';
import { PAGE_PATHS } from 'core/constants/Const';

class ContentList extends Component {
  render() {
    const { items, onSelectItems, onSelectFolder, isMobile } = this.props;

    const renderName = (item) => {
      return (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }} styles={{ root: { width: '100%' } }}>
          <Stack.Item disableShrink>
            <Icon iconName={item?.extension ? 'pdf-svg' : 'folder-svg'} styles={{ root: { width: 24, height: 24 } }} />
          </Stack.Item>
          {item?.extension ? (
            <Stack.Item styles={{ root: { overflow: 'hidden' } }}>
              <Link to={`/${PAGE_PATHS.fileDetail}/${item.id}`} className="hover-underline">
                {item.displayName}
              </Link>
            </Stack.Item>
          ) : (
            <Stack.Item
              className="hover-underline"
              styles={{ root: { cursor: 'pointer', overflow: 'hidden' } }}
              onClick={() => onSelectFolder && onSelectFolder(item)}
            >
              {item.name}
            </Stack.Item>
          )}
        </Stack>
      );
    };

    const columnsSchema = [
      {
        key: 'displayName',
        name: 'File Name',
        ariaLabel: 'File Name',
        fieldName: 'displayName',
        minWidth: 90,
        isRowHeader: true,
        isSortable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'string',
        onRender: renderName,
      },
      {
        key: 'recentVisits',
        name: 'Visits',
        ariaLabel: 'Visits',
        fieldName: 'recentVisits',
        minWidth: 60,
        maxWidth: 60,
        isSortable: true,
        isCollapsible: true,
        data: 'number',
        styles: { cellTitle: { justifyContent: 'flex-end' } },
      },
      {
        key: 'modifiedDate',
        name: 'Date',
        ariaLabel: 'Date',
        fieldName: 'modifiedDate',
        minWidth: 85,
        maxWidth: 85,
        isSortable: true,
        data: 'string',
        styles: { cellTitle: { justifyContent: 'flex-end' } },
        onRender: (item) => toLocalTime(item.modifiedDate || item.createdDate),
      },
      {
        key: 'ownerName',
        name: 'Owner',
        fieldName: 'ownerName',
        ariaLabel: 'Owner',
        width: 50,
        minWidth: 50,
        styles: { cellTitle: { justifyContent: 'flex-end' } },
        onRender: (item) => {
          if (item.ownerName) {
            return (
              <Persona
                hidePersonaDetails
                size={PersonaSize.size32}
                initialsColor="transparent"
                text={item.ownerName}
                title={item.ownerName}
              />
            );
          }
          return null;
        },
      },
    ];
    if (isMobile) {
      columnsSchema.splice(1, 1);
      columnsSchema.splice(-1);
    }

    return (
      <CustomDetailsList
        striped
        isShareable
        maxHeight="47vh"
        columns={columnsSchema}
        items={items}
        onSelectItems={onSelectItems}
        styles={{
          cell: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 14 },
        }}
        {...this.props}
      />
    );
  }
}
ContentList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  onSelectItems: PropTypes.func,
  onDeleteDataRoomContent: PropTypes.func,
  isDataRoomContent: PropTypes.bool,
  onSelectFolder: PropTypes.func,
  isMobile: PropTypes.bool.isRequired,
};
ContentList.defaultProps = {
  items: undefined,
  onSelectItems: undefined,
  isDataRoomContent: false,
  onDeleteDataRoomContent: undefined,
  onSelectFolder: undefined,
};
export default withRouter(ContentList);

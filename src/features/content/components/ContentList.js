/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stack, Icon, Text, Persona, PersonaSize, Image, ImageFit, ThemeContext, FontSizes } from '@fluentui/react';
import { CustomDetailsList, CustomIconButton, CustomText } from 'features/shared/components';
import toLocalTime from 'features/shared/lib/utils';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import { LIGHT_THEME } from 'core/constants/Theme';
import FileBiz from 'core/biz/FileBiz';
import { DRAG_DROP_TYPE } from 'core/constants/Const';
import CustomDetailRow from 'features/shared/components/CustomDetailsList/CustomDetailRow';

const folderNameStyle = {
  root: {
    overflow: 'hidden',
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
};

const menuIconStyles = (theme) => ({
  root: {
    display: 'none',
    height: 28,
    marginRight: 16,
    padding: 0,
  },
  rootExpanded: {
    backgroundColor: 'transparent',
  },
  rootHovered: {
    backgroundColor: 'none',
    color: theme.palette.neutralPrimaryAlt,
    fill: theme.palette.neutralPrimaryAlt,
  },
  rootPressed: {
    backgroundColor: 'none',
  },
  menuIcon: { width: 28, margin: 0 },
});

const detailRowListStyles = {
  root: {
    color: '#1e1e1e',
    fontSize: FontSizes.size14,
    selectors: {
      '&:hover': {
        '.more-button': { display: 'block' },
      },
    },
  },
  fields: { minHeight: 60 },
  isRowHeader: {
    justifyContent: 'initial',
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
};

class ContentList extends Component {
  state = {
    imageSrcs: [],
  };

  componentDidUpdate(prevProps) {
    const { items } = this.props;
    const { getToken } = this.context;

    if (prevProps.items !== items) {
      items?.forEach((i) => {
        if (i.isFile) {
          new RestService()
            .setPath(`/file/${i.id}/thumb/1?version=${i.version}`)
            .setToken(getToken())
            .setResponseType('arraybuffer')
            .get()
            .then(({ data }) => {
              const URL = window.URL || window.webkitURL;
              const imageUrl = URL.createObjectURL(new Blob([data], { type: 'image/jpeg', encoding: 'UTF-8' }));

              this._updateImgSrc(i.id, imageUrl);
            });
        }
      });
    }
  }

  _updateImgSrc = (id, src) => {
    const { imageSrcs } = this.state;

    const cloneImgs = [...imageSrcs];
    cloneImgs.push({ id, src });
    this.setState({ imageSrcs: cloneImgs });
  };

  _confirmDelete = (file) => {
    const { onDeleteFile } = this.props;
    window.confirm({
      title: 'Delete file',
      content: `Are you sure ?`,
      yesAction: () => onDeleteFile(file),
    });
  };

  _getBaseColumnConfig = () => {
    return {
      isSortable: true,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: 'string',
    };
  };

  render() {
    const { items, onSelectItems, onSelectFolder, onDropDocument, onShareDocument, onDeleteFolder, onRenameFolder } =
      this.props;

    const { imageSrcs } = this.state;

    const { isMobile, isDesktop } = this.context;

    const renderName = (item) => {
      return (
        <Stack grow horizontal verticalAlign="center" tokens={{ childrenGap: 10 }} styles={{ root: { width: '100%' } }}>
          <Stack.Item disableShrink>
            {item.isFile ? (
              <Stack
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof onSelectFolder === 'function') {
                    onSelectFolder(item);
                  }
                }}
              >
                <Image
                  src={imageSrcs.find((i) => i.id === item.id)?.src ?? '/img/pdf.svg'}
                  height={36}
                  width={36}
                  imageFit={ImageFit.contain}
                  alt="page"
                />
              </Stack>
            ) : (
              <Icon
                iconName="folder-svg"
                styles={{ root: { width: 24, height: 24, cursor: 'pointer' } }}
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof onSelectFolder === 'function') {
                    onSelectFolder(item);
                  }
                }}
              />
            )}
          </Stack.Item>
          <Text styles={folderNameStyle} onClick={() => onSelectFolder && onSelectFolder(item)}>
            {item.name}
          </Text>
        </Stack>
      );
    };

    const columnsSchema = (theme) => {
      const columns = [
        {
          key: 'name',
          name: 'File Name',
          fieldName: 'name',
          ariaLabel: 'File Name',
          minWidth: 70,
          isRowHeader: true,
          isSorted: true,
          ...this._getBaseColumnConfig(),
          styles: {
            cell: {
              justifyContent: 'flex-start',
            },
          },
          onRender: renderName,
        },
        {
          key: 'createdDate',
          name: 'Date',
          fieldName: 'createdDate',
          ariaLabel: 'Date',
          minWidth: 84,
          ...this._getBaseColumnConfig(),
          styles: { cellTitle: { justifyContent: 'flex-end' } },
          onRender: (item) => toLocalTime(item.modifiedDate || item.createdDate),
        },
      ];

      if (!isMobile) {
        columns.splice(1, 0, {
          key: 'visits',
          name: 'Visits',
          fieldName: 'visits',
          ariaLabel: 'Visits',
          minWidth: 50,
          ...this._getBaseColumnConfig(),
          styles: { cellTitle: { justifyContent: 'flex-end' } },
        });

        columns.splice(2, 0, {
          key: 'size',
          name: 'Size',
          fieldName: 'size',
          ariaLabel: 'Size',
          minWidth: 74,
          ...this._getBaseColumnConfig(),
          styles: { cellTitle: { justifyContent: 'flex-end' } },
          onRender: (item) => (item.isFile ? FileBiz.formatSize(item.size) : null),
        });

        columns.push({
          key: 'ownerName',
          name: 'Owner',
          fieldName: 'ownerName',
          ariaLabel: 'Owner',
          width: 52,
          minWidth: 52,
          styles: { cellTitle: { justifyContent: 'flex-end' } },
          isSortable: false,
          onRender: (item) => {
            if (item.isFile) {
              return (
                <Persona
                  hidePersonaDetails
                  size={PersonaSize.size40}
                  styles={{ root: { cursor: 'pointer' } }}
                  initialsColor={LIGHT_THEME.palette.greenLight}
                  text={item.ownerName}
                  title={item.ownerName}
                />
              );
            }
            return null;
          },
        });

        if (isDesktop) {
          columns.push({
            key: 'more',
            fieldName: 'more',
            minWidth: 56,
            onRender: (item) => {
              const itemsBtn = [
                {
                  key: 'share',
                  text: 'Share',
                  onClick: () => typeof onShareDocument === 'function' && onShareDocument(item),
                },
                {
                  key: 'delete',
                  text: (
                    <CustomText variant="smallPlus" color="textDanger">
                      Delete
                    </CustomText>
                  ),
                  onClick: () => (item.isFile ? this._confirmDelete(item) : onDeleteFolder(item)),
                },
              ];
              if (!item.isFile) {
                itemsBtn.splice(1, 0, {
                  key: 'rename',
                  text: 'Rename',
                  onClick: () => onRenameFolder && onRenameFolder({ ...item, oldName: item.name }),
                });
              }

              return (
                <CustomIconButton
                  className="more-button"
                  menuIconProps={{ iconName: 'more-svg' }}
                  menuProps={{
                    shouldFocusOnMount: true,
                    alignTargetEdge: true,
                    items: itemsBtn,
                  }}
                  styles={menuIconStyles(theme)}
                  title="More"
                  ariaLabel="More"
                />
              );
            },
          });
        }
      }

      return columns;
    };

    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <CustomDetailsList
            striped
            columns={columnsSchema(theme)}
            items={items}
            onSelectItems={onSelectItems}
            {...this.props}
            detailListProps={{
              onRenderRow: (row) => {
                const { item } = row;
                return (
                  <CustomDetailRow
                    rowProps={row}
                    {...this.props}
                    dragable
                    dropable={!item.isFile}
                    dragType={item.isFile ? DRAG_DROP_TYPE.FILE : DRAG_DROP_TYPE.FOLDER}
                    dropAccept={item.isFile ? undefined : DRAG_DROP_TYPE.FILE}
                    onDrop={onDropDocument}
                    styles={detailRowListStyles}
                    imageSrc={imageSrcs.find((i) => i.id === item.id)?.src ?? '/img/pdf.svg'}
                  />
                );
              },
            }}
          />
        )}
      </ThemeContext.Consumer>
    );
  }
}
ContentList.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]),
  onSelectItems: PropTypes.func,
  onShareFolder: PropTypes.func,
  onSelectFolder: PropTypes.func,
  onDropDocument: PropTypes.func,
  onShareDocument: PropTypes.func,
  onDeleteFolder: PropTypes.func,
  onDeleteFile: PropTypes.func,
  onRenameFolder: PropTypes.func,
};
ContentList.defaultProps = {
  items: undefined,
  onSelectItems: undefined,
  onShareFolder: undefined,
  onSelectFolder: undefined,
  onDropDocument: undefined,
  onShareDocument: undefined,
  onDeleteFolder: undefined,
  onDeleteFile: undefined,
  onRenameFolder: undefined,
};

ContentList.contextType = GlobalContext;
export default ContentList;

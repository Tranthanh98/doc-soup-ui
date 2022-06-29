import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Image, ImageFit, TooltipDelay, TooltipHost, mergeStyleSets } from '@fluentui/react';
import { Link } from 'react-router-dom';
import FileBiz from 'core/biz/FileBiz';
import { LIGHT_THEME } from 'core/constants/Theme';
import { PAGE_PATHS } from 'core/constants/Const';
import GlobalContext from 'security/GlobalContext';
import toLocalTime from 'features/shared/lib/utils';
import { CustomDetailsList, CircleProgress, CustomText } from 'features/shared/components';

const classes = mergeStyleSets({
  cellName: {
    display: 'flex !important',
    justifyContent: 'end',
    alignItems: 'center',
    fontSize: 14,
    color: '#1e1e1e',
  },
});

const linkStyles = {
  width: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: 14,
  color: '#1e1e1e',
};

function RecentDocumentActivity(props) {
  const { recentFiles, imgSrcs, onDeleteFile, initShareFile } = props;

  const context = React.useContext(GlobalContext);
  const { isTablet, isMobile } = context;

  const _baseColumnConfig = () => ({
    isSortable: true,
    isSorted: true,
    isSortedDescending: false,
    data: 'string',
  });

  // eslint-disable-next-line react/no-multi-comp
  const _renderName = (id, displayName) => {
    return (
      <Stack
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 10 }}
        styles={{ root: { width: '100%', minHeight: 48 } }}
      >
        <Stack.Item disableShrink>
          <Link to={`/${PAGE_PATHS.fileDetail}/${id}`}>
            <Image
              height={36}
              width={36}
              imageFit={ImageFit.contain}
              alt="page"
              src={imgSrcs.find((i) => i.id === id)?.src || '/img/pdf.svg'}
            />
          </Link>
        </Stack.Item>
        <Link to={`/${PAGE_PATHS.fileDetail}/${id}`} style={linkStyles} className="hover-underline">
          {displayName}
        </Link>
      </Stack>
    );
  };

  const _getColumnConfig = () => {
    const recentActivityColumnSchema = [
      {
        key: 'displayName',
        name: 'Name',
        fieldName: 'displayName',
        ariaLabel: 'Name',
        minWidth: 130,
        isRowHeader: true,
        ..._baseColumnConfig(),
        onRender: ({ id, displayName }) => _renderName(id, displayName),
      },
      {
        key: 'recentActivityDate',
        name: 'Date',
        fieldName: 'recentActivityDate',
        minWidth: 80,
        maxWidth: 100,
        className: classes.cellName,
        ..._baseColumnConfig(),
        onRender: ({ recentActivityDate }) => toLocalTime(recentActivityDate, 'YYYY-MM-DD'),
      },
    ];

    if (!isMobile) {
      // this code will be replaced when we unanimity about responsive
      recentActivityColumnSchema.push({
        key: 'views',
        name: 'Views',
        fieldName: 'views',
        minWidth: 70,
        maxWidth: 80,
        className: classes.cellName,
        ..._baseColumnConfig(),
        onRender: ({ views }) => `${views || 0} View${views > 1 ? 's' : ''}`,
      });

      recentActivityColumnSchema.push({
        key: 'size',
        name: 'Size',
        fieldName: 'size',
        minWidth: 88,
        maxWidth: 88,
        className: classes.cellName,
        isPadded: true,
        ..._baseColumnConfig(),
        onRender: ({ size }) => FileBiz.formatSize(size),
      });
    }

    recentActivityColumnSchema.push({
      key: 'viewedRate',
      name: 'Viewed Rate',
      fieldName: 'viewedRate',
      minWidth: isMobile ? 30 : 70,
      width: isTablet || isMobile ? 30 : 70,
      maxWidth: 70,
      className: classes.cellName,
      ..._baseColumnConfig(),
      // eslint-disable-next-line react/no-multi-comp
      onRender: ({ viewedRate }) => (
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          styles={{ root: { width: '100%', paddingRight: isMobile ? 0 : 12 } }}
        >
          <TooltipHost
            delay={TooltipDelay.zero}
            calloutProps={{ gapSpace: 7 }}
            content={`Viewed: ${viewedRate}%`}
            styles={{ root: { width: 28, cursor: 'pointer' } }}
          >
            <CircleProgress
              percent={parseInt(viewedRate || 0, 10)}
              lineColor={
                parseInt(viewedRate || 0, 10) === 100
                  ? LIGHT_THEME.palette.greenLight
                  : LIGHT_THEME.palette.themePrimary
              }
            />
          </TooltipHost>
        </Stack>
      ),
    });

    return recentActivityColumnSchema;
  };

  const _confirmDelete = (file) => {
    window.confirm({
      title: 'Delete file',
      content: `Are you sure ?`,
      yesAction: () => typeof onDeleteFile === 'function' && onDeleteFile(file),
    });
  };

  // eslint-disable-next-line react/no-multi-comp
  const _getMenuProps = (row) => ({
    items: [
      {
        key: 'share',
        text: 'Share',
        onClick: () => typeof initShareFile === 'function' && initShareFile(row),
      },
      {
        key: 'delete',
        text: (
          <CustomText variant="smallPlus" color="textDanger">
            Delete
          </CustomText>
        ),
        onClick: () => _confirmDelete(row),
      },
    ],
  });

  return (
    <CustomDetailsList
      items={recentFiles || []}
      columns={_getColumnConfig()}
      striped
      isStickyHeader={false}
      detailListProps={{ isHeaderVisible: false }}
      compact
      actionIconName="more-svg"
      onGetMenuActions={isMobile ? null : _getMenuProps}
    />
  );
}

RecentDocumentActivity.propTypes = {
  recentFiles: PropTypes.oneOfType([PropTypes.array]).isRequired,
  imgSrcs: PropTypes.oneOfType([PropTypes.array]).isRequired,
  onDeleteFile: PropTypes.func.isRequired,
  initShareFile: PropTypes.func.isRequired,
};

export default RecentDocumentActivity;

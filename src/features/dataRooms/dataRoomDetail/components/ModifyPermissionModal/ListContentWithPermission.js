import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Nav, Stack, Checkbox, Image, ImageFit } from '@fluentui/react';
import FolderItem from 'core/components/FolderTree/FolderItem';
import { CustomText } from 'features/shared/components';
import FolderBiz from 'core/biz/FolderBiz';

const navStyles = (props) => {
  const { isExpanded, theme, leftPadding } = props;
  const itemHeight = 50;
  return {
    root: {
      maxHeight: 320,
      overflowY: 'auto',
      overflowX: 'hidden',
      border: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    },
    compositeLink: {
      height: itemHeight,
      selectors: {
        '&:hover': {
          backgroundColor: theme.palette.themeLighterAlt,
          '.folder-item': {
            color: theme.palette.black,
            fontWeight: 'inherit',
          },
          color: 'inherit',
        },
      },
    },
    link: {
      padding: 0,
      color: 'inherit',
      fontWeight: 'initial',
      backgroundColor: 'transparent !important',
      overflow: 'initial',
      height: itemHeight,
      lineHeight: 'auto',
      selectors: {
        '::after': { border: 0 },
        '> *': { paddingLeft: leftPadding },
        '.folder-item': {
          maxWidth: '92%',
          '> *': { maxWidth: '100%' },
        },
      },
    },
    chevronButton: {
      background: 'transparent',
      color: 'inherit',
      height: itemHeight,
      selectors: {
        '::after': { border: 0 },
      },
    },
    chevronIcon: {
      transform: isExpanded ? 'rotate(0)' : 'rotate(-90deg)',
    },
    groupContent: {
      marginBottom: 0,
    },
  };
};

class ListContentWithPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleContents: {},
      aggregateContent: [],
    };
  }

  componentDidMount() {
    const { aggregateContent, files } = this.props;
    const foldersTree = FolderBiz.convertFoldersToTreeData(aggregateContent);
    this.setState({
      aggregateContent: [{ links: files }, { links: foldersTree }],
    });
  }

  _getContenIcon = (item) => {
    if (item?.extension) {
      return 'pdf-svg';
    }
    if (item?.isExpanded) {
      return 'folder-open-svg';
    }
    return 'folder-svg';
  };

  _renderFolderItem = (item) => {
    const { visibleContents } = this.state;
    const { thumbnailSrcs } = this.props;
    return (
      <Stack
        grow
        verticalFill
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        styles={{ root: { width: '100%' } }}
      >
        {item?.extension ? (
          <Stack grow horizontal verticalAlign="center" tokens={{ childrenGap: 4 }} styles={{ root: { width: '90%' } }}>
            <Stack.Item disableShrink>
              <Image
                src={thumbnailSrcs[item.id] || '/img/default-pdf-thumbnail.png'}
                srcSet={
                  thumbnailSrcs[item.id] || '/img/default-pdf-thumbnail-2x.png 2x, /img/default-pdf-thumbnail-3x.png 3x'
                }
                imageFit={ImageFit.centerContain}
                width={36}
                height={36}
              />
            </Stack.Item>
            <CustomText>{item.displayName || item.name}</CustomText>
          </Stack>
        ) : (
          <FolderItem item={item} iconName={this._getContenIcon(item)} />
        )}
        <Checkbox checked={Boolean(visibleContents[item.id + (item.extension || null)])} />
      </Stack>
    );
  };

  _toggleVisibleContent = (item) => {
    this.setState((state) => {
      const prevState = state.visibleContents;
      const visibleKey = item.id + (item.extension || null);
      return { visibleContents: { ...prevState, [visibleKey]: !prevState[visibleKey] } };
    });
  };

  render() {
    const { aggregateContent } = this.state;
    if (!aggregateContent || !aggregateContent.length) {
      return null;
    }
    return (
      <>
        <CustomText
          block
          variant="smallPlus"
          color="textSecondary"
          styles={{ root: { lineHeight: 13, textAlign: 'right', paddingBottom: 10, paddingRight: 20 } }}
        >
          Show
        </CustomText>
        <Nav
          styles={navStyles}
          groups={aggregateContent}
          onRenderLink={this._renderFolderItem}
          onLinkClick={(e, item) => {
            e.preventDefault();
            this._toggleVisibleContent(item);
          }}
        />
      </>
    );
  }
}

ListContentWithPermission.propTypes = {
  aggregateContent: PropTypes.oneOfType([PropTypes.array]),
  files: PropTypes.oneOfType([PropTypes.array]),
  thumbnailSrcs: PropTypes.oneOfType([PropTypes.object]),
};
ListContentWithPermission.defaultProps = {
  aggregateContent: [],
  files: [],
  thumbnailSrcs: {},
};

export default ListContentWithPermission;

import React from 'react';
import PropTypes from 'prop-types';
import {
  ThemeContext,
  Icon,
  Text,
  Stack,
  FontSizes,
  ContextualMenu,
  Link as FluentUILink,
  FontWeights,
  Spinner,
  SpinnerSize,
  TooltipHost,
  TooltipDelay,
} from '@fluentui/react';

const folderWrapperStyles = {
  root: {
    maxWidth: '80.5%',
  },
};
const folderNameStyles = (disabled) => ({
  root: {
    color: 'inherit',
    fontWeight: 'inherit',
    overflow: 'hidden',
    opacity: disabled && 0.5,
  },
});
const folderIconStyles = (props) => ({
  root: {
    width: 24,
    height: 'auto',
    fontSize: 24,
    flexShrink: '0 !important',
    marginLeft: props.theme.spacing.s1,
  },
});
const menuIconStyles = () => ({
  root: {
    width: 24,
    height: 24,
    fontSize: FontSizes.size18,
    marginRight: 8,
  },
});
const groupHeaderStyle = ({ theme, allowSelectRootFolder, isSelected, isHighlightBackgroundSelection }) => {
  const rootStyles = {
    root: {
      height: 42,
      selectors: {
        '.more-btn': {
          display: 'none',
        },
        '&:hover': {
          fontWeight: FontWeights.semibold,
          '.more-btn': {
            display: 'block',
          },
          color: theme.palette.black,
        },
      },
    },
  };
  if (allowSelectRootFolder) {
    rootStyles.root.cursor = 'pointer';
    rootStyles.root.selectors['&:hover'] = {
      ...rootStyles.root.selectors['&:hover'],
      color: theme.palette.themePrimary,
    };
  }
  if (isSelected) {
    return {
      root: {
        ...rootStyles.root,
        background: isHighlightBackgroundSelection && theme.palette.themePrimary,
        color: isHighlightBackgroundSelection ? theme.palette.white : theme.palette.orangeLight,
        fontWeight: FontWeights.semibold,
      },
    };
  }
  return rootStyles;
};
const renderTooltipContent = (content) => (
  <Text variant="small" block styles={{ root: { maxWidth: 160, padding: 8, textAlign: 'center', color: 'inherit' } }}>
    {content}
  </Text>
);

export default function FolderItem(props) {
  const { item, iconName, showManageMenu, manageMenu, onSelectItem, loadingItemId, disabledTooltip } = props;
  const { displayName, name, isExpanded, disabled } = item;
  const linkRef = React.useRef(null);
  const [showMenu, setShowMenu] = React.useState(false);

  const _showMenu = (event) => {
    event.preventDefault();
    setShowMenu(true);
  };

  const _hideContextualMenu = React.useCallback(() => setShowMenu(false), []);

  if (disabled) {
    return (
      <Stack horizontal verticalAlign="center" className="folder-item" tokens={{ childrenGap: 8 }}>
        <Icon iconName={iconName} styles={(props) => folderIconStyles({ ...props, isExpanded })} />
        <TooltipHost
          content={disabledTooltip}
          delay={TooltipDelay.zero}
          id={name}
          calloutProps={{ gapSpace: 7 }}
          tooltipProps={{ onRenderContent: () => renderTooltipContent(disabledTooltip) }}
        >
          <Text variant="medium" className="folder-name" styles={folderNameStyles(disabled)}>
            {displayName || name}
          </Text>
        </TooltipHost>
      </Stack>
    );
  }

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Stack
          grow
          horizontal
          verticalAlign="center"
          horizontalAlign="space-between"
          className="folder-item"
          tokens={{ childrenGap: 8 }}
          styles={groupHeaderStyle({ theme, ...props })}
        >
          <Stack
            grow
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 8 }}
            styles={folderWrapperStyles}
            onClick={() => onSelectItem && onSelectItem(item)}
          >
            {loadingItemId === item.id ? (
              <Spinner size={SpinnerSize.medium} />
            ) : (
              <Icon iconName={iconName} styles={(props) => folderIconStyles({ ...props, isExpanded })} />
            )}
            <Text variant="medium" className="folder-name" styles={folderNameStyles()}>
              {displayName || name}
            </Text>
          </Stack>
          {showManageMenu && (
            <span className="more-btn">
              <FluentUILink ref={linkRef} href="#" onClick={_showMenu}>
                <Icon iconName="more-svg" styles={menuIconStyles} />
              </FluentUILink>
              <ContextualMenu
                target={linkRef}
                hidden={!showMenu}
                onDismiss={_hideContextualMenu}
                styles={{ root: { minWidth: 'auto' } }}
                items={manageMenu}
              />
            </span>
          )}
        </Stack>
      )}
    </ThemeContext.Consumer>
  );
}
FolderItem.propTypes = {
  showManageMenu: PropTypes.bool,
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  iconName: PropTypes.string,
  manageMenu: PropTypes.oneOfType([PropTypes.array]),
  onSelectItem: PropTypes.func,
  loadingItemId: PropTypes.number,
  disabledTooltip: PropTypes.string,
};
FolderItem.defaultProps = {
  manageMenu: [],
  showManageMenu: false,
  onSelectItem: undefined,
  iconName: 'folder-svg',
  loadingItemId: undefined,
  disabledTooltip: 'This item was disabled',
};

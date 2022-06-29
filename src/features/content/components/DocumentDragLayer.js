import React from 'react';
import { useDragLayer } from 'react-dnd';
import { Stack, Icon, Image, ImageFit } from '@fluentui/react';
import { CustomIconButton } from 'features/shared/components';
import { DRAG_DROP_TYPE } from 'core/constants/Const';
import toLocalTime from 'features/shared/lib/utils';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '60vw',
  height: '100%',
  maxWidth: 930,
};

function getDragLayerStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y + 5}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export default function DocumentDragLayer() {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const renderItem = () => {
    return (
      <Stack
        horizontal
        horizontalAlign="space-between"
        className="dragitem"
        tokens={{ padding: 16 }}
        styles={{
          root: {
            width: item.links && 250,
            height: 50,
            backgroundColor: 'rgb(247 159 26 / 20%)',
          },
        }}
      >
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Stack.Item disableShrink>
            {itemType === DRAG_DROP_TYPE.FOLDER ? (
              <Icon iconName="folder-svg" styles={{ root: { width: 24, height: 24 } }} />
            ) : (
              <Image src={item.imageSrc} height={36} width={36} imageFit={ImageFit.contain} alt="page" />
            )}
          </Stack.Item>
          <Stack.Item>{item.displayName || item.name}</Stack.Item>
        </Stack>
        {!item.links && (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 32 }}>
            <Stack.Item>{toLocalTime(item.modifiedDate || item.createdDate)}</Stack.Item>
            <Stack.Item>
              <CustomIconButton iconProps={{ iconName: 'share-svg' }} title="Share" ariaLabel="Share" />
            </Stack.Item>
          </Stack>
        )}
      </Stack>
    );
  };

  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getDragLayerStyles(initialOffset, currentOffset)}>{renderItem()}</div>;
    </div>
  );
}

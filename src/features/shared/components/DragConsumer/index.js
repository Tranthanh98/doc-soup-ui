import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@fluentui/react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

const getClassNames = makeStyles((theme) => ({
  dragging: {
    cursor: 'grabbing',
    opacity: 0.4,
  },
  dragable: {
    cursor: 'grab',
  },
  dropable: {
    backgroundColor: `${theme.palette.themeLighter} !important`,
    border: `1px dashed ${theme.palette.themePrimary}`,
  },
}));

export default function DragConsumer(props) {
  const { item, type, children, dragable, imageSrc } = props;

  const [{ isDragging }, dragRef, preview] = useDrag({
    type,
    item: { ...item, type, imageSrc }, // function onDrop of DropCard will return this item
    canDrag: dragable,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: false });
  }, [preview]);

  const classNames = getClassNames();
  const _getDragClassNames = () => {
    if (isDragging) {
      return classNames.dragging;
    }
    if (dragable) {
      return classNames.dragable;
    }
    return undefined;
  };

  return (
    <div ref={dragRef} className={_getDragClassNames()}>
      {children}
    </div>
  );
}
DragConsumer.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  dragable: PropTypes.bool,
  imageSrc: PropTypes.string,
};
DragConsumer.defaultProps = {
  dragable: false,
  imageSrc: undefined,
};

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@fluentui/react';
import { useDrop } from 'react-dnd';

const getClassNames = makeStyles((theme) => ({
  dropable: {
    backgroundColor: `${theme.palette.themePrimary} !important`,
    color: theme.palette.white,
  },
}));

export default function DropConsumer(props) {
  const { item, accept, children, cloneChildren, dropable, onDrop, canDrop: canDropProps } = props;

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept,
    drop: (srcItem) => onDrop(srcItem, item),
    canDrop: canDropProps,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: dropable && monitor.canDrop(),
    }),
  });
  const isDropable = isOver && canDrop;

  const iconDom = document.getElementById(item.id);
  if (iconDom) {
    const icon = iconDom.childNodes[0];

    if (icon) {
      const a = icon.childNodes[0];

      if (isDropable && a) {
        a.style.color = '#ffffff';
        iconDom.style.backgroundColor = '#f79f1a';
      } else {
        a.style.color = 'inherit';
        iconDom.style.backgroundColor = '#ffffff';
      }
    }
  }

  const classNames = getClassNames();

  return (
    <div ref={dropRef} className={isDropable ? classNames.dropable : ''}>
      {cloneChildren ? React.cloneElement(children, { isDropable }) : children}
    </div>
  );
}
DropConsumer.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  accept: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  onDrop: PropTypes.func.isRequired,
  dropable: PropTypes.bool,
  cloneChildren: PropTypes.bool,
  canDrop: PropTypes.func,
};
DropConsumer.defaultProps = {
  dropable: false,
  cloneChildren: false,
  canDrop: undefined,
};

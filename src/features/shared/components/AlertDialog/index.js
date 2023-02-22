import React from 'react';
import { render } from 'react-dom';
import AlertComponent from './AlertComponent';

const _close = (containerId) => {
  const containerElement = document.getElementById(containerId);
  document.body.removeChild(containerElement);
};

export default function Alert(subText, options = {}) {
  const containerId = `alert-container`;
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', containerId);
    document.body.appendChild(container);
  }

  const _handleClose = (e) => {
    if (typeof options.onClose === 'function') {
      options.onClose(e);
    }
    _close(containerId);
  };

  render(
    <AlertComponent {...options} subText={subText} onClose={_handleClose} />,
    document.getElementById(containerId)
  );

  return () => {
    _close(containerId);
  };
}

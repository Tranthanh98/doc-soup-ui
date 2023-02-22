import React from 'react';
import { render } from 'react-dom';
import ConfirmComponent from './ConfirmComponent';

const _close = (containerId) => {
  const containerElement = document.getElementById(containerId);
  document.body.removeChild(containerElement);
};

export default function Confirm(options = {}) {
  const containerId = `confirm-container`;
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', containerId);
    document.body.appendChild(container);
  }

  const _handleYes = (e) => {
    if (typeof options.yesAction === 'function') {
      options.yesAction(e);
    }
    _close(containerId);
  };

  const _handleNo = (e) => {
    if (typeof options.noAction === 'function') {
      options.noAction(e);
    }
    _close(containerId);
  };

  render(
    <ConfirmComponent {...options} yesAction={_handleYes} noAction={_handleNo} />,
    document.getElementById(containerId)
  );

  return () => {
    _close(containerId);
  };
}

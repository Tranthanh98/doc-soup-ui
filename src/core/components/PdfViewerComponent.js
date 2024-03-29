/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function PdfViewerComponent(props) {
  const containerRef = useRef(null);

  const { document } = props;

  useEffect(() => {
    const container = containerRef.current;
    let instance;
    let PSPDFKit;
    (async function () {
      PSPDFKit = await import('pspdfkit');
      PSPDFKit.unload(container);

      instance = await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        container,
        // The document to open.
        document,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
      }).then((i) => URL.revokeObjectURL(document));

      // instance.exportPDF().then((buffer) => console.log('buffer'));
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
}

PdfViewerComponent.propTypes = {
  document: PropTypes.any.isRequired,
};

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GlobalProvider } from 'security/GlobalContext';
import App from './App';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

// eslint-disable-next-line no-extend-native
String.prototype.format = function () {
  // eslint-disable-next-line prefer-rest-params
  const args = arguments;
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    return typeof args[index] === 'undefined' ? match : args[index];
  });
};

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <DndProvider backend={HTML5Backend}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="dark"
        pauseOnFocusLoss
        closeButton={false}
        draggable
        pauseOnHover
        style={{
          top: 100,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          maxWidth: '100%',
          zIndex: 99999999999999,
        }}
      />
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </DndProvider>
  </BrowserRouter>,
  rootElement
);

/*
serviceWorker.register({
  onUpdate: () => {
    console.log('update');
  },
});
*/

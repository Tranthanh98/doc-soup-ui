/* eslint-disable react/sort-comp */
import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import PropTypes from 'prop-types';

/**
 * React component for SockJS-client with STOMP messaging protocol.
 *
 * @version 5.0.0
 * @author [lahsivjar] (https://github.com/lahsivjar)
 * @see {@link https://stomp.github.io/|STOMP}
 * @see {@link https://github.com/sockjs/sockjs-client|StompJS}
 */
class SockJsClient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      // False if disconnect method is called without a subsequent connect
      explicitDisconnect: false,
    };

    this.subscriptions = new Map();
    this.retryCount = 0;
  }

  componentDidMount() {
    this._connect();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.disconnect();
  }

  render() {
    return null;
  }

  _initStompClient = () => {
    const { url, options, heartbeat, heartbeatIncoming, heartbeatOutgoing, debug } = this.props;
    // Websocket held by stompjs can be opened only once
    this.client = Stomp.over(new SockJS(url, null, options));

    this.client.heartbeat.outgoing = heartbeat;
    this.client.heartbeat.incoming = heartbeat;

    if (Object.keys(this.props).includes('heartbeatIncoming')) {
      this.client.heartbeat.incoming = heartbeatIncoming;
    }
    if (Object.keys(this.props).includes('heartbeatOutgoing')) {
      this.client.heartbeat.outgoing = heartbeatOutgoing;
    }
    if (!debug) {
      this.client.debug = () => null;
    }
  };

  _cleanUp = () => {
    this.setState({ connected: false });
    this.retryCount = 0;
    this.subscriptions.clear();
  };

  _log = (msg) => {
    const { debug } = this.props;
    if (debug) {
      console.log(msg);
    }
  };

  _subscribe = (topic) => {
    if (!this.subscriptions.has(topic)) {
      const { subscribeHeaders, onMessage } = this.props;
      const sub = this.client.subscribe(
        topic,
        (msg) => {
          onMessage(this._processMessage(msg.body), msg.headers.destination);
        },
        subscribeHeaders
      );
      this.subscriptions.set(topic, sub);
    }
  };

  _processMessage = (msgBody) => {
    try {
      return JSON.parse(msgBody);
    } catch (e) {
      return msgBody;
    }
  };

  _unsubscribe = (topic) => {
    const sub = this.subscriptions.get(topic);
    sub.unsubscribe();
    this.subscriptions.delete(topic);
  };

  _connect = () => {
    const { headers, topics, onConnect, onConnectFailure, onDisconnect, autoReconnect, getRetryInterval } = this.props;
    const { connected, explicitDisconnect } = this.state;
    this._initStompClient();
    this.client.connect(
      headers,
      () => {
        this.setState({ connected: true });
        topics.forEach((topic) => {
          this._subscribe(topic);
        });
        onConnect();
      },
      (error) => {
        if (error) {
          if (Object.keys(this.props).includes('onConnectFailure')) {
            onConnectFailure(error);
          } else {
            this._log(error.stack);
          }
        }
        if (connected) {
          this._cleanUp();
          // onDisconnect should be called only once per connect
          onDisconnect();
        }
        if (autoReconnect && !explicitDisconnect) {
          this._timeoutId = setTimeout(this._connect, getRetryInterval(this.retryCount++));
        }
      }
    );
  };

  /**
   * Connect to the server if not connected. Under normal circumstances component
   * will automatically try to connect to server. This method is mostly useful
   * after component is explicitly disconnected via {@link SockJsClient#disconnect}.
   *
   * @public
   */
  connect = () => {
    this.setState({ explicitDisconnect: false });
    const { connected } = this.state;
    if (!connected) {
      this._connect();
    }
  };

  /**
   * Disconnect STOMP client and disable all reconnect.
   *
   * @public
   */
  disconnect = () => {
    // On calling disconnect explicitly no effort will be made to reconnect
    // Clear timeoutId in case the component is trying to reconnect
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    this.setState({ explicitDisconnect: true });
    const { connected } = this.state;
    const { onDisconnect } = this.props;
    if (connected) {
      this.subscriptions.forEach((subid, topic) => {
        this._unsubscribe(topic);
      });
      this.client.disconnect(() => {
        this._cleanUp();
        onDisconnect();
        this._log('Stomp client is successfully disconnected!');
      });
    }
  };

  /**
   * Send message to the specified topic.
   *
   * @param {string} topic target topic to send message
   * @param {string} msg message to send
   * @param {Object} [opt_headers={}] additional headers for underlying STOMP client
   * @public
   */
  sendMessage = (topic, msg, optHeaders = {}) => {
    const { connected } = this.state;
    if (connected) {
      this.client.send(topic, optHeaders, msg);
    } else {
      throw new Error('Send error: SockJsClient is disconnected');
    }
  };
}
SockJsClient.propTypes = {
  /**
   * HTTP URL of the endpoint to connect.
   */
  url: PropTypes.string.isRequired,
  /**
   * Additional options to pass to the underlying SockJS constructor.
   *
   * @see [SockJS-options](https://github.com/sockjs/sockjs-client#sockjs-client-api)
   */
  options: PropTypes.oneOfType([PropTypes.object]),
  /**
   * Array of topics to subscribe to.
   */
  topics: PropTypes.oneOfType([PropTypes.array]).isRequired,
  /**
   * Callback after connection is established.
   */
  onConnect: PropTypes.func,
  /**
   * Callback after connection is lost.
   */
  onDisconnect: PropTypes.func,
  /**
   * Gets called to find the time interval for next retry. Defaults to a function returing retryCount seconds.
   *
   * @param {number} retryCount number of retries for the current disconnect
   */
  getRetryInterval: PropTypes.func,
  /**
   * Callback when a message is recieved.
   *
   * @param {(string|Object)} msg message received from server, if JSON format then object
   * @param {string} topic the topic on which the message was received
   */
  onMessage: PropTypes.func.isRequired,
  /**
   * Headers that will be passed to the server or broker with STOMP's connection frame.
   */
  headers: PropTypes.oneOfType([PropTypes.object]),
  /**
   * Headers that will be passed when subscribing to a destination.
   */
  subscribeHeaders: PropTypes.oneOfType([PropTypes.object]),
  /**
   * Should the client try to automatically connect in an event of disconnection.
   */
  autoReconnect: PropTypes.bool,
  /**
   * Enable debugging mode.
   */
  debug: PropTypes.bool,
  /**
   * Number of milliseconds to send and expect heartbeat messages.
   */
  heartbeat: PropTypes.number,
  /**
   * Number of milliseconds to expect heartbeat messages
   */
  heartbeatIncoming: PropTypes.number,
  /**
   * Number of milliseconds to send heartbeat messages
   */
  heartbeatOutgoing: PropTypes.number,
  /**
   * Callback if connection could not be established
   */
  onConnectFailure: PropTypes.func,
};
SockJsClient.defaultProps = {
  onConnect: () => null,
  onDisconnect: () => null,
  getRetryInterval: (count) => {
    return 1000 * count;
  },
  onConnectFailure: () => null,
  options: {},
  headers: {},
  subscribeHeaders: {},
  autoReconnect: true,
  debug: false,
  heartbeat: 10000,
  heartbeatIncoming: 0,
  heartbeatOutgoing: 0,
};
export default SockJsClient;

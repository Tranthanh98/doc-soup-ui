import React, { Component } from 'react';

const GlobalContext = React.createContext();

class GlobalProvider extends Component {
  // Context state
  state = {
    isInitialized: false,
    authenticated: false,
    authContext: null,
    selectedFolderId: null,
    isMobile: window.innerWidth < 768,
    isDesktop: window.innerWidth >= 1024,
    isTablet: window.innerWidth >= 768 && window.innerWidth <= 1023,
    planFeatures: [],
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateResponsive);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateResponsive);
  }

  // Method to update state

  setInitialized = (status) => {
    this.setState({ isInitialized: status });
  };

  setAuthenticated = (authenticated) => {
    this.setState({ authenticated });
  };

  setAuthContext = (authContext) => {
    this.setState({ ...authContext });
  };

  setSelectedFolderId = (selectedFolderId) => {
    this.setState({ selectedFolderId });
  };

  getToken = () => {
    const { authContext, authenticated } = this.state;

    if (authContext && authenticated) {
      return authContext.token;
    }
    return null;
  };

  getUserInfo = async () => {
    const { authContext, authenticated } = this.state;

    if (authContext && authenticated) {
      if (authContext.loadUserInfo) {
        const userInfo = await authContext.loadUserInfo();

        return { name: userInfo.name, email: userInfo.email, id: userInfo.sub };
      }
    }

    return { name: '', email: '', id: '' };
  };

  updateResponsive = () => {
    this.setState({
      isMobile: window.innerWidth < 768,
      isDesktop: window.innerWidth >= 1024,
      isTablet: window.innerWidth >= 768 && window.innerWidth <= 1023,
    });
  };

  setPlanFeatures = (features) => {
    this.setState({ planFeatures: features });
  };

  render() {
    const { children } = this.props;
    const { isInitialized, authContext, authenticated, selectedFolderId, isMobile, isDesktop, isTablet, planFeatures } =
      this.state;
    const {
      setInitialized,
      setAuthContext,
      setAuthenticated,
      getToken,
      getUserInfo,
      setSelectedFolderId,
      setPlanFeatures,
    } = this;

    return (
      <GlobalContext.Provider
        value={{
          isInitialized,
          authenticated,
          authContext,
          selectedFolderId,
          isMobile,
          isDesktop,
          isTablet,
          planFeatures,
          setInitialized,
          setPlanFeatures,
          setSelectedFolderId,
          setAuthenticated,
          setAuthContext,
          getUserInfo,
          getToken,
        }}
      >
        {children}
      </GlobalContext.Provider>
    );
  }
}

const GlobalConsumer = GlobalContext.Consumer;

export { GlobalProvider, GlobalConsumer };

export default GlobalContext;

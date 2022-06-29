import axios from 'axios';
import DeviceService from './deviceService';

class TrackService {
  async getPublicIP() {
    if (!this.ipAddress) {
      const res = await axios.get(process.env.REACT_APP_IP_SERVICE_URL);
      this.ipAddress = res.data;
    }
    return this.ipAddress;
  }

  async getTrackPayload() {
    const clientInfo = {
      os: {
        language: navigator.language,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        ip: await this.getPublicIP(),
      },
      browser: {
        vendor: navigator.vendor,
        appCodeName: navigator.appCodeName,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        cookieEnabled: navigator.cookieEnabled,
        product: navigator.product,
      },
      app: {
        deviceId: DeviceService.getDeviceId(),
      },
    };

    let permissionResult = {};
    if (navigator.permissions) {
      permissionResult = await navigator.permissions.query({
        name: 'geolocation',
      });
    }

    if (permissionResult.state === 'denied') {
      return {
        ...clientInfo,
        errors: [
          {
            error: "User didn't grant Geolocation",
            path: 'location',
            meta: { permissionResult: permissionResult.state },
          },
        ],
      };
    }

    const getCurrentPositionPromise = new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        function (location) {
          resolve({ ...clientInfo, location });
        },
        function (err) {
          resolve({
            ...clientInfo,
            errors: [
              {
                error: err.message,
                path: 'location',
                meta: { code: err.code },
              },
            ],
          });
        }
      );
    });

    const currentPosition = await getCurrentPositionPromise;
    return currentPosition;
  }
}

export default new TrackService();

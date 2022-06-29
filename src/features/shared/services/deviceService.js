import { v4 as uuidv4 } from 'uuid';
import LocalStorage from '../lib/localStorage';

class DeviceService {
  getDeviceId = () => {
    let deviceId = LocalStorage.get('doc-soup-device-id');
    if (deviceId) {
      return deviceId;
    }
    deviceId = uuidv4();
    LocalStorage.set('doc-soup-device-id', deviceId);
    return deviceId;
  };
}

export default new DeviceService();

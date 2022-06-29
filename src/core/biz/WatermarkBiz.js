import * as dayjs from 'dayjs';
import TrackService from 'features/shared/services/trackService';
import { TIME_FORMAT } from 'core/constants/Const';

class WatermarkBiz {
  constructor() {
    this.ipAddress = undefined;
    this._getPublicIp();
  }

  async _getPublicIp() {
    const ip = await TrackService.getPublicIP();
    this.ipAddress = ip;
    return ip;
  }

  /**
   * create preview text for watermark
   * @param {string} format
   */
  getPreviewWatermarkText(format) {
    if (!this.ipAddress) {
      this._getPublicIp();
      return format;
    }
    const date = dayjs().format(TIME_FORMAT.YEAR_MONTH_DAY_SLASH);
    const time = dayjs().format(TIME_FORMAT.STANDARD_TIME);
    let previewText = format.replaceAll('{{date}}', date);
    previewText = previewText.replaceAll('{{time}}', time);
    previewText = previewText.replaceAll('{{ip-address}}', this.ipAddress);
    return previewText;
  }
}
export default new WatermarkBiz();

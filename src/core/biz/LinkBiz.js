import { LINK_TYPE } from 'core/constants/Const';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

class LinkBiz {
  /**
   *
   * @param {object} selectedFiles
   * @param {object} createLinkValues
   * @returns {object}
   */
  generateDataToCreateLink(createLinkValues) {
    const {
      linkType = LINK_TYPE.FILE,
      resourceId,
      name,
      allowDownload,
      allowExpired,
      expiredAt,
      allowPasscode,
      passcode,
      allowWatermark,
      requiredNDA,
      allowViewer,
      requireEmailAuthentication,
      allowedViewers,
      watermark,
      customWatermarkId,
      ndaId,
      linkAccountsId,
    } = createLinkValues;
    const emailViewers = [];
    const domainViewers = [];
    const secure = {};
    if (allowViewer && allowedViewers.length) {
      allowedViewers.forEach((mail) => {
        if (mail.isDomain) {
          domainViewers.push(mail.mailAddress);
        } else {
          emailViewers.push(mail.mailAddress);
        }
      });
    }
    if (allowPasscode && passcode) {
      secure.passcode = passcode;
    }
    if (requireEmailAuthentication) {
      secure.email = true;
    }
    if (emailViewers.length > 0) {
      secure.emailViewers = emailViewers;
    }
    if (domainViewers.length > 0) {
      secure.domainViewers = domainViewers;
    }
    if (requiredNDA) {
      secure.nda = true;
    }
    return {
      download: allowDownload,
      expiredAt: allowExpired ? expiredAt : '',
      linkType,
      name,
      resourceId,
      secure: Object.keys(secure).length > 0 ? JSON.stringify(secure) : undefined,
      watermarkId: allowWatermark ? customWatermarkId || watermark?.id : undefined,
      ndaId: requiredNDA ? ndaId : undefined,
      linkAccountsId,
    };
  }

  parseLinkDataToViewModel(row, watermarkValue) {
    const secureValue = typeof row.secure === 'string' ? JSON.parse(row.secure) : row.secure;
    const linkInfo = {
      ...row,
      allowDownload: row.download,
      allowExpired: Boolean(row.expiredAt),
      allowPasscode: Boolean(secureValue?.passcode),
      allowWatermark: Boolean(row.watermarkId),
      passcode: secureValue?.passcode,
      requireEmailAuthentication: secureValue?.email,
      requiredNDA: secureValue?.nda,
      expiredAt: row.expiredAt ? new Date(row.expiredAt) : '',
      name: row.name,
      allowViewer: secureValue?.emailViewers?.length > 0 || secureValue?.domainViewers?.length > 0,
      allowedViewers: secureValue?.emailViewers ? secureValue?.emailViewers?.map((i) => ({ mailAddress: i })) : [],
    };

    if (watermarkValue) {
      linkInfo.watermark = { ...watermarkValue, id: row.watermarkId };
    }

    return linkInfo;
  }

  checkIsViewingLink = (viewedAt) => {
    dayjs.extend(utc);
    const viewedAtTime = dayjs.utc(viewedAt).local();
    const now = dayjs();
    const diff = now.diff(viewedAtTime, 'minute'); // minute
    const WAITING_TIME = 10; // waiting time before user stop viewing is 10 minute
    return diff < WAITING_TIME;
  };
}

export default new LinkBiz();

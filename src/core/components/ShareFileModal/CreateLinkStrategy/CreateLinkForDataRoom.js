import RestService from 'features/shared/services/restService';
import LinkBiz from 'core/biz/LinkBiz';
import { LINK_TYPE } from 'core/constants/Const';

class CreateLinkForDataRoom {
  create(params) {
    const { token, createLinkValues } = params;
    const postData = LinkBiz.generateDataToCreateLink({
      ...createLinkValues,
      linkType: LINK_TYPE.DATA_ROOM,
    });
    return new RestService()
      .setPath('/link')
      .setToken(token)
      .post(postData)
      .then((res) => {
        if (res.data) {
          return { link: `${window.location.origin}/view/${res.data}` };
        }
        return null;
      });
  }
}

export default CreateLinkForDataRoom;

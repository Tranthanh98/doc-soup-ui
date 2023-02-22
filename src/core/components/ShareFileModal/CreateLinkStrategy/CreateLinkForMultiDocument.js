import RestService from 'features/shared/services/restService';
import LinkBiz from 'core/biz/LinkBiz';
import { LINK_TYPE } from 'core/constants/Const';

class CreateLinkForMultiDocument {
  async _addContentIntoDataRoom(params) {
    const { token, createLinkValues, dataRoomId } = params;
    const { selectedFiles, selectedFolders } = createLinkValues;
    const directoryIds = selectedFolders.map((e) => e.id);
    const fileIds = selectedFiles.map((e) => e.id);
    // call api to add content into data-room
    const response = await new RestService()
      .setPath(`/data-room/${dataRoomId}`)
      .setToken(token)
      .post({ id: dataRoomId, directoryIds, fileIds })
      .then(() => dataRoomId);
    return response;
  }

  async _createDataRoom(params) {
    const { token, createLinkValues } = params;
    const response = await new RestService()
      .setPath('/data-room')
      .setToken(token)
      .post({ name: createLinkValues?.dataRoomName })
      .then((res) => res);
    return response;
  }

  async create(params) {
    const { token, createLinkValues } = params;
    const { customWatermarkId } = createLinkValues;

    const createDataRoomResponse = await this._createDataRoom(params);

    const dataRoomId = createDataRoomResponse.data;
    if (dataRoomId) {
      const addContentResponse = await this._addContentIntoDataRoom({ ...params, dataRoomId });

      if (addContentResponse === dataRoomId) {
        const postData = LinkBiz.generateDataToCreateLink({
          ...createLinkValues,
          linkType: LINK_TYPE.DATA_ROOM,
          resourceId: dataRoomId,
          customWatermarkId,
        });
        // call api to create link
        return new RestService()
          .setPath('/link')
          .setToken(token)
          .post(postData)
          .then((res) => ({ link: `${window.location.origin}/view/${res.data}`, dataRoomId }));
      }
      return addContentResponse;
    }
    return createDataRoomResponse;
  }
}
export default CreateLinkForMultiDocument;

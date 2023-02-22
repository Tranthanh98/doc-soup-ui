import * as dayjs from 'dayjs';

class ContactBiz {
  /**
   * standardize all files which was viewed by a contact
   * @param {array} data links of the file
   * @returns {array} list link
   */
  standardizeFilesOfContact = (data) => {
    return (
      data &&
      data.map((item) => {
        const newItem = item;
        newItem.lastVisited = dayjs(newItem.lastActivity).unix();
        return newItem;
      })
    );
  };
}

export default new ContactBiz();

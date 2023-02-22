/* eslint-disable max-len */
const TextMessage = {
  // warning
  WARNING_DELETE_PERSONAL_FOLDER: 'All documents in the folder and their active links are deleted.',
  WARNING_DELETE_TEAM_FOLDER:
    'Deleting the Teams folder will make it unusable to team members. All documents in the folder and their active links are deleted.',

  WARNING_DELETE_USER_DATA_ROOM: 'Are you sure you want to delete {0} collaborator in {1}?',
  WARNING_ARCHIVE_CONTACT: 'Keeping contacts removes them from the contact list and keeps the link active.',
  WARNING_TRANSFER_USER_DATA: 'This process is irreversible. Would you like to proceed?',
  WARNING_CONFIRM_TRANSFER: 'This operation is permanent and irreversible.',
  WARNING_CONFIRM_MERGE_ACCOUNT: 'This process is irreversible. Would you like to proceed?',
  WARNING_DOWNGRADE_PLAN:
    "If you downgrade your payment plan from {0} to {1}, your company will not be able to use DocSoup's premium features.",

  // Text
  ADD_EMAIL_MESSAGE: 'Create multiple emails or domains and press the Add button.',
  DELETE_DATAROOM_USER_MESSAGE: 'This user will not be able to edit the data room.',
  EXPORT_VISIT_DESCRIPTION:
    'The file will be automatically downloaded shortly. If the download takes a long time, press the button below and we will send you a link by e-mail when the download is available.',
  DUPLICATE_DATA_ROOM:
    'Replicating a data room creates a data room with the same access status as the included document.',
  PREV_DOWNLOAD_DATA_ROOM: 'Please enter your name and email before downloading.',
  SUFFIX_DOWNLOAD_DATA_ROOM: 'This information is shared only with the owner of the document',
  TRACKING_OWNER_VISIT:
    "When this feature is enabled, the owner's visit is tracked together and the Owner's Visit tag is displayed on the Visit Analysis page.",
  MAKE_OWNER_SUB_TEXT:
    'Each company has only one owner. If you designate {0} as the owner, you will no longer be able to manage your payments. Would you like to proceed?',
  MAKE_MEMBER_SUB_TEXT: '{0} will lose administrative privileges. Would you like to proceed?',
  SUSPENDING_ACCOUNT_SUB_TEXT:
    'If you suspend an account, the password for that account will be reset, preventing existing users from logging in.',

  DEACTIVE_ACCOUNT_SUB_TEXT:
    'If you disable an account, it will no longer be able to log in and the link will be disabled.',
  REACTIVE_ACCOUNT_SUB_TEXT: 'Reactivating your account may incur additional charges.',
  TRANSFER_USER_DATA:
    'Articles, links, visit statistics, data rooms, etc. owned by suspended or inactive accounts are transferred to other active users.',
  TYPE_TEXT_TO_TRANSFER: 'Please enter TRANSFER below to continue the data transfer.',
  UNSUSPEND_ACCOUNT: 'Reactivating your account may incur additional charges.',
  INVITE_USER_TO_COMPANY: 'Adding team members may incur additional charges to your current account.',
  CREATE_A_NEW_COMPANY:
    'The new company account allows you to manage content separately from other user groups, and you can also bill individually. If you give ownership of the company to another user, that user will manage the payment information along with the ownership.',

  CREATE_COMPANY_FOR_ANOTHER_USER:
    'When a user accepts an invitation, he or she gains owner rights and you change to administrator rights.',

  ARCHIVE_ACCOUNT: 'When you save your account, it disappears from the Contacts list and the link remains active.',
  CONFIRM_MERGE_ACCOUNT:
    'Document activity data such as links to {0}, visit statistics, and data rooms are integrated into {1}.',
  NOTICE_CANCEL_PLAN: '{0}, your company has {1} active links that have achieved {2} visits in the past three months.',
  SUGGESTION_INSTEAD_CANCEL:
    'You can downgrade your payment plan to keep the link active and continue to use DocSoup at a reasonable price.',

  // title
  TITLE_ARCHIVE_CONTACT: 'Do you want to keep this contact number?',
  TITLE_MAKE_OWNER: 'Are you sure you want to grant ownership rights?',
  TITLE_MAKE_MEMBER: 'Do you want to change {0} to a member?',
  PLAN_TIER: 'There are plans suitable for different business sizes.',
};

export const ERROR_MESSAGE = {
  ERROR_DIFFERENT_DEVICE:
    'Email verification was initiated from a different device. Please reverify your email address to access this content.',
};

export { TextMessage };

const Resource = { ...TextMessage };

export default Resource;

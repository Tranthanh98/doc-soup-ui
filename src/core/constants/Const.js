/* eslint-disable max-lines */
export const STRING = {
  NEXT_LOCALE: 'NEXT_LOCALE',
  NDA_DOWNLOAD_FILE_NAME: 'docsoup-nda.zip',
  DEFAULT_DATA_ROOM_NAME: 'Untitled',
  TEAM_FOLDERS: 'Team folders',
  MY_FOLDERS: 'My folders',
  HEADER_HEIGHT: 70,
  HEADER_MAX_WIDTH: 1440,
};

export const PAGE_PATHS = {
  contacts: 'contacts',
  content: 'content',
  fileDetail: 'content/file',
  filePreview: 'content/file/id/preview',
  dataRooms: 'data-rooms',
  settings: 'settings',
  dashboard: 'dashboard',
  plans: 'upgrade/plans',
  billing: 'billing',
  company: 'company',
  account: 'link-account',
  search: 'search',
  checkout: 'checkout',
  team: 'team',
};

export const NAV_LINK_GROUP = [
  {
    name: 'Dashboard',
    iconName: 'ViewDashboard',
    to: `/${PAGE_PATHS.dashboard}`,
    paths: [`/${PAGE_PATHS.dashboard}`],
    key: `/${PAGE_PATHS.dashboard}`,
  },
  {
    name: 'Content',
    iconName: 'list-view-svg',
    to: `/${PAGE_PATHS.content}`,
    paths: ['/', `/${PAGE_PATHS.content}`],
    key: `/${PAGE_PATHS.content}`,
  },
  {
    name: 'Data Rooms',
    iconName: 'ico-dap-svg',
    to: `/${PAGE_PATHS.dataRooms}`,
    paths: [`/${PAGE_PATHS.dataRooms}`],
    key: `/${PAGE_PATHS.dataRooms}`,
  },
  {
    name: 'Contacts',
    iconName: 'user-svg',
    to: `/${PAGE_PATHS.contacts}`,
    paths: [`/${PAGE_PATHS.contacts}`],
    key: `/${PAGE_PATHS.contacts}`,
  },
  {
    name: 'Account',
    iconName: 'user-svg',
    to: `/${PAGE_PATHS.account}`,
    paths: [`/${PAGE_PATHS.account}`],
    key: `/${PAGE_PATHS.account}`,
  },
];

export const TIME_FORMAT = {
  DAY_MONTH_YEAR_HH_MH_SS: 'DD/MM/YYYY HH:mm:ss',
  YEAR_MONTH_DAY_SLASH: 'YYYY/MM/DD',
  STANDARD_TIME: 'HH:mm:ss',
  TIME: 'HH:mm',
};

export const TIME_OUT = {
  INTERVAL_REFRESH_LINK_STATISTIC: 120000,
  EXPORT_VISITS: 4000,
};

export const MODAL_NAME = {
  UPLOAD_FILE: 'UPLOAD_FILE',
  SHARE_FILE: 'SHARE_FILE',
  ADD_FOLDER: 'ADD_FOLDER',
  ADD_DATA_ROOM: 'ADD_DATA_ROOM',
  DUPLICATE_DATA_ROOM: 'DUPLICATE_DATA_ROOM',
  ADD_DATA_ROOM_CONTENT: 'ADD_DATA_ROOM_CONTENT',
  ADD_USER: 'ADD_USER',
  CREATE_LINK: 'CREATE_LINK',
  MODIFY_PERMISSION: 'MODIFY_PERMISSION',
  UPLOAD_NDA: 'UPLOAD_NDA',
  RENAME_NDA: 'RENAME_NDA',
  CREATED_LINK: 'CREATED_LINK',
  VERIFY_LINK: 'VERIFY_LINK',
  MANAGE_VIEWER: 'MANAGE_VIEWER',
  CUSTOM_WATERMARK: 'CUSTOM_WATERMARK',
  PREVIEW_FILE: 'PREVIEW_FILE',
  DATAROOM_LINK_LIST: 'DATAROOM_LINK_LIST',
  TRANSFER_DATA: 'TRANSFER_DATA',
  CREATE_NEW_COMPANY: 'CREATE_NEW_COMPANY',
  EXPORT_VISITS_MODAL: 'EXPORT_VISITS_MODAL',
  ARCHIVE_LINK_ACCOUNT: 'ARCHIVE_LINK_ACCOUNT',
  MERGE_LINK_ACCOUNT: 'MERGE_LINK_ACCOUNT',
  ADD_BILLING_CONTACT: 'ADD_BILLING_CONTACT',
  INVOICE_BILLING_INFO: 'INVOICE_BILLING_INFO',
  VALIDATION_EMAIL: 'VALIDATION_EMAIL',
};

export const FILE_TYPE = {
  FOLDER: 'folder',
  PDF: 'pdf',
};

export const DRAG_DROP_TYPE = {
  FILE: 'FILE',
  FOLDER: 'FOLDER',
};

export const FILE_UPLOAD_VALIDATION = {
  MAX_SIZE: 104857600, // = 1024 * 1024 * 100 byte = 100 MB
  ACCEPT: 'application/pdf',
  MULTIPE: true,
};
export const NDA_UPLOAD_VALIDATION = {
  MAX_SIZE: 104857600, // = 1024 * 1024 * 100 byte = 100 MB
  ACCEPT: 'application/pdf',
  MULTIPE: false,
};

export const FILE_UPLOAD_STATUS = {
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
  LOADING: 'LOADING',
};

export const VIEW_TYPE = {
  LIST: 0,
  GRID: 1,
};

const _formatTags = ['{{ip-address}} ', '{{date}} ', '{{time}} '];
const _fontSizeOptions = [
  { key: 10, text: '10px' },
  { key: 11, text: '11px' },
  { key: 12, text: '12px' },
  { key: 14, text: '14px' },
  { key: 18, text: '18px' },
  { key: 24, text: '24px' },
  { key: 30, text: '30px' },
  { key: 36, text: '36px' },
  { key: 48, text: '48px' },
  { key: 60, text: '60px' },
  { key: 72, text: '72px' },
];
const _positionOptions = [
  {
    key: 'TOP_LEFT',
    text: 'Top Left',
    vertical: 'start',
    horizontal: 'start',
    styles: {
      180: { textAlign: 'end' },
      90: { transformOrigin: 'right top', transform: 'translate(-100%,0) rotate(-90deg)', textAlign: 'end' },
      45: { transformOrigin: 'right top', transform: 'translate(-30%,0) rotate(-45deg)' },
      315: { transformOrigin: 'left bottom', transform: 'rotate(-315deg)' },
      270: { transformOrigin: 'left bottom', transform: 'translate(0,-100%) rotate(-270deg)' },
    },
  },
  {
    key: 'TOP',
    text: 'Top Center',
    vertical: 'start',
    horizontal: 'center',
    styles: {
      0: { textAlign: 'center' },
      180: { textAlign: 'center' },
      90: { transformOrigin: 'right', transform: 'translate(-50%,-50%) rotate(-90deg)', textAlign: 'end' },
      45: { transformOrigin: 'right top', transform: 'translate(-30%,0) rotate(-45deg)', textAlign: 'end' },
      315: { transformOrigin: 'left top', transform: 'translate(30%,0) rotate(-315deg)' },
      270: { transformOrigin: 'left', transform: 'translate(50%,-50%) rotate(-270deg)' },
    },
  },
  {
    key: 'TOP_RIGHT',
    text: 'Top Right',
    vertical: 'start',
    horizontal: 'end',
    styles: {
      0: { textAlign: 'end' },
      90: { transformOrigin: 'right bottom', transform: 'translate(0,-100%) rotate(-90deg)', textAlign: 'end' },
      45: { transformOrigin: 'right bottom', transform: 'translate(0,-25%) rotate(-45deg)', textAlign: 'end' },
      315: { transformOrigin: 'left top', transform: 'translate(30%,0) rotate(-315deg)' },
      270: { transformOrigin: 'left top', transform: 'translate(100%,0) rotate(-270deg)' },
    },
  },
  {
    key: 'LEFT',
    text: 'Middle Left',
    vertical: 'center',
    horizontal: 'start',
    styles: {
      180: { textAlign: 'end' },
      90: { transformOrigin: 'top', transform: 'translate(-50%,50%) rotate(-90deg)', textAlign: 'center' },
      45: { transformOrigin: '', transform: 'translate(-5%,0) rotate(-45deg)' },
      315: { transformOrigin: '', transform: 'translate(-5%,0) rotate(-315deg)' },
      270: { transformOrigin: 'bottom', transform: 'translate(-50%,-50%) rotate(-270deg)', textAlign: 'center' },
    },
  },
  {
    key: 'CENTER',
    text: 'Middle Center',
    vertical: 'center',
    horizontal: 'center',
    styles: {
      0: { textAlign: 'center' },
      180: { textAlign: 'center' },
      90: { textAlign: 'center' },
      45: { textAlign: 'center' },
      315: { textAlign: 'center' },
      270: { textAlign: 'center' },
    },
  },
  {
    key: 'RIGHT',
    text: 'Middle Right',
    vertical: 'center',
    horizontal: 'end',
    styles: {
      90: { transformOrigin: 'bottom', transform: 'translate(50%,-50%) rotate(-90deg)', textAlign: 'center' },
      45: { transformOrigin: '', transform: 'translate(5%,0) rotate(-45deg)' },
      315: { transformOrigin: '', transform: 'translate(5%,0) rotate(-315deg)' },
      270: { transformOrigin: 'top', transform: 'translate(50%,50%) rotate(-270deg)', textAlign: 'center' },
    },
  },
  {
    key: 'BOTTOM_LEFT',
    text: 'Bottom Left',
    vertical: 'end',
    horizontal: 'start',
    styles: {
      180: { textAlign: 'end' },
      90: { transformOrigin: 'left top', transform: 'translate(0,100%) rotate(-90deg)' },
      45: { transformOrigin: 'left top', transform: 'rotate(-45deg)' },
      315: { transformOrigin: 'right bottom', transform: 'translate(-25%,0) rotate(-315deg)' },
      270: { transformOrigin: 'right bottom', transform: 'translate(-100%,0) rotate(-270deg)', textAlign: 'end' },
    },
  },
  {
    key: 'BOTTOM',
    text: 'Bottom Center',
    vertical: 'end',
    horizontal: 'center',
    styles: {
      0: { textAlign: 'center' },
      180: { textAlign: 'center' },
      90: { transformOrigin: 'left', transform: 'translate(50%,50%) rotate(-90deg)' },
      45: { transformOrigin: 'left bottom', transform: 'translate(30%,0) rotate(-45deg)' },
      315: { transformOrigin: 'right bottom', transform: 'translate(-35%,0) rotate(-315deg)', textAlign: 'end' },
      270: { transformOrigin: 'right', transform: 'translate(-50%,50%) rotate(-270deg)', textAlign: 'end' },
    },
  },
  {
    key: 'BOTTOM_RIGHT',
    text: 'Bottom Right',
    vertical: 'end',
    horizontal: 'end',
    styles: {
      0: { textAlign: 'end' },
      90: { transformOrigin: 'left bottom', transform: 'translate(100%,0) rotate(-90deg)' },
      45: { transformOrigin: 'left bottom', transform: 'translate(30%,0) rotate(-45deg)' },
      315: { transformOrigin: 'right top', transform: 'rotate(-315deg)', textAlign: 'end' },
      270: { transformOrigin: 'right top', transform: 'translate(0,100%) rotate(-270deg)', textAlign: 'end' },
    },
  },
];
const _rotationOptions = [
  { key: 0, text: 'Do not rotate' },
  { key: 90, text: '90º counterclockwise' },
  { key: 45, text: '45º counterclockwise' },
  { key: 315, text: '45º clockwise' },
  { key: 270, text: '90º clockwise' },
  { key: 180, text: '180º clockwise' },
];
const _transparencyOptions = [
  { key: 1, text: 'No transparency' },
  { key: 0.25, text: '25%' },
  { key: 0.5, text: '50%' },
  { key: 0.75, text: '75%' },
];
const _fontColors = [
  { id: 1, color: '#ed1737' },
  { id: 2, color: '#e89b15' },
  { id: 3, color: '#f7e32f' },
  { id: 4, color: '#6eeb83' },
  { id: 5, color: '#1685e5' },
  { id: 6, color: '#7a00e6' },
  { id: 7, color: '#ea4690' },
  { id: 8, color: '#f58091' },
  { id: 9, color: '#f2c87f' },
  { id: 10, color: '#faef8d' },
  { id: 11, color: '#aff4bb' },
  { id: 12, color: '#7fbcf0' },
  { id: 13, color: '#b673f1' },
  { id: 14, color: '#f39ac2' },
  { id: 15, color: '#161616' },
  { id: 16, color: '#3d3d3d' },
  { id: 17, color: '#646464' },
  { id: 18, color: '#8b8b8b' },
  { id: 19, color: '#b1b1b1' },
  { id: 20, color: '#d8d8d8' },
  { id: 21, color: '#ffffff' },
];
export const WATERMARK_SETTINGS = {
  type: {
    TEXT: 'Text',
    IMAGE: 'Image',
  },
  formatTags: _formatTags,
  fontSizeOptions: _fontSizeOptions,
  positionOptions: _positionOptions,
  rotationOptions: _rotationOptions,
  transparencyOptions: _transparencyOptions,
  fontColors: _fontColors,
};

export const LINK_VIEW_LAYOUT = [
  { key: 1, text: 'Present as grid' },
  { key: 0, text: 'Present as list' },
];

export const USER_ROLES = {
  c_member: 'c_member',
  c_admin: 'c_admin',
};

export const USER_ROLE_OPTIONS = [
  { key: USER_ROLES.c_member, text: 'Member' },
  { key: USER_ROLES.c_admin, text: 'Admin' },
];

export const REGEX = {
  DOMAIN: /^\w+([.-]?\w+)*(\.\w{2,3})+$/,
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line
};

export const SORT_DIRECTION = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export const ROWS_PER_PAGE = {
  FIVE: 5,
  TEN: 10,
  FIFTEEN: 15,
  TWENTY: 20,
};

export const DATAROOM_LIST_TYPE = {
  mine: 'mine',
  collaborate: 'collaborate',
};

export const SUBCRIPTION_PLAN_TIER = {
  MONTHS_OF_YEAR: 12,
  ONE_MONTH: 1,
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
};

export const PLAN_TYPE = {
  NEW: 'New',
  UPGRADE: 'Upgrade',
  DOWNGRADE: 'Downgrade',
};

export const CURRENCY = {
  USD: 'USD',
};

export const PAYMENT_METHOD = {
  PAYPAL: 'paypal',
};

export const COMPANY_USER_STATUS = {
  TRANSFERRED: -2,
  SUSPENDED: -1,
  INACTIVE: 0,
  ACTIVE: 1,
  INVITED: 2,
};

export const MEMBER_USER = {
  0: 'Owner',
  1: 'Member',

  OWNER: 0,
  MEMBER: 1,
};

export const PROCESS_STATUS = {
  PAYMENT_FAILED: 'Failed',
  PAYMENT_PAID: 'Paid',

  FAILED: 'PAYMENT_FAILED',
  PAID: 'PAYMENT_PAID',
};

export const LINK_STATUS = {
  ACTIVE: 0,
  DISABLED: 1,
  DEACTIVE: 2,
};

export const LINK_TYPE = {
  FILE: 0,
  DATA_ROOM: 1,
};

export const FILTER_MODE = {
  all: 'all',
  personal: 'personal',
};

export const FILTER_LINK_TYPE = {
  DATA_ROOM: 'data-room',
  CONTENT: 'content',
};

export const PAYPAL_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
};

export const BILLING_INFO_STATUS = {
  CANCELLED: 0,
  ACTIVE: 1,
  COMPLETED: 2,
};

export const FEATURE_KEYS = {
  DocumentLimit: 'DocumentLimit',
  DocumentPages: 'DocumentPages',
  UploadSizeLimit: 'UploadSizeLimit',
  IncludeStorage: 'IncludeStorage',
  TotalAssetsInSpace: 'TotalAssetsInSpace',
  AssetsInSpaceFolder: 'AssetsInSpaceFolder',
};

export const ACTION_LIMITATION = {
  DISABLED: 'disabled',
  REPLACED_RENDER: 'replacedRender',
  HIDE: 'hide',
  PASS_PROP: 'passProp',
};

export const FEATURE_NAME = {
  DocumentLimit: 'Document Limit',
  DocumentPages: 'Document Pages',
  UploadSizeLimit: 'Upload Size Limit',
  IncludeStorage: 'Include Storage',
  TotalAssetsInSpace: 'Total Assets In Space',
  AssetsInSpaceFolder: 'Assets In Space Folder',
};

export const PLAN_TIER_LEVEL = {
  LIMITED: 0,
};

export const COMPANY_USER_STATUS_NAME = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  INVITED: 'Invited',
};

export const SETTINGS = {
  COMPANY: 'company',
  PERSONAL: 'personal',
};

export const HASH_TAG = {
  USER_SETTING: '#user-setting',
};

export const TIME_VALUES = {
  MIN_HOURS_IN_DAY: 0,
  MAX_HOURS_IN_DAY: 23,
  MIN_MINUTES_IN_HOUR: 0,
  MAX_MINUTES_IN_HOUR: 59,
};

export const ACCOUNT_KEY = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
};

export const WEB_SOCKET_ACTION = {
  VISIT_LINK: 'VISIT_LINK',
  REFRESH_ALL_VIEWER: 'REFRESH_ALL_VIEWER',
};

export const WEB_SOCKET_DESTINATION = {
  ADD_VIEWER: '/app/addViewer',
  REFRESH_ALL_VIEWER: '/app/refresh',
};

export const WEB_SOCKET_TOPIC = {
  VIEW_LINK: `/topic/viewLink`,
  REFRESH_ALL_VIEWER: `/topic/refreshAllViewer`,
};

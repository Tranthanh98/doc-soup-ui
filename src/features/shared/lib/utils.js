import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

const toLocalTime = (dateTimeString, formatType = 'YYYY.MM.DD') => {
  dayjs.extend(utc);
  return dayjs.utc(dateTimeString).local().format(formatType);
};

function millisecondsToStr(diffMilliseconds) {
  function numberEnding(number) {
    return number > 1 ? 's' : '';
  }

  let temp = Math.floor(diffMilliseconds / 1000);
  const years = Math.floor(temp / 31536000);

  if (years < 0) {
    return 'Just now';
  }

  if (years) {
    return `${years}y ago`;
  }

  const months = Math.floor((temp %= 31536000) / 2592000);
  if (months) {
    return `${months}mo ago`;
  }

  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return `${days}d ago`;
  }
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return `${hours} hour${numberEnding(hours)} ago`;
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return `${minutes} minute${numberEnding(minutes)} ago`;
  }
  const seconds = temp % 60;
  if (seconds) {
    return `${seconds} second${numberEnding(seconds)} ago`;
  }
  return 'just now';
}

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const createGroupTable = (data) => {
  if (!Array.isArray(data)) {
    throw new Error('data must be an array');
  }
  return data.map((i, index) => {
    const name = i.name ?? `name${index}`;
    const key = i.key ?? `group${index}`;
    const level = i.level ?? 0;
    const startIndex = index;
    const count = 1;
    const isCollapsed = true;

    return { ...i, name, key, level, startIndex, count, isCollapsed };
  });
};

const calculateDisplayValueXAxis = (totalPages) => {
  const maxPageNumber = 40;
  const pageStep = totalPages < 100 ? 5 : 10;
  let pageNumbers = []; // contain page numbers for display
  if (!totalPages) {
    return [];
  }
  if (totalPages <= maxPageNumber) {
    return undefined;
  }

  pageNumbers = [pageStep];
  let pageIndex = 0;
  while (pageNumbers[pageIndex] + pageStep <= totalPages) {
    pageNumbers.push(pageNumbers[pageIndex] + pageStep);
    pageIndex++;
  }

  return pageNumbers;
};

const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // support for old browser version
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};

function _copyAndSort(items, columnKey, isSortedDescending) {
  const key = columnKey;
  return items.slice(0).sort((a, b) => {
    if (a[key] === b[key]) {
      return 0;
    }
    const comperation = isSortedDescending ? a[key] < b[key] : a[key] > b[key];
    return comperation ? 1 : -1;
  });
}

function sortGroupData({ sortedColumn, columns, groups }) {
  if (sortedColumn && sortedColumn.isSortable) {
    const newColumns = columns.slice();
    const currColumn = newColumns.filter((currCol) => sortedColumn?.key === currCol?.key)[0];
    newColumns.forEach((newCol) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn?.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        const col = newCol;
        col.isSorted = false;
        col.isSortedDescending = true;
      }
    });
    return _copyAndSort(groups, currColumn.fieldName, currColumn.isSortedDescending);
  }
  return groups;
}

export {
  toLocalTime as default,
  randomColor,
  millisecondsToStr,
  createGroupTable,
  calculateDisplayValueXAxis,
  copyToClipboard,
  sortGroupData,
};

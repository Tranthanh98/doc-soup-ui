class FileHelper {
  download(file, type, fileDownloadName) {
    const URL = window.URL || window.webkitURL;
    const url = URL.createObjectURL(new Blob([file], { type, encoding: 'UTF-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileDownloadName;
    link.click();
    link.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 100);
  }
}
export default new FileHelper();

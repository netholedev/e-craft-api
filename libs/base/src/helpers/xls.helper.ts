export const xlsFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(xls|xlsx|XLS|XLSX)$/)) {
    // TODO
    return callback(new Error('Only Excel files are allowed!'), false);
  }
  callback(null, true);
};

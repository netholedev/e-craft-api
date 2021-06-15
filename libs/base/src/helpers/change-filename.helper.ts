import { extname } from 'path';
import { v4 } from 'uuid';

export const changeFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  callback(null, v4() + fileExtName);
};

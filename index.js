import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './src/constants/index.js';
import { initMongoConnection } from './src/db/initMongoConnection.js';
import { startServer } from './src/server.js';
import { createDirIfNotExists } from './src/utils/createDirIfNotExists.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  startServer();
};

bootstrap();

import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const ACCESS_TOKEN_TTL = 300 * 60 * 1000; // 15 minutes in milliseconds;
export const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds;

export const SMTP = {
  SERVER: process.env.SMTP_SERVER,
  PORT: process.env.SMTP_PORT,
  USER: process.env.SMTP_USER,
  PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
};

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'src/tmp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOSTNAME?: string;
      HOST?: string;
      PORT?: string;
      NODE_ENV?: 'development' | 'production';
      MONGODB_CONNECTION_STRING?: string;
      SESSION_SECRET?: string;
      MEMBER_PASSWORD?: string;
      ADMIN_PASSWORD?: string;
    }
  }
}

export { };

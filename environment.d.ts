declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GOOGLE_ID : string;
        GOOGLE_SECRET: string;
        MONGODB_URI: string;
        S3_ACCESS_KEY: string;
        S3_SECRET_ACCESS_KEY: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
      }
    }
}

export {}
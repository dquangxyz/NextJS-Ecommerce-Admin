declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GOOGLE_ID : string;
        GOOGLE_SECRET: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
      }
    }
}

export {}
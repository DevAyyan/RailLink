// /src/sharedCode/common.ts
export interface IDBSettings {
    host: string
    port: number
    user: string
    password: string
    database: string
  }
  
  export const GetDBSettings = (): IDBSettings => {
    const env = process.env.NODE_ENV // Get the environment value (development or production)
  
    if (env === 'development') {
      // Return development environment variables
      return {
        host: 'localhost',
        port: 8080,
        user: 'root',
        password: 'Z4275z991!',
        database: 'raillink',
      }
    } else {
      // Return production environment variables
      return {
        host: process.env.host!,
        port: parseInt(process.env.port!),
        user: process.env.user!,
        password: process.env.password!,
        database: process.env.database!,
      }
    }
  }
  
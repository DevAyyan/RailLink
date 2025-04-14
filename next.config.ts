import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Define environment variables for both production and development
  env: {
    // Production Environment Variables
    host: process.env.PROD_HOST,
    port: process.env.PROD_PORT,
    user: process.env.PROD_USER,
    password: process.env.PROD_PASSWORD,
    database: process.env.PROD_DATABASE,

    // Development Environment Variables
    host_dev: process.env.DEV_HOST,
    port_dev: process.env.DEV_PORT,
    user_dev: process.env.DEV_USER,
    password_dev: process.env.DEV_PASSWORD,
    database_dev: process.env.DEV_DATABASE,
  },

  // Optionally enable React Strict Mode (for better error handling and debugging)
  reactStrictMode: true,

  // Additional configurations for Next.js can go here
};

export default nextConfig;

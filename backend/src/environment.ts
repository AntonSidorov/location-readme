export const environment = {
  port: process.env.PORT || 4000,
  dbString: process.env.DB_STRING || '',
  dbName: process.env.DB_NAME || `landmark-remark`,
  production: process.env.IS_PRODUCTION.toLowerCase() === 'true' || false,
  auth0: {
    domain: process.env.AUTH0_DOMAIN || '',
  },
};

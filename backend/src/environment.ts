export const environment = {
  port: 4000 || process.env.PORT,
  dbString: `` || process.env.DB_STRING,
  dbName: `landmark-remark` || process.env.DB_NAME,
  production: process.env.IS_PRODUCTION.toLowerCase() === 'true' || false,
  auth0: {
    domain: '' || process.env.AUTH0_DOMAIN,
  },
};

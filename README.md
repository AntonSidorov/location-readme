# Location Readme

A full version of this readme is available to the intended audience of this project, attached with the email.

To run this application you will need to `npm i` and `npm start` both the `frontend` and the `backend` folders.
The API requires a mongodb connection string, either provided in a .env file (locally), or as an environment variable.

## Run Instructions

Both the frontend and the backend have 2 configurations: `production` and `development`. Some aspects of both can also be configured through environment variables.

On the backend, in `development` mode, a `.env` file is used to supply the important credentials to the application. ENV variables in the backend are:

- `DB_STRING` - the mongodb connection string. If you'd like to use a custom server, you only need to replace that
- `DB_NAME` - the database the backend should try open on the mongodb server
- `IS_PRODUCTION` - self explanatory. Production builds are minified. Dev builds allow to bypass JWT validation using a header `lr_dev_uid` for some requests. This was helpful in developing and testing the API.
- `AUTH0_DOMAIN` - the tenant domain for auth0. Needed to load the public keys and verify a JWT signed by auth0

On the frontend, there are 2 files: `environment.ts` - which is used for local development, and `environment.prod.ts` - which is replaced during deployments with the real production value. The `production` setting in these files determines whether or not to use SSL when connecting to the backend.

FROM node:slim

#TODO: fix webpack .env to allow for dynamic port loading
ENV PORT=8080
ENV DB_STRING=""
ENV DB_NAME=""
ENV IS_PRODUCTION=true
ENV AUTH0_DOMAIN=""


WORKDIR /usr/lrb/app

COPY dist/ ./
COPY node_modules/* ./

EXPOSE $PORT
CMD ["node", "dist/main.js"]
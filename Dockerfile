FROM node:18-bullseye-slim as base

ENV NODE_ENV="production"


# Install dependencies & build
FROM base as build

WORKDIR /remix-app

ADD package.json package-lock.json ./

# Install dev dependencies as well even though we're in production mode. They are needed for the build.
RUN npm install --production=false

ADD . .
RUN npm run build

# Remove dev dependencies after finishing build to keep the image size down
RUN npm prune --production

FROM base

WORKDIR /remix-app

COPY --from=build /remix-app/node_modules ./node_modules
COPY --from=build /remix-app/build ./build
COPY --from=build /remix-app/server.mjs ./server.mjs
COPY --from=build /remix-app/public ./public
COPY --from=build /remix-app/package.json ./package.json
COPY --from=build /remix-app/start.sh ./start.sh

RUN chmod +x start.sh

ENTRYPOINT ["./start.sh"]

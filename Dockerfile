# --------------> The build image__
FROM node:latest AS development
RUN --mount=type=cache,target=/var/cache/apt apt-get update && apt-get install -y --no-install-recommends dumb-init
WORKDIR /usr/src/app/dev
COPY package*.json /usr/src/app/dev
# Install both production and dev dependencies as they are required to build the source code
RUN --mount=type=cache,target=/var/cache/dev-modules npm ci

# --------------> The Compilation image__
FROM node:20.13.1-bookworm-slim AS build
USER node
WORKDIR /usr/src/app/build
# Copy both the dev and prod dependencies in order to successfully the application
COPY --chown=node:node package*.json /usr/src/app/build
COPY --chown=node:node --from=development /usr/src/app/dev/node_modules /usr/src/app/build/node_modules

# Install only production dependencies that will only be used in the final build(for production)
WORKDIR /usr/src/app/prod
COPY --chown=node:node package*.json /usr/src/app/prod
RUN --mount=type=cache,target=/var/cache/prod-moudles npm ci --omit=dev

# Change working directory to build directory
WORKDIR /usr/src/app/build

# Copy app source files into image
COPY --chown=node:node . /usr/src/app/build

# Build application which produces a production bundle stored in the dist folder
USER root

RUN npm run build

USER node

# --------------> The production image__
FROM node:20.13.1-bookworm-slim
USER node
COPY --from=development /usr/bin/dumb-init /usr/bin/dumb-init
WORKDIR /usr/src/app
# Change ownership of the application folder to node user so that user(node) can CRUD files within this folder
USER root
RUN chown node:node /usr/src/app
USER node
COPY --chown=node:node --from=build /usr/src/app/prod/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/build/dist /usr/src/app
CMD ["dumb-init", "node", "main.js"]

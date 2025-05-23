# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=16.17.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY --link . .

# Build application
RUN --mount=type=secret,id=REACT_APP_API_KEY \
    --mount=type=secret,id=REACT_APP_FUEL_API_AUTHORIZATION_HEADER \
    REACT_APP_API_KEY="$(cat /run/secrets/REACT_APP_API_KEY)" \
    REACT_APP_FUEL_API_AUTHORIZATION_HEADER="$(cat /run/secrets/REACT_APP_FUEL_API_AUTHORIZATION_HEADER)" \
    npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]

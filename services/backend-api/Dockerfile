# --- Build Stage ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm globally in the builder stage
RUN npm install -g pnpm

# Copy root package.json and pnpm-workspace.yaml to leverage Docker layer caching for pnpm install
COPY package.json pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copy service-specific package.json and tsconfig files
COPY services/backend-api/package.json ./services/backend-api/
COPY services/backend-api/tsconfig.json ./services/backend-api/
COPY services/backend-api/tsconfig.build.json ./services/backend-api/

# Copy shared packages package.json and tsconfig.json that are direct dependencies
# Ensure these paths and dependencies are correctly listed in backend-api's package.json
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-types/tsconfig.json ./packages/shared-types/

# Install all dependencies for the monorepo.
# pnpm will intelligently hoist and link, but installing from root ensures all workspace protocols are resolved.
# Using --frozen-lockfile is good practice if pnpm-lock.yaml is committed and up-to-date.
RUN pnpm install --frozen-lockfile --prod=false

# Copy the entire monorepo source code.
# This is done after pnpm install to leverage caching if only source code changes.
COPY . .

# Build shared dependencies first, then the target application.
# This ensures that shared packages are built before the services that depend on them.
RUN pnpm --filter @shared-types build
RUN pnpm --filter backend-api build

# --- Production Stage ---
FROM node:18-alpine

WORKDIR /usr/src/app

# Set NODE_ENV to production
ENV NODE_ENV production
ENV API_PORT 3000 # Default port

# Install pnpm to handle workspace dependencies correctly in production
RUN npm install -g pnpm

# Copy root package.json and pnpm-workspace.yaml for pnpm to understand the workspace structure.
COPY package.json pnpm-workspace.yaml ./

# Copy package.json files for the production service and its direct workspace dependencies.
COPY services/backend-api/package.json ./services/backend-api/
COPY packages/shared-types/package.json ./packages/shared-types/ # If shared-types is a production dependency

# Install only production dependencies for the backend-api service.
# pnpm deploy command is specifically designed for this scenario,
# creating a pruned dependency tree for a specific package.
# We need to copy the built shared package before running pnpm deploy or install.
COPY --from=builder /usr/src/app/packages/shared-types/dist ./packages/shared-types/dist
RUN pnpm --filter backend-api deploy --prod ./deploy/backend-api

# After `pnpm deploy`, the production files (including node_modules) for `backend-api`
# will be in `./deploy/backend-api`. We need to move them to the final app location.
# Create a new application directory for the final image.
RUN mkdir -p /opt/app/services/backend-api
RUN mkdir -p /opt/app/packages/shared-types # For shared dependencies

# Copy the deployed backend-api application (including its pruned node_modules)
COPY --from=builder /usr/src/app/deploy/backend-api/ /opt/app/services/backend-api/
# Copy the built shared package if it's needed at runtime and not bundled
COPY --from=builder /usr/src/app/packages/shared-types/dist /opt/app/packages/shared-types/dist

# Adjust WORKDIR to the location of the backend-api service
WORKDIR /opt/app/services/backend-api

# Expose the port the app runs on (should match API_PORT)
EXPOSE ${API_PORT}

# Command to run the application.
# Note: The path to main.js is now relative to the new WORKDIR.
CMD ["node", "dist/main.js"]

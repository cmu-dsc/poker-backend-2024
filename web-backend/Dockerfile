FROM node:21-alpine

# Install pnpm
RUN npm install -g pnpm

# Install bash and dependencies for Google Cloud SDK
RUN apk add --no-cache bash curl python3 py3-pip gcc python3-dev musl-dev libc6-compat openssh-client git && \
    curl -sSL https://sdk.cloud.google.com | bash

# Set the PATH to include gcloud and gsutil
ENV PATH $PATH:/root/google-cloud-sdk/bin

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . /app

# Build app
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 8080

# Run the app
CMD ["node", "-r", "tsconfig-paths/register", "dist/src/server.js"]

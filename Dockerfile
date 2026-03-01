# Dev Dockerfile: use with volume mount for hot reload (no COPY of app).
FROM node:20-alpine

WORKDIR /app

# Install deps (package.json mounted at run time in dev)
COPY package.json package-lock.json* ./
RUN npm install

EXPOSE 3000
ENV NODE_ENV=development
# Next.js dev server with polling for Docker volume changes
CMD ["npm", "run", "dev"]

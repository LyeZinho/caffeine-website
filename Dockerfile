# Builds the static site and serves it with nginx (used by Coolify for caffeine.devscafe.org).
FROM node:22-alpine AS build
WORKDIR /site
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY content ./content
COPY site ./site
RUN node site/build.mjs --check

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /site/dist /usr/share/nginx/html
EXPOSE 80

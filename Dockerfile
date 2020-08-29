FROM node:12-alpine AS node_base
WORKDIR /root/frontend
COPY frontend/tracker/package.json .

FROM node_base AS node_dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production

FROM node_dependencies AS node_release
COPY --from=node_dependencies /root/frontend/node_modules ./node_modules
COPY frontend/tracker/ .
RUN npm run build

FROM caddy:alpine AS caddy
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8
RUN pip install --no-cache-dir sqlalchemy ujson python-multipart nsepy
ENV BIND 127.0.0.1:8000
COPY ./app /app
COPY --from=node_release /root/frontend/build /frontend
COPY ./prestart.sh /app
COPY Caddyfile /

COPY --from=caddy /usr/bin/caddy /usr/bin/caddy

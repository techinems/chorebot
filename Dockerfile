FROM node:24-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY utilities/ ./utilities/

EXPOSE 3000

# The Google service-account key (keys/sheets-api.json) is NOT baked into the
# image — mount it at runtime, e.g.:
#   -v /host/sheets-api.json:/usr/src/app/keys/sheets-api.json:ro
#
# NOTE: runs as root so the mounted key is readable regardless of volume
# ownership (matching prior behavior). Running non-root + moving the key off
# disk (Workload Identity / injected secret) is a recommended follow-up.

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]

FROM docker.io/library/nginx:1.29.3-alpine@sha256:b3c656d55d7ad751196f21b7fd2e8d4da9cb430e32f646adcf92441b72f82b14

LABEL org.opencontainers.image.source="https://github.com/ncecere/harness-use" \
      org.opencontainers.image.description="Harness Kits: AI workspace setup guides" \
      org.opencontainers.image.licenses="MIT AND CC-BY-NC-4.0"

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 index.html library.html examples.html glossary.html favicon.svg /usr/share/nginx/html/
COPY --chown=101:101 css /usr/share/nginx/html/css
COPY --chown=101:101 fonts /usr/share/nginx/html/fonts
COPY --chown=101:101 js /usr/share/nginx/html/js
COPY --chown=101:101 img /usr/share/nginx/html/img
COPY --chown=101:101 kits /usr/share/nginx/html/kits
COPY --chown=101:101 files /usr/share/nginx/html/files

USER 101:101
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]

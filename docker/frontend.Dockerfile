FROM mysql:8.0 AS build
RUN microdnf -y update && microdnf -y install nodejs npm && microdnf clean all || \
    (dnf -y update && dnf -y install nodejs npm && dnf clean all)
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --only=production || npm install --omit=dev
COPY frontend ./
RUN npm run build

FROM mysql:8.0
RUN microdnf -y update && microdnf -y install nginx && microdnf clean all || \
    (dnf -y update && dnf -y install nginx && dnf clean all)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

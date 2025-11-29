FROM mysql:8.0
COPY backend/src/main/resources/schema.sql /docker-entrypoint-initdb.d/schema.sql
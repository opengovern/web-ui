# Set the base image to node:20-alpine
FROM docker.io/node:20-alpine as build

# Specify where our app will live in the container
WORKDIR /app

# Copy the React App to the container
COPY . /app/

# Prepare the container for building React
RUN npm install
RUN npm run build
RUN npm run sentry:sourcemaps

# Prepare nginx
FROM docker.io/nginx:1.25.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/.env.example /usr/share/nginx/html/.env
RUN rm /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d

RUN apk add --update npm
RUN npm i -g runtime-env-cra@0.2.4

WORKDIR /usr/share/nginx/html

# Fire up nginx
EXPOSE 7298
#CMD ["nginx", "-g", "daemon off;"]
CMD ["/bin/sh", "-c", "runtime-env-cra --config-name=./env-config.js && nginx -g \"daemon off;\""]

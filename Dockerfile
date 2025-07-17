# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn config set strict-ssl false && yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Serve with nginx
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
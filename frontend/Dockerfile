# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# install deps
COPY package*.json ./
RUN npm ci

# copy source
COPY . .

# IMPORTANT: pass API base to Vite at build time
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# build React app
RUN npm run build


# ---------- Production stage ----------
FROM nginx:alpine AS production

# custom nginx config (reverse proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

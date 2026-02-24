# Build stage – frontend with Vite
FROM node:20-alpine AS builder
WORKDIR /app

# Build-time API URL (browser will call this from the host)
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage – nginx serves static files
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default config and use ours (SPA fallback)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

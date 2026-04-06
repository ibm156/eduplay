FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our config
COPY nginx.conf /etc/nginx/nginx.conf

# Create dirs for static/media volumes
RUN mkdir -p /app/staticfiles /app/media

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

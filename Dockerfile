# Base image with PHP, Composer, Node, etc.
FROM php:8.2-fpm

# Install system dependencies & PHP extensions
RUN apt-get update && apt-get install -y \
    git curl unzip zip libpng-dev libonig-dev libxml2-dev libzip-dev libjpeg-dev libfreetype6-dev \
    nodejs npm \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql mbstring zip gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy app source code
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Copy .env if exists (or manually mount in deployment)
# COPY .env.example .env

# Generate key (only if needed in dev)
# RUN php artisan key:generate

# Install Node dependencies & build frontend
RUN npm install && npm run build

# Expose port (useful if needed for PHP dev server)
EXPOSE 8000

# Entrypoint when running container (optional, adjust as needed)
CMD ["php-fpm"]

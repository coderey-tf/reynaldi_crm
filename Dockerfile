# Base image dengan Node.js dan PHP
FROM node:20-bullseye

# Install PHP dan dependensi Laravel
RUN apt update && apt install -y \
    php \
    php-cli \
    php-mbstring \
    php-xml \
    php-bcmath \
    php-curl \
    php-mysql \
    unzip \
    git \
    curl \
    libzip-dev \
    zip \
    && apt clean

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

# Enable corepack agar bisa pakai pnpm
RUN corepack enable

# Buat direktori kerja
WORKDIR /app

# Salin semua file ke dalam container
COPY . .

# Install dependency backend (PHP)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Install dependency frontend (React + Vite)
RUN pnpm install

# Build frontend
RUN pnpm run build

# Expose port Laravel default
EXPOSE 8000

# Set permission storage & cache
RUN chmod -R 775 storage bootstrap/cache

# Generate key dan migrate (optional, untuk dev saja)
RUN php artisan key:generate
# RUN php artisan migrate --force

# Jalankan Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

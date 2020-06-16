FROM php:7.4-fpm

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN apt-get install -y nodejs

RUN npm install

RUN curl -s https://getcomposer.org/installer | php

RUN mv composer.phar /usr/local/bin/composer

RUN apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libpng-dev zlib1g-dev libzip-dev libpq-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg

RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql

RUN docker-php-ext-install -j$(nproc) gd zip pdo pdo_pgsql pgsql

RUN apt-get install unzip

RUN composer update && composer install

RUN npm run webpack

RUN chown -R www-data:www-data /usr/src/app

EXPOSE 9000

CMD "php-fpm"


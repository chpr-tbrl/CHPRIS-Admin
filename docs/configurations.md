# Development Setup Guide

Please follow the instructions below to setup this project

## Install dependencies

```bash
yarn install
```

## Configure environment variables

Create development and production .env configuration files from the env.example template

```bash
cp env.example .env.development.local

cp env.example .env.production.local

```

**.env.development.local** is used in development environments and **.env.production.local** is used when creating production builds.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), which specifies variable naming conventions

Below are the defaults

- PORT -> development port
- SASS_PATH -> location of sass files
- REACT_APP_API_URL -> Backend API URL
- REACT_APP_API_VERSION -> API version
- HTTPS -> Enable or disable https
- SSL_CRT_FILE -> Location of SSL CRT file
- SSL_KEY_FILE -> Location of SSL Key file

## Start development server

```bash
yarn start
```

Open [http://localhost:19100](http://localhost:19100) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

Create an optimized production build that can be hosted on servers. This step uses the variables in **.env.production.local**

```bash
yarn build
```

Check the `build` folder for deployable files once complete.

## Deployment

For a Linux/Ubuntu server running apache2 web server, follow these steps to deploy the site

- Enable rewrite module

```bash
sudo a2enmod rewrite
```

- Open apache configuration file at /etc/apache2/apache2.conf
- Change the AllowOverride permission from none to all

```bash
<Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
</Directory>
```

- Copy contents of build folder to server root normally located at /var/www/html. Ensure the .htaccess file is copied over. The .htaccess file is quite important as specified [here](https://create-react-app.dev/docs/deployment/#static-server)

```bash
sudo cp -r build/. /var/www/html
```

- restart apache2

```bash
sudo systemctl restart apache2
```

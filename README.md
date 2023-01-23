# PassyFire
A web UI for managing Passy instances.
## Why?
Cloudflare Zero Trust's TCP offerings didn't work the way I wanted, and I already had a protocol for handling this, but wanted to modernize it.
## Usage
Download this repo, and install all packages:
```bash
# Download the repo
$ git clone https://github.com/greysoh/passyfire.git
# Go into the directory
$ cd passyfire
# Install packages
$ npm install
```
For initial setup, set the following environment variables:
  * `PF_SET_USERNAME` to a username for the default account creation
  * `PF_SET_PASSWORD` to a password for the default account creation  
  
Then, start the application:
```bash
npm start
```
## Docker Usage
First, build the image:
```bash
$ docker build -t passyfire --network=host .
```
Create the initial account .env file, with these contents:
```
PF_SET_USERNAME=USERNAME_HERE
PF_SET_PASSWORD=PASSWORD_HERE
```
Then, create the container:
```bash
$ docker create --network="host" --env-file=".env" passyfire
```
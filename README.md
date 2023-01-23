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
## Docker Database Backing Up
Let's assume you already have the container name (or id).  
  
First, start the container:
```bash
docker start CONTAINER_NAME_OR_ID
```
First, get a shell in the container:
```bash
docker exec -it CONTAINER_NAME_OR_ID "/bin/sh"
```
You are now in the container. Run the following command:
```bash
$ clear; cat db.json; echo; echo "DO NOT COPY BEYOND THIS LINE"
```
(NOTE: All you really have to do is `cat db.json`, but I did it this way to make it easier to see.)  
You should see output like this:
```json
{"keys": ["data_here"], "names": ["more_data"], "version": 1}
```
Copy all that data, and save it to a `db.json` file. Note that you must not include anything extra.
## Docker Database Restoring Backup
You *must* do this before creating a container, by the way.  
  
All you have to do is copy the db.json file you created to the root of this directory, and create the image, then the container.
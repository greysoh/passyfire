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
Because I'm lazy (cry about it), you also need to apply a git patch to my 1udb library.
```bash
$ git apply fix.patch
```
For initial setup, set the following environment variables:
  * `PF_SET_USERNAME` to a username for the default account creation
  * `PF_SET_PASSWORD` to a password for the default account creation  
  
Then, start the application:
```bash
npm start
```
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
## Docker
### Usage
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
### Backing Up
Let's assume you already have the container name (or id).  
  
First, start the container:
```bash
docker start CONTAINER_NAME_OR_ID
```
After that, get a shell in the container:
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
### Restoring Backup
You *must* do this before creating a container, by the way.  
  
All you have to do is copy the db.json file you created to the root of this directory, and create the image, then the container.
### Updating
First, start the container:
```bash
docker start CONTAINER_NAME_OR_ID
```
After that, get a shell in the container:
```bash
docker exec -it CONTAINER_NAME_OR_ID "/bin/sh"
```
Then, check if we have the script `update-docker.sh`:
```bash
$ ls ./update-docker.sh
# If we have the script
./update-docker.sh
# If we do not have the script
ls: cannot access 'update-docker.sh': No such file or directory
```
If you do NOT have the script, run this command to get it:
```bash
$ apk add curl
(1/1) Installing curl (7.88.1-r1)
Executing busybox-1.35.0-r29.trigger
OK: 49 MiB in 29 packages
$ curl "https://raw.githubusercontent.com/greysoh/passyfire/master/update-docker.sh" > update-docker.sh
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   179  100   179    0     0   1170      0 --:--:-- --:--:-- --:--:--  1177
```
Make sure we have execute permissions on the script:
```bash
$ chmod +x update-docker.sh
```
Then, execute the script:
```bash
$ ./update-docker.sh
# Example output:
Updating...
+ apk add git
OK: 49 MiB in 28 packages
+ git reset --hard
HEAD is now at 96af22d chore: Switches nodemon to use forever instead.
+ git checkout master
Already on 'master'
Your branch is behind 'origin/master' by 23 commits, and can be fast-forwarded.
  (use "git pull" to update your local branch)
+ git add BREAKING-CHANGES.md Dockerfile README.md db.json forever.sh index.mjs libs node_modules package-lock.json package.json pages patches src update-docker.sh
The following paths are ignored by one of your .gitignore files:
db.json
node_modules
package-lock.json
hint: Use -f if you really want to add them.
hint: Turn this message off by running
hint: "git config advice.addIgnoredFile false"
+ git stash
Saved working directory and index state WIP on master: 96af22d chore: Switches nodemon to use forever instead.
+ git pull
Updating 96af22d..4ce7642
Fast-forward
 forever.sh                                               |  4 ++++
 index.mjs                                                | 38 ++++++++++++++++++++++++++------------
 libs/deepMergeObj.mjs                                    | 34 ----------------------------------
 libs/mergeUser.mjs                                       | 30 ++++++++++++++++++++++++++++++
 libs/noScope.mjs                                         | 13 ++++++++++++-
 libs/syncRunners.mjs                                     |  3 ++-
 package.json                                             |  5 ++---
 pages/dashboard/sysinternals/!troubleshooting/index.html | 14 +++++++-------
 pages/dashboard/sysinternals/proxy/add/index.html        |  8 ++++++++
 pages/dashboard/sysinternals/proxy/add/index.mjs         | 12 +++++++++---
 pages/dashboard/sysinternals/proxy/index.html            |  2 +-
 pages/dashboard/sysinternals/user/add/index.html         |  4 +++-
 pages/dashboard/sysinternals/user/add/index.mjs          |  7 +++++--
 pages/dashboard/sysinternals/user/guestToggle.mjs        | 27 +++++++++++++++++++++++++++
 pages/dashboard/sysinternals/user/index.html             |  3 ++-
 pages/dashboard/sysinternals/user/index.mjs              | 21 ++++++++++++++++-----
 pages/index.mjs                                          |  2 +-
 patches/@creamy-dev+passy+0.1.3.patch                    | 62 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++----
 src/tunnels/add.mjs                                      |  1 +
 src/tunnels/edit.mjs                                     | 30 ++++++++++++++++++++----------
 src/tunnels/get.mjs                                      | 19 ++++++++++++++++++-
 src/users/add.mjs                                        |  4 ++--
 src/users/get.mjs                                        |  2 +-
 src/users/guest-access/disable.mjs                       | 45 +++++++++++++++++++++++++++++++++++++++++++++
 src/users/guest-access/enable.mjs                        | 58 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 src/users/remove.mjs                                     |  6 +-----
 update-docker.sh                                         | 11 +++++++++++
 27 files changed, 370 insertions(+), 95 deletions(-)
 create mode 100644 forever.sh
 delete mode 100644 libs/deepMergeObj.mjs
 create mode 100644 libs/mergeUser.mjs
 create mode 100644 pages/dashboard/sysinternals/user/guestToggle.mjs
 create mode 100644 src/users/guest-access/disable.mjs
 create mode 100644 src/users/guest-access/enable.mjs
 create mode 100644 update-docker.sh
+ rm -rf node_modules
+ npm install

> passyfire-backend@0.1.0 postinstall
> patch-package; chmod +x forever.sh

patch-package 6.5.1
Applying patches...
@creamy-dev/passy@0.1.3 (checkmark)

added 112 packages, and audited 113 packages in 2s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
$
```
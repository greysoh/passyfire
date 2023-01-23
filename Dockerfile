# run with --network=host, pwease >w<
FROM node:19.3.0-alpine

WORKDIR /files/
COPY . /files/
RUN npm install

ENTRYPOINT npm start
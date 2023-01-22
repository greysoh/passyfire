import sha from "js-sha512";

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function genToken(username) {
  return sha.sha512(sha.sha384(getRandomInt(1000000, 9999999) + username));
}
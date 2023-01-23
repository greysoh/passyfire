export function getScopesAllEnabled() {
  return {
    users: {
      add: true,
      remove: true,
      get: true,
      getPasswords: true
    },
    routes: {
      add: true,
      remove: true,
      start: true,
      stop: true
    }
  }
}
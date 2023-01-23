export function getScopesAllEnabled() {
  return {
    hasAll: true,
    users: {
      hasAll: true,
      add: true,
      remove: true,
      get: true,
      getPasswords: true
    },
    routes: {
      hasAll: true,
      add: true,
      remove: true,
      start: true,
      stop: true
    }
  }
}
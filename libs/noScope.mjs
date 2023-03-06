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
      stop: true,
      get: true,
      getPasswords: true
    }
  }
}

export function getScopesAllDisabled() {
  const allEnabled = getScopesAllEnabled();

  Object.keys(allEnabled.users).forEach(v => allEnabled.users[v] = false);
  Object.keys(allEnabled.routes).forEach(v => allEnabled.routes[v] = false);

  return allEnabled;
}
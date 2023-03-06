/**
 * Merge user permissions the correct way.
 * This patches database injection, and privelege escelation
 * @param {object} defScopes Default scopes to use
 * @param {object} userPerms Permissions of the user
 * @param {object} reqPerms Requested permissions
 * @returns {object} Merged permissions
 */
export function mergeUserPerms(defScopes, userPerms, reqPerms) {
  const item = {};

  for (const subScopeKey of Object.keys(defScopes)) {
    const subScope = defScopes[subScopeKey];
    item[subScopeKey] = {};

    for (const scopeKey of Object.keys(subScope)) {
      const scope = subScope[scopeKey];

      if (!userPerms[subScopeKey][scopeKey]) {
        item[subScopeKey][scopeKey] = false;
      } else if (typeof reqPerms[subScopeKey][scopeKey] == "boolean") {
        item[subScopeKey][scopeKey] = reqPerms[subScopeKey][scopeKey];
      } else {
        item[subScopeKey][scopeKey] = scope;
      }
    }
  }

  return item;
}
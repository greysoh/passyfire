# 0.1.0
- Deprecated old tunnels format, for new one containing the host and port. This will be utilized for cloudflare access related stuff.
  * **NOTE**: Automatic migration has been added.
- Deprecated the `hasAll` scope, since it doesn't really do anything.
- Switched `nodemon` to `forever`.
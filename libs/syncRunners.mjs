import PassyServer from "@creamy-dev/passy";

export async function syncRunners(runners) {
  const runnerSynced = [];

  for (const i of runners) {
    if (!i.running) continue;
    
    const passyInstance = new PassyServer({
      originalPort: i.proxyUrlSettings.port - 1,
      passedPort: i.proxyUrlSettings.port,

      isIncenerator: false,
      passwords: i.passwords,

      server: {
        ip: i.dest.split(":")[0],
        port: i.dest.split(":")[1] ? i.dest.split(":")[1] : 80,
        protocol: i.proxyUrlSettings.protocol
      }
    });

    try {
      passyInstance.main();
    } catch (e) {
      console.log("Error occured while passyfire was proxying '%s'!", i.dest);
      console.log(e);
    }

    runnerSynced.push(passyInstance);
  }

  return runnerSynced;
}
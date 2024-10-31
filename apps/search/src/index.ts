import { log } from "@project-maps/logging";

import { App } from "./app";

const main = async () => {
  const app = new App()

  await app.createIndex()
}

main()
.catch((error) => log.error(error, 'Main error'))

process.on('unhandledRejection', (error) => {
  log.error(error)
})

process.on('uncaughtException', (error) => {
  log.error(error)
})

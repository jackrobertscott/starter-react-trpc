import {userRouter} from "@server/router-user"
import {serverConfig} from "@server/server-config"
import {closeMongoConnection, getMongoClient} from "@server/utils-mongodb"
import {createHTTPServer} from "@trpc/server/adapters/standalone"
import {mergeRouters} from "@trpc/server/unstable-core-do-not-import"
import cors from "cors"

console.log(`Starting ${serverConfig.APP_NAME}...`)

// Initialize MongoDB connection
async function initMongoDB() {
  try {
    await getMongoClient()
    console.log("MongoDB initialized")
  } catch (error) {
    console.error("Failed to initialize MongoDB:", error)
    process.exit(1)
  }
}

// Create tRPC router
const appRouter = mergeRouters(userRouter)

// Initialize the server
async function initServer() {
  // Connect to MongoDB
  await initMongoDB()

  // Start HTTP server
  const server = createHTTPServer({
    router: appRouter,
    middleware: cors({
      origin: [serverConfig.URL_CLIENT],
      credentials: true,
    }),
  })

  // Start listening
  server.listen(serverConfig.PORT, () => {
    console.log(`Server listening on port ${serverConfig.PORT}`)
  })

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down server...")

    // Close MongoDB connection
    await closeMongoConnection()

    // Exit the process
    process.exit(0)
  }

  // Listen for termination signals
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
}

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter

// Start the server
initServer().catch((error) => {
  console.error("Server initialization error:", error)
  process.exit(1)
})

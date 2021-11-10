const mongoose = require("mongoose");

const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

MongoMemoryServer.create()
  .then((mongoServer) => mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    dbName: "posts",
    useNewUrlParser: true,
    useUnifiedTopology: true
  }))
  .then(() =>
    console.info(`Successfully connected to the Database.`)
  )
  .catch((error) => {
    console.error("An error occurred trying to connect to the Database.", error);
    process.exit(1);
  });

process.on("SIGINT", () => {
  mongoose
    .disconnect()
    .then(() => {
      console.info("MongoDB disconnected successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("An error occurred trying to disconnect from MongoDB.", error);
      process.exit(1);
    });
});
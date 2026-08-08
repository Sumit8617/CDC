import mongoose from "mongoose";

// Connect with the DB dynamically with the productions data and dev data
export const connectDB = async () => {
  try {
    const env = process.env.NODE_ENV || "development";

    // Determine which cluster to use
    let mongoURI;
    let dbName;
    let appName;

    switch (env) {
      case "production":
        mongoURI = process.env.PROD_MONGODB_URI;
        dbName = process.env.PROD_DB_NAME;
        appName = process.env.PROD_APP_NAME;
        console.log("🔗 Connecting to PRODUCTION cluster...");
        break;

      case "development":
        mongoURI = process.env.DEV_MONGODB_URI;
        dbName = process.env.DEV_DB_NAME;
        appName = process.env.DEV_APP_NAME;
        console.log("Connecting to DEVELOPMENT cluster...");
        break;

      case "test":
        mongoURI = process.env.TEST_MONGODB_URI;
        dbName = process.env.TEST_DB_NAME;
        appName = process.env.TEST_APP_NAME;
        console.log("Connecting to TEST cluster...");
        break;

      default:
        mongoURI = process.env.MONGODB_URI;
        dbName = process.env.DB_NAME;
        appName = "Cluster0";
        console.log("Connecting to DEFAULT cluster...");
    }

    // Build connection string
    const connectionString = `${mongoURI}/${dbName}?retryWrites=true&w=majority&appName=${appName}`;

    // Connect to MongoDB
    const connection = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected Successfully`);
    console.log(`Database: ${dbName}`);
    console.log(`Host: ${connection.connection.host}`);
    console.log(`App Name: ${appName}`);
    console.log(`Environment: ${env}`);

    return connection;
  } catch (error) {
    console.error("ERR While Connecting to the DB:", error.message);
    process.exit(1);
  }
};

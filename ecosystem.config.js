module.exports = {
  apps: [
    {
      name: "identity", // Application name
      script: "index.js", // Entry point of your app (adjust if it's not `index.js`)
      instances: "max", // Use max instances based on CPU cores
      exec_mode: "cluster", // Run in cluster mode
      watch: true, // Auto-restart on file changes
      env: {
        NODE_ENV: "development", // Environment variable for development
      },
      env_production: {
        NODE_ENV: "production", // Environment variable for production
      },
    },
  ],
};

module.exports = {
  apps: [
    {
      name: "admin-frontend",
      script: ".next/standalone/server.js",
      args: "",
      cwd: "./",
      instances: 1, // Limit to 1 instance to save RAM on small VPS
      autorestart: true,
      watch: false,
      max_memory_restart: "800M", // Restart if it eats too much RAM
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};

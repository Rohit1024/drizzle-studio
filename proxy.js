const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { exec } = require("child_process");
const app = express();
const PORT = process.env.PORT || 8080;

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start Drizzle Studio in background
console.log("Starting Drizzle Studio...");
const drizzleProcess = exec("npx drizzle-kit studio --port 3000 --host 127.0.0.1");

drizzleProcess.stdout.on("data", (data) => {
  console.log(`Drizzle stdout: ${data}`);
});

drizzleProcess.stderr.on("data", (data) => {
  console.error(`Drizzle stderr: ${data}`);
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  if (drizzleProcess) {
    drizzleProcess.kill();
  }
  process.exit(0);
});

// Give Drizzle a moment to start
setTimeout(() => {
  // Set up proxy to forward all requests to Drizzle Studio
  // Exclude our health check endpoint
  app.use("/", (req, res, next) => {
    if (req.path === '/health') {
      return next();
    }
    return createProxyMiddleware({
      target: "http://127.0.0.1:3000",
      changeOrigin: true,
      ws: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying ${req.method} ${req.url}`);
      }
    })(req, res, next);
  });

  // Start the proxy server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Proxy server running on http://0.0.0.0:${PORT}`);
  });
}, 5000);
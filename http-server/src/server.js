const express = require("express");
require("dotenv").config();
const cors = require("cors");

const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");
const { Pool } = require("pg");

const forgetRoute = require("./routes/forgot-password");
const registerRoute = require("./routes/register");
const homePageRoute = require("./routes/homepage");
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logout");
const addUserRoute = require("./routes/adduser");
const deleteUserRoute = require("./routes/deleteuser");
const resetRoute = require("./routes/reset-password");

const app = express();
exports.app = app;
const port = 3000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://18.215.64.181:30081",
  "http://http-server-lb-653748718.us-east-1.elb.amazonaws.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`🔍 Request from origin: ${origin}`);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked origin: ${origin}`);
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
exports.pool = pool;

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
  socket: {
    connectTimeout: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error("Max retries reached");
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("error", (err) => console.error("❌ Redis Error:", err.message));
redisClient.on("connect", () => console.log("🔄 Redis Connecting..."));
redisClient.on("ready", () => console.log("✅ Redis Ready!"));

async function tryRedisConnection() {
  try {
    await Promise.race([
      redisClient.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout")), 5000)
      ),
    ]);
    return true;
  } catch (err) {
    return false;
  }
}

(async () => {
  const redisConnected = await tryRedisConnection();

  const sessionConfig = {
    secret: process.env.SESSION_SECRET || "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      path: "/",
    },
  };

  if (redisConnected && redisClient.isReady) {
    sessionConfig.store = new RedisStore({
      client: redisClient,
      prefix: "sess:",
    });
  } else {
    console.log(
      "⚠️  Using in-memory session storage (sessions won't persist on restart)"
    );
  }

  app.use(session(sessionConfig));

  app.use("/register", registerRoute({ pool }));
  app.use("/login", loginRoute({ pool, redisClient }));
  app.use("/logout", logoutRoute());
  app.use("/", homePageRoute({ pool }));
  app.use("/add", addUserRoute({ pool }));
  app.use("/delete", deleteUserRoute({ pool, redisClient }));
  app.use("/forgot-password", forgetRoute({ pool }));
  app.use("/reset-password", resetRoute({ pool }));

  app.use((req, res) => {
    res.status(404).send("Page not found");
  });

  app.listen(port, () => {
    console.log(`🚀 Server running at http://0.0.0.0:${port}/`);
  });
})();

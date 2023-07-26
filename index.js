const path = require("path");
const express = require("express");
const app = express();
const util = require("util");
const whois = util.promisify(require("whois").lookup);
var bodyParser = require("body-parser");
const log = require("morgan");
const ROOT = path.join(__dirname, "public");
const VIEW_ROOT = path.join(__dirname, "pages");
const NodeCache = require('node-cache');
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
	windowMs: 60 * 1000,
	max: 16,
	standardHeaders: true,
	legacyHeaders: false, 
	key: (request, response) => request.ip,
	handler: (req, res) => res.sendStatus(429)
})

const cache = new NodeCache({ stdTTL: 7200 });

require("dotenv").config();
const PORT = process.env.PORT || 8080;
app.set("trust proxy", true);
app.use(bodyParser());
app.set("json spaces", 2);
app.use(log("dev"));
app.use(express.static(ROOT));
app.set("view engine", "ejs");
app.set("views", VIEW_ROOT);

app.use((req, res, next) => {
  res.locals.hostname = req.hostname;
  next();
});

app.get("/", async (req, res) => {
  res.render("index");
});

app.get(['/api/whois/:query', '/api/whois'], limiter, async (req, res, next) => {
res.type("text/plain");
let query = req.params.query || req.query.query;
if (!query) return res.status(400).send('400: Bad Request');
if (cache.has(query)) return res.send(cache.get(query).trim());
try {
  //  if (cache[query]) return res.send(cache[query].trim());
    let result = await whois(query, { follow: 0 });
   cache.set(query, result.trim(), 7200)
    res.send(result.trim());
  } catch (e) {
    res.status(500).send("Error: "+e.message);
    console.log(e);
  }
})

app.use((req, res, next) => {
  res.status(404).render("404")
});

const listener = app.listen(PORT);

console.log(
  "[ EXPRESS ] Your app listen on port " + listener.address()?.port || 443
);

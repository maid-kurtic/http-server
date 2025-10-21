const http = require("http");
const url = require("url");
const querystring = require("querystring");

const hostname = "0.0.0.0";
const port = 80;

const definitions = {
  function:
    "A function is a block of code designed to perform a particular task. Example: function greet() { console.log('Hello'); }",
  object:
    "An object is a collection of properties, where each property is a key-value pair. Example: const obj = {name: 'John', age: 30};",
  array:
    "An array is an ordered list of values. Example: const arr = [1, 2, 3];",
  string:
    "A string is a sequence of characters used to represent text. Example: const str = 'Hello';",
  class:
    "A class is a blueprint for creating objects with predefined properties and methods. Example: class Person { constructor(name) { this.name = name; } }",
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  if (req.method === "GET" && parsedUrl.pathname === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    let options = Object.keys(definitions)
      .map((key) => `<option value="${key}">${key}</option>`)
      .join("\n");

    res.end(`
      <h2>JavaScript Terms</h2>
      <form method="POST" action="/define">
        <label for="term">Choose a term:</label>
        <select name="term" id="term" required>
          ${options}
        </select>
        <button type="submit">Show Definition</button>
      </form>
    `);
  } else if (req.method === "POST" && parsedUrl.pathname === "/define") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const data = querystring.parse(body);
      const term = data.term;
      const definition = definitions[term] || "Definition not found.";

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(`
        <h2>Definition of ${term}</h2>
        <p>${definition}</p>
        <a href="/">Back</a>
      `);
    });
  } else {
    res.statusCode = 404;
    res.end("Page not found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
	let fs = require('fs');
	let contents = fs.readFileSync('hello_world.html', 'utf8');
	let name = "Álvaro";
	let test = "Hello ${name}!";
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  eval("res.end('" + contents + "')");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
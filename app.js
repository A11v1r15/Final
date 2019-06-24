const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
	let fs = require('fs');
	let contents = fs.readFileSync('model/index.html', 'utf-8');
	
	let modules = [];
	modules.style = fs.readFileSync('model/css/index.css', 'utf-8');
	Object.keys(modules).forEach((e) => {
		contents = contents.replace("${"+e+"}", modules[e]);
	})
	
	let variables = [];
	variables.style = fs.readFileSync('model/css/index.css', 'utf-8');
	Object.keys(variables).forEach((e) => {
		contents = contents.replace("${"+e+"}", variables[e]);
	})
	
    if (req.method === 'POST') {
		let body = '';
		req.on('data', chunk => {
			body += chunk.toString(); // convert Buffer to string
		});
		req.on('end', () => {
			console.log(body);
			res.end('ok');
		});
	}
	
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(contents);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
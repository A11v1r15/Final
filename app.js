const http = require('http');
const qs = require('querystring');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
	let fs = require('fs');
	let contents = fs.readFileSync('model/index.html', 'utf8');

	let modules = [];
	modules.style = fs.readFileSync('model/css/index.css', 'utf-8');
	modules.numeros = "";

	let variables = [];
	variables.n1 = "";
	variables.n2 = "";
	variables.n3 = "";
	variables.N = "";
	variables.highest = "";

	if (!(fs.existsSync("sorted.json") && hasJsonStructure(fs.readFileSync("sorted.json", 'utf8')))) {
		let x = [];
		fs.writeFile("sorted.json", JSON.stringify(x), 'utf8', () => {
			console.log("created sorted")
		});
	}

	if (!(fs.existsSync("map.json") && hasJsonStructure(fs.readFileSync("map.json", 'utf8'))) || JSON.parse(fs.readFileSync("sorted.json", 'utf8')).length > 1000) {
		let x = [];
		for (let n = 0; n < 100; n++) {
			x[n] = n;
		}
		shuffleArray(x);
		fs.writeFile("map.json", JSON.stringify(x), 'utf8', () => {
			console.log("created map")
		});
	}

	if (req.method === 'POST') {
		let body = '';
		req.on('data', function(chunk) {
			body += chunk;
		});
		req.on('end', function() {
			let data = qs.parse(body);
			console.log(data)

			modules.numeros = fs.readFileSync('model/numeros.html', 'utf-8');

			let map = JSON.parse(fs.readFileSync("map.json", 'utf8'));
			variables.n1 = data.n1;
			variables.n2 = data.n2;
			variables.n3 = data.n3;
			variables.N = map[variables.n1] * map[variables.n2] * map[variables.n3];

			let sorted = JSON.parse(fs.readFileSync("sorted.json", 'utf8'));
			sorted.push(variables.N);
			sorted = sorted.sort(function(a, b) {
				return b - a
			});
			fs.writeFile("sorted.json", JSON.stringify(sorted), 'utf8', () => {
				console.log("updated sorted")
			});
			variables.highest = sorted[0];

			finishView(res, contents, modules, variables);
		});
	} else {
		finishView(res, contents, modules, variables);
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

function hasJsonStructure(str) {
	if (typeof str !== 'string') return false;
	try {
		const result = JSON.parse(str);
		return Object.prototype.toString.call(result) === '[object Object]' ||
			Array.isArray(result);
	} catch (err) {
		return false;
	}
}

function finishView(res, contents, modules, variables) {
	Object.keys(modules).forEach((e) => {
		contents = contents.replace("&{" + e + "}", modules[e]);
	})

	Object.keys(variables).forEach((e) => {
		contents = contents.replace("${" + e + "}", variables[e]);
	})

	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.end(contents);
}
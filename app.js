const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
    let fs = require('fs');
    let contents = fs.readFileSync('model/index.html', 'utf8');

    if (req.method === 'POST') {
        try {
            if (fs.existsSync("map.json") && hasJsonStructure(fs.readFileSync("map.json", 'utf8'))) {
                console.log(fs.readFileSync("map.json", 'utf8'));
            } else {
            let x = [];
            for (let n = 0; n < 1000; n++) {
                x[n] = n;
            }/*
            for (let i = x.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i++));
                [x[i], x[j]] = [x[j], x[i]];
            }*/
            let q = [];
            for (let i = 0; i < 10; i++) {
            	q[i]=[];
                for (let j = 0; j < 10; j++) {
                	q[i][j]=[];
                    for (let k = 0; k < 10; k++) {
                        q[i][j][k] = x[k * 100 + j * 10 + i];
                    }
                }
            }
            console.log("salvando?");
            fs.writeFile("map.json", JSON.stringify(q), 'utf8', () => {});
        }
        } catch (err) {
            console.log(err);
        } 
    }

    let modules = [];
    modules.style = fs.readFileSync('model/css/index.css', 'utf-8');
    Object.keys(modules).forEach((e) => {
        contents = contents.replace("${" + e + "}", modules[e]);
    })

    let variables = [];
    variables.style = fs.readFileSync('model/css/index.css', 'utf-8');
    Object.keys(variables).forEach((e) => {
        contents = contents.replace("${" + e + "}", variables[e]);
    })

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(contents);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function hasJsonStructure(str) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        return Object.prototype.toString.call(result) === '[object Object]' 
            || Array.isArray(result);
    } catch (err) {
        return false;
    }
}
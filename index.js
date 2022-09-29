const http = require('http');
const fs = require('fs');
const port = 3010;

http.createServer((request, response) => {
    console.log('request url: ', request.url);

    if (request.url === '/') {
        const html = fs.readFileSync('./index.html', 'utf-8');

        response.writeHead(200, {
            'Content-Type': 'text/html',
        });

        response.end(html);
    } else if (request.url === '/cache5s.js') {
        response.writeHead(200, {
            'Content-Type': 'text/javascript',
            'Cache-Control': 'max-age=5'
        });

        response.end("console.log('cache5s load')");
    }
     else if (request.url === '/expire5s.js') {
        response.writeHead(200, {
            'Content-Type': 'text/javascript',
            'Expires':new Date(( new Date().getTime() + 5000 )) .toGMTString(),
        });
        response.end("console.log('expire5s load')");
    }
    //协商缓存
    else if (request.url === '/last-modified.js') {
        let h = request.headers['if-modified-since']
        if(h !== 'Thu, 29 Sep 2022 08:35:13 GMT'){
            console.log('新文件');
            response.writeHead(200, {
                'Content-Type': 'text/javascript',
                'Last-Modified': 'Thu, 29 Sep 2022 08:35:13 GMT',
                'Cache-Control': 'max-age=0'
            });
            response.end("console.log('last-modified load')");
        }else{
            console.log('协商缓存 by last-modified');
            response.writeHead(304)
            response.end("console.log('new script')")
        }
       
    }else if(request.url === '/etag.js'){
        let h = request.headers['if-none-match']
        if(h !== 'wqewf'){
            console.log('新文件');
             response.writeHead(200, {
                'Content-Type': 'text/javascript',
                'ETag':'wqewf'
            });
            response.end("console.log('etag load')");
        }else{
            console.log('协商缓存 by etag');
            response.writeHead(304)
            response.end("console.log('new script')")
        }
       
    }

}).listen(port);
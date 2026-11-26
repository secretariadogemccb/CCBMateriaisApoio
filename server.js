// Servidor local opcional, sem dependências (Node.js 18+). Não é usado no GitHub Pages.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf'};
const port = Number(process.env.PORT || 8080);
http.createServer((req,res)=>{
 let p;
 try {p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);} catch {res.writeHead(400).end();return;}
 const target = path.resolve(root, '.' + p, p.endsWith('/') ? 'index.html' : '');
 if (target !== root && !target.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
 fs.stat(target,(error,st)=>{
  if(error || !st.isFile()){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Arquivo não encontrado');return;}
  const ext=path.extname(target).toLowerCase();
  const headers={'Content-Type':types[ext] || 'application/octet-stream','X-Content-Type-Options':'nosniff'};
  if(ext==='.pdf')headers['Content-Disposition']='attachment; filename="'+path.basename(target)+'"';
  res.writeHead(200,headers);fs.createReadStream(target).pipe(res);
 });
}).listen(port,()=>console.log(`Sistema CCB em http://localhost:${port}`));

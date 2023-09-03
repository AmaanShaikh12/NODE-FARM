const fs= require('fs');
const http=require('http');
const url=require('url');

//importing 3rd party modules
const slugify=require('slugify');

//importing 2nd party modules
const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////

//Blocking synchronous way
// const textin=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textin);
// const textout=`This is what we know about the avocado : ${textin}.\n Created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt',textout);
// console.log('File written!');



//non-blocking,asynchronous way
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//   fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//     console.log(data2);
//     fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//       console.log(data3);
//       fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',(err)=>{
//         console.log('Your file has been written');
//       })
//     })
//   })
// });
// console.log("This will be printed first");


/////////////////////////////////////////
//Server

const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempcard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempproduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataobj=JSON.parse(data);

const slugs=dataobj.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs)

const server = http.createServer((req,res)=>{
  console.log(req.url);
  const {query,pathname} = (url.parse(req.url,true));

  //Overview page
  if(pathname === '/' || pathname === '/overview')
  {
    res.writeHead(200,{'content-type':'text/html'});
    const cardshtml=dataobj.map(el => replaceTemplate(tempcard,el)).join('');
    const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardshtml);
    res.end(output);
  }

  //Product page
  else if(pathname === '/product')
  {
    res.writeHead(200,{'content-type':'text/html'});
    const product= dataobj[query.id];
    const output=replaceTemplate(tempproduct,product);
    res.end(output);
  }

  //API
  else if(pathname === '/api1')
  {
      res.writeHead(200,{'Content-type':'application/json'});
      //console.log(productData);
      res.end(data);
  }

  //Not found
  else
  {
    res.writeHead(404,{
      'Content-type':'text/html',
      'my-own-header':'hello-world'
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000,'127.0.0.1',()=>{
  console.log("listening to requests on port 8000");
});
import {rmSync,mkdirSync,copyFileSync,readdirSync,readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=resolve(new URL('..',import.meta.url).pathname);
const files=['index.html','style.css','app.js','404.html',...readdirSync(root).filter(name=>name.endsWith('.svg')), ...readdirSync(join(root,'vodici')).map(name=>`vodici/${name}`)];
rmSync(join(root,'dist'),{recursive:true,force:true});mkdirSync(join(root,'dist'),{recursive:true});
for(const file of files){const destination=join(root,'dist',file);mkdirSync(resolve(destination,'..'),{recursive:true});copyFileSync(join(root,file),destination);}
if(!readFileSync(join(root,'dist/index.html'),'utf8').includes('sapica-20261007-v2'))throw Error('Release marker missing');
console.log(`Šapica build ready: ${files.length} public files · sapica-20261007-v2`);

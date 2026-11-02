import {readFileSync} from 'node:fs';
// Offline only: input is a Sanity NDJSON export. Output is a reviewable mutation plan, never applied here.
const documents=readFileSync(process.argv[2]==='-'?0:process.argv[2],'utf8').trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));
const owned=new Set(['page','post','service','project','articleCategory','projectCategory','announcementBar']);
const mutations=[];
for(const document of documents){
 if(!owned.has(document._type)||document.site)continue;
 if(!document._rev)throw Error(`Missing revision: ${document._id}`);
 mutations.push({patch:{id:document._id,ifRevisionID:document._rev,set:{site:{_type:'reference',_ref:'site.cloud1media'}}}});
}
const decorate=v=>Array.isArray(v)?v.map((x,i)=>x&&typeof x==='object'?{...decorate(x),_key:x.id??`item-${i}`} : x):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,decorate(x)])):v;
const seeds=[{_id:'site.cloud1media',_type:'site',key:'cloud1media',title:'Cloud1 Media'},{_id:'site.simplevan',_type:'site',key:'simplevan',title:'SimpleVan'}];
for(const [file,type,site] of [['company','companyCopy','cloud1media'],['provider','providerOfferingCopy','simplevan']])seeds.push({_id:`copy.${site}`,_type:type,site:{_type:'reference',_ref:`site.${site}`},content:decorate(JSON.parse(readFileSync(new URL(`../fixtures/${file}.json`,import.meta.url),'utf8')))});
for(const seed of seeds)if(!documents.some(d=>d._id===seed._id))mutations.push({createIfNotExists:seed});
console.log(JSON.stringify({dryRun:true,documents:documents.length,mutations},null,2));

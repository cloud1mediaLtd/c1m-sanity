import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

/** Offline conversion only: guide routes stay code-backed until an explicit cutover. */
export function planGuideImport(documents, sources) {
  const mutations=[], assets=[];
  for(const {siteKey,guides} of sources){
    const sites=documents.filter(d=>d._type==='site'&&d.key===siteKey&&!d._id.startsWith('drafts.'));
    if(sites.length>1)throw Error(`Duplicate site key: ${siteKey}`);
    if(sites[0]?._id.includes('.'))throw Error('Site ID is private; repair it before public import');
    const site=sites[0]?._id??`site-${siteKey}`;
    const categories=documents.filter(d=>d._type==='articleCategory'&&d.site?._ref===site&&d.slug?.current==='guide'&&!d._id.startsWith('drafts.'));
    if(categories.length>1)throw Error(`Duplicate Guide category for ${siteKey}`);
    if(!categories.length&&documents.some(d=>d._type==='articleCategory'&&d.site?._ref===site&&d.slug?.current==='guide'&&d._id.startsWith('drafts.')))throw Error(`Review the existing draft Guide category for ${siteKey} before importing`);
    if(categories[0]?._id.includes('.'))throw Error('Category ID is private; repair it before public import');
    const category=categories[0]?._id??`category-${siteKey}-guide`;
    if(!documents.some(d=>d._id===site))mutations.push({createIfNotExists:{_id:site,_type:'site',key:siteKey,title:siteKey==='simplevan'?'SimpleVan':'Great Removals'}});
    if(!categories.length)mutations.push({createIfNotExists:{_id:category,_type:'articleCategory',site:{_type:'reference',_ref:site},name:'Guide',slug:{_type:'slug',current:'guide'}}});
    for(const guide of guides){
      if(documents.some(d=>d._type==='post'&&d.site?._ref===site&&d.slug?.current===guide.slug))continue;
      const id=`drafts.article-${siteKey}-${guide.slug}`;
      const content=[];
      const block=(text,style='normal',listItem)=>{const key=`block-${content.length}`;content.push({_type:'block',_key:key,style,markDefs:[],children:[{_type:'span',_key:`${key}-text`,text,marks:[]}],...(listItem?{listItem,level:1}:{})})};
      for(const section of guide.sections){block(section.heading,'h2');section.paragraphs.forEach(text=>block(text));section.checklist?.forEach(text=>block(text,'normal','bullet'));}
      mutations.push({createIfNotExists:{_id:id,_type:'post',site:{_type:'reference',_ref:site},title:guide.title,slug:{_type:'slug',current:guide.slug},excerpt:guide.summary,category:{_type:'reference',_ref:category},content,seo:{metaTitle:guide.title,metaDescription:guide.summary}}});
      assets.push({documentId:id,source:guide.image,alt:guide.imageAlt,action:'Review and upload through the authorized media workflow before publication'});
    }
  }
  return {dryRun:true,mutations,assets,notes:['Articles are drafts; no publication date is invented.','Existing site/slug matches are never overwritten.','Review images, SEO and publication date before publishing.']};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const input=process.argv[2];
  if(!input)throw Error('Pass a Sanity NDJSON export, or - for stdin');
  const documents=readFileSync(input==='-'?0:input,'utf8').trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));
  const sources=['simplevan','greatremovals'].map(siteKey=>({siteKey,guides:JSON.parse(readFileSync(new URL(`../fixtures/${siteKey}-guides.json`,import.meta.url),'utf8'))}));
  console.log(JSON.stringify(planGuideImport(documents,sources),null,2));
}

import {defineField, type ValidationContext} from 'sanity'
export const siteField = defineField({name:'site', title:'Site', type:'reference', to:[{type:'site'}], readOnly:({value})=>!!value, validation:rule=>rule.required()})
export async function uniqueSiteSlug(slug: string, context: ValidationContext) {
  const document=context.document
  const site=(document?.site as {_ref?:string}|undefined)?._ref
  if (!site) return false
  const id=document?._id.replace(/^drafts\./,'')
  return !(await context.getClient({apiVersion:'2026-01-01'}).fetch('count(*[_type == $type && site._ref == $site && slug.current == $slug && !(_id in [$id, $draft])])', {type:document?._type,site,slug,id,draft:`drafts.${id}`}))
}
export async function sameSiteReferences(value: unknown, context: ValidationContext) {
  const doc=context.document
  const site=(doc?.site as {_ref?:string}|undefined)?._ref
  if(!site || !value) return true
  const refs:string[]=[]
  const walk=(v:unknown):void=>{if(!v || typeof v!=='object')return; if('_ref' in v && typeof v._ref==='string')refs.push(v._ref);else Object.values(v).forEach(walk)}
  walk(value)
  if(!refs.length)return true
  const bad=await context.getClient({apiVersion:'2026-01-01'}).fetch<string[]>('*[_id in $refs && _type in ["page","post","service","project","articleCategory","projectCategory"] && (!defined(site._ref) || site._ref != $site)]._id',{refs,site})
  return bad.length ? 'Referenced content must belong to the same site.' : true
}

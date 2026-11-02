import {defineField,defineType} from 'sanity'
export const site=defineType({name:'site',title:'Site',type:'document',fields:[
 defineField({name:'key',title:'Site key',type:'string',readOnly:({document})=>!!document?._createdAt,validation:r=>r.required().regex(/^[a-z][a-z0-9-]*$/).custom(async (key,context)=>{if(!key)return true;const id=context.document?._id.replace(/^drafts\./,'');const count=await context.getClient({apiVersion:'2026-01-01'}).fetch<number>('count(*[_type == "site" && key == $key && !(_id in [$id,$draft])])',{key,id,draft:`drafts.${id}`});return count===0 || 'Site keys must be unique.'})}),
 defineField({name:'title',title:'Display name',type:'string',validation:r=>r.required()})
]})

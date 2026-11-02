import {test} from 'node:test'
import assert from 'node:assert/strict'
import {planSiteBackfill} from './plan-site-backfill.mjs'
test('backfill preserves legacy categories and draft IDs, pins every patch revision', () => {
 const p=planSiteBackfill([{_id:'legacy',_type:'category',name:'News',slug:{current:'news'}},{_id:'drafts.old',_type:'post',_rev:'r1',category:{_ref:'legacy'}}])
 assert.equal(p.mutations.length,3)
 assert.equal(p.mutations[1].createIfNotExists._type,'articleCategory')
 assert.deepEqual(p.mutations[2].patch,{id:'drafts.old',ifRevisionID:'r1',set:{site:{_type:'reference',_ref:'site-cloud1media'},category:{_type:'reference',_ref:'category-cloud1media-legacy'}}})
 assert.ok(p.mutations.every(m=>!m.delete))
})
test('migrated records and other sites remain unchanged',()=>{
 const docs=[{_id:'company',_type:'site',key:'cloud1media'},{_id:'old',_type:'post',site:{_ref:'company'}},{_id:'van',_type:'post',site:{_ref:'site.simplevan'}}]
 assert.equal(planSiteBackfill(docs).mutations.length,0)
})

test('retained private repair records do not make a completed backfill ambiguous',()=>{
 const docs=[{_id:'site-cloud1media',_type:'site',key:'cloud1media'},{_id:'site.cloud1media',_type:'site',key:'cloud1media'}];
 assert.equal(planSiteBackfill(docs).mutations.length,0);
 assert.throws(()=>planSiteBackfill(docs.slice(1)),/private/);
});

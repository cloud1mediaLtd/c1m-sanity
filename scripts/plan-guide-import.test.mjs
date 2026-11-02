import {test} from 'node:test';import assert from 'node:assert/strict';import {planGuideImport} from './plan-guide-import.mjs';
const guide={slug:'moving-day',title:'Moving day',summary:'Prepare',image:'/images/move.jpg',imageAlt:'Packed boxes',sections:[{heading:'Prepare',paragraphs:['Pack boxes'],checklist:['Label boxes']}]};
const sources=[{siteKey:'simplevan',guides:[guide]},{siteKey:'greatremovals',guides:[guide]}];
test('same-slug guides become separate site-owned draft articles with media review',()=>{const p=planGuideImport([],sources);const posts=p.mutations.map(m=>m.createIfNotExists).filter(d=>d._type==='post');assert.equal(posts.length,2);assert.ok(posts.every(d=>d._id.startsWith('drafts.')&&!d.publishedAt));assert.notEqual(posts[0].site._ref,posts[1].site._ref);assert.equal(posts[0].content[2].listItem,'bullet');assert.equal(p.assets.length,2)});
test('reuses existing Guide category and leaves existing articles untouched',()=>{const existing=[{_id:'site.simplevan',_type:'site'},{_id:'category.existing',_type:'articleCategory',site:{_ref:'site.simplevan'},slug:{current:'guide'}},{_id:'article.existing',_type:'post',site:{_ref:'site.simplevan'},slug:{current:guide.slug}}];assert.equal(planGuideImport(existing,[sources[0]]).mutations.length,0)});
test('reapplying a plan to its export is a no-op',()=>{const first=planGuideImport([],sources);assert.equal(planGuideImport(first.mutations.map(m=>m.createIfNotExists),sources).mutations.length,0)});

test('respects an existing site ID and refuses ambiguous category drafts',()=>{
 const site={_id:'custom-site-id',_type:'site',key:'simplevan'};
 const plan=planGuideImport([site],[sources[0]]);assert.ok(plan.mutations.filter(m=>m.createIfNotExists._type!=='site').every(m=>m.createIfNotExists.site._ref==='custom-site-id'));
 assert.throws(()=>planGuideImport([site,{_id:'drafts.guide-category',_type:'articleCategory',site:{_ref:site._id},slug:{current:'guide'}}],[sources[0]]),/Review/);
});

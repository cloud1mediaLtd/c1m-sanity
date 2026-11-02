import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {resolve} from 'node:path'

/** Preserve existing documents and drafts; normalize legacy categories without deleting them. */
export function planSiteBackfill(documents) {
  const mutations = []
  const owned = new Set(['page', 'post', 'service', 'project', 'articleCategory', 'projectCategory', 'announcementBar'])
  const matches = documents.filter(d => d._type === 'site' && d.key === 'cloud1media' && !d._id.startsWith('drafts.'))
  const sites = matches.filter(d => !d._id.includes('.'))
  if (!sites.length && matches.length) throw Error('Site ID is private; repair it before backfill')
  if (sites.length > 1) throw Error('Duplicate cloud1media site')
  if (sites[0]?._id.includes('.')) throw Error('Site ID is private; repair it before backfill')
  const site = sites[0]?._id ?? 'site-cloud1media'
  if (!sites.length) mutations.push({createIfNotExists: {_id: site, _type: 'site', key: 'cloud1media', title: 'Cloud1 Media'}})
  const categories = new Map()
  for (const doc of documents.filter(d => d._type === 'category' && !d._id.startsWith('drafts.'))) {
    if (!doc.slug?.current || !doc.name) throw Error(`Invalid legacy category: ${doc._id}`)
    const matches = documents.filter(d => d._type === 'articleCategory' && d.site?._ref === site && d.slug?.current === doc.slug.current && !d._id.startsWith('drafts.'))
    if (matches.length > 1) throw Error('Duplicate article category')
    const id = matches[0]?._id ?? `category-cloud1media-${doc._id}`
    categories.set(doc._id, id)
    if (!matches.length) mutations.push({createIfNotExists: {_id: id, _type: 'articleCategory', site: {_type: 'reference', _ref: site}, name: doc.name, slug: doc.slug, ...(doc.description ? {description: doc.description} : {})}})
  }
  for (const doc of documents) {
    if (!owned.has(doc._type)) continue
    const set = {}
    if (!doc.site) set.site = {_type: 'reference', _ref: site}
    if (doc._type === 'post' && (!doc.site || doc.site._ref === site) && categories.has(doc.category?._ref)) set.category = {_type: 'reference', _ref: categories.get(doc.category._ref)}
    if (!Object.keys(set).length) continue
    if (!doc._rev) throw Error(`Missing revision: ${doc._id}`)
    mutations.push({patch: {id: doc._id, ifRevisionID: doc._rev, set}})
  }
  return {dryRun: true, projectId: 'g2dro3ti', dataset: 'production', mutations}
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const documents = readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line))
  console.log(JSON.stringify(planSiteBackfill(documents), null, 2))
}

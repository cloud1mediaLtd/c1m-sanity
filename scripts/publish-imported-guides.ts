import {readFileSync, realpathSync} from 'node:fs'
import {resolve, sep} from 'node:path'
import {getCliClient} from 'sanity/cli'
import {planGuideImport} from './plan-guide-import.mjs'

async function main() {
  const [root, confirmation] = process.argv.slice(2)
  if (!root || confirmation !== '--apply-g2dro3ti-production') throw Error('Pass reviewed sites root and --apply-g2dro3ti-production')
  const client = getCliClient({apiVersion: '2026-01-01'}).withConfig({useCdn: false, perspective: 'raw'})
  if (client.config().projectId !== 'g2dro3ti' || client.config().dataset !== 'production') throw Error('Unexpected CMS target')
  const sources = ['simplevan', 'greatremovals'].map(siteKey => ({siteKey, guides: JSON.parse(readFileSync(new URL(`../fixtures/${siteKey}-guides.json`, import.meta.url), 'utf8'))}))
  const documents = await client.fetch('*[_type in ["site", "post", "articleCategory"]]')
  const plan = planGuideImport(documents, sources)
  const mutations: {createIfNotExists: {_id: string; _type: string; [key: string]: unknown}}[] = []
  for (const mutation of plan.mutations) {
    const doc = mutation.createIfNotExists
    if (doc._type !== 'post') {mutations.push(mutation); continue}
    const media = plan.assets.find((asset: {documentId: string}) => asset.documentId === doc._id)
    const siteKey = sources.find(source => doc._id.startsWith(`drafts.article-${source.siteKey}-`))?.siteKey
    if (!siteKey || !media?.alt) throw Error('Missing reviewed media')
    const folder = siteKey === 'simplevan' ? 'simplevan-dash-site' : 'greatremovals-site'
    const publicRoot = realpathSync(resolve(root, folder, 'public'))
    const imagePath = realpathSync(resolve(publicRoot, `.${media.source}`))
    if (!imagePath.startsWith(`${publicRoot}${sep}`)) throw Error('Image outside reviewed site')
    const asset = await client.assets.upload('image', readFileSync(imagePath), {filename: imagePath.split(sep).at(-1), contentType: 'image/webp'})
    mutations.push({createIfNotExists: {...doc, _id: doc._id.replace(/^drafts\./, ''), featuredImage: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: media.alt}}})
  }
  if (mutations.length) await client.mutate(mutations, {visibility: 'sync'})
  console.log(`Published ${mutations.filter(m => m.createIfNotExists._type === 'post').length} reviewed guides; ${mutations.length} conditional creates; no deletes or replacements`)
}
main().catch(error => {console.error(error.message); process.exitCode = 1})

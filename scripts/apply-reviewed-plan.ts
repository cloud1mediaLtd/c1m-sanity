import {readFileSync} from 'node:fs'
import {getCliClient} from 'sanity/cli'

async function main() {
  const [path, confirmation] = process.argv.slice(2)
  if (!path || confirmation !== '--apply-g2dro3ti-production') throw Error('Pass reviewed plan path and --apply-g2dro3ti-production')
  const plan = JSON.parse(readFileSync(path, 'utf8'))
  const client = getCliClient({apiVersion: '2026-01-01'}).withConfig({useCdn: false})
  if (client.config().projectId !== 'g2dro3ti' || client.config().dataset !== 'production') throw Error('Unexpected target')
  if (plan.projectId && plan.projectId !== 'g2dro3ti') throw Error('Unexpected plan project')
  if (plan.dataset && plan.dataset !== 'production') throw Error('Unexpected plan dataset')
  if (!Array.isArray(plan.mutations) || plan.mutations.some((m: Record<string, unknown>) => Object.keys(m).length !== 1 || (!m.createIfNotExists && !m.patch))) throw Error('Only conditional creates and revision-guarded patches are allowed')
  for (const mutation of plan.mutations) {
    if (mutation.patch && !mutation.patch.ifRevisionID) throw Error('Every patch needs an expected revision')
  }
  if (!plan.mutations.length) {console.log('No mutations'); return}
  await client.mutate(plan.mutations, {visibility: 'sync'})
  console.log(`Applied ${plan.mutations.length} reviewed mutations to g2dro3ti/production`)
}
main().catch(error => {console.error(error.message); process.exitCode = 1})

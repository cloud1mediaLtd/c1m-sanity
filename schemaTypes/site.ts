import {defineField, defineType} from 'sanity'

export const site = defineType({
  name: 'site', title: 'Site', type: 'document', fields: [
    defineField({
      name: 'key', title: 'Site key', type: 'string',
      description: 'Choose a unique key when creating this site. It cannot change after publication.',
      validation: rule => rule.required().regex(/^[a-z][a-z0-9-]*$/).custom(async (key, context) => {
        if (!key) return true
        const id = context.document?._id.replace(/^drafts\./, '')
        if (!id) return true
        if (id.includes('.')) return 'Public sites must use a root document ID without dots.'
        const client = context.getClient({apiVersion: '2026-01-01'})
        const published = await client.getDocument<{key?: string}>(id)
        if (published?.key && published.key !== key) return 'A published site key cannot change.'
        const count = await client.fetch<number>('count(*[_type == "site" && (_id in path("*") || _id in path("drafts.*")) && key == $key && !(_id in [$id,$draft])])', {key, id, draft: `drafts.${id}`})
        return count === 0 || 'Site keys must be unique.'
      }),
    }),
    defineField({name: 'title', title: 'Display name', type: 'string', validation: rule => rule.required()}),
  ],
})

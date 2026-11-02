import {siteField, uniqueSiteSlug, sameSiteReferences} from './ownership'
import {defineField, defineType} from 'sanity'

export const projectCategory = defineType({
  name: 'projectCategory',
  title: 'Project Category',
  type: 'document',
  validation: rule=>rule.custom(sameSiteReferences),
  fields: [
    siteField,
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {isUnique: uniqueSiteSlug,source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      order: 'order',
    },
    prepare({title, order}) {
      return {
        title,
        subtitle: order !== undefined ? `Order: ${order}` : '',
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})

import {siteField, uniqueSiteSlug, sameSiteReferences} from './ownership'
import {defineField, defineType} from 'sanity'

export const articleCategory = defineType({
  name: 'articleCategory',
  title: 'Article Category',
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
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})

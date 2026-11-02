import {siteField, uniqueSiteSlug, sameSiteReferences} from './ownership'
import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Article',
  type: 'document',
  validation: rule=>rule.custom(sameSiteReferences),
  fields: [
    siteField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {isUnique: uniqueSiteSlug,source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary for listing pages',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'articleCategory'}],
      description: 'Use an existing category such as Guide. Guides are articles, not a separate content type.',
      options: {filter: ({document}) => {const site=(document.site as {_ref?:string}|undefined)?._ref;return {filter: 'site._ref == $site', params: {site: site ?? ''}}}},
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      validation: rule => rule.required().min(1),
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      description: 'A future date keeps the published article out of public feeds until that time.',
      initialValue: () => new Date().toISOString(),
      type: 'datetime',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seo', title: 'Search appearance', type: 'object', fields: [
        defineField({name: 'metaTitle', title: 'Search title', type: 'string'}),
        defineField({name: 'metaDescription', title: 'Search description', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub Repository',
      type: 'url',
      description: 'Link to the GitHub repository (for product/plugin posts)',
    }),
  ],
    // Layout remains owned by each site; SEO is editorial content.
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage',
    },
    prepare({title, author, media}) {
      return {
        title,
        subtitle: author ? `by ${author}` : '',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})

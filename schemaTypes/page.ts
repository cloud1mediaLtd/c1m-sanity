import {defineField, defineType, defineArrayMember} from 'sanity'

// Reusable rich text configuration
const richText = {
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule: any) =>
                  rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
            ],
          },
        ],
      },
    },
  ],
}

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'URL path for this page (e.g., "about" or "terms/conditions")',
      options: {
        source: 'title',
        maxLength: 200,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'content',
      of: [
        // Hero Section
        defineArrayMember({
          name: 'heroSection',
          title: 'Hero Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'backgroundImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                {name: 'alt', type: 'string', title: 'Alt Text'},
              ],
            }),
            defineField({
              name: 'primaryCta',
              title: 'Primary Button',
              type: 'object',
              fields: [
                {name: 'text', type: 'string', title: 'Button Text'},
                {name: 'link', type: 'string', title: 'Link URL'},
                {name: 'external', type: 'boolean', title: 'Open in New Tab', initialValue: false},
              ],
            }),
            defineField({
              name: 'secondaryCta',
              title: 'Secondary Button',
              type: 'object',
              fields: [
                {name: 'text', type: 'string', title: 'Button Text'},
                {name: 'link', type: 'string', title: 'Link URL'},
                {name: 'external', type: 'boolean', title: 'Open in New Tab', initialValue: false},
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'backgroundImage',
            },
            prepare({title, media}) {
              return {
                title: title || 'Hero Section',
                subtitle: 'Hero',
                media,
              }
            },
          },
        }),
        // Text Section
        defineArrayMember({
          name: 'textSection',
          title: 'Text Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
            }),
            defineField({
              name: 'content',
              title: 'Content',
              ...richText,
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({title}) {
              return {
                title: title || 'Text Section',
                subtitle: 'Text',
              }
            },
          },
        }),
        // Text + Image Section
        defineArrayMember({
          name: 'textImageSection',
          title: 'Text + Image Section',
          type: 'object',
          fields: [
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  {title: 'Text Left, Image Right', value: 'text-left'},
                  {title: 'Text Right, Image Left', value: 'text-right'},
                ],
                layout: 'radio',
              },
              initialValue: 'text-left',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'content',
              title: 'Content',
              ...richText,
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                {name: 'alt', type: 'string', title: 'Alt Text'},
              ],
            }),
            defineField({
              name: 'cta',
              title: 'Call to Action',
              type: 'object',
              fields: [
                {name: 'text', type: 'string', title: 'Button Text'},
                {name: 'link', type: 'string', title: 'Link URL'},
                {name: 'external', type: 'boolean', title: 'Open in New Tab', initialValue: false},
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              layout: 'layout',
              media: 'image',
            },
            prepare({title, layout, media}) {
              const layoutLabel = layout === 'text-right' ? 'Image Left' : 'Image Right'
              return {
                title: title || 'Text + Image Section',
                subtitle: `Text + Image (${layoutLabel})`,
                media,
              }
            },
          },
        }),
        // Collection Section - Display products from a Medusa collection
        defineArrayMember({
          name: 'collectionSection',
          title: 'Collection Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'Override the collection title (optional)',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'collectionHandle',
              title: 'Collection Handle',
              type: 'string',
              description: 'The handle/slug of the Medusa collection (e.g., "featured", "new-arrivals")',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'limit',
              title: 'Product Limit',
              type: 'number',
              description: 'Max number of products to show',
              initialValue: 4,
              validation: (rule) => rule.min(1).max(12),
            }),
            defineField({
              name: 'showViewAll',
              title: 'Show "View All" Link',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              handle: 'collectionHandle',
            },
            prepare({title, handle}) {
              return {
                title: title || `Collection: ${handle}`,
                subtitle: 'Collection',
              }
            },
          },
        }),
        // Products Section - Display specific products by handle
        defineArrayMember({
          name: 'productsSection',
          title: 'Products Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'productHandles',
              title: 'Product Handles',
              type: 'array',
              of: [{type: 'string'}],
              description: 'List of product handles to display',
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              handles: 'productHandles',
            },
            prepare({title, handles}) {
              const count = handles?.length || 0
              return {
                title: title || 'Products Section',
                subtitle: `${count} product${count !== 1 ? 's' : ''}`,
              }
            },
          },
        }),
      ],
    }),
    // SEO Fields
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Override the page title for SEO',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'Social Share Image',
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', type: 'string', title: 'Alt Text'},
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title,
        subtitle: `/${slug || ''}`,
      }
    },
  },
})

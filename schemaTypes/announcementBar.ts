import {siteField, sameSiteReferences} from './ownership'
import {defineField, defineType} from 'sanity'

export const announcementBar = defineType({
  name: 'announcementBar',
  title: 'Announcement Bar',
  type: 'document',
  validation: rule=>rule.custom(sameSiteReferences),
  fields: [
    siteField,
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'announcements',
      title: 'Announcements',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'announcement',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link URL',
              type: 'string',
            }),
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              description: 'e.g., "Shop Now", "Learn More"',
            }),
            defineField({
              name: 'external',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'color',
            }),
            defineField({
              name: 'textColor',
              title: 'Text Color',
              type: 'color',
            }),
          ],
          preview: {
            select: {
              title: 'text',
              buttonText: 'buttonText',
            },
            prepare({title, buttonText}) {
              return {
                title: title || 'No text',
                subtitle: buttonText ? `Button: ${buttonText}` : '',
              }
            },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'settings',
      title: 'Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'autoRotate',
          title: 'Auto Rotate',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'rotationInterval',
          title: 'Rotation Interval (seconds)',
          type: 'number',
          initialValue: 5,
          validation: (rule) => rule.min(1).max(60),
        }),
        defineField({
          name: 'showNavigation',
          title: 'Show Navigation Arrows',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'pauseOnHover',
          title: 'Pause on Hover',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'dismissible',
          title: 'Allow Dismiss',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'styling',
      title: 'Default Styling',
      type: 'object',
      fields: [
        defineField({
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'color',
        }),
        defineField({
          name: 'textColor',
          title: 'Text Color',
          type: 'color',
        }),
      ],
    }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'object',
      fields: [
        defineField({
          name: 'startDate',
          title: 'Start Date',
          type: 'datetime',
        }),
        defineField({
          name: 'endDate',
          title: 'End Date',
          type: 'datetime',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      active: 'active',
      count: 'announcements',
    },
    prepare({active, count}) {
      const announcementCount = count?.length || 0
      return {
        title: `Announcement Bar ${active ? '(Active)' : '(Inactive)'}`,
        subtitle: `${announcementCount} announcement${announcementCount !== 1 ? 's' : ''}`,
      }
    },
  },
})

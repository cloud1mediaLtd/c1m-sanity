import {defineType, type DocumentDefinition} from 'sanity'
import {validateCopy} from './validateCopy'
import {siteField} from './ownership'
const schemas: DocumentDefinition[] = [
  {
    "name": "companyCopy",
    "title": "Company copy",
    "type": "document",
    "fields": [
      {
        "name": "site",
        "type": "reference",
        "to": [
          {
            "type": "site"
          }
        ]
      },
      {
        "name": "content",
        "title": "Content",
        "type": "object",
        "fields": [
          {
            "name": "name",
            "title": "Name",
            "type": "string"
          },
          {
            "name": "headline",
            "title": "Headline",
            "type": "string"
          },
          {
            "name": "summary",
            "title": "Summary",
            "type": "text"
          },
          {
            "name": "services",
            "title": "Services",
            "type": "array",
            "of": [
              {
                "type": "object",
                "fields": [
                  {
                    "name": "title",
                    "title": "Title",
                    "type": "string"
                  },
                  {
                    "name": "description",
                    "title": "Description",
                    "type": "text"
                  }
                ]
              }
            ],
            "options": {
              "disableActions": [
                "add",
                "remove",
                "duplicate",
                "copy",
                "sort"
              ]
            }
          },
          {
            "name": "software",
            "title": "Software",
            "type": "object",
            "fields": [
              {
                "name": "title",
                "title": "Title",
                "type": "string"
              },
              {
                "name": "ownership",
                "title": "Ownership",
                "type": "string"
              },
              {
                "name": "description",
                "title": "Description",
                "type": "text"
              },
              {
                "name": "availability",
                "title": "Availability",
                "type": "string"
              }
            ]
          }
        ]
      },
      {
        "name": "seo",
        "type": "object",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "text"
          }
        ]
      }
    ]
  },
  {
    "name": "providerOfferingCopy",
    "title": "Provider offering",
    "type": "document",
    "fields": [
      {
        "name": "site",
        "type": "reference",
        "to": [
          {
            "type": "site"
          }
        ]
      },
      {
        "name": "content",
        "title": "Content",
        "type": "object",
        "fields": [
          {
            "name": "title",
            "title": "Title",
            "type": "string"
          },
          {
            "name": "summary",
            "title": "Summary",
            "type": "text"
          },
          {
            "name": "services",
            "title": "Services",
            "type": "array",
            "of": [
              {
                "type": "object",
                "fields": [
                  {
                    "name": "id",
                    "title": "Id",
                    "type": "string"
                  },
                  {
                    "name": "title",
                    "title": "Title",
                    "type": "string"
                  },
                  {
                    "name": "description",
                    "title": "Description",
                    "type": "text"
                  }
                ]
              }
            ],
            "options": {
              "disableActions": [
                "add",
                "remove",
                "duplicate",
                "copy",
                "sort"
              ]
            }
          },
          {
            "name": "workspace",
            "title": "Workspace",
            "type": "object",
            "fields": [
              {
                "name": "title",
                "title": "Title",
                "type": "string"
              },
              {
                "name": "description",
                "title": "Description",
                "type": "text"
              },
              {
                "name": "note",
                "title": "Note",
                "type": "text"
              }
            ]
          },
          {
            "name": "steps",
            "title": "Steps",
            "type": "array",
            "of": [
              {
                "type": "object",
                "fields": [
                  {
                    "name": "title",
                    "title": "Title",
                    "type": "string"
                  },
                  {
                    "name": "description",
                    "title": "Description",
                    "type": "string"
                  }
                ]
              }
            ],
            "options": {
              "disableActions": [
                "add",
                "remove",
                "duplicate",
                "copy",
                "sort"
              ]
            }
          }
        ]
      },
      {
        "name": "seo",
        "type": "object",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "text"
          }
        ]
      }
    ]
  }
]
export const marketingCopy = schemas.map(schema=>defineType({...schema,validation:rule=>rule.custom(value=>validateCopy(schema.name,value)),fields:[siteField,...schema.fields.slice(1)]}))

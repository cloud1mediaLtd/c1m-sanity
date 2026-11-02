import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {structure} from './structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'c1media',

  projectId: 'g2dro3ti',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool(), colorInput()],

  schema: {
    types: schemaTypes,
  },
})

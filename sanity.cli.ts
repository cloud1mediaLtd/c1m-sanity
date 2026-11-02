import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'g2dro3ti',
    dataset: 'production'
  },
  deployment: {
    appId: 'z38h706a2kqos2rvg53mncbh',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})

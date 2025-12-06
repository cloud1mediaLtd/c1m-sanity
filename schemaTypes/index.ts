import {post} from './post'
import {articleCategory} from './articleCategory'
import {projectCategory} from './projectCategory'
import {author} from './author'
import {project} from './project'
import {service} from './service'
import {page} from './page'
import {announcementBar} from './announcementBar'

export const schemaTypes = [
  // Content Types
  post,
  articleCategory,
  projectCategory,
  author,
  project,
  service,
  page,

  // UI Components
  announcementBar,
]

import type {StructureResolver} from 'sanity/structure'

const contentTypes = [
  ['post', 'Articles'], ['articleCategory', 'Article categories'],
  ['page', 'Pages'], ['project', 'Projects'], ['projectCategory', 'Project categories'],
  ['service', 'Services'], ['announcementBar', 'Announcements'],
] as const

export const structure: StructureResolver = S => S.list().title('Editorial').items([
  S.listItem().title('Content by site').child(
    S.documentTypeList('site').title('Choose a site')
      .filter('_type == "site" && _id in path("*")').child(siteId =>
      S.list().title('Site content').items([
        ...contentTypes.map(([type, title]) => S.listItem().title(title).child(
          S.documentList().title(title).schemaType(type)
            .filter('_type == $type && site._ref == $site')
            .params({type, site: siteId})
            .initialValueTemplates([S.initialValueTemplateItem(`${type}-for-site`, {siteId})]),
        )),
        S.listItem().title('Marketing copy').child(S.documentList().title('Marketing copy')
          .filter('_type in ["companyCopy","providerOfferingCopy"] && site._ref == $site').params({site: siteId})),
      ]),
    ),
  ),
  S.documentTypeListItem('site').title('Site settings'),
  S.documentTypeListItem('author').title('Authors'),
])

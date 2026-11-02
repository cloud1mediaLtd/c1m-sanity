import type {StructureResolver} from 'sanity/structure'
export const structure:StructureResolver = S=>S.list().title('Editorial').items([
 ...[['cloud1media','Cloud1 Media','companyCopy'],['simplevan','SimpleVan','providerOfferingCopy']].map(([key,title,type])=>S.listItem().title(title).child(S.list().title(title).items([
  S.listItem().title('Marketing copy').child(S.document().schemaType(type).documentId(`copy.${key}`)),
  ...['page','service','post','project','articleCategory','projectCategory','announcementBar'].map(kind=>S.listItem().title(kind).child(S.documentList().title(kind).schemaType(kind).filter('_type == $kind && site._ref == $site').params({kind,site:`site.${key}`})))
 ]))),
 S.documentTypeListItem('site').title('Sites'), S.documentTypeListItem('author').title('Authors')
])

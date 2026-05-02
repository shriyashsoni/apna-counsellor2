import { defineDocumentType, makeSource } from 'contentlayer/source-files';

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: `blogs/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    keywords: { type: 'list', of: { type: 'string' }, required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, required: true },
    category: { type: 'string', required: true },
    readingTime: { type: 'string', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc._raw.sourceFileName.replace(/\.mdx$/, '')}`,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog],
});

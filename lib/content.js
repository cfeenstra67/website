import fs from 'fs'
import path from 'path'

import highlight from 'remark-highlight.js'
import html from 'remark-html'
import matter from 'gray-matter'
import remark from 'remark'

export const contentDirectory = path.join(process.cwd(), 'content')

export function getMarkdownContent(contentId) {
  let absPath = path.join(contentDirectory, `${contentId}.md`)
  return fs.readFileSync(absPath, 'utf8')
}

export async function markdownToHtml(markdownContent) {
  const processedContent = await remark()
    .use(html)
    .use(highlight)
    .process(markdownContent)
  return processedContent.toString()
}

export async function getDataFromMarkdown(fileContents) {
  const matterResult = matter(fileContents)

  const contentHtml = await markdownToHtml(matterResult.content)

  return {
    contentHtml,
    ...matterResult.data
  }
}

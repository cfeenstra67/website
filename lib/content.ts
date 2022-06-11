import fsPromises from 'fs/promises';
import path from 'path';

import langPuppet from 'highlight.js/lib/languages/puppet';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import externalLinks from 'remark-external-links';
import markdown from 'remark-parse';
import matter from 'gray-matter';
import remark from 'remark';

export const contentDirectory = path.join(process.cwd(), 'content');

const languages = {
  puppet: langPuppet,
};

export async function getMarkdownContent(contentId: string): Promise<string> {
  let absPath = path.join(contentDirectory, `${contentId}.md`);
  return await fsPromises.readFile(absPath, 'utf8');
}

export async function markdownToHtml(markdownContent: string): Promise<string> {
  const processedContent = await remark()
    .use(markdown as any)
    .use(externalLinks as any, { target: '_blank' })
    .use(remarkRehype as any, { allowDangerousHtml: true })
    .use(rehypeRaw as any)
    .use(rehypeHighlight as any, { languages })
    .use(rehypeStringify as any)
    .process(markdownContent);
  return processedContent.toString();
}

export async function getDataFromMarkdown(fileContents: string): Promise<Record<string, any>> {
  const matterResult = matter(fileContents);

  const contentHtml = await markdownToHtml(matterResult.content);

  return {
    contentHtml,
    ...matterResult.data,
  };
}

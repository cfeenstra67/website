import { createElement, Fragment, useEffect, useState } from 'react';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';
import { Custom123 } from './content-tmp';

export async function htmlToReact(htmlContent: string): Promise<React.ReactNode> {
  const result = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact as any, {
      Fragment,
      createElement,
      components: {
        custom123: Custom123
      }
    })
    .process(htmlContent);
  return result.result as React.ReactNode;
}

export function useHtmlReactComponent(htmlContent: string): React.ReactNode {
  const [content, setContent] = useState<React.ReactNode>(undefined);

  useEffect(() => {
    let active = true;

    async function load() {
      const component = await htmlToReact(htmlContent);
      if (active) {
        setContent(component);
      }
    }

    load();
    return () => { active = false; };
  }, [htmlContent, setContent]);

  return content;
}

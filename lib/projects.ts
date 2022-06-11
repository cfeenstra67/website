import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import {
  contentDirectory,
  getDataFromMarkdown,
} from './content';

export interface Project {
  id: string;
  title: string;
  date: string;
  description: string;
  repo: string;
  live?: string;
}

const projectsDirectory = path.join(contentDirectory, 'projects');

export function getAllProjectIds(): string[] {
  const fileNames = fs.readdirSync(projectsDirectory);
  return fileNames.map((fileName) => {
    return fileName.replace(/\.md/, '');
  });
}

export function getSortedProjectsData(): Project[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(projectsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    } as Project;
  });
  // Sort posts by date
  return allPostsData.sort((a: any, b: any) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getProjectData(id: string): Promise<Project & { contentHtml: string }> {
  const fullPath = path.join(projectsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  return {
    id,
    ...(await getDataFromMarkdown(fileContents)),
  } as Project & { contentHtml: string };
}

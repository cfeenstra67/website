import Head from 'next/head';

import ProjectCard from '../../components/ProjectCard';
import Layout from '../../components/Layout';
import Markdown from '../../components/Markdown';
import { Config } from '../../lib/config';
import { getMarkdownContent, markdownToHtml } from '../../lib/content';
import { getSortedProjectsData, Project } from '../../lib/projects';

export async function getStaticProps(): Promise<{ props: PostsProps }> {
  const allProjectsData = getSortedProjectsData();
  const projectsIntroMd = await getMarkdownContent('projects-intro');
  const projectsIntroHtml = await markdownToHtml(projectsIntroMd);
  return {
    props: {
      allProjectsData,
      projectsIntroHtml,
      config: Config(),
    },
  };
}

export interface PostsProps {
  allProjectsData: Project[];
  projectsIntroHtml: string;
  config: Config;
}

export default function Projects({
  allProjectsData,
  projectsIntroHtml,
  config,
}: PostsProps) {
  return (
    <Layout config={config}>
      <Head>
        <title key="title">Projects - {config.MY_NAME}</title>
        <meta
          name="og:title"
          content={`Projects - ${config.MY_NAME}`}
          key="metatitle"
        />
        <meta
          name="description"
          content="Descriptions of some of the projects I've worked on."
          key="description"
        />
      </Head>

      <header>
        <h1>Projects</h1>
      </header>

      <section>
        <Markdown htmlContent={projectsIntroHtml} />
      </section>

      <section>
        {allProjectsData.map((project) => (
          <ProjectCard key={project.id} project={project}/>
        ))}
      </section>
    </Layout>
  );
}

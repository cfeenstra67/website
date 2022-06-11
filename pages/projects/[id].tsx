import Head from 'next/head';
import Link from 'next/link';

import Button from '../../components/Button';
import Layout from '../../components/Layout';
import Markdown from '../../components/Markdown';
import ProjectCard from '../../components/ProjectCard';
import { Config } from '../../lib/config';
import { getAllProjectIds, getProjectData, Project } from '../../lib/projects';
import utilStyles from '../../styles/utils.module.css';

export interface ProjectProps {
  projectData: Project & { contentHtml: string };
  config: Config;
}

export default function ProjectComponent({ projectData, config }: ProjectProps) {
  return (
    <Layout config={config}>
      <Head>
        <title key="title">
          {projectData.title} - {config.MY_NAME}
        </title>
        <meta
          name="og:title"
          content={`${projectData.title} - ${config.MY_NAME}`}
          key="metatitle"
        />
        <meta
          name="description"
          content={projectData.description}
          key="description"
        />
      </Head>

      <header className={utilStyles.marginTop}>
        <Button>
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </header>

      <section className={utilStyles.marginTop}>
        <ProjectCard project={projectData} />
      </section>

      <section>
        <Markdown htmlContent={projectData.contentHtml} />
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllProjectIds().map((id) => ({ params: { id } }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const projectData = await getProjectData(params.id);
  return {
    props: {
      projectData,
      config: Config(),
    },
  };
}

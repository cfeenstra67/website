import Link from 'next/link';

import Card from './Card';
import Date from './Date';
import { Project } from '../lib/projects';
import styles from '../styles/ProjectCard.module.css';

export interface ProjectCardProps {
  project: Project;
}

function formatUrl(url: string): string {
  const urlObj = new URL(url);
  const path = urlObj.pathname === '/' ? '' : urlObj.pathname;
  let host = urlObj.hostname;
  if (host.startsWith('www.')) {
    host = host.slice('www.'.length);
  }
  return `${host}${path}`;
}

export default function ProjectCard({
  project
}: ProjectCardProps) {
  return (
    <Card className={styles.projectCard}>
      <div>
        <div>
          <Link href={`/projects/${project.id}`}><h2>{project.title}</h2></Link>
        </div>
        <div>
          <div className={styles.githubIcon} />
          <a
            href={`https://github.com/${project.repo}`}
            target="_blank"
            rel="noreferrer"
          >{project.repo}</a>
        </div>
        {project.live && (
          <div>
            <div className={styles.internetIcon} />
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
            >{formatUrl(project.live)}</a>
          </div>
        )}
      </div>

      <div className={styles.descriptionCard}>
        <p>
          {project.description}
        </p>
        <p className={styles.descriptionUpdated}>
          <i>Updated:</i> <Date dateString={project.date} />
        </p>
      </div>
    </Card>
  );
}

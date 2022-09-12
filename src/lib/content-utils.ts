export function getPostId(path: string): string {
  const pathComps = path.split('/');
  return pathComps[pathComps.length - 1].split('.')[0];
}

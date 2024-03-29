import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '../types';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getPost(id: string) {
  // Is there risk of injection here ?
  const fileName = `${id}.md`;
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Combine the data with the id
  return {
    id,
    ...matterResult.data,
    content: matterResult.content,
  };
}

function getPosts(): Array<Post> {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      content: matterResult.data.content || '',
      date: matterResult.data.date || '',
      thumbnailUrl: matterResult.data.thumbnailUrl || '',
      title: matterResult.data.title || '',
    };
  });
}

export function getSortedPostsData(): Array<Post> {
  const allPostsData: Array<Post> = getPosts();

  // Sort posts by date
  return allPostsData.sort((a: Post, b: Post) => {
    if (a.date < b.date) {
      return 1;
    }
    return -1;
  });
}

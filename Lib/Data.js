import fs from "fs/promises";
import path from "path";
import readingTime from "reading-time";

const dir = path.join(process.cwd(), "_content");

export const getAllBlogPosts = async () => {
  try {
    const allFiles = await fs.readdir(dir);
    const allBlogs = await Promise.all(
      allFiles.map(async (file) => {
        const filePath = path.join(dir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data, content } = parseMarkdown(fileContent);
        const readTime = readingTime(content);
        return { data, content, readTime };
      })
    );
    return allBlogs;
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
};

export const getAllTopics = async () => {
  try {
    const allFiles = await fs.readdir(dir);
    const allTopics = allFiles.map(async (file) => {
      const filePath = path.join(dir, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data } = parseMarkdown(fileContent);
      return data.Topic;
    });
    const filteredTopics = new Set(await Promise.all(allTopics));
    return [...filteredTopics];
  } catch (error) {
    console.error("Error reading topics:", error);
    return [];
  }
};

const parseMarkdown = (markdownContent) => {
  const lines = markdownContent.split("\n");
  const frontMatter = {};
  let content = "";
  let isFrontMatter = false;

  lines.forEach((line) => {
    if (!isFrontMatter && line.trim() === "---") {
      isFrontMatter = true;
    } else if (isFrontMatter && line.trim() === "---") {
      isFrontMatter = false;
    } else if (isFrontMatter) {
      const [key, value] = line.split(":").map((item) => item.trim());
      frontMatter[key] = value;
    } else {
      content += line + "\n";
    }
  });

  return { data: frontMatter, content };
};

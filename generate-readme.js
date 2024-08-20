const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, ".");
const outputFilePath = path.join(__dirname, "README.md");
const baseUrl = "https://divyansh-sharma-mindtickle.github.io/"; // Base URL for GitHub Pages

function getAllMarkdownFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllMarkdownFiles(dirPath + "/" + file, arrayOfFiles);
    } else if (path.extname(file) === ".md" && file !== "README.md") {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

function generateReadmeContent(files) {
  const fileLinks = files
    .map((file) => {
      let relativePath = path.relative(directoryPath, file).replace(/\\/g, "/");
      relativePath = relativePath.replace(".md", ".html");
      const url = new URL(relativePath, baseUrl).toString();
      return `- [${relativePath}](/${url})`;
    })
    .join("\n");

  return `# Documentation Index\n\nThis repository 
  contains the following Markdown files:\n\n## List of Files\n\n${fileLinks}\n\n## How to Use This Repository\n\nEach file contains notes. Click on the links above to navigate to the respective files.\n\n---\n\n*Generated on: ${new Date().toLocaleDateString()}*`;
}

function generateReadme() {
  const markdownFiles = getAllMarkdownFiles(directoryPath);
  const readmeContent = generateReadmeContent(markdownFiles);

  fs.writeFileSync(outputFilePath, readmeContent, "utf8");
  console.log("README.md file has been generated.");
}

generateReadme();

// src/defaultPrompt.js
// Reference: https://github.com/peterdanwan/gimme_readme/blob/main/src/prompt/defaultPrompt.js
const defaultPrompt = `Take the code from each file sent and produce a comprehensive response in markdown format explaining the code.

## Structure Requirements:
- Start with a level 1 heading (#) that serves as an appropriate title for the document. This title should not be "README.md".
- For each file sent, provide a separate level 2 heading (##) with the file name (do not include the relative path).
- Under each file heading, give a detailed explanation of the file's purpose and functionality, including code snippets where relevant.

## Explanation Requirements:
- Refer to code snippets from the provided files to illustrate your explanations.
- Ensure the explanation is clear, concise, and uses semantic markdown headings to separate different sections and concepts.
- If the file is a script or module, explain the key functions, classes, or exports it contains.
- If there are any dependencies or connections between the files, explain them under the appropriate headings.

## Explain details the operations and example of how this app works and how can we use it
- If the provided files are part of a larger project, explain how they fit into the overall project structure and functionality.
- If they are not relate to each other, explain the purpose of each file individually.

## Example Output:
\`\`\`markdown
# Appropriate Title for the Document

## <file_name>.<extension>
Explanation of <file_name>.<extension>, highlighting its role in the project, key functionality, and any important code snippets.

... (continue for each file)
\`\`\`

Ensure that the markdown uses the appropriate level of headings and references relevant code snippets for clarity.\n\n`;

module.exports = defaultPrompt;

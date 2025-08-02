import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

/**
 * Fetches the README.md content from a given GitHub repository URL.
 * @param {string} repoUrl - The URL of the GitHub repository (e.g., https://github.com/user/repo)
 * @returns {Promise<string|null>} - The README.md content as a string, or null if not found/error.
 */
export async function fetchGithubReadme(repoUrl) {
  try {
    // Extract owner and repo from the URL
    const match = repoUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/i);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    const owner = match[1];
    const repo = match[2];

    // Try to fetch README from main or master branch
    const branches = ['main', 'master'];
    let readmeContent = null;

    for (const branch of branches) {
      // Try both README.md and README.MD (case-insensitive)
      const readmeUrls = [
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`,
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.MD`
      ];

      for (const url of readmeUrls) {
        const res = await fetch(url);
        if (res.ok) {
          readmeContent = await res.text();
          if (readmeContent && readmeContent.trim().length > 0) {
            return readmeContent;
          }
        }
      }
    }

    // If not found, try GitHub API (in case of custom default branch)
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const apiRes = await fetch(apiUrl, {
      headers: { Accept: 'application/vnd.github.v3.raw' }
    });
    if (apiRes.ok) {
      return await apiRes.text();
    }

    return null;
  } catch (err) {
    console.error('Error fetching GitHub README:', err);
    return null;
  }
}

/**
 * Summarizes a GitHub repository's README using LangChain and an LLM.
 * @param {string} readmeContent - The content of the README.md file.
 * @returns {Promise<{ summary: string, cool_facts: string[] }>}
 */
export async function summarizeGithubReadme(readmeContent) {
  if (!readmeContent || typeof readmeContent !== "string" || readmeContent.trim().length === 0) {
    throw new Error("README content is empty or invalid.");
  }

  // Define a strict Zod schema for the output
  const summarySchema = z.object({
    summary: z.string().describe("A concise summary of the repository"),
    cool_facts: z.array(z.string()).describe("A list of interesting or unique facts about the repository"),
  });

  // Create the prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an expert open source analyst. Summarize this GitHub repository from this README file content. " +
      "Return your answer as a JSON object with two fields: 'summary' (a concise summary string of the repository) " +
      "and 'cool_facts' (an array of 3-5 interesting or unique facts about the repository). " +
      "Only output valid JSON. Here is the README content:\n\n{readme}"
    ]
  ]);

  // Set up the LLM with OpenAI
  const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
    temperature: 0,
  });

  // Bind the schema to the model using withStructuredOutput
  const structuredLlm = llm.withStructuredOutput(summarySchema);

  // Chain the prompt to the structured LLM
  const chain = prompt.pipe(structuredLlm);

  // Invoke the chain
  const response = await chain.invoke({
    readme: readmeContent
  });

  // The response will be validated and parsed by the schema
  return response;
} 
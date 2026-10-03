import axios from 'axios';
import AdmZip from 'adm-zip';

/**
 * Parses GitHub repository URL into { owner, repo }.
 */
export const parseGithubUrl = (url) => {
  if (!url || typeof url !== 'string') {
    throw new Error('GitHub URL is required');
  }

  const cleanUrl = url.trim().replace(/\/+$/, '');
  
  // Match standard https://github.com/owner/repo or github.com/owner/repo or owner/repo
  const match = cleanUrl.match(/(?:github\.com\/|^)([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/);
  
  if (!match) {
    throw new Error('Invalid GitHub repository URL. Format must be https://github.com/owner/repo');
  }

  const owner = match[1];
  let repo = match[2];
  if (repo.endsWith('.git')) {
    repo = repo.slice(0, -4);
  }

  return { owner, repo };
};

/**
 * Helper to construct Axios headers with optional GitHub Personal Access Token
 */
const getGithubHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'RepoBreakdown-Orchestrator',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

/**
 * Fetches repository metadata from GitHub REST API
 */
export const fetchRepoMetadata = async (owner, repo) => {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  try {
    const response = await axios.get(url, { headers: getGithubHeaders() });
    return {
      defaultBranch: response.data.default_branch || 'main',
      description: response.data.description || '',
      stars: response.data.stargazers_count,
      language: response.data.language,
      fullName: response.data.full_name,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Repository '${owner}/${repo}' not found or is private.`);
    }
    if (error.response?.status === 403) {
      console.warn(`[GitHub API] Rate limit hit on metadata for ${owner}/${repo}. Gracefully continuing with fallback metadata.`);
      return {
        defaultBranch: 'main',
        description: 'Open-source repository',
        stars: 0,
        language: 'Auto',
        fullName: `${owner}/${repo}`,
      };
    }
    console.warn(`[GitHub API Warning] Metadata fetch failed (${error.message}). Continuing with defaults.`);
    return {
      defaultBranch: 'main',
      description: 'Open-source repository',
      stars: 0,
      language: 'Auto',
      fullName: `${owner}/${repo}`,
    };
  }
};

/**
 * Fetches recursive Git file tree
 */
export const fetchRepoTree = async (owner, repo, branch) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  try {
    const response = await axios.get(url, { headers: getGithubHeaders() });
    const rawTree = response.data.tree || [];

    // Latest commit SHA
    const commitSha = response.data.sha;

    return { commitSha, tree: rawTree };
  } catch (error) {
    throw new Error(`Failed to fetch file tree for '${owner}/${repo}': ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Checks if a file path is a noise file that should be ignored
 */
export const isNoiseFile = (path) => {
  const noisePatterns = [
    /^node_modules\//,
    /^\.git\//,
    /^\.github\//,
    /^\.vscode\//,
    /^\.idea\//,
    /^dist\//,
    /^build\//,
    /^target\//,
    /^vendor\//,
    /^__pycache__\//,
    /\.egg-info\//,
    /\.png$/i, /\.jpg$/i, /\.jpeg$/i, /\.gif$/i, /\.ico$/i, /\.svg$/i,
    /\.woff$/i, /\.woff2$/i, /\.ttf$/i, /\.eot$/i,
    /\.zip$/i, /\.tar$/i, /\.gz$/i, /\.pdf$/i,
    /\.lock$/i, /package-lock\.json$/i, /yarn\.lock$/i, /pnpm-lock\.yaml$/i, /Pipfile\.lock$/i
  ];

  return noisePatterns.some(pattern => pattern.test(path));
};

/**
 * Helper to identify key source code and config files
 */
export const isSourceOrConfigFile = (path) => {
  const keyConfigs = ['package.json', 'requirements.txt', 'pyproject.toml', 'Pipfile', 'Cargo.toml', 'go.mod', 'pom.xml', 'build.gradle', 'README.md', 'Makefile', 'docker-compose.yml', 'docker-compose.yaml', 'Dockerfile', 'index.js', 'main.py', 'app.py', 'server.js', 'src/main.py'];
  const baseName = path.split('/').pop();
  if (keyConfigs.includes(baseName)) return true;

  const validExts = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.go', '.rs', '.rb', '.php'];
  return validExts.some(ext => path.endsWith(ext));
};

/**
 * Fetches raw file content from GitHub raw user content API (fallback)
 */
export const fetchRawFileContent = async (owner, repo, branch, filePath) => {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  try {
    const response = await axios.get(url, { responseType: 'text', timeout: 3500 });
    return response.data;
  } catch (error) {
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
      const apiResp = await axios.get(apiUrl, { headers: getGithubHeaders(), timeout: 2500 });
      if (apiResp.data?.content && apiResp.data?.encoding === 'base64') {
        return Buffer.from(apiResp.data.content, 'base64').toString('utf-8');
      }
    } catch (apiErr) {}
    return null;
  }
};

/**
 * Downloads and extracts repository zipball in-memory using AdmZip.
 * Replaces dozens of individual GitHub REST API requests with 1 fast archive stream.
 */
export const downloadAndExtractZipball = async (owner, repo, ref) => {
  const branch = ref || 'main';
  const candidateUrls = [
    `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${branch}`,
    `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/master`,
    `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`,
    `https://api.github.com/repos/${owner}/${repo}/zipball/${ref || ''}`,
  ];

  let response = null;
  let lastError = null;

  for (const url of candidateUrls) {
    try {
      console.log(`[GitHub Zipball] Trying stream from ${url}...`);
      response = await axios.get(url, {
        headers: url.includes('api.github.com') ? getGithubHeaders() : { 'User-Agent': 'Mozilla/5.0 RepoBreakdown' },
        responseType: 'arraybuffer',
        maxContentLength: 100 * 1024 * 1024, // 100MB safety cap
        timeout: 30000,
      });
      if (response && response.status === 200 && response.data?.length > 0) {
        break;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[GitHub Zipball] Download attempt failed for ${url} (${err.message})`);
    }
  }

  if (!response || !response.data) {
    throw new Error(`Failed to download repository archive: ${lastError?.message || 'Download failed'}`);
  }

  const zip = new AdmZip(Buffer.from(response.data));
  const zipEntries = zip.getEntries();
  console.log(`[GitHub Zipball] Extracted ${zipEntries.length} archive entries in memory.`);

  // GitHub zip archives nest all files inside a dynamic root folder: {owner}-{repo}-{shortSha}/
  let rootPrefix = '';
  if (zipEntries.length > 0) {
    const firstPath = zipEntries[0].entryName;
    const slashIdx = firstPath.indexOf('/');
    if (slashIdx !== -1) {
      rootPrefix = firstPath.slice(0, slashIdx + 1);
    }
  }

  const tree = [];
  const filesContent = {};
  const candidateFiles = [];

  const highPriorityNames = [
    'package.json', 'Makefile', 'docker-compose.yml', 'docker-compose.yaml',
    'requirements.txt', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'pom.xml',
    'main.py', 'app.py', 'src/index.js', 'index.js', 'src/App.jsx', 'src/App.tsx', 'README.md'
  ];

  for (const entry of zipEntries) {
    // Strip the dynamic root folder prefix
    let relativePath = entry.entryName;
    if (rootPrefix && relativePath.startsWith(rootPrefix)) {
      relativePath = relativePath.slice(rootPrefix.length);
    }

    if (!relativePath || isNoiseFile(relativePath)) {
      continue;
    }

    if (entry.isDirectory) {
      tree.push({
        path: relativePath.replace(/\/$/, ''),
        type: 'tree',
        size: 0,
      });
    } else {
      const fileSize = entry.header.size || 0;
      tree.push({
        path: relativePath,
        type: 'blob',
        size: fileSize,
      });

      // Filter for files we want to pass to AST / LLM parser
      if (fileSize < 65000 && isSourceOrConfigFile(relativePath)) {
        const isPriority = highPriorityNames.some(p => relativePath === p || relativePath.endsWith('/' + p));
        candidateFiles.push({ entry, relativePath, isPriority, size: fileSize });
      }
    }
  }

  // Prioritize critical manifests first, then source files (up to 15 files)
  candidateFiles.sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0));
  const selectedCandidates = candidateFiles.slice(0, 15);

  for (const { entry, relativePath } of selectedCandidates) {
    try {
      const text = entry.getData().toString('utf8');
      filesContent[relativePath] = text;
    } catch (e) {
      // Ignore binary decode error if any
    }
  }

  return { tree, files: filesContent };
};

/**
 * Ingests repository, extracts tree structure and raw file content of key source files
 * Uses fast in-memory Zipball extraction with resilient Git API fallback.
 */
export const extractRepoData = async (repoUrl) => {
  const { owner, repo } = parseGithubUrl(repoUrl);
  const metadata = await fetchRepoMetadata(owner, repo);

  let tree = [];
  let files = {};
  let commitSha = '';

  // Step 1: Zipball in-memory download & extraction (Single API call, 100x faster, zero rate limit depletion)
  try {
    const zipResult = await downloadAndExtractZipball(owner, repo, metadata.defaultBranch);
    tree = zipResult.tree;
    files = zipResult.files;
    console.log(`[GitHub Ingestion] Successfully extracted ${tree.length} tree nodes and ${Object.keys(files).length} files via Zipball in RAM!`);
  } catch (zipErr) {
    console.warn(`[GitHub Zipball Warning] In-memory zipball download failed (${zipErr.message}). Falling back to Git tree API...`);

    // Fallback: Git Tree API + Raw file fetching
    const treeResult = await fetchRepoTree(owner, repo, metadata.defaultBranch);
    commitSha = treeResult.commitSha;
    const cleanTree = treeResult.tree.filter(item => !isNoiseFile(item.path));

    const highPriority = ['package.json', 'Makefile', 'docker-compose.yml', 'docker-compose.yaml', 'requirements.txt', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'pom.xml', 'main.py', 'app.py', 'src/index.js', 'index.js', 'src/App.jsx', 'src/App.tsx', 'README.md'];
    
    const priorityBlobs = cleanTree.filter(item => 
      item.type === 'blob' && 
      (item.size || 0) < 60000 &&
      highPriority.some(p => item.path === p || item.path.endsWith('/' + p))
    );

    const otherCodeBlobs = cleanTree.filter(item => 
      item.type === 'blob' && 
      isSourceOrConfigFile(item.path) && 
      (item.size || 0) < 60000 &&
      !priorityBlobs.includes(item)
    );

    const candidateFiles = [...priorityBlobs, ...otherCodeBlobs].slice(0, 8);
    await Promise.allSettled(
      candidateFiles.map(async (file) => {
        try {
          const content = await fetchRawFileContent(owner, repo, metadata.defaultBranch, file.path);
          if (content !== null && content !== undefined) {
            files[file.path] = content;
          }
        } catch (err) {}
      })
    );

    tree = cleanTree.map(item => ({ path: item.path, type: item.type, size: item.size }));
  }

  return {
    owner,
    repo,
    fullName: metadata.fullName,
    description: metadata.description,
    defaultBranch: metadata.defaultBranch,
    stars: metadata.stars,
    commitSha,
    tree,
    files,
  };
};

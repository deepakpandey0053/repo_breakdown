import { parseGithubUrl, isNoiseFile, isSourceOrConfigFile } from './src/services/github.js';
import { getCache, setCache } from './src/config/db.js';

function runBackendTests() {
  console.log('Testing GitHub URL Parser...');
  const test1 = parseGithubUrl('https://github.com/facebook/react');
  if (test1.owner !== 'facebook' || test1.repo !== 'react') {
    throw new Error(`Parse failed for https://github.com/facebook/react: ${JSON.stringify(test1)}`);
  }

  const test2 = parseGithubUrl('https://github.com/pallets/flask.git');
  if (test2.owner !== 'pallets' || test2.repo !== 'flask') {
    throw new Error(`Parse failed for .git URL: ${JSON.stringify(test2)}`);
  }

  const test3 = parseGithubUrl('fastapi/fastapi');
  if (test3.owner !== 'fastapi' || test3.repo !== 'fastapi') {
    throw new Error(`Parse failed for short URL: ${JSON.stringify(test3)}`);
  }
  console.log('[PASS] GitHub URL Parser verified successfully!');

  console.log('Testing Noise File Detection...');
  if (!isNoiseFile('node_modules/express/index.js')) throw new Error('Failed to filter node_modules');
  if (!isNoiseFile('.git/config')) throw new Error('Failed to filter .git');
  if (!isNoiseFile('package-lock.json')) throw new Error('Failed to filter package-lock.json');
  if (isNoiseFile('src/index.js')) throw new Error('False positive on src/index.js');
  console.log('[PASS] Noise File Detection verified successfully!');

  console.log('Testing Source & Config Filter...');
  if (!isSourceOrConfigFile('package.json')) throw new Error('Failed to identify package.json');
  if (!isSourceOrConfigFile('main.py')) throw new Error('Failed to identify main.py');
  if (!isSourceOrConfigFile('src/App.jsx')) throw new Error('Failed to identify App.jsx');
  console.log('[PASS] Source & Config Filter verified successfully!');

  console.log('Testing In-Memory Cache Fallback...');
  setCache('test-key', { sample: 'value' });
  const cached = getCache('test-key');
  if (!cached || cached.sample !== 'value') throw new Error('In-memory cache failure');
  console.log('[PASS] In-Memory Cache Fallback verified successfully!');

  console.log('\n[SUCCESS] ALL STEP 3 NODE.JS ORCHESTRATOR TESTS PASSED SUCCESSFULLY!');
}

runBackendTests();

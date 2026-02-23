#!/usr/bin/env node

const path = require('path');
const { generateAIToolkit } = require('./generators/ai-toolkit');
const { writeStreamDeckProfile } = require('./lib/zip-writer');

async function main() {
  const outputDir = process.argv[2] || '.';
  const outputPath = path.join(outputDir, 'AI Toolkit.streamDeckProfile');

  console.log('Generating AI Toolkit Stream Deck+ profile...\n');

  const startTime = Date.now();
  const profileData = await generateAIToolkit();

  console.log(`  Pages: ${profileData.pages.length}`);
  let totalActions = 0;
  let totalImages = 0;
  for (const page of profileData.pages) {
    const keypadCount = Object.keys(page.manifest.Controllers[0].Actions).length;
    const encoderCount = Object.keys(page.manifest.Controllers[1].Actions).length;
    totalActions += keypadCount + encoderCount;
    totalImages += page.images.size;
  }
  console.log(`  Actions: ${totalActions}`);
  console.log(`  Icons: ${totalImages}`);

  const result = await writeStreamDeckProfile(outputPath, profileData);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const sizeKB = (result.size / 1024).toFixed(0);

  console.log(`\n  Output: ${result.path}`);
  console.log(`  Size: ${sizeKB} KB`);
  console.log(`  Time: ${elapsed}s`);
  console.log('\nDouble-click the file to import into Elgato Stream Deck.');
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});

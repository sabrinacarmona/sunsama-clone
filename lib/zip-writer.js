const JSZip = require('jszip');
const fs = require('fs/promises');
const path = require('path');
const { profileRootId, profileFolderId } = require('./ids');

/**
 * Write a .streamDeckProfile ZIP file.
 *
 * @param {string} outputPath - File path for the output .streamDeckProfile
 * @param {object} profileData - Profile definition:
 *   {
 *     name: string,
 *     pages: [{
 *       uuid: string,       // dashed UUID for top-level manifest
 *       folderId: string,   // 27-char base32 ID for folder name
 *       manifest: object,   // page manifest JSON
 *       images: Map<string, Buffer>  // imageId -> PNG buffer
 *     }]
 *   }
 */
async function writeStreamDeckProfile(outputPath, profileData) {
  const zip = new JSZip();
  const rootId = profileRootId();
  const rootDir = `${rootId}.sdProfile`;

  // Top-level manifest
  const topManifest = {
    Device: { Model: 7, UUID: '' },
    Name: profileData.name,
    Pages: {
      Current: profileData.pages[0].uuid,
      Pages: profileData.pages.map((p) => p.uuid),
    },
    Version: '2.0',
  };

  zip.file(`${rootDir}/manifest.json`, JSON.stringify(topManifest, null, 2));

  // Per-page folders
  for (const page of profileData.pages) {
    const pageDir = `${rootDir}/Profiles/${page.folderId}`;

    // Page manifest
    zip.file(
      `${pageDir}/manifest.json`,
      JSON.stringify(page.manifest, null, 2)
    );

    // Images
    for (const [imgId, buffer] of page.images) {
      zip.file(`${pageDir}/Images/${imgId}.png`, buffer);
    }
  }

  // Generate ZIP with STORE compression (no deflate)
  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'STORE',
  });

  await fs.writeFile(outputPath, content);
  return { path: outputPath, size: content.length, rootId };
}

module.exports = { writeStreamDeckProfile };

const fs = require('fs');
const path = require('path');

const musicDir = './music';
const outputFile = './music-manifest.json';

function scanDirectory(dir) {
  const tracks = [];
  
  function scan(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (stat.isFile() && item.toLowerCase().endsWith('.mp3')) {
          const relativePath = path.relative('.', fullPath).replace(/\\/g, '/');
          tracks.push(relativePath);
        }
      }
    } catch (error) {
      console.error(`Ошибка сканирования ${currentDir}:`, error);
    }
  }
  
  scan(musicDir);
  return tracks;
}

console.log('Сканирую папку с музыкой...');
const allTracks = scanDirectory(musicDir);

console.log(`Найдено ${allTracks.length} треков`);

const manifest = {
  generated: new Date().toISOString(),
  trackCount: allTracks.length,
  tracks: allTracks
};

fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
console.log(`Список сохранен в ${outputFile}`);

if (allTracks.length > 0) {
  console.log('\nПримеры путей:');
  for (let i = 0; i < Math.min(5, allTracks.length); i++) {
    console.log(`  ${allTracks[i]}`);
  }
}
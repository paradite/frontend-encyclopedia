const fs = require('fs');

const data = require('./data.json');

let content = '# Frontend Encyclopedia\n\n';

for (const key in data) {
  content += `### ${key}\n`;
  const terms = data[key].map((term) =>
    term.url ? `- [${term.name}](${term.url})` : `- ${term.name}`
  );
  content += terms.join('\n') + '\n\n';
}
content += '---\n\nPull requests are welcome!\n\n';

fs.writeFileSync('README.md', content);

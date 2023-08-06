const fs = require('fs');

const data = require('./data.json');

let content = '# Frontend Encyclopedia\n\n';

content += '[List by categories](categories.md)\n\n';

for (const key in data) {
  content += `### ${key}\n`;
  const terms = data[key].map((term) => {
    const nameWithLink = term.url ? `[${term.name}](${term.url})` : term.name;
    return `- ${nameWithLink}${term.type ? ` - ${term.type}` : ''}`;
  });
  content += terms.join('\n') + '\n\n';
}
content +=
  '---\n\nPull requests are welcome!\n\nEdit `scripts/data.json` to add new entries. The husky pre-commit hook will automatically update the `README.md` file.';

fs.writeFileSync('README.md', content);

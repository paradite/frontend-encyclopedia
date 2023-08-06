const fs = require('fs');

const data = require('./data.json');

let content = "# Frontend Encyclopedia\n\n";

for (const key in data) {
  const terms = data[key].map(term => term.url ? `[${term.name}](${term.url})` : term.name);
  content += key + ': ' + terms.join(', ') + '\n';
}

fs.writeFileSync('README.md', content);

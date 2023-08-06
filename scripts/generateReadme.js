const fs = require('fs');

const data = require('./data.json');

let content = '# Frontend Encyclopedia\n\n';

content += '[List by categories](categories.md)\n\n';

for (const key in data) {
  content += `### ${key}\n`;
 
  const terms = data[key].map((term) => {
    let dateInfo = ``
    const nameWithLink = term.url
      ? `[${term.name}](${term.url})`
      : term.name;

    if (term.year_created && term.year_deprecated) {
      dateInfo = `(${term.year_created} - ${term.year_deprecated})`
    } else if (term.year_created) {
      dateInfo = `(${term.year_created})`
    }
    return `- ${nameWithLink}${
      term.type ? (dateInfo) ? ` - ${term.type} ${dateInfo}` : ` - ${term.type}`  : ''
    }`;
  });
  content += terms.join('\n') + '\n\n';
}
content +=
  '---\n\nPull requests are welcome!\n\nEdit `scripts/data.json` to add new entries.\n\nEnsure that official names are used with correct spelling, capitalization and styling. \n\nThe husky pre-commit hook will automatically update the `README.md` file.';

fs.writeFileSync('README.md', content);

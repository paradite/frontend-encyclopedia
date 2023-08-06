const fs = require('fs');
const data = require('./data.json');

const categories = {};

for (const key in data) {
  data[key].forEach((term) => {
    let dateInfo = ``
    if (term.year_created && term.year_deprecated) {
      dateInfo = ` (${term.year_created} - ${term.year_deprecated})`
    } else if (term.year_created) {
      dateInfo = ` (${term.year_created})`
    }
    if (term.type) {
      if (!categories[term.type]) categories[term.type] = [];
      let nameWithLink = term.url ? `[${term.name}](${term.url})` : term.name;

      if (dateInfo) 
        nameWithLink += dateInfo     
      categories[term.type].push(nameWithLink);
    }
  });
}

let content = '# Categories\n\n';

Object.keys(categories)
  .sort()
  .forEach((category) => {
    content += `### ${category}\n`;
    content += categories[category].map((item) => `- ${item}`).join('\n') + '\n\n';
  });

fs.writeFileSync('categories.md', content);

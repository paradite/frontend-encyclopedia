const fs = require('fs');

const data = require('./data.json');

// README.md

let readmeContent = '# Frontend Encyclopedia\n\n';
readmeContent += '[List by categories](categories.md)\n\n';

for (const key in data) {
  readmeContent += `### ${key}\n`;
  const terms = data[key]
    .map((term) => {
      ``;
      const nameWithLink = term.url
        ? `[${term.name}](${term.url})`
        : term.name;

      let dateInfo = getAdditionalInfo(term);
      return `- ${nameWithLink}${
        term.type
          ? dateInfo
            ? ` - ${term.type} ${dateInfo}`
            : ` - ${term.type}`
          : ''
      }`;
    })
    // sort by name case-insensitive
    .sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  readmeContent += terms.join('\n') + '\n\n';
}
readmeContent +=
  '---\n\nPull requests are welcome!\n\nEdit `scripts/data.json` to add new entries.\n\nEnsure that official names are used with correct spelling, capitalization and styling. \n\nThe husky pre-commit hook will automatically update the `README.md` file.';

fs.writeFileSync('README.md', readmeContent);

// categories.md

const categories = {};

for (const key in data) {
  data[key].forEach((term) => {
    let dateInfo = getAdditionalInfo(term);
    if (term.type) {
      if (!categories[term.type])
        categories[term.type] = [];
      let nameWithLink = term.url
        ? `[${term.name}](${term.url})`
        : term.name;

      if (dateInfo) nameWithLink += ` ${dateInfo}`;
      categories[term.type].push(nameWithLink);
    }
  });
}

let categoriesContent =
  '# Frontend Encyclopedia - Categories\n\n';

Object.keys(categories)
  .sort()
  .forEach((category) => {
    categoriesContent += `### ${category}\n`;
    categoriesContent +=
      categories[category]
        .map((item) => `- ${item}`)
        // sort by name case-insensitive
        .sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
        .join('\n') + '\n\n';
  });

fs.writeFileSync('categories.md', categoriesContent);

function getAdditionalInfo(term) {
  let dateInfo = ``;
  let noteInfo = term.note ? `, ${term.note}` : '';

  if (term.year_created && term.year_deprecated) {
    dateInfo = `(${term.year_created} - ${term.year_deprecated}${noteInfo})`;
  } else if (term.year_created) {
    dateInfo = `(${term.year_created}${noteInfo})`;
  }

  return dateInfo;
}

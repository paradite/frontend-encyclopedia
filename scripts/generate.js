const fs = require('fs');

const data = require('./data.json');

function getAdditionalInfo(term) {
  let dateInfo = ``;
  let noteInfo = term.note ? `, ${term.note}` : '';
  let yearCreated = term.year_created_source
    ? `[${term.year_created}](${term.year_created_source})`
    : term.year_created;
  let yearDeprecated = term.year_deprecated_source
    ? `[${term.year_deprecated}](${term.year_deprecated_source})`
    : term.year_deprecated;
  if (term.year_created && term.year_deprecated) {
    dateInfo = `(${yearCreated} - ${yearDeprecated}${noteInfo})`;
  } else if (term.year_created) {
    dateInfo = `(${yearCreated}${noteInfo})`;
  }

  return dateInfo;
}

const subHeading = `<div align="center">
List by
<a href="README.md">Alphabetical order</a> |
<a href="categories.md">Categories</a> | 
<a href="chronological.md">Chronological order</a> |
<a href="#contributing">Contribute</a>
</div>

`;

const contributing =
  `---\n` +
  subHeading +
  `## Contributing

Pull requests are welcome! Take note of the following guidelines:

- Edit \`scripts/data.json\` to add new entries or update existing ones.
  - Do not edit \`README.md\` or other markdown files directly.
- Ensure that official names are used with correct spelling, capitalization and styling.
  - For example, use "Node.js" instead of "nodejs" or "node.js". Use "npm" instead of "NPM".
- Add \`year_created\` and \`year_created_source\` fields.
  - \`year_created_source\` should cite npm package version page, GitHub release page, Wikipedia page with first release date information or other official sources which indicate the year of creation or first release.
  - \`year_created_source_alt\` can be added to cite an alternative official source, in case the primary source is no longer available.
  - Add \`year_deprecated\` and \`year_deprecated_source\` fields when applicable.
- Optionally, run \`npm run generate\` to update the \`README.md\` and other markdown files automatically.
  - To avoid the need to run \`npm run generate\` for each change, setup a [git pre-commit hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) with script below:
  - \`node scripts/generate.js && git add *.md\`
## Criteria for inclusion

Either one of the following must be true:

- The term is closely related to frontend development and widely known among a group of frontend developers, e.g. webpack, React, Figma.
- The term is not specific to frontend but used extensively by frontend developers, e.g. git, GitHub, Node.js.

`;

// README.md

let readmeContent =
  '<div align="center"><h1>Frontend Encyclopedia</h1></div>\n' +
  subHeading;

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
          ? `: ${term.type}${
              dateInfo ? ` ${dateInfo}` : ''
            }`
          : ''
      }`;
    })
    // sort by name case-insensitive
    .sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  readmeContent += terms.join('\n') + '\n\n';
}
readmeContent += contributing;

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
  '<div align="center"><h1>Frontend Encyclopedia - Categories</h1></div>\n' +
  subHeading;

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

categoriesContent += contributing;

fs.writeFileSync('categories.md', categoriesContent);

// chronological.md

const chronological = {};

for (const key in data) {
  data[key].forEach((term) => {
    let dateInfo = getAdditionalInfo(term);
    let yearCreated = term.year_created;
    let category = term.type; // Using 'type' as the category

    if (yearCreated && category) {
      let nameWithLink = term.url
        ? `[${term.name}](${term.url})`
        : term.name;

      let entry = `- ${nameWithLink}: ${category}${
        dateInfo ? ` ${dateInfo}` : ''
      }`;

      if (!chronological[yearCreated])
        chronological[yearCreated] = [];

      chronological[yearCreated].push(entry);
    }
  });
}

let chronologicalContent =
  '<div align="center"><h1>Frontend Encyclopedia - Chronological Order</h1></div>\n' +
  subHeading;

Object.keys(chronological)
  .sort((a, b) => a - b)
  .forEach((year) => {
    chronologicalContent += `### ${year}\n`;
    chronologicalContent +=
      chronological[year].join('\n') + '\n\n';
  });

chronologicalContent += contributing;

fs.writeFileSync('chronological.md', chronologicalContent);

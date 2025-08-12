import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { lookupCollections, locate } from '@iconify/json';
import { parseIconSet } from '@iconify/utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.argv.length < 3) {
  console.log('Please specify the collection you want to use.');
  process.exit(1);
}

const defaultCollections = ['mdi', 'wi', 'fa'];
const allCollections = Object.keys(await lookupCollections());

let collections = [];
if (process.argv[2] === 'default') {
  collections = defaultCollections;
} else {
  for (let i = 2; i < process.argv.length; i++) {
    if (allCollections.includes(process.argv[i])) {
      collections.push(process.argv[i]);
    } else {
      console.log(`Collection not found: ${process.argv[i]}`);
      process.exit(1);
    }
  }
}

if (collections.length === 0) {
  process.exit(1);
}

const componentsDir = path.join(__dirname, 'components');
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir);
}

for (const prefix of collections) {
  console.log(`Processing icon collection: ${prefix}`);

  const jsonPath = locate(prefix);
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const targetDir = path.join(componentsDir, prefix);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  parseIconSet(jsonData, (name, data) => {
    if (!data.body) return;

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${data.width || 16} ${data.height || 16}" height="100%" width="100%">${data.body}</svg>`;

    const componentName =
      'yad-icon-' +
      prefix +
      '-' +
      name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

    const template = `
const template = document.createElement('template');
template.innerHTML = \`
  <style>
    :host {
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      width: var(--yad-icon-size, 24px);
      height: var(--yad-icon-size, 24px);
    }
  </style>
  ${svgString}
\`;
window.customElements.define('${componentName}', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
});
`;

    fs.writeFileSync(
      path.join(targetDir, `${componentName}.js`),
      template,
      'utf8'
    );
  });
}

console.log('✅ All collections processed successfully.');

var fs = require('fs');
var path = require('path');

var iconifyJSON = require('@iconify/json');
var iconifyTools = require('@iconify/json-tools');

if(process.argv.length < 3) {
  console.log('please specify the collection you want to use');
  process.exit(1);
}

var defaultCollections = ['mdi', 'wi', 'fa'];
var collections = [];

var allCollections = Object.keys(iconifyJSON.collections());

if(process.argv[2] === 'default') {
  collections = defaultCollections;
} else {
  for(let i = 2; i < process.argv.length; i++) {
    if(allCollections.includes(process.argv[i])) {
      collections.push(process.argv[i]);
    } else {
      console.log('collection not found');
      process.exit(1);
    }
  }  
}

if(collections.length == 0) {
  process.exit(1);
}

var componentPath = path.join(__dirname, '/components');
if(!fs.existsSync(componentPath)) {
  fs.mkdirSync(componentPath);
}

collections.forEach(function(collectionName) {
  console.log('convert icon collection ' + collectionName);
  let componentPath = path.join(__dirname, '/components/' + collectionName);
  if(!fs.existsSync(componentPath)) {
    fs.mkdirSync(componentPath);
  }
  let collection = new iconifyTools.Collection();
  collection.loadIconifyCollection(collectionName);
  collection.listIcons(true).forEach(icon => {
    let svg = new iconifyTools.SVG(collection.getIconData(icon));
    let svgString = generateSVG(svg, {height: '100%'}); //svg.getSVG({height: '100%'});
  
    var componentName = 'yad-icon-' + collectionName + '-';
    componentName += icon.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    var s = createTemplate(componentName, svgString);
    var fileName = path.join(componentPath, componentName + '.js');
    fs.writeFileSync(fileName, s);
  });
});



function createTemplate(componentName, svg) {
  var s = '';
  s += "const template = document.createElement('template');";
  s += "template.innerHTML = `";
  s +=   "<style>";
  s +=     ":host {";
  s +=       "display: inline-block;";
  s +=       "vertical-align: middle;";
  s +=       "text-align: center;";
  s +=       "width: var(--yad-icon-size, 24px);";
  s +=       "height: var(--yad-icon-size, 24px);";
  s +=     "}";
  s +=   "</style>";
  s +=   svg;
  s += '`;';
  s += 'window.customElements.define("' + componentName + '", class extends HTMLElement {';
  s +=   'constructor() {';
  s +=     'super();';
  s +=     'this.attachShadow({mode: "open"});';
  s +=     'this.shadowRoot.appendChild(template.content.cloneNode(true));';
  s +=   '}';
  s += '});';
  return s;
}






/*
  The following function is a modified version of the getSVG function from
  https://github.com/iconify/json-tools.js/blob/master/src/svg.js
  released under the following licence

  MIT License

  Copyright (c) 2018 Vjacheslav Trushkin

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
function generateSVG(svgObject, props) {
  let attributes = iconifyTools.SVG.splitAttributes(props);
  let data = svgObject.getAttributes(attributes.icon);

  let svg = '<svg'; //xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"

  Object.keys(data.attributes).forEach(attr => {
    if(attr != 'preserveAspectRatio') svg += ' ' + attr + '="' + data.attributes[attr] + '"';
  });

  if(Object.keys(data.style).length) {
    svg += ' style="';
    Object.keys(data.style).forEach(attr => {
      svg += ' ' + attr + ': ' + data.style[attr] + ';';
    });
    if (props && props.style !== undefined) {
      svg += props.style;
    }
    svg += '"';
  }

  svg += '>';

  svg += data.body + '</svg>';
  return svg;
}


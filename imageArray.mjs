import fs from 'fs';
import brandData from './brandData.js';

const images = {};

for (const key in brandData) {
  if (brandData.hasOwnProperty(key)) {
    const item = brandData[key];
    if (item.image) {
      const imageName = item.image.split('/').pop(); // Extract the image name from the image path
      images[item.name] = `./pictures/VapePics/${item.brand}/${imageName}.png`;
    }
  }
}

let content = 'module.exports = {\n';

for (let key in images) {
  content += `  "${key}": require("${images[key]}"),\n`;
}

content += '};';

const filePath = 'imageArray2.js';

fs.writeFile(filePath, content, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log(`Successfully wrote images to ${filePath}`);
  }
});
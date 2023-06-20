const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('Vape Flavors.xlsx');
const sheet_name_list = workbook.SheetNames;

let formattedData = {};

// Iterate over all sheets
for(let i = 0; i < sheet_name_list.length; i++){
    // Convert each sheet to JSON
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]);

    // Reduce each sheet's data and merge it into formattedData
    const sheetData = data.reduce((obj, item) => {
        obj[item.id] = {
            name: item.name,
            price: item.price,
            brand: item.brand,
            image: item.image,
        };
        return obj;
    }, {});

    // Merge current sheet data into formattedData
    formattedData = { ...formattedData, ...sheetData};
}

fs.writeFile('output.json', JSON.stringify(formattedData, null, 2), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});

console.log(formattedData);
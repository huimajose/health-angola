const fetch = require('node-fetch');
const fs = require('fs');

// Array com os nomes das províncias de Angola
const provinces = [
  "Bengo",
  "Benguela",
  "Bié",
  "Cabinda",
  "Cuando Cubango",
  "Cunene",
  "Huambo",
  "Huíla",
  "Luanda",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Moxico",
  "Namibe",
  "Uíge",
  "Zaire"
];

// Função que faz uma solicitação à API Geocode.xyz e retorna os dados de latitude e longitude
async function getCoordinates(location) {
  const response = await fetch(`https://geocode.xyz/${location},+Angola?json=1`);
  const data = await response.json();
  return {
    latitude: data.latt,
    longitude: data.longt
  };
}

// Função principal que itera sobre as províncias, obtém as coordenadas e as escreve em um arquivo CSV
async function generateDataset() {
  const dataset = [];
  for (const province of provinces) {
    const coordinates = await getCoordinates(province);
    dataset.push(`${province},${coordinates.latitude},${coordinates.longitude}`);
  }
  const csv = dataset.join('\n');
  fs.writeFileSync('provinces.csv', csv);
}

// Chamada da função principal
generateDataset();

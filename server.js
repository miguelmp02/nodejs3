const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const fs = require('fs');

const app = express();
const port = 3000;

const url = 'http://as.com';

async function fetchData() {
  try {
    console.log('Realizando solicitud HTTP...');
    const response = await axios.get(url);
    console.log('Solicitud HTTP exitosa.');
    fs.writeFileSync('html_output.html', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al hacer la solicitud HTTP:', error.message);
    return null;
  }
}


function processHTML(html) {
  const $ = cheerio.load(html);
  $('.text').each((index, element) => {
    const quote = $(element).text();
    console.log('Cita:', quote);
  });
  $('.author').each((index, element) => {
    const author = $(element).text();
    console.log('Autor:', author);
  });
}

async function scrape() {
  const html = await fetchData();
  if (html) {
    processHTML(html);
  } else {
    console.log('No se pudo obtener el HTML para el scraping.');
  }
}

cron.schedule('*/30 * * * * *', () => {
  console.log('Ejecutando scraper...');
  scrape();
});

app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor de web scraping!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

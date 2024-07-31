const express = require('express');
const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');

const app = express();
const port = 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para cargar el CSV
app.get('/getCSV', (req, res) => {
    const filePath = path.join(__dirname, 'sinRepetidos2.csv');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error al leer el archivo CSV.");
        }
        Papa.parse(data, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                res.send(results);
            },
            error: function (error) {
                res.status(500).send("Error al parsear el archivo CSV.");
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

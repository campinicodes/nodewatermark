const express = require('express');
const fileUpload = require('express-fileupload');
const Jimp = require('jimp');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(fileUpload());

app.post('/apply-watermark', async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).send('Nenhuma imagem foi enviada.');
        }

        const image = await Jimp.read(req.files.image.data);
        const watermarkFileName = req.body.watermark;
        const marcaDagua = await Jimp.read(watermarkFileName);

        // Calcular o fator de escala
        const scale = Math.min(
            image.bitmap.width / marcaDagua.bitmap.width,
            image.bitmap.height / marcaDagua.bitmap.height
        );

        // Redimensionar a marca d'água proporcionalmente
        marcaDagua.scale(scale);

        // Calcular as coordenadas (x, y) para centralizar a marca d'água
        const x = (image.bitmap.width - marcaDagua.bitmap.width) / 2;
        const y = (image.bitmap.height - marcaDagua.bitmap.height) / 2;

        image.composite(marcaDagua, x, y, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 0.5,
        });

        const resultBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(resultBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro ao processar a imagem.');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

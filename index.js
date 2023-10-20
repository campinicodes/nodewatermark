const Jimp = require('jimp');

Jimp.read('imagem1.jpg')
    .then((imagem) => {

        return Jimp.read('watermark.png').then((marcaDagua) => {

            // Calcular o fator de escala
            const scale = Math.min(
                imagem.bitmap.width / marcaDagua.bitmap.width,
                imagem.bitmap.height / marcaDagua.bitmap.height
            );

            // Redimensionar a marca d'água proporcionalmente
            marcaDagua.scale(scale);

            // Calcular as coordenadas (x, y) para centralizar a marca d'água
            const x = (imagem.bitmap.width - marcaDagua.bitmap.width) / 2;
            const y = (imagem.bitmap.height - marcaDagua.bitmap.height) / 2;

            imagem.composite(marcaDagua, x, y, {
                mode: Jimp.BLEND_SOURCE_OVER,
                opacitySource: 0.5,
            });

            imagem.write('watermarked.jpg', () => console.log('Aplicado com sucesso!'));

        });

    })
    .catch((err) => {
        console.error(err);
    });

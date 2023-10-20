const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const resultDiv = document.getElementById('result');
const watermarkSelect = document.getElementById('watermark-select');
const watermarkPreview = document.getElementById('watermark-preview');

watermarkSelect.addEventListener('change', () => {

    const selectedWatermark = watermarkSelect.value;
    const watermarkImage = new Image();
    watermarkImage.src = selectedWatermark;
    watermarkImage.alt = `Marca d'Água ${watermarkSelect.selectedIndex + 1}`;
    watermarkPreview.innerHTML = '';
    watermarkPreview.appendChild(watermarkImage);

});

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('watermark', watermarkSelect.value);
    

    try {
        const response = await fetch('/apply-watermark', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            resultDiv.innerHTML = `<h2>Imagem com Marca d'Água</h2><img src="${imageUrl}" alt="Imagem com Marca d'Água">`;
        } else {
            resultDiv.innerHTML = '<p>Ocorreu um erro no servidor.</p>';
        }
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = '<p>Ocorreu um erro ao enviar a imagem.</p>';
    }
});

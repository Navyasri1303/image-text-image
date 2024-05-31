const textToImageToken = "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";
const imageToTextToken = "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";
 

const inputText = document.getElementById("input-text");
const generatedImage = document.getElementById("generated-image");
const textToImageButton = document.getElementById("btn-text-to-image");

const inputImage = document.getElementById("input-image");
const generatedText = document.getElementById("generated-text");
const imageToTextButton = document.getElementById("btn-image-to-text");


async function generateImageFromText() {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/Melonie/pokemon-lora",
            {
                headers: {
                    Authorization: `Bearer ${textToImageToken}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ inputs: inputText.value }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Error:", error);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.blob();
        const objectURL = URL.createObjectURL(result);
        generatedImage.src = objectURL;
    } catch (error) {
        console.error("Error during image generation:", error);
    }
}

textToImageButton.addEventListener('click', generateImageFromText);

async function generateTextFromImage(file) {
    const data = await file.arrayBuffer();
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/adityarajkishan/ImageCaptioningTransformers",
            {
                headers: {
                    Authorization: `Bearer ${imageToTextToken}`,
                    "Content-Type": "application/octet-stream"
                },
                method: "POST",
                body: data,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Error:", error);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        generatedText.textContent = result[0].generated_text;
    } catch (error) {
        console.error("Error during text generation:", error);
    }
}

imageToTextButton.addEventListener('click', () => {
    const file = inputImage.files[0];
    if (file) {
        generateTextFromImage(file);
    } else {
        alert("Please select an image file first.");
    }
});

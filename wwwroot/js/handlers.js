async function handleConditions() {
    if (areTermsAccepted()) {
        toggleElementVisibility(termsOfUse, false);
        await processConfig(loadImageGallery);
        toggleElementVisibility(imageGalleryContainer, true);
    } else {
        toggleElementVisibility(imageGalleryContainer, false);
        await processConfig(loadTermsOfUse);
        toggleElementVisibility(termsOfUse, true);
    }
}

function onRejectButtonClick() {
    toggleElementVisibility(modal, true);
}

async function onAcceptButtonClick() {
    setAccepted();
    toggleElementVisibility(termsOfUse, false);
    await processConfig(loadImageGallery);
    toggleElementVisibility(imageGalleryContainer, true);
}

async function onNextButtonClick() {
    let currentIndex = getCurrentIndex();
    currentIndex++;
    
    let imageUrls = getImageUrls();
    if (currentIndex >= imageUrls.length) {
        currentIndex = 0;
    }

    saveCurrentIndex(currentIndex.toString());
    
    await renderImageToCanvas(imageUrls[currentIndex]);
}

async function onPrevButtonClick() {
    let currentIndex = getCurrentIndex();
    currentIndex--;
    
    let imageUrls = getImageUrls();
    if (currentIndex < 0) {
        currentIndex = imageUrls.length - 1;
    }
    
    saveCurrentIndex(currentIndex.toString());
    
    await renderImageToCanvas(imageUrls[currentIndex]);
}

function onCloseModalButtonClick() {
    toggleElementVisibility(modal, false);
}

async function onSaveButtonClick() {
    const imageUrls = getImageUrls();
    const currentIndex = getCurrentIndex();
    const imageUrl = imageUrls[currentIndex];

    try {
        const response = await fetch(`${FILE_ENDPOINT}?url=${encodeURIComponent(imageUrl)}`);

        if (response.ok) {
            const blob = await response.blob();

            const imageLink = document.createElement('a');

            imageLink.href = window.URL.createObjectURL(blob);
            imageLink.download = imageUrl.split('/').pop();
            imageLink.type = response.headers.get('Content-Type');
            document.body.appendChild(imageLink);

            imageLink.click();

            window.URL.revokeObjectURL(imageLink.href);
        } else {
            console.error('Failed to download image.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

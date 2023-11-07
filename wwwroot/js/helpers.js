function saveValueInStorage(key, value) {
    sessionStorage.setItem(key, value);
}

function getValueFromStorage(key) {
    return sessionStorage.getItem(key);
}

async function renderImageToCanvas(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;

        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve();
        };
    });
}

async function loadImageGallery(config, data) {
    if (config && data && data.images) {

        const imageUrls = data.images.map((image) => {
            const partsOfImageUrl = image.image_url.split('/');
            const imageName = partsOfImageUrl[partsOfImageUrl.length - 1];

            return `${config.apiUrl}${imageName}`;
        });

        initializeCurrentIndex();
        saveImageUrlsLocally(imageUrls);

        await renderImageToCanvas(imageUrls[0]);
    } else {
        console.error('Invalid images data.');
    }
}

function getCurrentIndex() {
    return parseInt(getValueFromStorage('currentIndex'), 10);
}

function getImageUrls() {
    const jsonString = getValueFromStorage('imageUrls');
    if (jsonString) {
        return JSON.parse(jsonString);
    } else {
        return [];
    }
}

function initializeCurrentIndex() {
    if(!getValueFromStorage('currentIndex')) {
        saveCurrentIndex(0);
    }
}

function saveCurrentIndex(index) {
    saveValueInStorage('currentIndex', index);
}

function saveImageUrlsLocally(imageUrls) {
    const jsonString = JSON.stringify(imageUrls);
    saveValueInStorage('imageUrls', jsonString);
}

function toggleElementVisibility(element, isVisible) {
    element.style.display = isVisible ? 'block' : 'none';
}

function areTermsAccepted() {
    let name = "accepted=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length) === "true";
        }
    }
    return false;
}

function setAccepted() {
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    document.cookie = "accepted=true; expires=" + expirationDate.toUTCString();
}

function replacePlaceholdersInText(text, config) {
    const regex = /\[Name of Province\]|\[Name of City\]|\[Merchant Name\]|\[Email Address\]/g;

    return text.replace(regex, match => {
        switch (match) {
            case '[Name of Province]':
                return config.nameOfProvince;
            case '[Name of City]':
                return config.nameOfCity;
            case '[Merchant Name]':
                return config.merchantName;
            case '[Email Address]':
                return config.emailAddress;
            default:
                return match;
        }
    });
}

function addTermParagraph(paragraph, config) {
    const pElement = document.createElement('p');
    const paragraphText = paragraph.content || paragraph.text;
    const replacedText = replacePlaceholdersInText(paragraphText, config);

    const titleElement = document.createElement('strong');
    const textElement = document.createElement('span');

    titleElement.classList.add('paragraph-title');
    textElement.classList.add('paragraph-text');

    titleElement.textContent = paragraph.title;
    textElement.textContent = replacedText;

    pElement.appendChild(titleElement);
    pElement.appendChild(textElement);

    termsContent.appendChild(pElement);
}

function loadTermsOfUse(config, data) {
    if (config && data && data.terms_of_use && data.terms_of_use.paragraphs) {
        const sortedParagraphs = data.terms_of_use.paragraphs.sort((a, b) => a.index - b.index);
        sortedParagraphs.forEach(paragraph => addTermParagraph(paragraph, config));
    } else {
        console.error('Invalid terms of use data.');
    }
}

async function processConfig(callback) {
    try {
        const configResponse = await fetch(CONFIG_ENDPOINT);
        const config = await configResponse.json();

        if (config && config.apiUrl && config.dataFileName) {
            const response = await fetch(`${config.apiUrl}${config.dataFileName}`);
            const data = await response.json();

            callback(config, data);
        } else {
            console.error('Invalid config file format.');
        }
    } catch (error) {
        console.error('Error loading config file: ', error);
    }
}
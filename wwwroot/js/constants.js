const CONFIG_ENDPOINT = 'api/config';
const FILE_ENDPOINT = 'api/file';

const acceptButton = document.getElementById('acceptButton');
const rejectButton = document.getElementById('rejectButton');
const imageGalleryContainer = document.getElementById('imageGalleryContainer');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModalButton');
const saveButton = document.getElementById('saveButton');
const termsOfUse = document.getElementById('termsOfUse');
const termsContent = document.getElementById('termsContent');
const canvas = document.getElementById('imageCanvas');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const ctx = canvas.getContext('2d');

export function initPopup() {
    const trackingButton = document.getElementById('tracking_button');
    const popupContainer = document.getElementById('popup-container');
    const closePopupButton = document.getElementById('close-popup');

    trackingButton.addEventListener('click', togglePopup);
    closePopupButton.addEventListener('click', closePopup);
    window.addEventListener('click', handleOutsideClick);
}

function togglePopup() {
    const popupContainer = document.getElementById('popup-container');
    popupContainer.style.display = popupContainer.style.display === 'none' || popupContainer.style.display === '' ? 'block' : 'none';
}

function closePopup() {
    document.getElementById('popup-container').style.display = 'none';
}

function handleOutsideClick(event) {
    const popupContainer = document.getElementById('popup-container');
    const trackingButton = document.getElementById('tracking_button');
    if (!popupContainer.contains(event.target) && !trackingButton.contains(event.target)) {
        popupContainer.style.display = 'none';
    }
}

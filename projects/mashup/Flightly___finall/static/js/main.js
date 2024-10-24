import { initFlightSearch } from './components/flightSearch.js';
import { initSmsForm } from './components/smsForm.js';
import { initPopup } from './components/popup.js';

document.addEventListener('DOMContentLoaded', () => {
    initFlightSearch();
    initSmsForm();
    initPopup();
});

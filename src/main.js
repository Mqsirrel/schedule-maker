import './styles/mobile-presentation.css';
import { ScheduleMakerApp } from './application/ScheduleMakerApp.js';

document.addEventListener('DOMContentLoaded', () => {
  window.app = new ScheduleMakerApp();
});

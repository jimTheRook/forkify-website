import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (el) {
      el.preventDefault();

      // Get the data from the form using the folowing method
      const dataArr = [...new FormData(this)];

      // Convert the dataArr to an object using the following method
      const data = Object.fromEntries(dataArr);

      // Get the data to the model by way of the subscribed handler from the controller
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();

import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  // USING JsDoc Documentation
  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View Instance
   * @author Jim Bourbeau
   * @todo Finsih implimentation
   */
  render(data, render = true) {
    // check to see if data exists (!data works for undefinded and null)
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // check to see if data exists (!data works for undefinded and null)

    this._data = data;

    // create a new markup but not render it. Compare with existing first and change only what is different.
    const newMarkup = this._generateMarkup();

    // create a virtual dom of the area defined by the markup. Create the object, then fill it with the markup string that will be converted into real elements.
    const newDom = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curELements = Array.from(this._parentElement.querySelectorAll('*'));

    // compare
    newElements.forEach((newEl, i) => {
      const curEl = curELements[i];

      // Update changes to text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Udate changed Attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(att => {
          curEl.setAttribute(att.name, att.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
              <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
              </svg>
          </div>
      <p>${message}</p>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
          <div>
              <svg>
                  <use href="${icons}#icon-smile"></use>
              </svg>
          </div>
      <p>${message}</p>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

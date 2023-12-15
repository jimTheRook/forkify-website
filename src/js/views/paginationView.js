import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      // perform handler function
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and there are other pages. Then render only the "next" button"
    if (this._data.page === 1 && numPages > 1) {
      return this._generateNextBtn();
    }
    // Last Page and there are other pages. Then render only the "previous" button"
    if (this._data.page === numPages && numPages > 1) {
      return this._generatePreviousBtn();
    }
    // Other page. Then, render both the "previous" and "next" buttons
    if (this._data.page < numPages) {
      return [this._generatePreviousBtn(), this._generateNextBtn()].join('');
    }

    // Page 1 and NO other pages. Then do not use any button
    return '';
  }

  _generatePreviousBtn() {
    return `
    <button data-goto = ${
      this._data.page - 1
    } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
    </button>`;
  }

  _generateNextBtn() {
    return `
    <button data-goto = ${
      this._data.page + 1
    } class="btn--inline pagination__btn--next">
         <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
             <use href="${icons}#icon-arrow-right"></use>
            </svg>
    </button> `;
  }
}

export default new PaginationView();

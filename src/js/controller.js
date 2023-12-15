import * as model from './model.js';
import recipeView from '../js/views/recipeView.js';

import 'core-js/stable'; // this is to pollyfill everything else
import 'regenerator-runtime/runtime'; // this is to polyfill assync/await
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}

async function controlRecipes() {
  try {
    // get the hash from the window url. Slice to remove the # at the beginning
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Spinner
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Load Recipe
    await model.loadRecipe(id);

    // Render Recipe
    recipeView.render(model.state.recipe);

    console.log(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.log(error);
  }
}

// The subscriber pattern for Event Listeners in the view
function init() {
  bookmarksView.addHandlerRender(controlBookmarksRender);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServingsClick(controlServings);
  recipeView.addHandlerToggleBookmark(controlToggleBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render the inital pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
}

function controlPagination(pageNum) {
  resultsView.render(model.getSearchResultsPage(pageNum)); // list view of recipes
  paginationView.render(model.state.search); // view of the page buttons at the bottom of the list
}

function controlServings(servings) {
  // update servers in model
  model.updateServings(servings);

  // update the recipeView
  recipeView.update(model.state.recipe);
}

function controlToggleBookmark() {
  // Add/Remove bookmark
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  // update the view
  recipeView.update(model.state.recipe);

  // Render the bookmarks view
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarksRender() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    // Show Spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe
    await model.uploadRecipe(newRecipe);

    // Render the new recipe
    recipeView.render(model.state.recipe);

    // Render success window
    addRecipeView.renderMessage();

    // Render the bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change Id in URL (READ THROUGH THE HISTORY API)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    console.log(model.state.recipe);
  } catch (error) {
    console.error('💥', error);
    addRecipeView.renderError(error.message);
  }
}

init();

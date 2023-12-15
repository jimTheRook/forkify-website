import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config.js';
import { AJAX } from '../../../final/src/js/helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(`${error} 💥💥💥💥`);
    throw error;
  }
}

function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: false,
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    // Reset the page to 1
    state.search.page = 1;
  } catch (error) {
    console.error(`${error} 💥💥💥💥`);
    throw error;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  // Return an array of 10 objects pulled from the state.search.results starting at position page * 10.
  const start = (page - 1) * state.search.resultsPerPage;
  const end = start + state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (newServings / state.recipe.servings) * ing.quantity;
  });

  state.recipe.servings = newServings;
}

export function addBookmark(recipe) {
  // Add bookmark to array if it is not already in the area
  if (!state.bookmarks.map(rec => rec.id).includes(recipe.id))
    state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  // Store in local storage
  persistBookmarks();

  console.log('BOOKMARKS:', state.bookmarks);
}

export function deleteBookmark(id) {
  // Find the element in the bookmarks array and delete it
  const index = state.bookmarks.findIndex(rec => rec.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as not bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  // Store in local storage
  persistBookmarks();
}

function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
}

export async function uploadRecipe(recipeData) {
  try {
    const ingredients = Object.entries(recipeData)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingredArray = ing[1].split(',').map(ing => ing.trim());

        if (ingredArray.length !== 3)
          throw new Error(
            'wrong ingredient format! Please use the correct format.'
          );

        const [quantity, unit, description] = ingredArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: recipeData.title,
      source_url: recipeData.sourceUrl,
      image_url: recipeData.image,
      publisher: recipeData.publisher,
      cooking_time: +recipeData.cookingTime,
      servings: +recipeData.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}

// This function is ONLY FOR DEVELOPEMENT
function clearBookmarks() {
  localStorage.clear('bookmarks');
}
//clearBookmarks();
init();

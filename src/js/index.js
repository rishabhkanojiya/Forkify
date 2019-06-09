import Search from "./models/search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchViews";
import * as recipeView from "./views/recipeViews";
import { elements, renderLoader, clearLoader } from "./views/base";

const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();
  if (query) {
    state.search = new Search(query);
  }
  searchView.clearIP();
  searchView.clearResults();
  renderLoader(elements.searchRes);
  try {
    await state.search.getResult();
    clearLoader();
    searchView.renderResult(state.search.result);
  } catch (error) {
    clearLoader();

    console.log("error :", error);
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPAges.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResults();

    searchView.renderResult(state.search.result, goToPage);
  }
});

// ***********
const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");

  if (id) {
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    if (state.search) searchView.highltSelected(id);
    state.recipe = new Recipe(id);
    try {
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      state.recipe.calcTime();

      state.recipe.calcServing();

      clearLoader();

      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      console.log("error :", error);
    }
  }
};

["hashchange", "load"].forEach(event => {
  window.addEventListener(event, controlRecipe);
});

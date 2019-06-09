import { elements } from "./base";

export const getInput = () => {
  return elements.searchInput.value;
};

export const clearIP = () => {
  return (elements.searchInput.value = "");
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPAges.innerHTML = "";
};
export const highltSelected = id => {
  const resultArr = Array.from(document.querySelectorAll(".results__link"));
  resultArr.forEach(el => {
    el.classList.remove("results__link--active");
  });
  document
    .querySelector(`a[href="#${id}"]`)
    .classList.add("results__link--active");
};

// for limiting String for display ........................
export const limitStr = (title, limit = 17) => {
  if (title.length > limit) {
    const trstr = title.substring(0, limit);
    return `${trstr} ...`;
  }
  return title;
};

const renderRecipe = recipe => {
  const markup = `
    <li>
        <a class="results__link results__link--active" href="#${
          recipe.recipe_id
        }">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitStr(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

export const createBtn = (page, type) => `
  <button class="btn-inline results__btn--${type} " data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
<span>Page ${type === "prev" ? page - 1 : page + 1}</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${
            type === "prev" ? "left" : "right"
          }"></use>
      </svg>
  </button>   
                
`;

export const renderBtn = (page, numRes, resPerPage) => {
  const pages = Math.ceil(numRes / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    button = createBtn(page, "next");
  } else if (page < pages) {
    button = `
      ${createBtn(page, "prev")}
      ${createBtn(page, "next")}
    `;
  } else if (page === pages && pages > 1) {
    button = createBtn(page, "prev");
  }
  elements.searchResPAges.insertAdjacentHTML("afterbegin", button);
};

export const renderResult = (recipe, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipe.slice(start, end).forEach(renderRecipe);

  renderBtn(page, recipe.length, resPerPage);
};

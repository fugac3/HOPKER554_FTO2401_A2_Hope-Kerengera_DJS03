import { books, authors, genres, BOOKS_PER_PAGE } from "./utils/data.js";
import {
  createBookPreviewElement,
  createOptionElement,
  setThemeColors,
  checkAndSetTheme,
  filterBooks,
} from "./utils/helper.js";

let page = 1;
let matches = books;

const starting = document.createDocumentFragment(); //creating an element to append other elements to in the DOM

//---CALLING FUNCTION TO CREATE A PREVIEW BUTTON FOR EACH BOOK
for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
  const element = createBookPreviewElement(
    { author, id, image, title },
    authors
  );
  starting.appendChild(element);
}

document.querySelector("[data-list-items]").appendChild(starting);

//---CALLING FUNCTION TO CATEGORISE AND POPULATE GENRE AND AUTHOR OPTIONS
const genreHtml = createOptionElement(genres, "All Genres");
document.querySelector("[data-search-genres]").appendChild(genreHtml);

const authorsHtml = createOptionElement(authors, "All Authors");
document.querySelector("[data-search-authors]").appendChild(authorsHtml);

//---FUNCTION TO CHECK AND SET THEME
checkAndSetTheme();

//---UPDATING 'SHOW MORE' BUTTON
document.querySelector("[data-list-button]").innerText = `Show more (${
  books.length - BOOKS_PER_PAGE
})`;
document.querySelector("[data-list-button]").disabled =
  matches.length - page * BOOKS_PER_PAGE > 0;

document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>
`;

//---ADDING EVENT LISTENERS FOR CLOSING, CANCELLING AND OPENING THE SEARCH AND SETTINGS FEATURE
document.querySelector("[data-search-cancel]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = false;
});

document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = false;
  });

document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = true;
  });

document.querySelector("[data-list-close]").addEventListener("click", () => {
  document.querySelector("[data-list-active]").open = false;
});

//---LISTENING FOR THEME FORM SUBMISSION AND CHANGING MODE
document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    setThemeColors(theme);

    document.querySelector("[data-settings-overlay]").open = false;
  });

//---HANDLING SEARCH FORM SUBMISSION
document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);

    matches = filterBooks(books, filters);
    page = 1;

    if (matches.length < 1) {
      document
        .querySelector("[data-list-message]")
        .classList.add("list__message_show");
    } else {
      document
        .querySelector("[data-list-message]")
        .classList.remove("list__message_show");
    }

    document.querySelector("[data-list-items]").innerHTML = "";
    const newItems = document.createDocumentFragment();

    for (const { author, id, image, title } of matches.slice(
      0,
      BOOKS_PER_PAGE
    )) {
      const element = createBookPreviewElement(
        { author, id, image, title },
        authors
      );
      newItems.appendChild(element);
    }

    document.querySelector("[data-list-items]").appendChild(newItems);
    document.querySelector("[data-list-button]").disabled =
      matches.length - page * BOOKS_PER_PAGE < 1;

    document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>
  `;

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("[data-search-overlay]").open = false;
  });

//---LISTENS FOR WHEN SHOW MORE BUTTON CLICKED AND LOADS MORE BOOKS
document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = createBookPreviewElement(
      { author, id, image, title },
      authors
    );
    fragment.appendChild(element);
  }

  document.querySelector("[data-list-items]").appendChild(fragment);
  page += 1;
});

//---LISTENS FOR WHEN PREVIEW BUTTON CLICKED AND SHOWS INFO
document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
      if (active) break;

      if (node?.dataset?.preview) {
        active = books.find((book) => book.id === node.dataset.preview);
      }
    }

    if (active) {
      document.querySelector("[data-list-active]").open = true;
      document.querySelector("[data-list-blur]").src = active.image;
      document.querySelector("[data-list-image]").src = active.image;
      document.querySelector("[data-list-title]").innerText = active.title;
      document.querySelector("[data-list-subtitle]").innerText = `${
        authors[active.author]
      } (${new Date(active.published).getFullYear()})`;
      document.querySelector("[data-list-description]").innerText =
        active.description;
    }
  });

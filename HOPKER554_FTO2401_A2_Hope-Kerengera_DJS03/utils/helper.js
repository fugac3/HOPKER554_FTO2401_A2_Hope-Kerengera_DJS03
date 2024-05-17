//---FUNCTION TO CREATE PREVIEW BOOK ELEMENT
export const createBookPreviewElement = (
  { author, id, image, title },
  authors
) => {
  const element = document.createElement("button");
  element.classList = "preview";
  element.setAttribute("data-preview", id);

  element.innerHTML = `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
    </div>
  `;

  return element;
};

//---FUNCTION TO CREATE OPTION FILTER ELEMENT
export const createOptionElement = (options, defaultOptionText) => {
  const fragment = document.createDocumentFragment();
  const firstElement = document.createElement("option");
  firstElement.value = "any";
  firstElement.innerText = defaultOptionText;
  fragment.appendChild(firstElement);

  //for loop that was repeated in genre and author now part of the function
  for (const [id, name] of Object.entries(options)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    fragment.appendChild(element);
  }

  return fragment;
};

//---FUNCTION TO SET THEME
export const setThemeColors = (theme) => {
  const colors = {
    darkColor: theme === "night" ? "255, 255, 255" : "10, 10, 20",
    lightColor: theme === "night" ? "10, 10, 20" : "255, 255, 255",
  };
  const { darkColor, lightColor } = colors;
  document.querySelector("[data-settings-theme]").value = theme;
  document.documentElement.style.setProperty("--color-dark", darkColor);
  document.documentElement.style.setProperty("--color-light", lightColor);
};

//---FUNCTION TO CHECK AND SET THEME
export const checkAndSetTheme = () => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    setThemeColors("night");
  } else {
    setThemeColors("day");
  }
};

//---FUNCTION TO FILTER BOOKS BASED ON CRITERIA---
export const filterBooks = (books, filters) => {
  return books.filter((book) => {
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;

    return genreMatch && titleMatch && authorMatch;
  });
};

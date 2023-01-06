const books = [];
const RENDER_EV = 'render-book';
const SAVED_EV = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  const serchButton = document.getElementById('searchSubmit');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    statusBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  serchButton.addEventListener('click', function (e) {
    e.preventDefault();

    searchBook();
  });
  statusBook();
});

const searchBook = () => {
  const inputSearchBook = document.getElementById('searchBookTitle').value;
  const regexsearchBook = new RegExp(`${inputSearchBook}`);

  for (const book of books) {
    if (regexsearchBook.test(book.title) || inputSearchBook === '') {
      const articleElement = document.querySelector(`#book-${book.id}`);
      articleElement.removeAttribute('hidden');
    } else {
      const articleElement = document.querySelector(`#book-${book.id}`);
      articleElement.setAttribute('hidden', true);
    }
  }
  statusBook();
};

const statusBook = () => {
  const countArticleUnRead = document.querySelectorAll('#incompleteBookshelfList > article').length;
  const countArticleRead = document.querySelectorAll('#completeBookshelfList > article').length;

  document.querySelector('.done .value').innerText = countArticleRead;
  document.querySelector('.undone .value').innerText = countArticleUnRead;
  saveData();
};

const generateID = () => {
  return +new Date();
};

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

const saveData = () => {
  if (isStorageExist()) {
    const stringBooks = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, stringBooks);
    document.dispatchEvent(new Event(SAVED_EV));
  }
};
document.addEventListener(SAVED_EV, () => {
  console.log('Data berhasil di simpan.');
});
function loadDataFromStorage() {
  const getDataBook = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(getDataBook);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EV));
}

const addBook = () => {
  const inputTitle = document.getElementById('inputBookTitle').value;
  const inputAuthor = document.getElementById('inputBookAuthor').value;
  const inputYear = document.getElementById('inputBookYear').value;
  const cbDoneRead = document.getElementById('inputBookIsComplete').checked;
  const idBook = generateID();
  const imgNumber = numberRandom();

  const bookObject = generateBookObject(
    idBook,
    inputTitle,
    inputAuthor,
    inputYear,
    cbDoneRead,
    imgNumber
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EV));
  saveData();
};

document.addEventListener(RENDER_EV, () => {
  const uncompletedReadBook = document.getElementById('incompleteBookshelfList');
  const completedReadBook = document.getElementById('completeBookshelfList');

  uncompletedReadBook.innerHTML = '';
  completedReadBook.innerHTML = '';

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isCompleted) {
      completedReadBook.append(bookElement);
    } else {
      uncompletedReadBook.append(bookElement);
    }
  }
});
function findBook(id) {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
}
const unDoneReadBook = (id) => {
  const bookTarget = findBook(id);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EV));
  saveData();
};
const DoneReadBook = (id) => {
  const bookTarget = findBook(id);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EV));
  saveData();
};

function findBookIndex(id) {
  for (const index in books) {
    if (books[index].id === id) {
      return index;
    }
  }
  return -1;
}
const deleteBook = (id) => {
  const bookTarget = findBookIndex(id);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EV));
  saveData();
};

const numberRandom = () => {
  return Math.floor(Math.random() * 10 + 1);
};

const makeBook = (bookObject) => {
  const { id, title, author, year, isCompleted, imgNumber } = bookObject;

  const imgBook = document.createElement('img');
  imgBook.setAttribute('src', `assets/img/book-${imgNumber}.png`);
  imgBook.setAttribute('alt', `assets/img/book-${imgNumber}.png`);
  imgBook.setAttribute('height', '130');

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis : ${author}`;

  const textYear = document.createElement('p');
  textYear.innerText = `Year : ${year}`;

  const container = document.createElement('article');
  container.setAttribute('class', 'book_item');
  container.setAttribute('id', `book-${id}`);
  container.append(imgBook, textTitle, textAuthor, textYear);

  if (isCompleted) {
    const unDoneReadButton = document.createElement('button');
    unDoneReadButton.setAttribute('class', 'green');
    unDoneReadButton.innerText = 'Belum selesai diBaca';
    unDoneReadButton.addEventListener('click', function () {
      unDoneReadBook(id);
      statusBook();
    });

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'red');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.addEventListener('click', function () {
      deleteBook(id);
      statusBook();
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'action');
    buttonContainer.append(unDoneReadButton, deleteButton);

    container.append(buttonContainer);
  } else {
    const doneReadButton = document.createElement('button');
    doneReadButton.setAttribute('class', 'green');
    doneReadButton.innerText = 'selesai dibaca';
    doneReadButton.addEventListener('click', function () {
      DoneReadBook(id);
      statusBook();
    });

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'red');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.addEventListener('click', function () {
      deleteBook(id);
      statusBook();
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'action');
    buttonContainer.append(doneReadButton, deleteButton);

    container.append(buttonContainer);
  }

  return container;
};

const generateBookObject = (id, title, author, year, isCompleted, imgNumber) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
    imgNumber,
  };
};

const { nanoid } = require('nanoid');
const books = require('../books');

const addBooks = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const createData = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt,
    updatedAt: insertedAt,
  };
  let response;

  if (!name) {
    response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(createData);

  const isSuccess = books.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooks = (req, h) => {
  const { name, reading, finished } = req.query;

  let booksResults = books.map((book) => {
    const mappedData = {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
    return mappedData;
  });

  if (name) {
    booksResults = books
      .filter((book) => {
        const bookName = book.name.toLowerCase();
        const bookQuery = name.toLowerCase();
        return bookName.includes(bookQuery);
      })
      .map((book) => {
        const mappedData = {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
        return mappedData;
      });
  }

  if (reading !== undefined) {
    booksResults = books
      .filter((book) => (Number(reading) === 1 ? book.reading : !book.reading))
      .map((book) => {
        const mappedData = {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
        return mappedData;
      });
  }

  if (finished !== undefined) {
    booksResults = books
      .filter((book) => {
        return Number(finished) === 1 ? book.finished : !book.finished;
      })
      .map((book) => {
        const mappedData = {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
        return mappedData;
      });
  }

  const response = h.response({
    status: 'success',
    data: {
      books: booksResults,
    },
  });
  response.code(200);
  return response;
};

const getBook = (req, h) => {
  const { id } = req.params;
  const bookFound = books.find((book) => book.id === id);

  let response;
  if (!bookFound) {
    response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  response = h.response({
    status: 'success',
    data: {
      book: bookFound,
    },
  });
  response.code(200);
  return response;
};

const updateBook = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  let response;
  if (!name) {
    response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const { id } = req.params;
  const bookFoundIndex = books.findIndex((book) => book.id === id);
  if (bookFoundIndex < 0) {
    response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(bookFoundIndex, 1, {
    id: books[bookFoundIndex].id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    finished: pageCount === readPage,
    readPage,
    reading,
    insertedAt: books[bookFoundIndex].insertedAt,
    updatedAt: new Date(),
  });

  response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};
const deleteBook = (req, h) => {
  let response;

  const { id } = req.params;
  const bookFoundIndex = books.findIndex((book) => book.id === id);
  if (bookFoundIndex < 0) {
    response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(bookFoundIndex, 1);

  response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBooks,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
};

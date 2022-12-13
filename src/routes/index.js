const {
  addBooks,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
} = require('../handler');

const routes = [
  { method: 'GET', path: '/books', handler: getAllBooks },
  { method: 'GET', path: '/books/{id}', handler: getBook },
  { method: 'POST', path: '/books', handler: addBooks },
  { method: 'PUT', path: '/books/{id}', handler: updateBook },
  { method: 'DELETE', path: '/books/{id}', handler: deleteBook },

  // For testing purpose using notes path
  { method: 'GET', path: '/notes', handler: getAllBooks },
  { method: 'GET', path: '/notes/:id', handler: () => {} },
  { method: 'POST', path: '/notes', handler: addBooks },
  { method: 'PUT', path: '/notes/:id', handler: () => {} },
  { method: 'DELETE', path: '/notes/:id', handler: () => {} },
];

module.exports = routes;

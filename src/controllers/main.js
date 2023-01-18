const bcryptjs = require('bcryptjs');
const { Sequelize } = require("../database/models");
const db = require('../database/models');
const Op = Sequelize.Op;

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    db.Book.findByPk(req.params.id, {
      include: [{ association: 'authors'}]
    })
      .then((book) => {
        res.render('bookDetail', { book });
  })},
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }],
      where: {
        title: {[Op.like]: '%'+ req.body.title +'%'}
      },
    }).then((books) => {
      console.log("Encontre: " + books.title)
      res.render('home', { books });
    })
  },
  deleteBook: (req, res) => {
    db.Book.findOne({
      where:{
        id: req.params.id
      },
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        db.Book.destroy({
          where:{
            id: req.params.id
          },
          include: [{ association: 'authors' }]
        })
      .then((books) => {
        res.render('home', { books });

        })
      }).catch(error => res.status(500).send(error))
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    db.Author.findByPk(req.params.id, {
      include: [{ association: 'books' }]
    })
      .then((author) => {
        res.render('authorBooks', { author });
  })},
  edit: (req, res) => {
    db.Book.findByPk(req.params.id)
    .then(book => {res.render('editBook', { book:book })})
  },
  processEdit: (req, res) => {
    db.Book.update({
      title: req.body.title,
      cover: req.body.cover,
      description: req.body.description
    }, {
      where: {
        id: req.params.id
      }
    })
    .then(result => {
      res.redirect('/books/edit/' + req.params.id)
    })
    .catch(error => res.status(500).send(error))
  }
};

module.exports = mainController;

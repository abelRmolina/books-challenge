const bcryptjs = require('bcryptjs');
const { Sequelize } = require("../database/models");
const db = require('../database/models');
const Op = Sequelize.Op;
const {edit,processEdit,destroy} = require('../controllers/adminControl')

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
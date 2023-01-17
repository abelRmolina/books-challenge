const bcryptjs = require('bcryptjs');
const db = require('../database/models');

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
    db.Book.destroy({
      where:{
        id: req.params.id
      },
      include: [{ association: 'authors' }]
    })
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
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
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    res.render('login');
  },
  processLogin: (req, res) => {
    processLogin:(req,res)=>{ 
      console.log(req.body)
      db.User.findOne({ where:{Email : req.body.email}})
      .then(user =>{
          if(user){
            console.log("Email ya validado")
              var validPassword = bcryptjs.compareSync(req.body.password, user.Pass)
              if (validPassword) {
                  console.log("Contraseña autorizada")
                  req.session.user = user;
                  res.redirect('/')
              }
              else{
                console.log("Error en la contraseña, por favor ingrese la contraseña validada")
                  res.redirect('/users/login')
              }
          }else{
            console.log("El email ingresado no es valida, ingrese un nuevo email")
              res.redirect('/users/login')
          }
      })
    }
  },  
    logout: (req,res) =>{
      req.session.destroy();
      res.cookie('Email',null,{maxAge: -1});
      res.redirect('/')
    },
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
    res.redirect('/books/edit/' + req.params.id)
  }
};

module.exports = mainController;

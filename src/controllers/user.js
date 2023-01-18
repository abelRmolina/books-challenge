const bcryptjs = require('bcryptjs');
const { Sequelize } = require("../database/models");
const db = require('../database/models');
const Op = Sequelize.Op;

const userController = {

register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => res.status(500).send(error));
  },
  login: (req, res) => {
    res.render('login');
  },
  processLogin: (req, res) => { 
      console.log(req.body)
      db.User.findOne({ where:{Email : req.body.email}})
      .then(user =>{
        console.log(user)
          /*if(user){
            console.log("Email ya validado")
              var validPassword = bcryptjs.compareSync(req.body.password, user.Pass)
              if (validPassword) {
                  console.log("Contraseña autorizada")*/
                  req.session.userLogin = {nombre : user.name, 
                    Email: user.Email, 
                    CategoryId:user.CategoryId
                  };
                    console.log(req.session.userLogin);
                    console.log("sesion iniciada");
                  res.redirect('/')
            /*}
              else{
                console.log("Error en la contraseña, por favor ingrese la contraseña validada")
                  res.redirect('/users/login')
              }
          /*}else{
            console.log("El email ingresado no es valida, ingrese un nuevo email")
              res.redirect('/users/login')
          }*/
      })
    },  
  logout: (req,res) =>{
    req.session.destroy();
    res.cookie('Email',null,{maxAge: -1});
    res.redirect('/')
  },
}
module.exports = userController;
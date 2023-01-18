const express = require('express');
const mainRouter = require('./routes/main');
const userRouter = require('./routes/user');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//const acceso = require ('./middlewares/acceso');
const methodOverride = require('method-override')
const app = express();
const userLoginCheck = require('./middlewares/userLoginCheck')

/* Metodos PUT y DELETE */
app.use(methodOverride('_method'));
app.use(cookieParser())
app.use(session({secret: 'secret'}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(userLoginCheck)
//app.use(acceso)

app.set('view engine', 'ejs');
app.set('views', 'src/views');



app.use('/', mainRouter);
app.use('/users', userRouter);


app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});

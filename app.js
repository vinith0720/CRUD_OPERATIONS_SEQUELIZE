
import createError from "http-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";


import indexRouter from  "./routes/index.js"
import usersRouter from "./routes/users.js"
import postsRouter from "./routes/posts.js"

var app = express();

// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use((err, req, res, next)=> {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message,
      details: req.app.get('env') === 'development' ? err.stack : undefined
    }
  });
});


export default app;
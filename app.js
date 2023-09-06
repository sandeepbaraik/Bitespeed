var express = require('express');
var indexRouter = require('./routes/index');

var app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);
app.listen(PORT, _ => console.log("server running at port", PORT));
module.exports = app;

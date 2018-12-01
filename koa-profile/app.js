const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const controller = require('./controller');
const rest = require('./rest');

// new app
const app = new Koa();

// parse request body
app.use(bodyParser());

// bind .rest() for ctx:
app.use(rest.restify());

// add controller
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
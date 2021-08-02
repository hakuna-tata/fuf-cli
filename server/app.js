const Koa = require('koa');
const router = require('./router');

const PORT = 3000;

const app = new Koa();

app.use(router.routes());

app.listen(PORT);

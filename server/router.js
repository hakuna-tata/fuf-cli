const dbInstance = require('./model');
const Router = require('koa-router');

const router = new Router();
router.prefix('/@fuf');

router
  .get('/command', async (ctx) => {
    ctx.body = await dbInstance.find('command');
  })
  .get('/template', async (ctx) => {
    ctx.body = await dbInstance.find('template');
  });


module.exports = router;

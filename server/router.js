const { Command, Template } = require('./model');
const Router = require('koa-router');

const router = new Router();
router.prefix('/@fuf');

router
  .get('/command', async (ctx) => {
    ctx.body = await Command.find({});
  })
  .get('/template', async (ctx) => {
    ctx.body = await Template.find({});
  });


module.exports = router;

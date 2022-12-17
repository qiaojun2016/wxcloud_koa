const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-body");
const serve = require("koa-static");
const render = require("koa-ejs");
const fs = require("fs");
const path = require("path");
const { init: initDB, Counter } = require("./db");

const router = new Router();

const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

// 首页
router.get("/", async (ctx) => {
  ctx.body = homePage;
});

// 更新计数
router.post("/api/count", async (ctx) => {
  const { request } = ctx;
  const { action } = request.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }

  ctx.body = {
    code: 0,
    data: await Counter.count(),
  };
});

// 获取计数
router.get("/api/count", async (ctx) => {
  const result = await Counter.count();

  ctx.body = {
    code: 0,
    data: result,
  };
});

router.post("/api/wx/callback", async (ctx) => {
  ctx.body = ctx.request.body;
});

// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (ctx) => {
  if (ctx.request.headers["x-wx-source"]) {
    ctx.body = ctx.request.headers["x-wx-openid"];
  }
});

const app = new Koa();
const koaBody = bodyParser({
  formidable: {
    keepExtensions: true,
    uploadDir: "./uploads",
  },
  multipart: true,
});
/// 设置中间件
app.use(serve(path.join(__dirname, "/public")));
app.use(serve("./upload"));
app
  .use(logger())
  .use(koaBody)
  .use(serve(path.join(__dirname, "/public")))
  .use(serve("./upload"))
  .use(router.routes())
  .use(require('./routes/vote').routes())
  .use(router.allowedMethods());

/// ejs 配置
render(app, {
  root: path.join(__dirname, "views"),
  layout: "index",
  viewExt: "ejs",
});
  

/// 页面


const port = process.env.PORT || 80;
async function bootstrap() {
  //await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();

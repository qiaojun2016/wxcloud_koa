const Router = require("koa-router");
const router = new Router();
const faker = require("../faker");

/// 排名
router.get("/vote/vote-rank", async (ctx) => {
  const votesList = faker.votesList;
  // 获取最新的列表
  await ctx.render("vote-rank", {
    layout: "vote-page",
    votesList,
  });
});

/// 最新参与
router.get("/vote", async (ctx) => {
  const votesList = faker.votesList;
  // 获取最新的列表
  await ctx.render("vote-latest", {
    layout: "vote-page",
    votesList,
  });
});
/// 排名列表
router.get("/vote/vote-rank-list", async (ctx) => {
  const rankList = faker.votesList;
  await ctx.render("vote-rank-list", {
    layout: "vote-page",
    rankList,
  });
});

/// 排名列表
router.get("/vote/vote-rule", async (ctx) => {
  const rankList = faker.votesList;
  await ctx.render("vote-rule", {
    layout: "vote-page",
    rankList,
  });
});

/// 关键字查找
router.post("/vote/search", async (ctx) => {
  console.log(ctx.request.body);
  const { keyword } = ctx.request.body;
  ctx.redirect("/vote?keyword=" + keyword);
});

/// 参与
router.get("/vote/vote-join", async (ctx) => {
  await ctx.render("vote-join", {
    layout: false,
  });
});

router.post("/vote/vote-join", async (ctx) => {
  /// 防止 dos 攻击?
  ctx.body = { success: 1 };
});

/// 助力点赞
router.post("/vote/zhuli", async (ctx) => {
  console.log("post votes");
  ctx.body = { success: 1, title: "投票结果", msg: "投票成功" };
});
/// api

module.exports = router;

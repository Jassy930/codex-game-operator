import test from "node:test";
import assert from "node:assert/strict";

import {
  buildActionNoticeWithGoalTransition,
  buildClickActionNotice,
  buildGoalCompletionNotice,
  buildUpgradePurchaseNotice,
  clickCore,
  createInitialState,
  formatNumber,
  getComboStatus,
  getCurrentGoal,
  getEffectiveProduction,
  getProjectStatuses,
  getUpgradeAffordability,
  getUpgradeCost,
  purchaseUpgrade,
  settleOfflineProgress,
  tick
} from "../src/game.js";
import {
  buildFeedbackIssueUrl,
  createFeedbackEntry,
  createFeedbackIssueBody
} from "../src/feedback.js";

test("点击星核会增加能量与累计产出", () => {
  const state = createInitialState(0);
  const clicked = clickCore(state, 100);

  assert.equal(clicked.energy, 1);
  assert.equal(clicked.totalEnergy, 1);
  assert.equal(clicked.clicks, 1);
  assert.equal(clicked.combo, 1);
  assert.equal(clicked.lastGain, 1);
  assert.equal(buildClickActionNotice(clicked), "+1 能量");
});

test("第八次连击触发过载奖励", () => {
  let state = createInitialState(0);
  for (let index = 0; index < 8; index += 1) {
    state = clickCore(state, index * 100);
  }

  assert.equal(state.energy, 13);
  assert.equal(state.lastPulse, "过载 +5");
  assert.equal(state.lastGain, 6);
  assert.equal(buildClickActionNotice(state), "+6 能量（含过载）");
});

test("连击状态会返回过载进度和剩余点击数", () => {
  let state = createInitialState(0);
  for (let index = 0; index < 3; index += 1) {
    state = clickCore(state, index * 100);
  }

  const charging = getComboStatus(state, 300);
  assert.equal(charging.count, 3);
  assert.equal(charging.step, 3);
  assert.equal(charging.remaining, 5);
  assert.equal(charging.progress, 0.375);
  assert.equal(charging.progressText, "过载 3/8");
  assert.equal(charging.hintText, "距过载 5 次");

  for (let index = 3; index < 8; index += 1) {
    state = clickCore(state, index * 100);
  }

  const overloaded = getComboStatus(state, 800);
  assert.equal(overloaded.count, 8);
  assert.equal(overloaded.step, 8);
  assert.equal(overloaded.remaining, 0);
  assert.equal(overloaded.progress, 1);
  assert.equal(overloaded.hintText, "过载已触发");
});

test("购买聚能透镜会扣除成本并提升点击产能", () => {
  const state = {
    ...createInitialState(0),
    energy: 10,
    totalEnergy: 10
  };

  const result = purchaseUpgrade(state, "lens", 1000);

  assert.equal(result.purchased, true);
  assert.equal(result.cost, 10);
  assert.equal(result.state.energy, 0);
  assert.equal(result.state.energyPerClick, 2);
  assert.equal(result.state.upgrades.lens, 1);
  assert.equal(buildUpgradePurchaseNotice(result), "已购买聚能透镜 Lv.1，每次产能 2");
});

test("操作提示会拼接目标完成和下一目标", () => {
  const state = {
    ...createInitialState(0),
    energy: 10,
    totalEnergy: 10
  };
  const previousGoal = getCurrentGoal(state);
  const result = purchaseUpgrade(state, "lens", 1000);
  const nextGoal = getCurrentGoal(result.state);

  assert.equal(
    buildGoalCompletionNotice(previousGoal, nextGoal),
    "目标完成：购买第一次升级；下一目标：启动自动采集"
  );
  assert.equal(
    buildActionNoticeWithGoalTransition(
      buildUpgradePurchaseNotice(result),
      previousGoal,
      nextGoal
    ),
    "已购买聚能透镜 Lv.1，每次产能 2 · 目标完成：购买第一次升级；下一目标：启动自动采集"
  );
});

test("星图目标完成提示会确认项目奖励", () => {
  const before = {
    ...createInitialState(0),
    totalEnergy: 249_999,
    upgrades: {
      lens: 12,
      collector: 12,
      stabilizer: 9
    }
  };
  const after = {
    ...before,
    totalEnergy: 250_000
  };
  const previousGoal = getCurrentGoal(before);
  const nextGoal = getCurrentGoal(after);

  assert.equal(previousGoal.id, "project-starbridge-trial");
  assert.equal(nextGoal.id, "project-stabilizer-matrix");
  assert.equal(
    buildGoalCompletionNotice(previousGoal, nextGoal),
    "目标完成：星桥试运行；获得奖励：总产能 +25%；下一目标：稳定矩阵"
  );
  assert.equal(
    buildActionNoticeWithGoalTransition("", previousGoal, nextGoal),
    "目标完成：星桥试运行；获得奖励：总产能 +25%；下一目标：稳定矩阵"
  );
});

test("自动产能随 tick 增长并限制离线收益上限", () => {
  const state = {
    ...createInitialState(0),
    energyPerSecond: 2,
    multiplier: 1.5
  };

  const updated = tick(state, 2000);
  const capped = tick(state, 24 * 60 * 60 * 1000);

  assert.equal(updated.energy, 6);
  assert.equal(capped.energy, 86400);
});

test("离线收益会立即结算并返回可展示摘要", () => {
  const state = {
    ...createInitialState(0),
    energyPerSecond: 2,
    multiplier: 1.5,
    lastTick: 0
  };

  const result = settleOfflineProgress(state, 60_000);

  assert.equal(result.state.energy, 180);
  assert.equal(result.state.totalEnergy, 180);
  assert.equal(result.state.lastTick, 60_000);
  assert.deepEqual(result.summary, {
    gained: 180,
    elapsedSeconds: 60,
    capped: false
  });
});

test("当前目标会从第一次升级推进到自动采集", () => {
  const state = {
    ...createInitialState(0),
    upgrades: {
      lens: 1,
      collector: 0,
      stabilizer: 0
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "passive-production");
  assert.equal(goal.value, "启动自动采集");
  assert.equal(goal.upgradeId, "collector");
});

test("购买型当前目标会暴露对应升级用于界面推荐", () => {
  const firstUpgrade = getCurrentGoal(createInitialState(0));
  const passiveProduction = getCurrentGoal({
    ...createInitialState(0),
    upgrades: {
      lens: 1,
      collector: 0,
      stabilizer: 0
    }
  });
  const stableCore = getCurrentGoal({
    ...createInitialState(0),
    totalEnergy: 120,
    upgrades: {
      lens: 1,
      collector: 1,
      stabilizer: 0
    }
  });

  assert.equal(firstUpgrade.upgradeId, "lens");
  assert.equal(passiveProduction.upgradeId, "collector");
  assert.equal(stableCore.upgradeId, "stabilizer");
});

test("当前目标会返回可读的进度和剩余量", () => {
  const state = {
    ...createInitialState(0),
    upgrades: {
      lens: 1,
      collector: 1,
      stabilizer: 0
    },
    totalEnergy: 42
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "hundred-energy");
  assert.equal(goal.currentValue, 42);
  assert.equal(goal.remaining, 58);
  assert.equal(goal.progress, 0.42);
  assert.equal(goal.progressText, "进度 42 能量 / 100 能量 · 还差 58 能量");
});

test("购买型当前目标会提示下一次关键升级所需能量", () => {
  const waiting = getCurrentGoal({
    ...createInitialState(0),
    energy: 6
  });
  const ready = getCurrentGoal({
    ...createInitialState(0),
    energy: 10
  });
  const collector = getCurrentGoal({
    ...createInitialState(0),
    energy: 20,
    upgrades: {
      lens: 1,
      collector: 0,
      stabilizer: 0
    }
  });

  assert.equal(
    waiting.progressText,
    "进度 0 次升级 / 1 次升级 · 还差 4 能量购买聚能透镜"
  );
  assert.equal(ready.progressText, "进度 0 次升级 / 1 次升级 · 可购买聚能透镜");
  assert.equal(collector.progressText, "进度 0 级 / 1 级 · 还差 4 能量购买自动采集臂");
});

test("升级价格和数字格式稳定", () => {
  const state = {
    ...createInitialState(0),
    upgrades: {
      lens: 2,
      collector: 0,
      stabilizer: 0
    }
  };

  assert.equal(getUpgradeCost(state, "lens"), 24);
  assert.equal(formatNumber(1530), "1.5K");
});

test("升级购买进度会显示剩余能量和可购买状态", () => {
  const state = {
    ...createInitialState(0),
    energy: 6
  };

  const waiting = getUpgradeAffordability(state, "lens");
  const ready = getUpgradeAffordability({ ...state, energy: 12 }, "lens");

  assert.equal(waiting.cost, 10);
  assert.equal(waiting.remaining, 4);
  assert.equal(waiting.progress, 0.6);
  assert.equal(waiting.canBuy, false);
  assert.equal(ready.remaining, 0);
  assert.equal(ready.progress, 1);
  assert.equal(ready.canBuy, true);
});

test("星图项目会给中后段玩家新的可追目标", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 114_354.89,
    upgrades: {
      lens: 11,
      collector: 11,
      stabilizer: 9
    }
  };

  const projects = getProjectStatuses(state);

  assert.equal(projects[0].id, "stellar-map");
  assert.equal(projects[0].completed, true);
  assert.equal(projects[0].progressText, "进度 100K 能量 / 100K 能量 · 已完成");
  assert.equal(projects[1].id, "lens-array");
  assert.equal(projects[1].remaining, 1);
  assert.equal(projects[1].progressText, "进度 11 级 / 12 级 · 还差 1 级");
  assert.equal(projects[2].id, "collector-grid");
  assert.equal(projects[2].remaining, 1);
  assert.equal(projects[3].id, "starbridge-trial");
  assert.equal(projects[3].completed, false);
});

test("100K 后当前目标会指向下一个未完成星图项目", () => {
  const state = {
    ...createInitialState(0),
    energy: 87_030,
    totalEnergy: 114_354.89,
    upgrades: {
      lens: 11,
      collector: 11,
      stabilizer: 9
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-lens-array");
  assert.equal(goal.label, "星图计划");
  assert.equal(goal.value, "透镜阵列");
  assert.equal(goal.upgradeId, "lens");
  assert.equal(
    goal.progressText,
    "进度 11 级 / 12 级 · 可购买聚能透镜 · 奖励 点击产能 +18%"
  );
});

test("星图主目标会直接显示项目奖励", () => {
  const state = {
    ...createInitialState(0),
    energy: 50_000,
    totalEnergy: 120_000,
    upgrades: {
      lens: 12,
      collector: 11,
      stabilizer: 9
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-collector-grid");
  assert.equal(goal.value, "采集阵列");
  assert.equal(goal.reward, "自动产能 +18%");
  assert.equal(
    goal.progressText,
    "进度 11 级 / 12 级 · 可购买自动采集臂 · 奖励 自动产能 +18%"
  );
});

test("首批星图项目完成后会继续指向稳定矩阵", () => {
  const state = {
    ...createInitialState(0),
    energy: 50_000,
    totalEnergy: 260_000,
    upgrades: {
      lens: 12,
      collector: 12,
      stabilizer: 9
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-stabilizer-matrix");
  assert.equal(goal.value, "稳定矩阵");
  assert.equal(goal.upgradeId, "stabilizer");
  assert.equal(
    goal.progressText,
    "进度 9 级 / 12 级 · 可购买星核稳定器 · 奖励 总产能 +18%"
  );
});

test("500K 后星图会继续指向深空矿带", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 600_000,
    upgrades: {
      lens: 12,
      collector: 12,
      stabilizer: 12
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-deep-space-mine");
  assert.equal(goal.value, "深空矿带");
  assert.equal(
    goal.progressText,
    "进度 600K 能量 / 750K 能量 · 还差 150K 能量 · 奖励 点击产能 +26%"
  );
});

test("100K 前当前目标仍保留短周期累计目标", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 99_500,
    upgrades: {
      lens: 11,
      collector: 11,
      stabilizer: 9
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "loop-100000");
  assert.equal(goal.label, "当前目标");
  assert.equal(goal.value, "累计 100K 能量");
});

test("已完成星图项目会提升有效产能", () => {
  const state = {
    ...createInitialState(0),
    energyPerClick: 10,
    energyPerSecond: 5,
    multiplier: 2,
    totalEnergy: 120_000,
    upgrades: {
      lens: 12,
      collector: 12,
      stabilizer: 0
    }
  };

  const production = getEffectiveProduction(state);
  const clicked = clickCore(state, 0);

  assert.deepEqual(production.projectBonuses.projectIds, [
    "stellar-map",
    "lens-array",
    "collector-grid"
  ]);
  assert.equal(production.totalMultiplier, 2.24);
  assert.equal(production.perClick, 26.432);
  assert.equal(production.perSecond, 13.216);
  assert.equal(clicked.lastGain, 26.432);
});

test("深空航段完成后会继续叠加项目奖励", () => {
  const state = {
    ...createInitialState(0),
    energyPerClick: 10,
    energyPerSecond: 10,
    totalEnergy: 1_200_000,
    upgrades: {
      lens: 12,
      collector: 16,
      stabilizer: 16
    }
  };

  const production = getEffectiveProduction(state);

  assert.deepEqual(production.projectBonuses.projectIds, [
    "stellar-map",
    "lens-array",
    "collector-grid",
    "starbridge-trial",
    "stabilizer-matrix",
    "farstar-relay",
    "deep-space-mine",
    "orbital-foundry",
    "stellar-anchor"
  ]);
  assert.equal(production.projectBonuses.completed, 9);
  assert.equal(production.projectBonuses.clickMultiplier, 1.4868);
  assert.equal(production.projectBonuses.secondMultiplier, 1.9022);
  assert.equal(production.perClick, 29.965);
  assert.equal(production.perSecond, 38.3369);
});

test("反馈入口会生成带游戏快照的 GitHub Issue 链接", () => {
  const state = {
    ...createInitialState(0),
    energy: 42,
    totalEnergy: 80,
    energyPerSecond: 0.7,
    upgrades: {
      lens: 1,
      collector: 1,
      stabilizer: 0
    }
  };
  const entry = createFeedbackEntry({
    type: "bug",
    rating: 5,
    message: "升级按钮反馈不明显",
    state,
    goal: { value: "累计 100 能量" },
    sessionId: "test-session",
    createdAt: "2026-04-28T13:40:00.000Z"
  });

  const body = createFeedbackIssueBody(entry);
  const url = new URL(buildFeedbackIssueUrl(entry));

  assert.equal(url.origin + url.pathname, "https://github.com/Jassy930/codex-game-operator/issues/new");
  assert.equal(url.searchParams.get("labels"), "feedback,bug");
  assert.equal(url.searchParams.get("title"), "[反馈] 问题/Bug - 5/5");
  assert.match(body, /升级按钮反馈不明显/);
  assert.match(body, /当前目标：累计 100 能量/);
  assert.match(body, /lens:1/);
});

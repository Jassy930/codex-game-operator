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
  getProjectOverview,
  getProjectStatuses,
  getRouteStanceStatus,
  getUpgradeAffordability,
  getUpgradeCost,
  purchaseUpgrade,
  setRouteStance,
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

test("购买星核谐振器会提升过载奖励", () => {
  const state = {
    ...createInitialState(0),
    energy: 520,
    totalEnergy: 520
  };

  const result = purchaseUpgrade(state, "resonator", 1000);

  assert.equal(result.purchased, true);
  assert.equal(result.cost, 520);
  assert.equal(result.state.overloadBonus, 7);
  assert.equal(result.state.upgrades.resonator, 1);
  assert.equal(buildUpgradePurchaseNotice(result), "已购买星核谐振器 Lv.1，过载奖励 +7");
});

test("星图航线策略会在 100K 后解锁并影响产能", () => {
  const locked = setRouteStance(createInitialState(0), "ignition");

  assert.equal(locked.changed, false);
  assert.equal(locked.reason, "locked");
  assert.equal(locked.state.routeStance, "balanced");

  const unlockedState = {
    ...createInitialState(0),
    energyPerClick: 10,
    energyPerSecond: 10,
    totalEnergy: 100_000
  };
  const switched = setRouteStance(unlockedState, "ignition");
  const status = getRouteStanceStatus(switched.state);
  const production = getEffectiveProduction(switched.state);

  assert.equal(switched.changed, true);
  assert.equal(switched.stance.name, "点火优先");
  assert.equal(status.unlocked, true);
  assert.equal(status.activeId, "ignition");
  assert.equal(status.options.find((option) => option.id === "ignition").selected, true);
  assert.equal(production.routeStance.activeId, "ignition");
  assert.equal(production.perClick, 12.768);
  assert.equal(production.perSecond, 11.2);
  assert.equal(production.overloadBonus, 6.8947);
});

test("星图航线策略会兼容旧存档和未知策略", () => {
  const status = getRouteStanceStatus({
    ...createInitialState(0),
    totalEnergy: 120_000,
    routeStance: "unknown"
  });

  assert.equal(status.activeId, "balanced");
  assert.equal(status.active.name, "均衡航线");
});

test("星图航线策略会显示对应专精航段进度", () => {
  const status = getRouteStanceStatus({
    ...createInitialState(0),
    totalEnergy: 260_000,
    upgrades: {
      lens: 12,
      collector: 13,
      resonator: 6,
      stabilizer: 9
    }
  });

  assert.equal(status.unlocked, true);
  assert.equal(
    status.options.find((option) => option.id === "ignition").masteryText,
    "专精：点火航校 12 级/14 级"
  );
  assert.equal(
    status.options.find((option) => option.id === "cruise").masteryText,
    "专精：巡航航校 13 级/14 级"
  );
  assert.equal(
    status.options.find((option) => option.id === "balanced").masteryText,
    "专精：均衡校准 9 级/14 级"
  );
});

test("已完成的航线策略专精会显示完成状态", () => {
  const status = getRouteStanceStatus({
    ...createInitialState(0),
    totalEnergy: 1_200_000,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  });

  assert.equal(
    status.options.find((option) => option.id === "ignition").masteryText,
    "专精：点火航校已完成"
  );
  assert.equal(
    status.options.find((option) => option.id === "cruise").masteryText,
    "专精：巡航航校已完成"
  );
  assert.equal(
    status.options.find((option) => option.id === "balanced").masteryText,
    "专精：均衡校准已完成"
  );
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
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 14,
      resonator: 6,
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
      resonator: 0,
      stabilizer: 9
    }
  };

  const projects = getProjectStatuses(state);

  assert.equal(projects[0].id, "stellar-map");
  assert.equal(projects[0].segmentIndex, 1);
  assert.equal(projects[0].segmentTotal, 31);
  assert.equal(projects[0].segmentText, "航段 1/31");
  assert.equal(projects[0].completed, true);
  assert.equal(projects[0].isCurrent, false);
  assert.equal(projects[0].progressText, "进度 100K 能量 / 100K 能量 · 已完成");
  assert.equal(projects[1].id, "resonance-calibration");
  assert.equal(projects[1].segmentText, "航段 2/31");
  assert.equal(projects[1].isCurrent, true);
  assert.equal(projects[1].remaining, 6);
  assert.equal(projects[1].progressText, "进度 0 级 / 6 级 · 还差 6 级");
  assert.equal(projects[2].id, "lens-array");
  assert.equal(projects[2].isCurrent, false);
  assert.equal(projects[2].remaining, 1);
  assert.equal(projects[3].id, "collector-grid");
  assert.equal(projects[3].remaining, 1);
  assert.equal(projects[4].id, "ignition-drill");
  assert.equal(projects[4].completed, false);
  assert.equal(projects[5].id, "cruise-drill");
  assert.equal(projects[6].id, "starbridge-trial");
});

test("星图总览会显示完成数和下一段奖励", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 114_354.89,
    upgrades: {
      lens: 11,
      collector: 11,
      resonator: 0,
      stabilizer: 9
    }
  };

  const overview = getProjectOverview(state);

  assert.equal(overview.completed, 1);
  assert.equal(overview.total, 31);
  assert.equal(overview.nextProjectId, "resonance-calibration");
  assert.deepEqual(overview.upcomingProjectIds, [
    "resonance-calibration",
    "lens-array",
    "collector-grid"
  ]);
  assert.equal(
    overview.summaryText,
    "星图进度 1/31 · 下一段 2/31：谐振校准 · 奖励 过载奖励 +20%"
  );
  assert.equal(overview.detailText, "进度 0 级 / 6 级 · 还差 6 级");
  assert.equal(
    overview.trackText,
    "目标分轨：累计航段 星桥试运行（进度 114.4K 能量 / 250K 能量 · 还差 135.6K 能量）；升级航段 谐振校准（进度 0 级 / 6 级 · 还差 6 级）"
  );
  assert.equal(
    overview.compositionText,
    "航线构成：22 个累计航段 · 9 个升级航段 · 奖励分布 总产能 10 段 / 点击 8 段 / 自动 8 段 / 过载 5 段"
  );
  assert.equal(overview.bonusText, "生效加成：总产能 x1.12");
  assert.equal(
    overview.forecastText,
    "航线预告：谐振校准（过载奖励 +20%）、透镜阵列（点击产能 +18%）、采集阵列（自动产能 +18%）"
  );
});

test("星图总览在首个项目前会提示等待奖励生效", () => {
  const overview = getProjectOverview(createInitialState(0));

  assert.equal(overview.completed, 0);
  assert.equal(overview.nextProjectId, "stellar-map");
  assert.equal(overview.bonusText, "生效加成：等待首个星图奖励");
});

test("100K 后当前目标会指向下一个未完成星图项目", () => {
  const state = {
    ...createInitialState(0),
    energy: 87_030,
    totalEnergy: 114_354.89,
    upgrades: {
      lens: 11,
      collector: 11,
      resonator: 0,
      stabilizer: 9
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-resonance-calibration");
  assert.equal(goal.label, "星图计划");
  assert.equal(goal.value, "谐振校准");
  assert.equal(goal.segmentIndex, 2);
  assert.equal(goal.segmentTotal, 31);
  assert.equal(goal.upgradeId, "resonator");
  assert.equal(
    goal.progressText,
    "航段 2/31 · 进度 0 级 / 6 级 · 可购买星核谐振器 · 奖励 过载奖励 +20%"
  );
});

test("星图主目标会直接显示项目奖励", () => {
  const state = {
    ...createInitialState(0),
    energy: 50_000,
    totalEnergy: 120_000,
    overloadBonus: 17,
    upgrades: {
      lens: 12,
      collector: 11,
      resonator: 6,
      stabilizer: 9
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-collector-grid");
  assert.equal(goal.value, "采集阵列");
  assert.equal(goal.reward, "自动产能 +18%");
  assert.equal(
    goal.progressText,
    "航段 4/31 · 进度 11 级 / 12 级 · 可购买自动采集臂 · 奖励 自动产能 +18%"
  );
});

test("首批星图项目完成后会继续指向策略专精目标", () => {
  const state = {
    ...createInitialState(0),
    energy: 50_000,
    totalEnergy: 260_000,
    overloadBonus: 17,
    upgrades: {
      lens: 12,
      collector: 12,
      resonator: 6,
      stabilizer: 9
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-ignition-drill");
  assert.equal(goal.value, "点火航校");
  assert.equal(goal.upgradeId, "lens");
  assert.equal(
    goal.progressText,
    "航段 5/31 · 进度 12 级 / 14 级 · 可购买聚能透镜 · 奖励 点击产能 +16%"
  );
});

test("500K 后星图会继续指向深空矿带", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 600_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 14,
      resonator: 6,
      stabilizer: 14
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-deep-space-mine");
  assert.equal(goal.value, "深空矿带");
  assert.equal(
    goal.progressText,
    "航段 11/31 · 进度 600K 能量 / 750K 能量 · 还差 150K 能量 · 奖励 点击产能 +26%"
  );
});

test("深空航段完成后会继续指向星门远征", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 1_200_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-void-gate-expedition");
  assert.equal(goal.value, "星门远征");
  assert.equal(
    goal.progressText,
    "航段 14/31 · 进度 1.2M 能量 / 1.5M 能量 · 还差 300K 能量 · 奖励 总产能 +16%"
  );
});

test("星门远征完成后会继续指向外环信标", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 1_600_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-outer-ring-beacon");
  assert.equal(goal.value, "外环信标");
  assert.equal(
    goal.progressText,
    "航段 15/31 · 进度 1.6M 能量 / 2M 能量 · 还差 400K 能量 · 奖励 点击产能 +14%"
  );
});

test("外环信标完成后会继续指向彗尾船坞", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 2_100_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-comet-tail-dock");
  assert.equal(goal.value, "彗尾船坞");
  assert.equal(
    goal.progressText,
    "航段 16/31 · 进度 2.1M 能量 / 2.8M 能量 · 还差 650K 能量 · 奖励 自动产能 +18%"
  );
});

test("彗尾船坞完成后会继续指向引力航标", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 3_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-gravity-beacon");
  assert.equal(goal.value, "引力航标");
  assert.equal(
    goal.progressText,
    "航段 17/31 · 进度 3M 能量 / 3.5M 能量 · 还差 500K 能量 · 奖励 总产能 +15%"
  );
});

test("引力航标完成后会继续指向暗流观测站", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 3_800_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-dark-current-observatory");
  assert.equal(goal.value, "暗流观测站");
  assert.equal(
    goal.progressText,
    "航段 18/31 · 进度 3.8M 能量 / 4.5M 能量 · 还差 700K 能量 · 奖励 过载奖励 +15%"
  );
});

test("暗流观测站完成后会继续指向虚空罗盘", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 4_900_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-void-compass");
  assert.equal(goal.value, "虚空罗盘");
  assert.equal(
    goal.progressText,
    "航段 19/31 · 进度 4.9M 能量 / 5.8M 能量 · 还差 850K 能量 · 奖励 点击产能 +15%"
  );
});

test("虚空罗盘完成后会继续指向星云档案库", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 6_200_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-nebula-archive");
  assert.equal(goal.value, "星云档案库");
  assert.equal(
    goal.progressText,
    "航段 20/31 · 进度 6.2M 能量 / 7.3M 能量 · 还差 1.1M 能量 · 奖励 自动产能 +17%"
  );
});

test("星云档案库完成后会继续指向深穹测距阵", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 7_600_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-deep-sky-ranging-array");
  assert.equal(goal.value, "深穹测距阵");
  assert.equal(
    goal.progressText,
    "航段 21/31 · 进度 7.6M 能量 / 9M 能量 · 还差 1.4M 能量 · 奖励 总产能 +17%"
  );
});

test("深穹测距阵完成后会继续指向寂光中继环", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 9_500_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-silent-light-relay");
  assert.equal(goal.value, "寂光中继环");
  assert.equal(
    goal.progressText,
    "航段 22/31 · 进度 9.5M 能量 / 11M 能量 · 还差 1.5M 能量 · 奖励 过载奖励 +16%"
  );
});

test("寂光中继环完成后会继续指向极昼折跃井", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 11_500_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-daybreak-warp-well");
  assert.equal(goal.value, "极昼折跃井");
  assert.equal(
    goal.progressText,
    "航段 23/31 · 进度 11.5M 能量 / 13.5M 能量 · 还差 2M 能量 · 奖励 点击产能 +16%"
  );
});

test("极昼折跃井完成后会继续指向日冕回廊", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 14_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-corona-corridor");
  assert.equal(goal.value, "日冕回廊");
  assert.equal(
    goal.progressText,
    "航段 24/31 · 进度 14M 能量 / 16.5M 能量 · 还差 2.5M 能量 · 奖励 自动产能 +16%"
  );
});

test("日冕回廊完成后会继续指向磁帆穹顶", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 17_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-mag-sail-dome");
  assert.equal(goal.value, "磁帆穹顶");
  assert.equal(
    goal.progressText,
    "航段 25/31 · 进度 17M 能量 / 20M 能量 · 还差 3M 能量 · 奖励 总产能 +18%"
  );
});

test("磁帆穹顶完成后会继续指向引潮星环", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 21_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-tidal-star-ring");
  assert.equal(goal.value, "引潮星环");
  assert.equal(
    goal.progressText,
    "航段 26/31 · 进度 21M 能量 / 24M 能量 · 还差 3M 能量 · 奖励 过载奖励 +18%"
  );
});

test("引潮星环完成后会继续指向脉冲航闸", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 25_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-pulse-arc-gate");
  assert.equal(goal.value, "脉冲航闸");
  assert.equal(
    goal.progressText,
    "航段 27/31 · 进度 25M 能量 / 30M 能量 · 还差 5M 能量 · 奖励 点击产能 +18%"
  );
});

test("脉冲航闸完成后会继续指向离辉轨道港", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 31_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-glow-orbit-harbor");
  assert.equal(goal.value, "离辉轨道港");
  assert.equal(
    goal.progressText,
    "航段 28/31 · 进度 31M 能量 / 38M 能量 · 还差 7M 能量 · 奖励 自动产能 +18%"
  );
});

test("离辉轨道港完成后会继续指向远曦灯塔", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 39_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-far-dawn-lighthouse");
  assert.equal(goal.value, "远曦灯塔");
  assert.equal(
    goal.progressText,
    "航段 29/31 · 进度 39M 能量 / 50M 能量 · 还差 11M 能量 · 奖励 总产能 +19%"
  );
});

test("远曦灯塔完成后会继续指向星冠回声站", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 52_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-star-crown-echo-station");
  assert.equal(goal.value, "星冠回声站");
  assert.equal(
    goal.progressText,
    "航段 30/31 · 进度 52M 能量 / 65M 能量 · 还差 13M 能量 · 奖励 过载奖励 +19%"
  );
});

test("星冠回声站完成后会继续指向晨渊观星台", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 66_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-dawn-abyss-observatory");
  assert.equal(goal.value, "晨渊观星台");
  assert.equal(
    goal.progressText,
    "航段 31/31 · 进度 66M 能量 / 85M 能量 · 还差 19M 能量 · 奖励 点击产能 +19%"
  );
});

test("100K 前当前目标仍保留短周期累计目标", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 99_500,
    upgrades: {
      lens: 11,
      collector: 11,
      resonator: 0,
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
    overloadBonus: 17,
    upgrades: {
      lens: 12,
      collector: 12,
      resonator: 6,
      stabilizer: 0
    }
  };

  const production = getEffectiveProduction(state);
  const clicked = clickCore(state, 0);

  assert.deepEqual(production.projectBonuses.projectIds, [
    "stellar-map",
    "resonance-calibration",
    "lens-array",
    "collector-grid"
  ]);
  assert.equal(production.projectBonuses.overloadMultiplier, 1.2);
  assert.equal(production.totalMultiplier, 2.24);
  assert.equal(production.perClick, 26.432);
  assert.equal(production.perSecond, 13.216);
  assert.equal(production.overloadBonus, 53.9213);
  assert.equal(clicked.lastGain, 26.432);
});

test("深空航段完成后会继续叠加项目奖励", () => {
  const state = {
    ...createInitialState(0),
    energyPerClick: 10,
    energyPerSecond: 10,
    totalEnergy: 1_200_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const production = getEffectiveProduction(state);

  assert.deepEqual(production.projectBonuses.projectIds, [
    "stellar-map",
    "resonance-calibration",
    "lens-array",
    "collector-grid",
    "ignition-drill",
    "cruise-drill",
    "starbridge-trial",
    "stabilizer-matrix",
    "balanced-tuning",
    "farstar-relay",
    "deep-space-mine",
    "orbital-foundry",
    "stellar-anchor"
  ]);
  assert.equal(production.projectBonuses.completed, 13);
  assert.equal(production.projectBonuses.overloadMultiplier, 1.2);
  assert.equal(production.projectBonuses.clickMultiplier, 1.7247);
  assert.equal(production.projectBonuses.secondMultiplier, 2.2065);
  assert.equal(production.perClick, 39.6267);
  assert.equal(production.perSecond, 50.6965);
  assert.equal(production.overloadBonus, 80.8385);
});

test("星图项目只会标记第一个未完成项目为当前航段", () => {
  const active = getProjectStatuses({
    ...createInitialState(0),
    totalEnergy: 260_000,
    overloadBonus: 17,
    upgrades: {
      lens: 12,
      collector: 12,
      resonator: 6,
      stabilizer: 9
    }
  });
  const completed = getProjectStatuses({
    ...createInitialState(0),
    totalEnergy: 86_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  });

  assert.deepEqual(
    active.filter((project) => project.isCurrent).map((project) => project.id),
    ["ignition-drill"]
  );
  assert.deepEqual(
    completed.filter((project) => project.isCurrent).map((project) => project.id),
    []
  );
});

test("星图总览会显示全部完成状态", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 86_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const overview = getProjectOverview(state);

  assert.equal(overview.completed, 31);
  assert.equal(overview.total, 31);
  assert.equal(overview.nextProjectId, null);
  assert.equal(overview.summaryText, "星图进度 31/31 · 全部航段已完成");
  assert.equal(
    overview.detailText,
    "所有星图奖励已生效，继续累计能量等待下一段航线。"
  );
  assert.equal(overview.trackText, "目标分轨：累计航段 全部完成；升级航段 全部完成");
  assert.equal(
    overview.bonusText,
    "生效加成：总产能 x5.04 · 点击 x3.68 · 自动 x4.17 · 过载 x2.25"
  );
  assert.equal(overview.forecastText, "航线预告：等待下一段航线");
  assert.equal(
    overview.compositionText,
    "航线构成：22 个累计航段 · 9 个升级航段 · 奖励分布 总产能 10 段 / 点击 8 段 / 自动 8 段 / 过载 5 段"
  );
});

test("反馈入口会生成带游戏快照的 GitHub Issue 链接", () => {
  const state = {
    ...createInitialState(0),
    energy: 42,
    totalEnergy: 80,
    energyPerSecond: 0.7,
    routeStance: "ignition",
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
  assert.match(body, /过载奖励：5/);
  assert.match(body, /航线策略：点火优先/);
  assert.match(body, /lens:1/);
});

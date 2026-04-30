import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  activateDirective,
  buildActionNoticeWithGoalTransition,
  buildClickActionNotice,
  buildGoalCompletionNotice,
  buildUpgradePurchaseNotice,
  clickCore,
  createInitialState,
  DIRECTIVE_MASTERY_CAPSTONE_RATE,
  DIRECTIVE_MASTERY_MAX_STACKS,
  DIRECTIVE_PLAN_BONUS_RATE,
  DIRECTIVE_STANCE_BONUS_RATE,
  DIRECTIVE_STANCE_FINISHER_RATE,
  DIRECTIVE_TASK_REWARD_RATE,
  FAR_ROUTE_DISPATCH_BONUS_RATE,
  FAR_ROUTE_DISPATCH_UNLOCK_ENERGY,
  filterProjectStatuses,
  formatNumber,
  getComboStatus,
  getCoreRewardPreview,
  getCurrentGoal,
  getDirectivePlan,
  getDirectiveStatus,
  getDirectiveTaskStatus,
  getEffectiveProduction,
  getFarRouteDispatch,
  getProjectFilterBrief,
  getProjectFilterButtonText,
  getProjectFilterSummary,
  getProjectChapterVisuals,
  getProjectListWindow,
  getProjectOverview,
  getProjectStatuses,
  getProjectVisualMap,
  getRouteStanceStatus,
  getUpgradeAffordability,
  getUpgradeCost,
  INITIAL_PROJECT_FILTER_ID,
  PROJECT_LIST_PREVIEW_LIMIT,
  PROJECT_FILTER_DEFS,
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

test("点火奖励预告会显示下一击收益和过载触发", () => {
  let state = createInitialState(0);
  const idlePreview = getCoreRewardPreview(state, 0);

  assert.equal(idlePreview.nextGain, 1);
  assert.equal(idlePreview.text, "下一击 +1 · 再 8 次过载 +5");
  assert.equal(idlePreview.isOverloadReady, false);
  assert.equal(idlePreview.isOverloadHit, false);

  for (let index = 0; index < 7; index += 1) {
    state = clickCore(state, index * 100);
  }

  const readyPreview = getCoreRewardPreview(state, 700);

  assert.equal(readyPreview.nextGain, 6);
  assert.equal(readyPreview.text, "下一击 +6 · 触发过载 +5");
  assert.equal(readyPreview.isOverloadReady, true);
  assert.equal(readyPreview.isOverloadHit, false);

  state = clickCore(state, 700);
  const hitPreview = getCoreRewardPreview(state, 800);

  assert.equal(hitPreview.nextGain, 1);
  assert.equal(hitPreview.text, "下一击 +1 · 新一轮过载蓄能");
  assert.equal(hitPreview.isOverloadReady, false);
  assert.equal(hitPreview.isOverloadHit, true);
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

test("航线指令会在 100K 后解锁并返回预计收益", () => {
  const locked = getDirectiveStatus(createInitialState(0), 0);
  const unlocked = getDirectiveStatus(
    {
      ...createInitialState(0),
      totalEnergy: 100_000,
      energyPerClick: 10,
      energyPerSecond: 5,
      overloadBonus: 7
    },
    0
  );

  assert.equal(locked.unlocked, false);
  assert.equal(locked.options[0].disabled, true);
  assert.equal(locked.options[0].previewText, "累计 100K 能量后解锁航线指令");
  assert.equal(unlocked.unlocked, true);
  assert.equal(unlocked.options[0].ready, true);
  assert.equal(unlocked.options[0].previewText, "预计 +95 能量 · 预案执行 +5.4");
  assert.equal(unlocked.options[0].recommended, true);
  assert.equal(unlocked.options[0].recommendationText, "收束起手");
  assert.equal(unlocked.options[0].planReward, 5.376);
  assert.equal(unlocked.options[0].planRewardText, "预案执行 +5.4");
  assert.equal(unlocked.options[0].planBonusRate, DIRECTIVE_PLAN_BONUS_RATE);
  assert.equal(unlocked.options[1].previewText, "预计 +267.1 能量 · 预案执行 +15.1");
  assert.equal(unlocked.options[1].recommended, true);
  assert.equal(unlocked.options[1].recommendationText, "收束起手");
  assert.equal(unlocked.options[2].previewText, "预计 +17.2 能量 · 策略契合 +10%");
  assert.equal(unlocked.options[2].recommended, false);
  assert.equal(unlocked.options[2].recommendationText, "");
  assert.equal(unlocked.options[2].stanceMatched, true);
  assert.equal(unlocked.options[2].stanceBonusRate, DIRECTIVE_STANCE_BONUS_RATE);
  assert.equal(unlocked.options[2].stanceBonusText, "策略契合 +10%");
});

test("航线指令会返回轮换目标提示", () => {
  const locked = getDirectivePlan(createInitialState(0), 0);
  const lockedTask = getDirectiveTaskStatus(createInitialState(0), 0);
  const ready = getDirectivePlan(
    {
      ...createInitialState(0),
      totalEnergy: 100_000
    },
    0
  );
  const readyTask = getDirectiveTaskStatus(
    {
      ...createInitialState(0),
      totalEnergy: 100_000
    },
    0
  );

  assert.equal(locked.progress, 0);
  assert.equal(locked.summaryText, "指令轮换：累计 100K 能量后解锁 90 秒连携目标");
  assert.equal(
    locked.text,
    "指令轮换：累计 100K 能量后解锁 90 秒连携目标 · 解锁后先从非契合指令起手，第二步继续避开契合指令，把契合指令留到 3/3 策略终结；完成轮换会累积指令熟练，满层后用回响续航触发满层回响。"
  );
  assert.equal(lockedTask.text, "航线委托：累计 100K 能量后解锁 3 步短期任务");
  assert.equal(ready.progress, 0);
  assert.equal(ready.target, 3);
  assert.deepEqual(ready.nextDirectiveIds, ["ignition-salvo", "cruise-cache"]);
  assert.equal(ready.recommendationText, "收束起手");
  assert.equal(ready.waitingRecommendationText, "等待起手");
  assert.equal(
    ready.text,
    "指令轮换 0/3 · 先执行点火齐射或巡航回收，保留谐振脉冲完成 3/3 策略终结 · 匹配当前航线策略可获得策略契合 +10% · 随后在 90 秒内切换不同指令 · 完成 3/3 轮换会累积 3 分钟指令熟练，每层指令收益 +5%，最多 3 层；满层后继续完成 3/3 会触发满层回响 +10%。"
  );
  assert.equal(DIRECTIVE_TASK_REWARD_RATE, 0.08);
  assert.equal(
    readyTask.text,
    "航线委托 0/3 · 下一步 点火齐射或巡航回收，完成 3/3 推荐轮换 · 完成奖励 委托完成 +8%"
  );
});

test("执行航线指令会获得即时收益并进入冷却", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 100_000,
    energyPerClick: 10,
    energyPerSecond: 0,
    overloadBonus: 7
  };

  const result = activateDirective(state, "ignition-salvo", 1000);
  const status = getDirectiveStatus(result.state, 1000);
  const blocked = activateDirective(result.state, "ignition-salvo", 11_000);

  assert.equal(result.activated, true);
  assert.equal(result.gain, 94.976);
  assert.equal(result.planReward, 5.376);
  assert.equal(result.planRewardText, "预案执行 +5.4");
  assert.equal(result.planBonusRate, DIRECTIVE_PLAN_BONUS_RATE);
  assert.equal(result.state.energy, 94.976);
  assert.equal(result.state.totalEnergy, 100_094.976);
  assert.equal(result.notice, "已执行点火齐射，预案执行 +5.4，+95 能量。");
  assert.equal(status.options[0].ready, false);
  assert.equal(status.options[0].statusText, "冷却 35 秒");
  assert.equal(blocked.activated, false);
  assert.equal(blocked.reason, "cooldown");
  assert.equal(blocked.notice, "点火齐射冷却中，还需 25 秒。");
});

test("轮换航线指令会触发航线连携收益", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 100_000,
    energyPerClick: 10,
    energyPerSecond: 0,
    overloadBonus: 7
  };

  const first = activateDirective(state, "ignition-salvo", 1000);
  const status = getDirectiveStatus(first.state, 2000);
  const cruiseOption = status.options.find((option) => option.id === "cruise-cache");
  const earlyResonanceOption = status.options.find((option) => option.id === "resonance-pulse");
  const firstPlan = getDirectivePlan(first.state, 2000);
  const second = activateDirective(first.state, "cruise-cache", 2000);
  const secondPlan = getDirectivePlan(second.state, 3000);
  const secondTask = getDirectiveTaskStatus(second.state, 3000);
  const secondStatus = getDirectiveStatus(second.state, 3000);
  const resonanceOption = secondStatus.options.find((option) => option.id === "resonance-pulse");
  const third = activateDirective(second.state, "resonance-pulse", 3000);
  const continuationStatus = getDirectiveStatus(third.state, 40_000);
  const continuationPlan = getDirectivePlan(third.state, 40_000);
  const continuationTask = getDirectiveTaskStatus(third.state, 40_000);
  const ignitionContinuationOption = continuationStatus.options.find(
    (option) => option.id === "ignition-salvo"
  );

  assert.equal(first.chainStacks, 0);
  assert.equal(first.chainMultiplier, 1);
  assert.equal(cruiseOption.recommended, true);
  assert.equal(cruiseOption.recommendationText, "收束续航");
  assert.equal(cruiseOption.finisherRecommended, false);
  assert.equal(cruiseOption.previewText, "预计 +52.9 能量 · 预案执行 +2.7 · 航线连携 +12%");
  assert.equal(earlyResonanceOption.recommended, false);
  assert.deepEqual(firstPlan.nextDirectiveIds, ["cruise-cache"]);
  assert.equal(firstPlan.recommendationText, "收束续航");
  assert.equal(firstPlan.waitingRecommendationText, "等待续航");
  assert.equal(
    firstPlan.text,
    "指令轮换 1/3 · 当前 点火齐射 · 连携窗口 1.5 分钟 · 下一步切换到巡航回收，继续保留谐振脉冲做 3/3 策略终结，预计连携 +12%；完成 3/3 轮换会累积 3 分钟指令熟练，每层指令收益 +5%，最多 3 层；满层后继续完成 3/3 会触发满层回响 +10%。"
  );
  assert.equal(second.activated, true);
  assert.equal(second.baseGain, 44.8);
  assert.equal(second.chainStacks, 1);
  assert.equal(second.chainMultiplier, 1.12);
  assert.equal(second.planReward, 2.688);
  assert.equal(second.gain, 52.864);
  assert.equal(second.notice, "已执行巡航回收，预案执行 +2.7，航线连携 +12%，+52.9 能量。");
  assert.equal(
    secondPlan.text,
    "指令轮换 2/3 · 当前 巡航回收 · 连携窗口 1.5 分钟 · 下一步切换到谐振脉冲，预计连携 +24%，并触发轮换目标奖励；收束到谐振脉冲还会触发策略终结奖励；完成 3/3 轮换会累积 3 分钟指令熟练，每层指令收益 +5%，最多 3 层；满层后继续完成 3/3 会触发满层回响 +10%。"
  );
  assert.equal(
    secondTask.text,
    "航线委托 2/3 · 下一步 谐振脉冲，完成 3/3 推荐轮换 · 完成奖励 委托完成 +8%"
  );
  assert.equal(secondTask.progress, 2);
  assert.equal(secondTask.target, 3);
  assert.equal(secondTask.completed, false);
  assert.equal(resonanceOption.recommended, true);
  assert.equal(resonanceOption.recommendationText, "轮换推荐");
  assert.equal(resonanceOption.finisherRecommended, true);
  assert.equal(resonanceOption.finisherRecommendationText, "策略终结");
  assert.equal(resonanceOption.taskReward, 1.2544);
  assert.equal(resonanceOption.taskRewardText, "委托完成 +1.3");
  assert.equal(
    resonanceOption.previewText,
    "预计 +29 能量 · 预案执行 +0.9 · 委托完成 +1.3 · 航线连携 +24% · 轮换目标 +2.8 · 策略终结 +1.9 · 策略契合 +10%"
  );
  assert.equal(third.chainStacks, 2);
  assert.equal(third.chainMultiplier, 1.24);
  assert.equal(third.planReward, 0.9408);
  assert.equal(third.taskReward, 1.2544);
  assert.equal(third.taskRewardText, "委托完成 +1.3");
  assert.equal(third.rotationReward, 2.8224);
  assert.equal(third.stanceFinisherReward, 1.8816);
  assert.equal(third.stanceBonus, 2.6342);
  assert.equal(third.gain, 28.9766);
  assert.equal(third.planRewardText, "预案执行 +0.9");
  assert.equal(third.chainBonusText, "航线连携 +24%");
  assert.equal(third.rotationRewardText, "轮换目标 +2.8");
  assert.equal(third.stanceFinisherText, "策略终结 +1.9");
  assert.equal(third.stanceBonusText, "策略契合 +10%");
  assert.equal(third.masteryRewardGained, 1);
  assert.equal(third.masteryRewardStacks, 1);
  assert.equal(third.masteryRewardText, "指令熟练 +1 层 (1/3)");
  assert.equal(third.state.directiveMastery.stacks, 1);
  assert.equal(third.notice, "已执行谐振脉冲，预案执行 +0.9，委托完成 +1.3，航线连携 +24%，轮换目标 +2.8，策略终结 +1.9，策略契合 +10%，指令熟练 +1 层 (1/3)，+29 能量。");
  assert.equal(DIRECTIVE_STANCE_FINISHER_RATE, 0.12);
  assert.equal(continuationPlan.progress, 3);
  assert.equal(
    continuationTask.text,
    "航线委托已完成 · 已达成 3/3 推荐轮换；重置或超时后开启下一轮委托，继续轮换可维持连携与熟练"
  );
  assert.equal(continuationTask.progress, 3);
  assert.equal(continuationTask.target, 3);
  assert.equal(continuationTask.completed, true);
  assert.deepEqual(continuationPlan.nextDirectiveIds, ["ignition-salvo"]);
  assert.equal(continuationPlan.recommendationText, "熟练续航");
  assert.equal(continuationPlan.waitingRecommendationText, "等待续航");
  assert.equal(
    continuationPlan.text,
    "指令轮换 3/3 · 当前 谐振脉冲 · 连携窗口 53 秒 · 下一步切换到点火齐射进入熟练续航，可维持连携 +24%，并继续触发轮换目标奖励；重复同类会重置；当前指令熟练 1/3，下一次指令 +5%，剩余 2.4 分钟。"
  );
  assert.equal(ignitionContinuationOption.recommended, true);
  assert.equal(ignitionContinuationOption.recommendationText, "熟练续航");
  assert.equal(
    ignitionContinuationOption.previewText,
    "预计 +139.2 能量 · 指令熟练 +5% · 预案执行 +5.6 · 航线连携 +24% · 轮换目标 +16.9"
  );

  const masteredState = {
    ...third.state,
    directiveChain: {
      lastDirectiveId: null,
      stacks: 0,
      expiresAt: 0
    }
  };
  const masteredStatus = getDirectiveStatus(masteredState, 4000);
  const masteredPlan = getDirectivePlan(masteredState, 4000);
  const masteredResonanceOption = masteredStatus.options.find(
    (option) => option.id === "resonance-pulse"
  );

  assert.equal(masteredResonanceOption.masteryMatched, true);
  assert.equal(masteredResonanceOption.masteryBonusText, "指令熟练 +5%");
  assert.equal(masteredResonanceOption.previewText, "预计 +18.1 能量 · 指令熟练 +5% · 策略契合 +10%");
  assert.equal(
    masteredPlan.text,
    "指令轮换 0/3 · 等待冷却后执行点火齐射或巡航回收，保留谐振脉冲完成 3/3 策略终结 · 匹配当前航线策略可获得策略契合 +10% · 随后在 90 秒内切换不同指令 · 当前指令熟练 1/3，下一次指令 +5%，剩余 3 分钟。"
  );

  const expiredStatus = getDirectiveStatus(third.state, 184_000);
  const expiredResonanceOption = expiredStatus.options.find(
    (option) => option.id === "resonance-pulse"
  );

  assert.equal(expiredResonanceOption.masteryMatched, false);
  assert.equal(expiredResonanceOption.masteryBonusText, "");

  const nonMatchedFirst = activateDirective(
    { ...state, routeStance: "ignition" },
    "ignition-salvo",
    1000
  );
  const nonMatchedSecond = activateDirective(nonMatchedFirst.state, "cruise-cache", 2000);
  const nonMatchedStatus = getDirectiveStatus(nonMatchedSecond.state, 3000);
  const nonMatchedResonanceOption = nonMatchedStatus.options.find(
    (option) => option.id === "resonance-pulse"
  );
  const nonMatchedThird = activateDirective(nonMatchedSecond.state, "resonance-pulse", 3000);

  assert.equal(nonMatchedResonanceOption.finisherRecommended, false);
  assert.equal(nonMatchedResonanceOption.finisherRecommendationText, "");
  assert.equal(nonMatchedThird.chainStacks, 2);
  assert.equal(nonMatchedThird.rotationReward > 0, true);
  assert.equal(nonMatchedThird.stanceFinisherReward, 0);
  assert.equal(nonMatchedThird.stanceFinisherText, "");
});

test("满层指令熟练会触发回响续航奖励", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 100_000,
    energyPerClick: 10,
    energyPerSecond: 0,
    overloadBonus: 7,
    directiveChain: {
      lastDirectiveId: "resonance-pulse",
      stacks: 2,
      expiresAt: 94_000
    },
    directiveMastery: {
      stacks: 3,
      expiresAt: 184_000
    }
  };

  const plan = getDirectivePlan(state, 4000);
  const status = getDirectiveStatus(state, 4000);
  const ignitionOption = status.options.find((option) => option.id === "ignition-salvo");
  const result = activateDirective(state, "ignition-salvo", 4000);

  assert.equal(DIRECTIVE_MASTERY_CAPSTONE_RATE, 0.1);
  assert.equal(plan.recommendationText, "回响续航");
  assert.equal(plan.waitingRecommendationText, "等待回响");
  assert.deepEqual(plan.nextDirectiveIds, ["ignition-salvo", "cruise-cache"]);
  assert.equal(
    plan.text,
    "指令轮换 3/3 · 当前 谐振脉冲 · 连携窗口 1.5 分钟 · 下一步切换到点火齐射或巡航回收进入回响续航，可维持连携 +24%，并继续触发轮换目标奖励与满层回响；重复同类会重置；当前指令熟练 3/3，下一次指令 +15%，完成 3/3 可触发满层回响 +10%，剩余 3 分钟。"
  );
  assert.equal(ignitionOption.recommended, true);
  assert.equal(ignitionOption.recommendationText, "回响续航");
  assert.equal(ignitionOption.planReward, 6.1824);
  assert.equal(ignitionOption.planRewardText, "预案执行 +6.2");
  assert.equal(ignitionOption.masteryCapstoneReward, 10.304);
  assert.equal(ignitionOption.masteryCapstoneText, "满层回响 +10.3");
  assert.equal(
    ignitionOption.previewText,
    "预计 +162.8 能量 · 指令熟练 +15% · 预案执行 +6.2 · 航线连携 +24% · 轮换目标 +18.5 · 满层回响 +10.3"
  );
  assert.equal(result.planReward, 6.1824);
  assert.equal(result.planRewardText, "预案执行 +6.2");
  assert.equal(result.masteryCapstoneReward, 10.304);
  assert.equal(result.masteryCapstoneText, "满层回响 +10.3");
  assert.equal(
    result.notice,
    "已执行点火齐射，指令熟练 +15%，预案执行 +6.2，航线连携 +24%，轮换目标 +18.5，满层回响 +10.3，指令熟练刷新 (3/3)，+162.8 能量。"
  );
});

test("航线连携超时后会重置", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 100_000,
    energyPerClick: 10,
    energyPerSecond: 0,
    overloadBonus: 7
  };

  const first = activateDirective(state, "ignition-salvo", 1000);
  const status = getDirectiveStatus(first.state, 92_000);
  const cruiseOption = status.options.find((option) => option.id === "cruise-cache");
  const expired = activateDirective(first.state, "cruise-cache", 92_000);

  assert.equal(cruiseOption.previewText, "预计 +47.5 能量 · 预案执行 +2.7");
  assert.equal(expired.chainStacks, 0);
  assert.equal(expired.chainMultiplier, 1);
  assert.equal(expired.planReward, 2.688);
  assert.equal(expired.gain, 47.488);
  assert.equal(expired.notice, "已执行巡航回收，预案执行 +2.7，+47.5 能量。");
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

test("星图总览会显示当前航线策略焦点", () => {
  const overview = getProjectOverview({
    ...createInitialState(0),
    routeStance: "ignition",
    totalEnergy: 260_000,
    upgrades: {
      lens: 12,
      collector: 12,
      resonator: 6,
      stabilizer: 9
    }
  });

  assert.equal(
    overview.routeFocusText,
    "航线焦点：点火优先 -> 点火航校（点击产能 +16% · 进度 12 级 / 14 级 · 还差 2 级）"
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
    energy: 87_030,
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
  assert.equal(projects[0].segmentTotal, 57);
  assert.equal(projects[0].segmentText, "航段 1/57");
  assert.equal(projects[0].chapterName, "首段星图");
  assert.equal(projects[0].chapterIndex, 1);
  assert.equal(projects[0].chapterTotal, 4);
  assert.equal(projects[0].chapterText, "首段星图 1/4");
  assert.equal(projects[0].tagText, "累计航段 · 总产能奖励");
  assert.equal(projects[0].statusText, "已完成");
  assert.equal(projects[0].completed, true);
  assert.equal(projects[0].isCurrent, false);
  assert.equal(projects[0].progressText, "进度 100K 能量 / 100K 能量 · 已完成");
  assert.equal(projects[1].id, "resonance-calibration");
  assert.equal(projects[1].segmentText, "航段 2/57");
  assert.equal(projects[1].chapterName, "首段星图");
  assert.equal(projects[1].chapterIndex, 2);
  assert.equal(projects[1].chapterTotal, 4);
  assert.equal(projects[1].chapterText, "首段星图 2/4");
  assert.equal(projects[1].tagText, "升级航段 · 过载奖励");
  assert.equal(projects[1].statusText, "当前航段");
  assert.equal(projects[1].isCurrent, true);
  assert.equal(projects[1].remaining, 6);
  assert.equal(projects[1].progressText, "进度 0 级 / 6 级 · 还差 6 级");
  assert.equal(projects[2].id, "lens-array");
  assert.equal(projects[2].tagText, "升级航段 · 点击奖励");
  assert.equal(projects[2].statusText, "待推进");
  assert.equal(projects[2].isCurrent, false);
  assert.equal(projects[2].remaining, 1);
  assert.equal(projects[3].id, "collector-grid");
  assert.equal(projects[3].remaining, 1);
  assert.equal(projects[4].id, "ignition-drill");
  assert.equal(projects[4].completed, false);
  assert.equal(projects[5].id, "cruise-drill");
  assert.equal(projects[6].id, "starbridge-trial");
});

test("星图项目会标记所属章节", () => {
  const projects = getProjectStatuses(createInitialState(0));

  assert.equal(projects[0].chapterName, "首段星图");
  assert.equal(projects[0].chapterText, "首段星图 1/4");
  assert.equal(projects[4].chapterName, "专精校准");
  assert.equal(projects[4].chapterText, "专精校准 1/5");
  assert.equal(projects[9].chapterName, "深空基建");
  assert.equal(projects[9].chapterText, "深空基建 1/4");
  assert.equal(projects[13].chapterName, "远航长尾");
  assert.equal(projects[13].chapterText, "远航长尾 1/44");
  assert.equal(projects[30].chapterName, "远航长尾");
  assert.equal(projects[30].chapterText, "远航长尾 18/44");
  assert.equal(projects[31].chapterName, "远航长尾");
  assert.equal(projects[31].chapterText, "远航长尾 19/44");
  assert.equal(projects[32].chapterName, "远航长尾");
  assert.equal(projects[32].chapterText, "远航长尾 20/44");
  assert.equal(projects[33].chapterName, "远航长尾");
  assert.equal(projects[33].chapterText, "远航长尾 21/44");
  assert.equal(projects[34].chapterName, "远航长尾");
  assert.equal(projects[34].chapterText, "远航长尾 22/44");
  assert.equal(projects[35].chapterName, "远航长尾");
  assert.equal(projects[35].chapterText, "远航长尾 23/44");
  assert.equal(projects[36].chapterName, "远航长尾");
  assert.equal(projects[36].chapterText, "远航长尾 24/44");
  assert.equal(projects[37].chapterName, "远航长尾");
  assert.equal(projects[37].chapterText, "远航长尾 25/44");
  assert.equal(projects[38].chapterName, "远航长尾");
  assert.equal(projects[38].chapterText, "远航长尾 26/44");
  assert.equal(projects[39].chapterName, "远航长尾");
  assert.equal(projects[39].chapterText, "远航长尾 27/44");
  assert.equal(projects[40].chapterName, "远航长尾");
  assert.equal(projects[40].chapterText, "远航长尾 28/44");
  assert.equal(projects[41].chapterName, "远航长尾");
  assert.equal(projects[41].chapterText, "远航长尾 29/44");
  assert.equal(projects[42].chapterName, "远航长尾");
  assert.equal(projects[42].chapterText, "远航长尾 30/44");
  assert.equal(projects[43].chapterName, "远航长尾");
  assert.equal(projects[43].chapterText, "远航长尾 31/44");
  assert.equal(projects[44].chapterName, "远航长尾");
  assert.equal(projects[44].chapterText, "远航长尾 32/44");
  assert.equal(projects[45].chapterName, "远航长尾");
  assert.equal(projects[45].chapterText, "远航长尾 33/44");
  assert.equal(projects[46].chapterName, "远航长尾");
  assert.equal(projects[46].chapterText, "远航长尾 34/44");
  assert.equal(projects[47].chapterName, "远航长尾");
  assert.equal(projects[47].chapterText, "远航长尾 35/44");
  assert.equal(projects[48].chapterName, "远航长尾");
  assert.equal(projects[48].chapterText, "远航长尾 36/44");
  assert.equal(projects[49].chapterName, "远航长尾");
  assert.equal(projects[49].chapterText, "远航长尾 37/44");
  assert.equal(projects[50].chapterName, "远航长尾");
  assert.equal(projects[50].chapterText, "远航长尾 38/44");
  assert.equal(projects[51].chapterName, "远航长尾");
  assert.equal(projects[51].chapterText, "远航长尾 39/44");
  assert.equal(projects[52].chapterName, "远航长尾");
  assert.equal(projects[52].chapterText, "远航长尾 40/44");
  assert.equal(projects[53].chapterName, "远航长尾");
  assert.equal(projects[53].chapterText, "远航长尾 41/44");
  assert.equal(projects[54].chapterName, "远航长尾");
  assert.equal(projects[54].chapterText, "远航长尾 42/44");
  assert.equal(projects[55].chapterName, "远航长尾");
  assert.equal(projects[55].chapterText, "远航长尾 43/44");
  assert.equal(projects[56].chapterName, "远航长尾");
  assert.equal(projects[56].chapterText, "远航长尾 44/44");
});

test("星图视觉图会返回全航线节点和筛选高亮", () => {
  const projects = getProjectStatuses(createInitialState(0));
  const map = getProjectVisualMap(projects);
  const currentMap = getProjectVisualMap(projects, "current");

  assert.equal(map.summaryText, "星图视觉 0/57 · 当前 航段 1/57 · 首段星图 1/4 点亮星图");
  assert.equal(map.filterText, "高亮：全部 57 段");
  assert.equal(map.nodes.length, 57);
  assert.equal(map.nodes[0].label, "航段 1/57 · 首段星图 1/4 点亮星图");
  assert.equal(map.nodes[0].status, "current");
  assert.equal(map.nodes[0].selected, true);
  assert.equal(map.nodes[1].status, "pending");
  assert.equal(currentMap.filterText, "高亮：当前 1 段");
  assert.equal(currentMap.nodes.filter((node) => node.selected).length, 1);
  assert.equal(currentMap.nodes[1].selected, false);
});

test("静态首页会引用星图插画资产", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const asset = readFileSync(
    new URL("../src/assets/star-map-visual.svg", import.meta.url),
    "utf8"
  );

  assert.match(indexHtml, /project-scene-image/);
  assert.match(indexHtml, /src="\.\/src\/assets\/star-map-visual\.svg"/);
  assert.match(indexHtml, /星核、航线节点和远航星门组成的星图插画/);
  assert.match(styles, /\.project-scene-image/);
  assert.match(asset, /星核工坊星图航线插画/);
  assert.match(asset, /routeLine/);
});

test("静态首页会渲染星图章节视觉导航", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="projectChapterMap"/);
  assert.match(indexHtml, /星图章节视觉导航/);
  assert.match(indexHtml, /project-chapter-tile is-current is-active/);
  assert.match(indexHtml, /<strong>远航长尾<\/strong>/);
  assert.match(indexHtml, /project-chapter-visual is-long-tail/);
  assert.match(indexHtml, /project-chapter-emblem/);
  assert.match(indexHtml, /<span class="project-chapter-focus">远航航线<\/span>/);
  assert.match(indexHtml, /<span class="project-chapter-next">下一条 1\/44 星门远征<\/span>/);
  assert.match(appJs, /getProjectChapterVisuals/);
  assert.match(appJs, /function renderProjectChapterMap\(chapters\)/);
  assert.match(appJs, /projectChapterMap: document\.querySelector\("#projectChapterMap"\)/);
  assert.match(appJs, /chapter\.visualClass/);
  assert.match(appJs, /chapter\.focusText/);
  assert.match(appJs, /projectFilter = chapter\.filterId/);
  assert.match(styles, /\.project-chapter-map/);
  assert.match(styles, /\.project-chapter-tile/);
  assert.match(styles, /\.project-chapter-visual/);
  assert.match(styles, /\.project-chapter-emblem/);
  assert.match(styles, /\.project-chapter-focus/);
});

test("静态首页会引用主操作区工坊插画资产", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const asset = readFileSync(
    new URL("../src/assets/workshop-visual.svg", import.meta.url),
    "utf8"
  );

  assert.match(indexHtml, /workshop-scene-image/);
  assert.match(indexHtml, /src="\.\/src\/assets\/workshop-visual\.svg"/);
  assert.match(indexHtml, /星核、聚能透镜、自动采集臂、稳定器和谐振环组成的工坊插画/);
  assert.match(styles, /\.workshop-scene-image/);
  assert.match(asset, /星核工坊主操作插画/);
  assert.match(asset, /energyBeam/);
});

test("点火按钮会渲染点击反馈和过载前兆效果", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="coreButton" class="core-button" type="button" data-combo-step="0"/);
  assert.match(indexHtml, /class="core-feedback-layer"/);
  assert.match(indexHtml, /class="core-combo-track"/);
  assert.match(indexHtml, /id="coreRewardHint" class="core-reward-hint"/);
  assert.match(indexHtml, /class="core-label">点火<\/span>/);
  assert.match(appJs, /getCoreRewardPreview/);
  assert.match(appJs, /function renderCoreFeedback\(combo\)/);
  assert.match(appJs, /function renderCoreComboTrack\(combo\)/);
  assert.match(appJs, /function renderCoreRewardHint\(coreReward\)/);
  assert.match(appJs, /elements\.coreButton\.dataset\.comboStep = String\(combo\.step\)/);
  assert.match(appJs, /dot\.classList\.toggle\("is-filled", combo\.step >= step\)/);
  assert.match(appJs, /dot\.classList\.toggle\("is-next", !combo\.overloaded && combo\.step \+ 1 === step\)/);
  assert.match(appJs, /is-combo-charging/);
  assert.match(appJs, /is-overload-ready/);
  assert.match(appJs, /is-overload-hit/);
  assert.match(appJs, /is-overload-impact/);
  assert.match(appJs, /window\.setTimeout/);
  assert.match(styles, /\.core-button::before/);
  assert.match(styles, /\.core-feedback-layer/);
  assert.match(styles, /\.core-combo-track/);
  assert.match(styles, /\.core-combo-dot\.is-next/);
  assert.match(styles, /\.core-reward-hint/);
  assert.match(styles, /\.core-label/);
  assert.match(styles, /\.core-button\.is-overload-ready/);
  assert.match(styles, /\.core-button\.is-overload-impact::after/);
  assert.match(styles, /\.combo-line span\.is-overload-ready/);
  assert.match(styles, /@keyframes coreShockwave/);
  assert.match(styles, /@keyframes coreOverloadShockwave/);
  assert.match(styles, /@keyframes coreSparks/);
  assert.match(styles, /@keyframes coreDotPulse/);
});

test("升级卡片会渲染可扫视图标", () => {
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(appJs, /UPGRADE_ICON_DEFS/);
  assert.match(appJs, /upgrade-card-head/);
  assert.match(appJs, /upgrade-icon-/);
  assert.match(appJs, /聚能透镜图标/);
  assert.match(appJs, /星核谐振器图标/);
  assert.match(styles, /\.upgrade-icon/);
  assert.match(styles, /\.upgrade-icon-lens/);
  assert.match(styles, /\.upgrade-icon-resonator/);
});

test("星图项目卡片会渲染推进和奖励图标", () => {
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(appJs, /PROJECT_CARD_ICON_DEFS/);
  assert.match(appJs, /project-card-icons/);
  assert.match(appJs, /renderProjectCardIcon\(getProjectTrackIconId\(project\), "track"\)/);
  assert.match(appJs, /renderProjectCardIcon\(getProjectRewardIconId\(project\), "reward"\)/);
  assert.match(appJs, /累计航段图标/);
  assert.match(appJs, /升级航段图标/);
  assert.match(appJs, /总产能奖励图标/);
  assert.match(appJs, /过载奖励图标/);
  assert.match(styles, /\.project-title/);
  assert.match(styles, /\.project-card-icon/);
  assert.match(styles, /\.project-card-icon-track/);
  assert.match(styles, /\.project-card-icon-reward/);
  assert.match(styles, /\.project-card-icon-second/);
  assert.match(styles, /\.project-card-icon-overload/);
});

test("星图项目卡片会默认折叠非当前航段详情", () => {
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(appJs, /function renderProjectDetailNodes\(project\)/);
  assert.match(appJs, /if \(project\.isCurrent\) \{/);
  assert.match(appJs, /details\.className = "project-card-drawer"/);
  assert.match(appJs, /detailGrid\.className = "project-card-detail-grid"/);
  assert.match(appJs, /detailSummary\.textContent = "航段详情"/);
  assert.match(styles, /\.project-item:not\(\.is-current\)/);
  assert.match(styles, /\.project-card-drawer/);
  assert.match(styles, /\.project-card-detail-grid/);
  assert.match(styles, /\.project-card-drawer\[open\] summary::after/);
});

test("星图项目长列表会默认收起超出窗口的航段", () => {
  const projects = getProjectStatuses(createInitialState(0));
  const longTailProjects = filterProjectStatuses(projects, "chapter-long-tail");
  const allWindow = getProjectListWindow(projects);
  const longTailWindow = getProjectListWindow(longTailProjects);
  const compactWindow = getProjectListWindow(longTailProjects.slice(0, 4));
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.equal(PROJECT_LIST_PREVIEW_LIMIT, 8);
  assert.equal(allWindow.visibleProjects.length, 8);
  assert.equal(allWindow.collapsedProjects.length, 49);
  assert.equal(allWindow.visibleProjects[0].isCurrent, true);
  assert.equal(allWindow.summaryText, "已收起 49 段 · 当前显示 1-8/57");
  assert.equal(longTailWindow.visibleProjects.length, 8);
  assert.equal(longTailWindow.collapsedProjects.length, 36);
  assert.equal(longTailWindow.summaryText, "已收起 36 段 · 当前显示 1-8/44");
  assert.equal(compactWindow.visibleProjects.length, 4);
  assert.equal(compactWindow.collapsedProjects.length, 0);
  assert.match(appJs, /getProjectListWindow/);
  assert.match(appJs, /function renderProjectListDrawer\(projectWindow\)/);
  assert.match(appJs, /details\.className = "project-list-drawer"/);
  assert.match(appJs, /grid\.className = "project-list-drawer-grid"/);
  assert.match(styles, /\.project-list-drawer/);
  assert.match(styles, /\.project-list-drawer-grid/);
  assert.match(styles, /\.project-list-drawer\[open\] summary::after/);
});

test("静态首页会渲染航线指令轮换目标", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="directivePlan"/);
  assert.match(indexHtml, /id="directiveTask"/);
  assert.match(indexHtml, /id="farDispatch"/);
  assert.match(indexHtml, /class="directive-task-meter"/);
  assert.match(indexHtml, /class="far-dispatch-meter"/);
  assert.match(indexHtml, /aria-label="航线委托进度"/);
  assert.match(indexHtml, /aria-label="远航调度进度"/);
  assert.match(indexHtml, /指令轮换：累计 100K 能量后解锁 90 秒连携目标/);
  assert.match(indexHtml, /航线委托：累计 100K 能量后解锁 3 步短期任务/);
  assert.match(indexHtml, /远航调度：累计 20M 能量后解锁后半段航段调度/);
  assert.match(indexHtml, /非契合指令起手/);
  assert.match(indexHtml, /第二步继续避开契合指令/);
  assert.match(indexHtml, /3\/3 策略终结/);
  assert.match(indexHtml, /预案执行奖励/);
  assert.match(indexHtml, /指令熟练/);
  assert.match(indexHtml, /回响续航/);
  assert.match(indexHtml, /满层回响/);
  assert.match(appJs, /rotationReward: result\.rotationReward/);
  assert.match(appJs, /planReward: result\.planReward/);
  assert.match(appJs, /planBonusRate: result\.planBonusRate/);
  assert.match(appJs, /taskReward: result\.taskReward/);
  assert.match(appJs, /taskRewardRate: result\.taskRewardRate/);
  assert.match(appJs, /dispatchReward: result\.dispatchReward/);
  assert.match(appJs, /dispatchRewardRate: result\.dispatchRewardRate/);
  assert.match(appJs, /masteryCapstoneReward: result\.masteryCapstoneReward/);
  assert.match(appJs, /masteryCapstoneRate: result\.masteryCapstoneRate/);
  assert.match(appJs, /stanceFinisherReward: result\.stanceFinisherReward/);
  assert.match(appJs, /stanceBonus: result\.stanceBonus/);
  assert.match(appJs, /masteryBonus: result\.masteryBonus/);
  assert.match(appJs, /masteryRewardStacks: result\.masteryRewardStacks/);
  assert.match(appJs, /directivePlan: document\.querySelector\("#directivePlan"\)/);
  assert.match(appJs, /directiveTask: document\.querySelector\("#directiveTask"\)/);
  assert.match(appJs, /farDispatch: document\.querySelector\("#farDispatch"\)/);
  assert.match(appJs, /elements\.directivePlan\.textContent = directives\.plan\.text/);
  assert.match(appJs, /renderDirectiveTask\(directives\.task\)/);
  assert.match(appJs, /renderFarDispatch\(directives\.dispatch/);
  assert.match(appJs, /function renderDirectiveTask\(task\)/);
  assert.match(appJs, /function renderFarDispatch\(dispatch\)/);
  assert.match(appJs, /meter\.className = "directive-task-meter"/);
  assert.match(appJs, /meter\.className = "far-dispatch-meter"/);
  assert.match(appJs, /meter\.setAttribute\("role", "meter"\)/);
  assert.match(appJs, /elements\.directiveTask\.classList\.toggle\("is-completed", task\.completed\)/);
  assert.match(appJs, /elements\.directiveTask\.replaceChildren\(text, meter\)/);
  assert.match(appJs, /elements\.farDispatch\.classList\.toggle\("is-active", dispatch\.active\)/);
  assert.match(appJs, /option\.recommended \? "is-recommended" : ""/);
  assert.match(appJs, /option\.finisherRecommended \? "is-finisher-recommended" : ""/);
  assert.match(appJs, /badges\.className = "directive-badges"/);
  assert.match(appJs, /recommendation\.className = "directive-recommendation"/);
  assert.match(appJs, /recommendation\.textContent = option\.recommendationText/);
  assert.match(appJs, /planBonus\.className = "directive-plan-bonus"/);
  assert.match(appJs, /planBonus\.textContent = option\.planRewardText/);
  assert.match(appJs, /planBonus\.hidden = !option\.planRewardText/);
  assert.match(appJs, /taskBonus\.className = "directive-task-bonus"/);
  assert.match(appJs, /taskBonus\.textContent = option\.taskRewardText/);
  assert.match(appJs, /dispatchBonus\.className = "directive-dispatch-bonus"/);
  assert.match(appJs, /dispatchBonus\.textContent = option\.dispatchRewardText/);
  assert.match(appJs, /finisherRecommendation\.className = "directive-finisher-recommendation"/);
  assert.match(appJs, /finisherRecommendation\.textContent = option\.finisherRecommendationText/);
  assert.match(appJs, /masteryBonus\.className = "directive-mastery-bonus"/);
  assert.match(appJs, /masteryBonus\.textContent = option\.masteryBonusText/);
  assert.match(appJs, /stanceBonus\.className = "directive-stance-bonus"/);
  assert.match(appJs, /stanceBonus\.textContent = option\.stanceBonusText/);
  assert.match(styles, /\.directive-plan/);
  assert.match(styles, /\.directive-task/);
  assert.match(styles, /\.directive-task-meter/);
  assert.match(styles, /\.directive-task\.is-completed/);
  assert.match(styles, /\.far-dispatch/);
  assert.match(styles, /\.far-dispatch-meter/);
  assert.match(styles, /\.far-dispatch\.is-active/);
  assert.match(styles, /\.directive-button \.directive-badges/);
  assert.match(styles, /\.directive-button\.is-recommended/);
  assert.match(styles, /\.directive-button\.is-finisher-recommended/);
  assert.match(styles, /\.directive-button \.directive-recommendation/);
  assert.match(styles, /\.directive-button \.directive-plan-bonus/);
  assert.match(styles, /\.directive-button \.directive-task-bonus/);
  assert.match(styles, /\.directive-button \.directive-dispatch-bonus/);
  assert.match(styles, /\.directive-button \.directive-finisher-recommendation/);
  assert.match(styles, /\.directive-button \.directive-mastery-bonus/);
  assert.match(styles, /\.directive-button \.directive-stance-bonus/);
});

test("静态首页会默认折叠星图详细文本", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /<details class="project-detail-drawer">/);
  assert.doesNotMatch(indexHtml, /<details class="project-detail-drawer" open>/);
  assert.match(indexHtml, /<summary>星图明细<\/summary>/);
  assert.match(indexHtml, /projectOverviewTracks/);
  assert.match(indexHtml, /projectOverviewAction/);
  assert.match(indexHtml, /projectOverviewForecast/);
  assert.match(styles, /\.project-detail-drawer/);
  assert.match(styles, /\.project-detail-grid/);
});

test("静态首页会默认折叠星图筛选长摘要", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.equal(INITIAL_PROJECT_FILTER_ID, "current-chapter");
  assert.match(indexHtml, /<details class="project-filter-controls">/);
  assert.doesNotMatch(indexHtml, /<details class="project-filter-controls" open>/);
  assert.match(indexHtml, /<summary>筛选航段<\/summary>/);
  assert.match(indexHtml, /<details class="project-filter-drawer">/);
  assert.doesNotMatch(indexHtml, /<details class="project-filter-drawer" open>/);
  assert.match(indexHtml, /id="projectFilterSummaryBrief"/);
  assert.match(indexHtml, /高亮：本章 4 段/);
  assert.match(indexHtml, /<button class="project-filter-button is-active" type="button" aria-pressed="true">本章 0\/4<\/button>/);
  assert.match(indexHtml, /<button class="project-filter-button" type="button" aria-pressed="false">首段星图 0\/4<\/button>/);
  assert.match(indexHtml, /<button class="project-filter-button" type="button" aria-pressed="false">远航长尾 0\/44<\/button>/);
  assert.match(indexHtml, /筛选摘要：本章 0\/4 · 下一条 航段 1\/57/);
  assert.match(indexHtml, /终点 航段 4\/57 · 首段星图 4\/4 采集阵列/);
  assert.match(appJs, /INITIAL_PROJECT_FILTER_ID/);
  assert.match(appJs, /let projectFilter = INITIAL_PROJECT_FILTER_ID/);
  assert.match(appJs, /getProjectFilterBrief/);
  assert.match(appJs, /projectFilterSummaryBrief: document\.querySelector\("#projectFilterSummaryBrief"\)/);
  assert.match(styles, /\.project-filter-controls/);
  assert.match(styles, /\.project-filter-controls\[open\] summary::after/);
  assert.match(styles, /\.project-filter-drawer/);
  assert.match(styles, /\.project-filter-drawer\[open\] summary::after/);
});

test("星图总览会显示完成数和下一段奖励", () => {
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

  const overview = getProjectOverview(state);

  assert.equal(overview.completed, 1);
  assert.equal(overview.total, 57);
  assert.equal(overview.nextProjectId, "resonance-calibration");
  assert.deepEqual(overview.upcomingProjectIds, [
    "resonance-calibration",
    "lens-array",
    "collector-grid"
  ]);
  assert.equal(
    overview.summaryText,
    "星图进度 1/57 · 下一段 2/57：谐振校准 · 奖励 过载奖励 +20%"
  );
  assert.equal(overview.detailText, "进度 0 级 / 6 级 · 还差 6 级");
  assert.equal(
    overview.trackText,
    "目标分轨：累计航段 星桥试运行（进度 114.4K 能量 / 250K 能量 · 还差 135.6K 能量）；升级航段 谐振校准（进度 0 级 / 6 级 · 还差 6 级）"
  );
  assert.equal(
    overview.chapterText,
    "阶段导航：首段星图 1/4 · 专精校准 0/5 · 深空基建 0/4 · 远航长尾 0/44；当前 首段星图 2/4 · 航段 2/57 谐振校准 · 本阶段还剩 3 段 · 下一阶段 专精校准"
  );
  assert.equal(
    overview.chapterTargetText,
    "章节目标：首段星图 2/4 谐振校准 · 专精校准 1/5 点火航校 · 深空基建 1/4 远星中继 · 远航长尾 1/44 星门远征"
  );
  assert.equal(
    overview.chapterRewardText,
    "章节奖励：首段星图 总产能 1 / 点击 1 / 自动 1 / 过载 1 · 专精校准 总产能 3 / 点击 1 / 自动 1 · 深空基建 总产能 1 / 点击 1 / 自动 2 · 远航长尾 总产能 12 / 点击 11 / 自动 11 / 过载 10"
  );
  assert.equal(
    overview.rewardProgressText,
    "奖励进度：总产能 1/17 · 点击 0/14 · 自动 0/15 · 过载 0/11"
  );
  assert.equal(
    overview.rewardTargetText,
    "奖励目标：总产能 星桥试运行（总产能 +25% · 进度 114.4K 能量 / 250K 能量 · 还差 135.6K 能量） · 点击 透镜阵列（点击产能 +18% · 进度 11 级 / 12 级 · 还差 1 级） · 自动 采集阵列（自动产能 +18% · 进度 11 级 / 12 级 · 还差 1 级） · 过载 谐振校准（过载奖励 +20% · 进度 0 级 / 6 级 · 还差 6 级）"
  );
  assert.equal(
    overview.milestoneText,
    "里程碑：本章终点 采集阵列（航段 4/57 · 自动产能 +18% · 进度 11 级 / 12 级 · 还差 1 级）；终局航点 星渊方舟（航段 57/57 · 总产能 +32% · 进度 114.4K 能量 / 122B 能量 · 还差 122B 能量）"
  );
  assert.equal(
    overview.routeFocusText,
    "航线焦点：均衡航线 -> 均衡校准（总产能 +14% · 进度 9 级 / 14 级 · 还差 5 级）"
  );
  assert.equal(
    overview.compositionText,
    "航线构成：48 个累计航段 · 9 个升级航段 · 奖励分布 总产能 17 段 / 点击 14 段 / 自动 15 段 / 过载 11 段"
  );
  assert.equal(overview.bonusText, "生效加成：总产能 x1.12");
  assert.equal(
    overview.actionText,
    "行动建议：可购买星核谐振器，推进航段 2/57 谐振校准"
  );
  assert.equal(
    overview.forecastText,
    "航线预告：谐振校准（过载奖励 +20%）、透镜阵列（点击产能 +18%）、采集阵列（自动产能 +18%）"
  );
});

test("星图总览在首个项目前会提示等待奖励生效", () => {
  const overview = getProjectOverview(createInitialState(0));

  assert.equal(overview.completed, 0);
  assert.equal(overview.nextProjectId, "stellar-map");
  assert.equal(
    overview.chapterTargetText,
    "章节目标：首段星图 1/4 点亮星图 · 专精校准 1/5 点火航校 · 深空基建 1/4 远星中继 · 远航长尾 1/44 星门远征"
  );
  assert.equal(
    overview.chapterRewardText,
    "章节奖励：首段星图 总产能 1 / 点击 1 / 自动 1 / 过载 1 · 专精校准 总产能 3 / 点击 1 / 自动 1 · 深空基建 总产能 1 / 点击 1 / 自动 2 · 远航长尾 总产能 12 / 点击 11 / 自动 11 / 过载 10"
  );
  assert.equal(
    overview.rewardProgressText,
    "奖励进度：总产能 0/17 · 点击 0/14 · 自动 0/15 · 过载 0/11"
  );
  assert.equal(
    overview.rewardTargetText,
    "奖励目标：总产能 点亮星图（总产能 +12% · 进度 0 能量 / 100K 能量 · 还差 100K 能量） · 点击 透镜阵列（点击产能 +18% · 进度 0 级 / 12 级 · 还差 12 级） · 自动 采集阵列（自动产能 +18% · 进度 0 级 / 12 级 · 还差 12 级） · 过载 谐振校准（过载奖励 +20% · 进度 0 级 / 6 级 · 还差 6 级）"
  );
  assert.equal(
    overview.milestoneText,
    "里程碑：本章终点 采集阵列（航段 4/57 · 自动产能 +18% · 进度 0 级 / 12 级 · 还差 12 级）；终局航点 星渊方舟（航段 57/57 · 总产能 +32% · 进度 0 能量 / 122B 能量 · 还差 122B 能量）"
  );
  assert.equal(overview.routeFocusText, "航线焦点：累计 100K 能量后解锁策略焦点");
  assert.equal(overview.bonusText, "生效加成：等待首个星图奖励");
  assert.equal(
    overview.actionText,
    "行动建议：继续点火累计，推进航段 1/57 点亮星图，还差 100K 能量"
  );
});

test("星图总览会给累计航段显示行动建议和预计时间", () => {
  const overview = getProjectOverview({
    ...createInitialState(0),
    totalEnergy: 120_000,
    energyPerSecond: 1000,
    upgrades: {
      lens: 14,
      collector: 14,
      resonator: 6,
      stabilizer: 9
    }
  });

  assert.equal(overview.nextProjectId, "starbridge-trial");
  assert.equal(
    overview.actionText,
    "行动建议：继续点火或放置累计，推进航段 7/57 星桥试运行，还差 130K 能量，按当前每秒约 1.5K 需 1.4 分钟"
  );
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
  assert.equal(goal.segmentTotal, 57);
  assert.equal(goal.upgradeId, "resonator");
  assert.equal(
    goal.progressText,
    "航段 2/57 · 进度 0 级 / 6 级 · 可购买星核谐振器 · 奖励 过载奖励 +20%"
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
    "航段 4/57 · 进度 11 级 / 12 级 · 可购买自动采集臂 · 奖励 自动产能 +18%"
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
    "航段 5/57 · 进度 12 级 / 14 级 · 可购买聚能透镜 · 奖励 点击产能 +16%"
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
    "航段 11/57 · 进度 600K 能量 / 750K 能量 · 还差 150K 能量 · 奖励 点击产能 +26%"
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
    "航段 14/57 · 进度 1.2M 能量 / 1.5M 能量 · 还差 300K 能量 · 奖励 总产能 +16%"
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
    "航段 15/57 · 进度 1.6M 能量 / 2M 能量 · 还差 400K 能量 · 奖励 点击产能 +14%"
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
    "航段 16/57 · 进度 2.1M 能量 / 2.8M 能量 · 还差 650K 能量 · 奖励 自动产能 +18%"
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
    "航段 17/57 · 进度 3M 能量 / 3.5M 能量 · 还差 500K 能量 · 奖励 总产能 +15%"
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
    "航段 18/57 · 进度 3.8M 能量 / 4.5M 能量 · 还差 700K 能量 · 奖励 过载奖励 +15%"
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
    "航段 19/57 · 进度 4.9M 能量 / 5.8M 能量 · 还差 850K 能量 · 奖励 点击产能 +15%"
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
    "航段 20/57 · 进度 6.2M 能量 / 7.3M 能量 · 还差 1.1M 能量 · 奖励 自动产能 +17%"
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
    "航段 21/57 · 进度 7.6M 能量 / 9M 能量 · 还差 1.4M 能量 · 奖励 总产能 +17%"
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
    "航段 22/57 · 进度 9.5M 能量 / 11M 能量 · 还差 1.5M 能量 · 奖励 过载奖励 +16%"
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
    "航段 23/57 · 进度 11.5M 能量 / 13.5M 能量 · 还差 2M 能量 · 奖励 点击产能 +16%"
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
    "航段 24/57 · 进度 14M 能量 / 16.5M 能量 · 还差 2.5M 能量 · 奖励 自动产能 +16%"
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
    "航段 25/57 · 进度 17M 能量 / 20M 能量 · 还差 3M 能量 · 奖励 总产能 +18%"
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
    "航段 26/57 · 进度 21M 能量 / 24M 能量 · 还差 3M 能量 · 奖励 过载奖励 +18%"
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
    "航段 27/57 · 进度 25M 能量 / 30M 能量 · 还差 5M 能量 · 奖励 点击产能 +18%"
  );
});

test("远航调度会在 20M 后按当前航段指定目标指令", () => {
  const locked = getFarRouteDispatch({
    ...createInitialState(0),
    totalEnergy: 19_900_000
  });
  const state = {
    ...createInitialState(0),
    totalEnergy: 25_000_000,
    energyPerClick: 16,
    energyPerSecond: 17.5,
    multiplier: 32.3239,
    overloadBonus: 27,
    routeStance: "cruise",
    upgrades: {
      lens: 15,
      collector: 25,
      resonator: 11,
      stabilizer: 21
    }
  };
  const dispatch = getFarRouteDispatch(state, 1000);
  const status = getDirectiveStatus(state, 1000);
  const ignitionOption = status.options.find((option) => option.id === "ignition-salvo");
  const cruiseOption = status.options.find((option) => option.id === "cruise-cache");
  const ignitionResult = activateDirective(state, "ignition-salvo", 1000);
  const cruiseResult = activateDirective(state, "cruise-cache", 1000);

  assert.equal(FAR_ROUTE_DISPATCH_UNLOCK_ENERGY, 20_000_000);
  assert.equal(FAR_ROUTE_DISPATCH_BONUS_RATE, 0.14);
  assert.equal(locked.unlocked, false);
  assert.equal(locked.text, "远航调度：累计 20M 能量后解锁后半段航段调度");
  assert.equal(dispatch.unlocked, true);
  assert.equal(dispatch.active, true);
  assert.equal(dispatch.projectId, "pulse-arc-gate");
  assert.equal(dispatch.projectName, "脉冲航闸");
  assert.equal(dispatch.segmentText, "航段 27/57");
  assert.equal(dispatch.targetDirectiveId, "ignition-salvo");
  assert.equal(dispatch.targetDirectiveName, "点火齐射");
  assert.equal(dispatch.rewardText, "调度校准 +14%");
  assert.equal(
    dispatch.text,
    "远航调度：航段 27/57 脉冲航闸指定点火齐射 · 执行目标指令获得调度校准 +14%"
  );
  assert.equal(Math.round(dispatch.progress * 100), 83);
  assert.equal(ignitionOption.dispatchReward > 0, true);
  assert.match(ignitionOption.dispatchRewardText, /调度校准 \+/);
  assert.match(ignitionOption.previewText, /调度校准 \+/);
  assert.equal(cruiseOption.dispatchReward, 0);
  assert.equal(cruiseOption.dispatchRewardText, "");
  assert.equal(ignitionResult.dispatchReward > 0, true);
  assert.equal(ignitionResult.dispatchRewardRate, FAR_ROUTE_DISPATCH_BONUS_RATE);
  assert.match(ignitionResult.notice, /调度校准 \+/);
  assert.equal(cruiseResult.dispatchReward, 0);
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
    "航段 28/57 · 进度 31M 能量 / 38M 能量 · 还差 7M 能量 · 奖励 自动产能 +18%"
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
    "航段 29/57 · 进度 39M 能量 / 50M 能量 · 还差 11M 能量 · 奖励 总产能 +19%"
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
    "航段 30/57 · 进度 52M 能量 / 65M 能量 · 还差 13M 能量 · 奖励 过载奖励 +19%"
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
    "航段 31/57 · 进度 66M 能量 / 85M 能量 · 还差 19M 能量 · 奖励 点击产能 +19%"
  );
});

test("晨渊观星台完成后会继续指向曜幕天穹", () => {
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

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-solar-veil-dome");
  assert.equal(goal.value, "曜幕天穹");
  assert.equal(
    goal.progressText,
    "航段 32/57 · 进度 86M 能量 / 110M 能量 · 还差 24M 能量 · 奖励 自动产能 +20%"
  );
});

test("曜幕天穹完成后会继续指向星渊回声门", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 111_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-abyss-echo-gate");
  assert.equal(goal.value, "星渊回声门");
  assert.equal(
    goal.progressText,
    "航段 33/57 · 进度 111M 能量 / 145M 能量 · 还差 34M 能量 · 奖励 总产能 +20%"
  );
});

test("星渊回声门完成后会继续指向虚曜谐振塔", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 146_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-voidflare-resonator");
  assert.equal(goal.value, "虚曜谐振塔");
  assert.equal(
    goal.progressText,
    "航段 34/57 · 进度 146M 能量 / 190M 能量 · 还差 44M 能量 · 奖励 过载奖励 +20%"
  );
});

test("虚曜谐振塔完成后会继续指向烁影星匣", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 191_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-glimmer-shadow-vault");
  assert.equal(goal.value, "烁影星匣");
  assert.equal(
    goal.progressText,
    "航段 35/57 · 进度 191M 能量 / 250M 能量 · 还差 59M 能量 · 奖励 点击产能 +21%"
  );
});

test("烁影星匣完成后会继续指向辉潮巡航环", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 251_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-radiant-tide-cruise-ring");
  assert.equal(goal.value, "辉潮巡航环");
  assert.equal(
    goal.progressText,
    "航段 36/57 · 进度 251M 能量 / 320M 能量 · 还差 69M 能量 · 奖励 自动产能 +21%"
  );
});

test("辉潮巡航环完成后会继续指向星澜汇流庭", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 321_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-starwave-confluence-court");
  assert.equal(goal.value, "星澜汇流庭");
  assert.equal(
    goal.progressText,
    "航段 37/57 · 进度 321M 能量 / 420M 能量 · 还差 99M 能量 · 奖励 总产能 +22%"
  );
});

test("星澜汇流庭完成后会继续指向穹海棱镜", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 421_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-skysea-prism");
  assert.equal(goal.value, "穹海棱镜");
  assert.equal(
    goal.progressText,
    "航段 38/57 · 进度 421M 能量 / 550M 能量 · 还差 129M 能量 · 奖励 过载奖励 +22%"
  );
});

test("穹海棱镜完成后会继续指向极光谱站", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 551_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-aurora-spectrum-station");
  assert.equal(goal.value, "极光谱站");
  assert.equal(
    goal.progressText,
    "航段 39/57 · 进度 551M 能量 / 720M 能量 · 还差 169M 能量 · 奖励 点击产能 +23%"
  );
});

test("极光谱站完成后会继续指向银翼曙环", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 721_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-silverwing-dawn-ring");
  assert.equal(goal.value, "银翼曙环");
  assert.equal(
    goal.progressText,
    "航段 40/57 · 进度 721M 能量 / 950M 能量 · 还差 229M 能量 · 奖励 自动产能 +23%"
  );
});

test("银翼曙环完成后会继续指向晨星方舟", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 951_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-morningstar-ark");
  assert.equal(goal.value, "晨星方舟");
  assert.equal(
    goal.progressText,
    "航段 41/57 · 进度 951M 能量 / 1.2B 能量 · 还差 249M 能量 · 奖励 总产能 +24%"
  );
});

test("晨星方舟完成后会继续指向星潮谐振庭", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 1_201_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-startide-resonance-court");
  assert.equal(goal.value, "星潮谐振庭");
  assert.equal(
    goal.progressText,
    "航段 42/57 · 进度 1.2B 能量 / 1.6B 能量 · 还差 399M 能量 · 奖励 过载奖励 +24%"
  );
});

test("星潮谐振庭完成后会继续指向星辉远港", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 1_601_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-starglow-far-harbor");
  assert.equal(goal.value, "星辉远港");
  assert.equal(
    goal.progressText,
    "航段 43/57 · 进度 1.6B 能量 / 2.1B 能量 · 还差 499M 能量 · 奖励 点击产能 +25%"
  );
});

test("星辉远港完成后会继续指向辉翼巡航港", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 2_101_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-radiant-wing-cruise-haven");
  assert.equal(goal.value, "辉翼巡航港");
  assert.equal(
    goal.progressText,
    "航段 44/57 · 进度 2.1B 能量 / 2.8B 能量 · 还差 699M 能量 · 奖励 自动产能 +25%"
  );
});

test("辉翼巡航港完成后会继续指向星穹导航塔", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 2_801_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-stardome-navigation-spire");
  assert.equal(goal.value, "星穹导航塔");
  assert.equal(
    goal.progressText,
    "航段 45/57 · 进度 2.8B 能量 / 3.7B 能量 · 还差 899M 能量 · 奖励 总产能 +26%"
  );
});

test("星穹导航塔完成后会继续指向星瀑谐振门", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 3_701_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-starfall-resonance-gate");
  assert.equal(goal.value, "星瀑谐振门");
  assert.equal(
    goal.progressText,
    "航段 46/57 · 进度 3.7B 能量 / 4.9B 能量 · 还差 1.2B 能量 · 奖励 过载奖励 +26%"
  );
});

test("星瀑谐振门完成后会继续指向星焰引航环", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 4_901_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-starflame-pilot-ring");
  assert.equal(goal.value, "星焰引航环");
  assert.equal(
    goal.progressText,
    "航段 47/57 · 进度 4.9B 能量 / 6.5B 能量 · 还差 1.6B 能量 · 奖励 点击产能 +27%"
  );
});

test("星焰引航环完成后会继续指向星冕远航港", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 6_501_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-starcrown-voyage-harbor");
  assert.equal(goal.value, "星冕远航港");
  assert.equal(
    goal.progressText,
    "航段 48/57 · 进度 6.5B 能量 / 8.6B 能量 · 还差 2.1B 能量 · 奖励 自动产能 +27%"
  );
});

test("星冕远航港完成后会继续指向曜冕星门", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 8_601_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-radiant-crown-stargate");
  assert.equal(goal.value, "曜冕星门");
  assert.equal(
    goal.progressText,
    "航段 49/57 · 进度 8.6B 能量 / 11.4B 能量 · 还差 2.8B 能量 · 奖励 总产能 +28%"
  );
});

test("曜冕星门完成后会继续指向曜潮谐振门", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 11_401_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-radiant-tide-resonance-gate");
  assert.equal(goal.value, "曜潮谐振门");
  assert.equal(
    goal.progressText,
    "航段 50/57 · 进度 11.4B 能量 / 15.2B 能量 · 还差 3.8B 能量 · 奖励 过载奖励 +28%"
  );
});

test("曜潮谐振门完成后会继续指向星耀跃迁塔", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 15_201_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-starflare-transition-spire");
  assert.equal(goal.value, "星耀跃迁塔");
  assert.equal(
    goal.progressText,
    "航段 51/57 · 进度 15.2B 能量 / 20.4B 能量 · 还差 5.2B 能量 · 奖励 点击产能 +29%"
  );
});

test("星耀跃迁塔完成后会继续指向星翼远航港", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 20_401_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-starwing-voyage-haven");
  assert.equal(goal.value, "星翼远航港");
  assert.equal(
    goal.progressText,
    "航段 52/57 · 进度 20.4B 能量 / 27.5B 能量 · 还差 7.1B 能量 · 奖励 自动产能 +29%"
  );
});

test("星翼远航港完成后会继续指向曜翼星门", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 27_501_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-radiant-wing-stargate");
  assert.equal(goal.value, "曜翼星门");
  assert.equal(
    goal.progressText,
    "航段 53/57 · 进度 27.5B 能量 / 37.2B 能量 · 还差 9.7B 能量 · 奖励 总产能 +30%"
  );
});

test("曜翼星门完成后会继续指向曜渊谐振门", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 37_201_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-radiant-abyss-resonance-gate");
  assert.equal(goal.value, "曜渊谐振门");
  assert.equal(
    goal.progressText,
    "航段 54/57 · 进度 37.2B 能量 / 50B 能量 · 还差 12.8B 能量 · 奖励 过载奖励 +30%"
  );
});

test("曜渊谐振门完成后会继续指向星渊点火塔", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 50_001_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-abyss-ignition-spire");
  assert.equal(goal.value, "星渊点火塔");
  assert.equal(
    goal.progressText,
    "航段 55/57 · 进度 50B 能量 / 67.5B 能量 · 还差 17.5B 能量 · 奖励 点击产能 +31%"
  );
});

test("星渊点火塔完成后会继续指向星渊巡航环", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 67_501_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-abyss-cruise-ring");
  assert.equal(goal.value, "星渊巡航环");
  assert.equal(
    goal.progressText,
    "航段 56/57 · 进度 67.5B 能量 / 91B 能量 · 还差 23.5B 能量 · 奖励 自动产能 +31%"
  );
});

test("星渊巡航环完成后会继续指向星渊方舟", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 91_001_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const goal = getCurrentGoal(state);

  assert.equal(goal.id, "project-abyss-ark");
  assert.equal(goal.value, "星渊方舟");
  assert.equal(
    goal.progressText,
    "航段 57/57 · 进度 91B 能量 / 122B 能量 · 还差 31B 能量 · 奖励 总产能 +32%"
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
    totalEnergy: 122_001_000_000,
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

test("星图项目筛选会区分当前、未完成和已完成航段", () => {
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
    totalEnergy: 122_001_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  });

  assert.equal(filterProjectStatuses(active, "all").length, 57);
  assert.equal(filterProjectStatuses(active, "invalid").length, 57);
  assert.deepEqual(
    filterProjectStatuses(active, "current").map((project) => project.id),
    ["ignition-drill"]
  );
  assert.deepEqual(
    filterProjectStatuses(active, "current-chapter").map((project) => project.id),
    [
      "ignition-drill",
      "cruise-drill",
      "starbridge-trial",
      "stabilizer-matrix",
      "balanced-tuning"
    ]
  );
  assert.deepEqual(
    filterProjectStatuses(active, "chapter-starter-map").map((project) => project.id),
    ["stellar-map", "resonance-calibration", "lens-array", "collector-grid"]
  );
  assert.deepEqual(
    filterProjectStatuses(active, "chapter-mastery").map((project) => project.id),
    [
      "ignition-drill",
      "cruise-drill",
      "starbridge-trial",
      "stabilizer-matrix",
      "balanced-tuning"
    ]
  );
  assert.equal(filterProjectStatuses(active, "chapter-deep-infra").length, 4);
  assert.equal(filterProjectStatuses(active, "chapter-long-tail").length, 44);
  assert.deepEqual(
    filterProjectStatuses(active, "chapter-long-tail")
      .slice(0, 2)
      .map((project) => project.id),
    ["void-gate-expedition", "outer-ring-beacon"]
  );
  assert.equal(filterProjectStatuses(active, "energy-track").length, 48);
  assert.equal(filterProjectStatuses(active, "upgrade-track").length, 9);
  assert.deepEqual(
    filterProjectStatuses(active, "upgrade-track")
      .slice(0, 4)
      .map((project) => project.id),
    ["resonance-calibration", "lens-array", "collector-grid", "ignition-drill"]
  );
  assert.equal(filterProjectStatuses(active, "total-reward").length, 17);
  assert.equal(filterProjectStatuses(active, "click-reward").length, 14);
  assert.equal(filterProjectStatuses(active, "second-reward").length, 15);
  assert.equal(filterProjectStatuses(active, "overload-reward").length, 11);
  assert.deepEqual(
    filterProjectStatuses(active, "overload-reward")
      .slice(0, 3)
      .map((project) => project.id),
    ["resonance-calibration", "dark-current-observatory", "silent-light-relay"]
  );
  assert.equal(filterProjectStatuses(active, "completed").length, 5);
  assert.equal(filterProjectStatuses(active, "incomplete").length, 52);
  assert.deepEqual(filterProjectStatuses(completed, "current"), []);
  assert.deepEqual(filterProjectStatuses(completed, "current-chapter"), []);
  assert.equal(filterProjectStatuses(completed, "completed").length, 57);
});

test("星图筛选按钮会显示筛选视图完成进度", () => {
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
    totalEnergy: 122_001_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  });

  assert.equal(getProjectFilterButtonText(active, "all"), "全部 5/57");
  assert.equal(getProjectFilterButtonText(active, "current"), "当前 1");
  assert.equal(getProjectFilterButtonText(active, "current-chapter"), "本章 1/5");
  assert.equal(getProjectFilterButtonText(active, "chapter-starter-map"), "首段星图 4/4");
  assert.equal(getProjectFilterButtonText(active, "chapter-mastery"), "专精校准 1/5");
  assert.equal(getProjectFilterButtonText(active, "chapter-deep-infra"), "深空基建 0/4");
  assert.equal(getProjectFilterButtonText(active, "chapter-long-tail"), "远航长尾 0/44");
  assert.equal(getProjectFilterButtonText(active, "energy-track"), "累计 2/48");
  assert.equal(getProjectFilterButtonText(active, "upgrade-track"), "升级 3/9");
  assert.equal(getProjectFilterButtonText(active, "total-reward"), "总产能 2/17");
  assert.equal(getProjectFilterButtonText(active, "click-reward"), "点击 1/14");
  assert.equal(getProjectFilterButtonText(active, "second-reward"), "自动 1/15");
  assert.equal(getProjectFilterButtonText(active, "overload-reward"), "过载 1/11");
  assert.equal(getProjectFilterButtonText(active, "incomplete"), "未完成 52");
  assert.equal(getProjectFilterButtonText(active, "completed"), "已完成 5");
  assert.equal(getProjectFilterButtonText(completed, "current-chapter"), "本章 0");
  assert.equal(getProjectFilterButtonText(completed, "chapter-long-tail"), "远航长尾 44/44");
});

test("星图筛选摘要会显示状态、奖励、推进、章节构成和下一条航段", () => {
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
    totalEnergy: 122_001_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  });

  assert.equal(
    getProjectFilterBrief(active, "current-chapter"),
    "筛选摘要：本章 1/5 · 下一条 航段 5/57 · 专精校准 1/5 点火航校 · 剩余 4 段"
  );
  assert.equal(
    getProjectFilterBrief(active, "chapter-long-tail"),
    "筛选摘要：远航长尾 0/44 · 下一条 航段 14/57 · 远航长尾 1/44 星门远征 · 剩余 44 段"
  );
  assert.equal(
    getProjectFilterBrief(completed, "current-chapter"),
    "筛选摘要：本章 0 段 · 无匹配"
  );
  assert.equal(
    getProjectFilterSummary(active, "current-chapter"),
    "筛选视图：本章 5 段 · 已完成 1/5 · 完成率 20% · 剩余 4 段 · 状态构成 已完成 1 段 / 当前 1 段 / 待推进 3 段 · 奖励构成 总产能 3 段 / 点击 1 段 / 自动 1 段 · 推进构成 累计 1 段 / 升级 4 段 · 章节构成 专精校准 5 段 · 已领取奖励 总产能 1 段 · 待领取奖励 总产能 2 段 / 点击 1 段 / 自动 1 段 · 下一条 航段 5/57 · 专精校准 1/5 点火航校（点击产能 +16% · 进度 12 级 / 14 级 · 还差 2 级）；后续 航段 6/57 · 专精校准 2/5 巡航航校、航段 8/57 · 专精校准 4/5 稳定矩阵；终点 航段 9/57 · 专精校准 5/5 均衡校准"
  );
  assert.equal(
    getProjectFilterSummary(active, "chapter-long-tail"),
    "筛选视图：远航长尾 44 段 · 已完成 0/44 · 完成率 0% · 剩余 44 段 · 状态构成 待推进 44 段 · 奖励构成 总产能 12 段 / 点击 11 段 / 自动 11 段 / 过载 10 段 · 推进构成 累计 44 段 · 章节构成 远航长尾 44 段 · 待领取奖励 总产能 12 段 / 点击 11 段 / 自动 11 段 / 过载 10 段 · 下一条 航段 14/57 · 远航长尾 1/44 星门远征（总产能 +16% · 进度 260K 能量 / 1.5M 能量 · 还差 1.2M 能量）；后续 航段 15/57 · 远航长尾 2/44 外环信标、航段 16/57 · 远航长尾 3/44 彗尾船坞；终点 航段 57/57 · 远航长尾 44/44 星渊方舟"
  );
  assert.equal(
    getProjectFilterSummary(active, "upgrade-track"),
    "筛选视图：升级 9 段 · 已完成 3/9 · 完成率 33% · 剩余 6 段 · 状态构成 已完成 3 段 / 当前 1 段 / 待推进 5 段 · 奖励构成 总产能 3 段 / 点击 2 段 / 自动 3 段 / 过载 1 段 · 推进构成 升级 9 段 · 章节构成 首段星图 3 段 / 专精校准 4 段 / 深空基建 2 段 · 已领取奖励 点击 1 段 / 自动 1 段 / 过载 1 段 · 待领取奖励 总产能 3 段 / 点击 1 段 / 自动 2 段 · 下一条 航段 5/57 · 专精校准 1/5 点火航校（点击产能 +16% · 进度 12 级 / 14 级 · 还差 2 级）；后续 航段 6/57 · 专精校准 2/5 巡航航校、航段 8/57 · 专精校准 4/5 稳定矩阵；终点 航段 13/57 · 深空基建 4/4 恒星锚点"
  );
  assert.equal(
    getProjectFilterSummary(active, "current"),
    "筛选视图：当前 1 段 · 已完成 0/1 · 完成率 0% · 剩余 1 段 · 状态构成 当前 1 段 · 奖励构成 点击 1 段 · 推进构成 升级 1 段 · 章节构成 专精校准 1 段 · 待领取奖励 点击 1 段 · 下一条 航段 5/57 · 专精校准 1/5 点火航校（点击产能 +16% · 进度 12 级 / 14 级 · 还差 2 级）"
  );
  assert.equal(
    getProjectFilterSummary(active, "completed"),
    "筛选视图：已完成 5 段 · 全部已完成 · 完成率 100% · 剩余 0 段 · 状态构成 已完成 5 段 · 奖励构成 总产能 2 段 / 点击 1 段 / 自动 1 段 / 过载 1 段 · 推进构成 累计 2 段 / 升级 3 段 · 章节构成 首段星图 4 段 / 专精校准 1 段"
  );
  assert.equal(
    getProjectFilterSummary(completed, "current-chapter"),
    "筛选视图：本章 0 段 · 没有匹配航段"
  );
});

test("星图筛选定义包含四个章节入口", () => {
  assert.deepEqual(
    PROJECT_FILTER_DEFS.filter((filter) => filter.chapterName).map((filter) => [
      filter.id,
      filter.name,
      filter.chapterName
    ]),
    [
      ["chapter-starter-map", "首段星图", "首段星图"],
      ["chapter-mastery", "专精校准", "专精校准"],
      ["chapter-deep-infra", "深空基建", "深空基建"],
      ["chapter-long-tail", "远航长尾", "远航长尾"]
    ]
  );
});

test("星图章节视觉导航会返回章节进度和下一条目标", () => {
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
    totalEnergy: 122_001_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  });

  assert.deepEqual(
    getProjectChapterVisuals(active).map((chapter) => [
      chapter.name,
      chapter.filterId,
      chapter.progressText,
      chapter.status,
      chapter.visualClass,
      chapter.focusText,
      chapter.nextText
    ]),
    [
      ["首段星图", "chapter-starter-map", "4/4", "completed", "is-starter", "星核点亮", "已完成"],
      ["专精校准", "chapter-mastery", "1/5", "current", "is-mastery", "策略校准", "下一条 1/5 点火航校"],
      ["深空基建", "chapter-deep-infra", "0/4", "pending", "is-infra", "基建扩展", "下一条 1/4 远星中继"],
      ["远航长尾", "chapter-long-tail", "0/44", "pending", "is-long-tail", "远航航线", "下一条 1/44 星门远征"]
    ]
  );
  assert.equal(getProjectChapterVisuals(active)[1].progress, 0.2);
  assert.equal(getProjectChapterVisuals(completed)[3].status, "completed");
  assert.equal(getProjectChapterVisuals(completed)[3].nextText, "已完成");
});

test("星图总览会显示全部完成状态", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 122_001_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  };

  const overview = getProjectOverview(state);

  assert.equal(overview.completed, 57);
  assert.equal(overview.total, 57);
  assert.equal(overview.nextProjectId, null);
  assert.equal(overview.summaryText, "星图进度 57/57 · 全部航段已完成");
  assert.equal(
    overview.detailText,
    "所有星图奖励已生效，继续累计能量等待下一段航线。"
  );
  assert.equal(overview.trackText, "目标分轨：累计航段 全部完成；升级航段 全部完成");
  assert.equal(
    overview.chapterText,
    "阶段导航：首段星图 4/4 · 专精校准 5/5 · 深空基建 4/4 · 远航长尾 44/44；全部阶段完成"
  );
  assert.equal(
    overview.chapterTargetText,
    "章节目标：首段星图 已完成 · 专精校准 已完成 · 深空基建 已完成 · 远航长尾 已完成"
  );
  assert.equal(
    overview.chapterRewardText,
    "章节奖励：首段星图 总产能 1 / 点击 1 / 自动 1 / 过载 1 · 专精校准 总产能 3 / 点击 1 / 自动 1 · 深空基建 总产能 1 / 点击 1 / 自动 2 · 远航长尾 总产能 12 / 点击 11 / 自动 11 / 过载 10"
  );
  assert.equal(
    overview.rewardProgressText,
    "奖励进度：总产能 17/17 · 点击 14/14 · 自动 15/15 · 过载 11/11"
  );
  assert.equal(
    overview.rewardTargetText,
    "奖励目标：总产能 已完成 · 点击 已完成 · 自动 已完成 · 过载 已完成"
  );
  assert.equal(
    overview.milestoneText,
    "里程碑：全部章节已完成 · 终局航点 星渊方舟已完成"
  );
  assert.equal(
    overview.routeFocusText,
    "航线焦点：均衡航线 -> 均衡校准（总产能 +14% · 已完成）"
  );
  assert.equal(
    overview.bonusText,
    "生效加成：总产能 x25.30 · 点击 x14.71 · 自动 x19.98 · 过载 x8.56"
  );
  assert.equal(
    overview.actionText,
    "行动建议：所有航段完成，继续累计能量等待下一段航线。"
  );
  assert.equal(overview.forecastText, "航线预告：等待下一段航线");
  assert.equal(
    overview.compositionText,
    "航线构成：48 个累计航段 · 9 个升级航段 · 奖励分布 总产能 17 段 / 点击 14 段 / 自动 15 段 / 过载 11 段"
  );
});

test("星图阶段导航会显示最终阶段余量", () => {
  const overview = getProjectOverview({
    ...createInitialState(0),
    totalEnergy: 66_000_000,
    overloadBonus: 17,
    upgrades: {
      lens: 14,
      collector: 16,
      resonator: 6,
      stabilizer: 16
    }
  });

  assert.equal(
    overview.chapterText,
    "阶段导航：首段星图 4/4 · 专精校准 5/5 · 深空基建 4/4 · 远航长尾 17/44；当前 远航长尾 18/44 · 航段 31/57 晨渊观星台 · 本阶段还剩 27 段 · 最终阶段"
  );
});

test("反馈入口会生成带游戏快照的 GitHub Issue 链接", () => {
  const state = {
    ...createInitialState(0),
    energy: 42,
    totalEnergy: 80,
    energyPerSecond: 0.7,
    routeStance: "ignition",
    directiveMastery: {
      stacks: 2,
      expiresAt: 60_000
    },
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
  assert.match(body, new RegExp(`指令熟练：2/${DIRECTIVE_MASTERY_MAX_STACKS}`));
  assert.match(body, /远航调度：累计 20M 能量后解锁后半段航段调度/);
  assert.match(body, /lens:1/);
});

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
  FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE,
  FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE,
  FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE,
  FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE,
  FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS,
  FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE,
  FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER,
  FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE,
  FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE,
  FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER,
  FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE,
  FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE,
  FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE,
  FAR_ROUTE_DISPATCH_LOOP_STREAK_CAPSTONE_RATE,
  FAR_ROUTE_DISPATCH_LOOP_STREAK_MAX_STACKS,
  FAR_ROUTE_DISPATCH_LOOP_STREAK_REWARD_STEP,
  FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE,
  FAR_ROUTE_DISPATCH_PREP_REWARD_RATE,
  FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE,
  FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE,
  FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE,
  FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE,
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
  PROJECT_CHAPTER_HERO_NODE_LIMIT,
  getProjectChapterVisuals,
  getProjectCurrentVisual,
  getProjectForecastVisuals,
  getProjectListWindow,
  getProjectOverview,
  getProjectRewardVisuals,
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
  const unlockedState = {
    ...createInitialState(0),
    totalEnergy: 100_000,
    energyPerClick: 10,
    energyPerSecond: 5,
    overloadBonus: 7
  };
  const unlocked = getDirectiveStatus(unlockedState, 0);

  assert.equal(locked.unlocked, false);
  assert.equal(locked.options[0].disabled, true);
  assert.equal(locked.options[0].previewText, "累计 100K 能量后解锁航线指令");
  assert.equal(unlocked.unlocked, true);
  assert.equal(unlocked.options[0].ready, true);
  assert.equal(unlocked.options[0].cooldownProgress, 1);
  assert.equal(unlocked.options[0].cooling, false);
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

  const used = activateDirective(unlockedState, "ignition-salvo", 1_000).state;
  const cooling = getDirectiveStatus(used, 11_000).options[0];

  assert.equal(cooling.ready, false);
  assert.equal(cooling.cooling, true);
  assert.equal(cooling.cooldownProgress, 0.2857);
  assert.equal(cooling.statusText, "冷却 25 秒");
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

test("星图奖励罗盘会返回四类奖励进度", () => {
  const projects = getProjectStatuses(createInitialState(0));
  const rewardVisuals = getProjectRewardVisuals(projects);
  const overview = getProjectOverview(createInitialState(0));

  assert.equal(rewardVisuals.length, 4);
  assert.deepEqual(
    rewardVisuals.map((reward) => reward.id),
    ["total", "click", "second", "overload"]
  );
  assert.equal(rewardVisuals[0].label, "总产能");
  assert.equal(rewardVisuals[0].progressText, "0/17");
  assert.equal(rewardVisuals[0].nextText, "下一条 1/57 点亮星图");
  assert.equal(rewardVisuals[0].status, "current");
  assert.equal(rewardVisuals[1].progressText, "0/14");
  assert.equal(rewardVisuals[1].nextText, "下一条 3/57 透镜阵列");
  assert.equal(rewardVisuals[2].progressText, "0/15");
  assert.equal(rewardVisuals[2].nextText, "下一条 4/57 采集阵列");
  assert.equal(rewardVisuals[3].progressText, "0/11");
  assert.equal(rewardVisuals[3].nextText, "下一条 2/57 谐振校准");
  assert.equal(overview.rewardVisuals.length, 4);
  assert.equal(overview.rewardVisuals[0].title, "总产能奖励 0/17 · 下一条 1/57 点亮星图");
});

test("星图航线预告会返回三段视觉槽", () => {
  const projects = getProjectStatuses(createInitialState(0));
  const forecastVisuals = getProjectForecastVisuals(projects);
  const overview = getProjectOverview(createInitialState(0));

  assert.equal(forecastVisuals.length, 3);
  assert.deepEqual(
    forecastVisuals.map((project) => project.id),
    ["stellar-map", "resonance-calibration", "lens-array"]
  );
  assert.equal(forecastVisuals[0].segmentText, "航段 1/57");
  assert.equal(forecastVisuals[0].chapterText, "首段星图 1/4");
  assert.equal(forecastVisuals[0].trackId, "energy");
  assert.equal(forecastVisuals[0].rewardId, "total");
  assert.equal(forecastVisuals[0].status, "current");
  assert.equal(forecastVisuals[1].trackId, "upgrade");
  assert.equal(forecastVisuals[1].rewardId, "overload");
  assert.equal(forecastVisuals[2].rewardId, "click");
  assert.equal(
    forecastVisuals[0].title,
    "航线预告 1：航段 1/57 · 首段星图 1/4 点亮星图 · 总产能 +12% · 进度 0 能量 / 100K 能量 · 还差 100K 能量"
  );
  assert.equal(overview.forecastVisuals.length, 3);
  assert.equal(overview.forecastVisuals[2].name, "透镜阵列");
});

test("星图当前航段视觉会返回当前目标槽", () => {
  const projects = getProjectStatuses(createInitialState(0));
  const currentVisual = getProjectCurrentVisual(projects);
  const overview = getProjectOverview(createInitialState(0));

  assert.equal(currentVisual.id, "stellar-map");
  assert.equal(currentVisual.name, "点亮星图");
  assert.equal(currentVisual.segmentText, "航段 1/57");
  assert.equal(currentVisual.chapterText, "首段星图 1/4");
  assert.equal(currentVisual.trackId, "energy");
  assert.equal(currentVisual.trackText, "累计航段");
  assert.equal(currentVisual.rewardId, "total");
  assert.equal(currentVisual.status, "current");
  assert.equal(
    currentVisual.title,
    "当前航段：航段 1/57 · 首段星图 1/4 点亮星图 · 累计航段 · 总产能 +12% · 进度 0 能量 / 100K 能量 · 还差 100K 能量"
  );
  assert.equal(overview.currentVisual.id, "stellar-map");
  assert.equal(overview.currentVisual.trackText, "累计航段");
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

test("静态首页会渲染星图奖励罗盘", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="projectRewardMap" class="project-reward-map"/);
  assert.match(indexHtml, /aria-label="星图奖励罗盘"/);
  assert.match(indexHtml, /project-reward-tile project-reward-total is-current/);
  assert.match(indexHtml, /project-reward-tile project-reward-click is-pending/);
  assert.match(indexHtml, /总产能奖励 0\/17 · 下一条 1\/57 点亮星图/);
  assert.match(indexHtml, /过载奖励 0\/11 · 下一条 2\/57 谐振校准/);
  assert.match(appJs, /getProjectRewardVisuals/);
  assert.match(appJs, /projectRewardMap: document\.querySelector\("#projectRewardMap"\)/);
  assert.match(appJs, /function renderProjectRewardMap\(rewards\)/);
  assert.match(appJs, /function renderProjectRewardTile\(reward\)/);
  assert.match(appJs, /project-reward-tile/);
  assert.match(styles, /\.project-reward-map/);
  assert.match(styles, /\.project-reward-tile/);
  assert.match(styles, /\.project-reward-icon/);
  assert.match(styles, /\.project-reward-meter/);
  assert.match(styles, /\.project-reward-overload \.project-reward-icon/);
});

test("静态首页会渲染当前航段视觉卡", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="projectCurrentVisual" class="project-current-visual is-current is-track-energy is-reward-total"/);
  assert.match(indexHtml, /当前航段：航段 1\/57 · 首段星图 1\/4 点亮星图 · 累计航段 · 总产能 \+12%/);
  assert.match(indexHtml, /class="project-current-orbit"/);
  assert.match(indexHtml, /class="project-current-meter"/);
  assert.match(appJs, /getProjectCurrentVisual/);
  assert.match(appJs, /projectCurrentVisual: document\.querySelector\("#projectCurrentVisual"\)/);
  assert.match(appJs, /function renderProjectCurrentVisual\(project\)/);
  assert.match(appJs, /project-current-visual/);
  assert.match(appJs, /project\.dispatchBadgeText \? "is-dispatch-active" : ""/);
  assert.match(appJs, /project-current-dispatch/);
  assert.match(styles, /\.project-current-visual/);
  assert.match(styles, /\.project-current-orbit/);
  assert.match(styles, /\.project-current-track/);
  assert.match(styles, /\.project-current-track \.project-current-dispatch/);
  assert.match(styles, /\.project-current-visual\.is-dispatch-active/);
  assert.match(styles, /\.project-current-meter/);
  assert.match(styles, /\.project-current-visual\.is-reward-overload/);
});

test("静态首页会渲染航线预告视觉带", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="projectForecastMap" class="project-forecast-map"/);
  assert.match(indexHtml, /aria-label="航线预告视觉带"/);
  assert.match(indexHtml, /project-forecast-tile is-current is-track-energy is-reward-total/);
  assert.match(indexHtml, /project-forecast-tile is-pending is-track-upgrade is-reward-overload/);
  assert.match(indexHtml, /project-forecast-tile is-pending is-track-upgrade is-reward-click/);
  assert.match(indexHtml, /航线预告 1：航段 1\/57 · 首段星图 1\/4 点亮星图/);
  assert.match(appJs, /getProjectForecastVisuals/);
  assert.match(appJs, /projectForecastMap: document\.querySelector\("#projectForecastMap"\)/);
  assert.match(appJs, /function renderProjectForecastMap\(projects\)/);
  assert.match(appJs, /function renderProjectForecastTile\(project\)/);
  assert.match(appJs, /project-forecast-tile/);
  assert.match(styles, /\.project-forecast-map/);
  assert.match(styles, /\.project-forecast-tile/);
  assert.match(styles, /\.project-forecast-path/);
  assert.match(styles, /\.project-forecast-meter/);
  assert.match(styles, /\.project-forecast-tile\.is-reward-overload/);
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
  assert.match(indexHtml, /project-chapter-scene/);
  assert.match(indexHtml, /project-chapter-scene-track/);
  assert.match(indexHtml, /project-chapter-scene-gate/);
  assert.match(indexHtml, /project-chapter-scene-signal/);
  assert.match(indexHtml, /project-chapter-emblem/);
  assert.match(indexHtml, /<span class="project-chapter-focus">远航航线<\/span>/);
  assert.match(indexHtml, /<span class="project-chapter-next">下一条 1\/44 星门远征<\/span>/);
  assert.match(appJs, /getProjectChapterVisuals/);
  assert.match(appJs, /function renderProjectChapterMap\(chapters\)/);
  assert.match(appJs, /projectChapterMap: document\.querySelector\("#projectChapterMap"\)/);
  assert.match(appJs, /chapter\.visualClass/);
  assert.match(appJs, /chapter\.focusText/);
  assert.match(appJs, /scene\.className = "project-chapter-scene"/);
  assert.match(appJs, /sceneTrack\.className = "project-chapter-scene-track"/);
  assert.match(appJs, /sceneGate\.className = "project-chapter-scene-gate"/);
  assert.match(appJs, /sceneSignal\.className = "project-chapter-scene-signal"/);
  assert.match(appJs, /projectFilter = chapter\.filterId/);
  assert.match(styles, /\.project-chapter-map/);
  assert.match(styles, /\.project-chapter-tile/);
  assert.match(styles, /\.project-chapter-visual/);
  assert.match(styles, /\.project-chapter-scene/);
  assert.match(styles, /\.project-chapter-scene-track/);
  assert.match(styles, /\.project-chapter-scene-gate/);
  assert.match(styles, /\.project-chapter-scene-signal/);
  assert.match(styles, /\.project-chapter-visual\.is-long-tail \.project-chapter-scene/);
  assert.match(styles, /\.project-chapter-emblem/);
  assert.match(styles, /\.project-chapter-focus/);
});

test("星图视觉航线会渲染当前章节大图景", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="projectChapterHero"/);
  assert.match(indexHtml, /class="project-chapter-hero is-starter is-current"/);
  assert.match(indexHtml, /当前章节：首段星图 0\/4 · 星核点亮 · 下一条 1\/4 点亮星图/);
  assert.match(indexHtml, /project-chapter-hero-scene/);
  assert.match(indexHtml, /project-chapter-hero-lane/);
  assert.match(indexHtml, /project-chapter-hero-gate/);
  assert.match(indexHtml, /project-chapter-hero-signal/);
  assert.match(indexHtml, /project-chapter-hero-beacon/);
  assert.match(indexHtml, /project-chapter-hero-route/);
  assert.match(indexHtml, /project-chapter-hero-node is-current/);
  assert.match(indexHtml, /project-chapter-hero-meter/);
  assert.match(appJs, /projectChapterHero: document\.querySelector\("#projectChapterHero"\)/);
  assert.match(appJs, /function renderProjectChapterHero\(chapters\)/);
  assert.match(appJs, /function renderProjectChapterHeroNode\(node\)/);
  assert.match(appJs, /function getActiveProjectChapter\(chapters\)/);
  assert.match(appJs, /renderProjectChapterHero\(projectChapters\)/);
  assert.match(appJs, /"project-chapter-hero"/);
  assert.match(appJs, /chapter\.visualClass/);
  assert.match(appJs, /chapter\.heroNodes\.map\(renderProjectChapterHeroNode\)/);
  assert.match(appJs, /scene\.className = "project-chapter-hero-scene"/);
  assert.match(appJs, /lane\.className = "project-chapter-hero-lane"/);
  assert.match(appJs, /gate\.className = "project-chapter-hero-gate"/);
  assert.match(appJs, /signal\.className = "project-chapter-hero-signal"/);
  assert.match(appJs, /beacon\.className = "project-chapter-hero-beacon"/);
  assert.match(styles, /\.project-chapter-hero/);
  assert.match(styles, /\.project-chapter-hero-scene/);
  assert.match(styles, /\.project-chapter-hero-lane/);
  assert.match(styles, /\.project-chapter-hero-gate/);
  assert.match(styles, /\.project-chapter-hero-signal/);
  assert.match(styles, /\.project-chapter-hero-beacon/);
  assert.match(styles, /\.project-chapter-hero-route/);
  assert.match(styles, /\.project-chapter-hero-node\.is-current/);
  assert.match(styles, /\.project-chapter-hero-node\.is-completed/);
  assert.match(styles, /\.project-chapter-hero\.is-long-tail \.project-chapter-hero-scene/);
  assert.match(styles, /\.project-chapter-hero-meter/);
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

test("静态首页会引用航线指令插画资产", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const asset = readFileSync(
    new URL("../src/assets/directive-visual.svg", import.meta.url),
    "utf8"
  );

  assert.match(indexHtml, /directive-scene-image/);
  assert.match(indexHtml, /src="\.\/src\/assets\/directive-visual\.svg"/);
  assert.match(indexHtml, /点火齐射、巡航回收、谐振脉冲和三步轮换组成的航线指令插画/);
  assert.match(styles, /\.directive-scene-image/);
  assert.match(asset, /星核工坊航线指令插画/);
  assert.match(asset, /routeBeam/);
});

test("顶部产能读数卡片提供视觉徽记", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /score-card score-card-energy/);
  assert.match(indexHtml, /score-icon score-icon-energy/);
  assert.match(indexHtml, /score-card score-card-second/);
  assert.match(indexHtml, /score-icon score-icon-second/);
  assert.match(indexHtml, /score-card score-card-click/);
  assert.match(indexHtml, /score-icon score-icon-click/);
  assert.match(indexHtml, /score-card score-card-overload/);
  assert.match(indexHtml, /score-icon score-icon-overload/);
  assert.match(styles, /\.score-card::before/);
  assert.match(styles, /\.score-icon/);
  assert.match(styles, /\.score-icon svg/);
  assert.match(styles, /\.score-card-second \.score-icon/);
  assert.match(styles, /\.score-card-click \.score-icon/);
  assert.match(styles, /\.score-card-overload \.score-icon/);
});

test("当前目标条提供视觉徽记", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /class="goal-strip"/);
  assert.match(indexHtml, /class="goal-visual"/);
  assert.match(indexHtml, /class="goal-copy"/);
  assert.match(indexHtml, /id="goalLabel"/);
  assert.match(indexHtml, /id="goalValue"/);
  assert.match(indexHtml, /id="goalHint" class="goal-hint"/);
  assert.match(indexHtml, /id="goalMeter"/);
  assert.match(styles, /\.goal-strip \{/);
  assert.match(styles, /grid-template-columns: 54px minmax\(0, 1fr\)/);
  assert.match(styles, /\.goal-visual/);
  assert.match(styles, /\.goal-visual::before/);
  assert.match(styles, /\.goal-visual svg/);
  assert.match(styles, /\.goal-copy/);
  assert.match(styles, /\.goal-copy span/);
  assert.match(styles, /grid-column: 1 \/ -1/);
});

test("主操作行动提示提供视觉短标", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="offlineNotice" class="offline-notice"/);
  assert.match(indexHtml, /id="actionNotice" class="action-notice"/);
  assert.match(styles, /\.offline-notice \{/);
  assert.match(styles, /\.action-notice \{/);
  assert.match(styles, /grid-template-columns: 30px minmax\(0, 1fr\)/);
  assert.match(styles, /\.offline-notice::before,\n\.action-notice::before/);
  assert.match(styles, /\.offline-notice::before/);
  assert.match(styles, /\.action-notice\[hidden\]/);
  assert.match(styles, /\.offline-notice\[hidden\]/);
});

test("点火按钮会渲染点击反馈和过载前兆效果", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="coreButton" class="core-button" type="button" data-combo-step="0"/);
  assert.match(indexHtml, /class="core-feedback-layer"/);
  assert.match(indexHtml, /class="core-stage-aura"/);
  assert.match(indexHtml, /class="core-surge-orbit"/);
  assert.match(indexHtml, /id="coreImpactPoint" class="core-impact-point"/);
  assert.match(indexHtml, /id="coreImpactRipple" class="core-impact-ripple"/);
  assert.match(indexHtml, /id="coreImpactSparks" class="core-impact-sparks"/);
  assert.match(indexHtml, /id="coreImpactBurst" class="core-impact-burst"/);
  assert.match(indexHtml, /class="core-charge-ring"/);
  assert.match(indexHtml, /id="coreGainPop" class="core-gain-pop"/);
  assert.match(indexHtml, /class="core-veins"/);
  assert.match(indexHtml, /class="core-vein core-vein-a"/);
  assert.match(indexHtml, /id="coreOverloadBadge" class="core-overload-badge"/);
  assert.match(indexHtml, /id="coreOverloadBadgeValue">8<\/strong>/);
  assert.match(indexHtml, /class="core-combo-track"/);
  assert.match(indexHtml, /id="coreRewardHint" class="core-reward-hint"/);
  assert.match(indexHtml, /class="feedback-toggle-list"/);
  assert.match(indexHtml, /class="feedback-toggle sound-toggle"/);
  assert.match(indexHtml, /id="soundToggle" type="checkbox" checked/);
  assert.match(indexHtml, /class="feedback-toggle-icon feedback-toggle-icon-sound"/);
  assert.match(indexHtml, /点火音效/);
  assert.match(indexHtml, /class="feedback-toggle haptic-toggle"/);
  assert.match(indexHtml, /id="hapticToggle" type="checkbox" checked/);
  assert.match(indexHtml, /class="feedback-toggle-icon feedback-toggle-icon-haptic"/);
  assert.match(indexHtml, /触感反馈/);
  assert.match(indexHtml, /class="core-label">点火<\/span>/);
  assert.match(appJs, /getCoreRewardPreview/);
  assert.match(appJs, /const SOUND_KEY = "codex-game-operator\.sound-enabled"/);
  assert.match(appJs, /const HAPTIC_KEY = "codex-game-operator\.haptic-enabled"/);
  assert.match(appJs, /soundToggle: document\.querySelector\("#soundToggle"\)/);
  assert.match(appJs, /hapticToggle: document\.querySelector\("#hapticToggle"\)/);
  assert.match(appJs, /let soundEnabled = loadSoundPreference\(\)/);
  assert.match(appJs, /let hapticEnabled = loadHapticPreference\(\)/);
  assert.match(appJs, /elements\.soundToggle\.checked = soundEnabled/);
  assert.match(appJs, /elements\.hapticToggle\.checked = hapticEnabled/);
  assert.match(appJs, /elements\.soundToggle\.addEventListener\("change"/);
  assert.match(appJs, /recordEvent\("sound_toggle"/);
  assert.match(appJs, /elements\.hapticToggle\.addEventListener\("change"/);
  assert.match(appJs, /recordEvent\("haptic_toggle"/);
  assert.match(appJs, /function renderCoreFeedback\(combo\)/);
  assert.match(appJs, /coreStageAura: document\.querySelector\("#coreButton \.core-stage-aura"\)/);
  assert.match(appJs, /elements\.coreStageAura\.style\.setProperty\(\s*"--core-stage-angle"/);
  assert.match(appJs, /elements\.coreStageAura\.classList\.toggle\(\s+"is-stage-hot"/);
  assert.match(appJs, /coreChargeRing: document\.querySelector\("#coreButton \.core-charge-ring"\)/);
  assert.match(appJs, /coreImpactPoint: document\.querySelector\("#coreImpactPoint"\)/);
  assert.match(appJs, /coreImpactRipple: document\.querySelector\("#coreImpactRipple"\)/);
  assert.match(appJs, /coreImpactSparks: document\.querySelector\("#coreImpactSparks"\)/);
  assert.match(appJs, /coreImpactBurst: document\.querySelector\("#coreImpactBurst"\)/);
  assert.match(appJs, /elements\.coreChargeRing\.style\.setProperty\(\s*"--core-charge-angle"/);
  assert.match(appJs, /Math\.round\(combo\.progress \* 360\) \+ "deg"/);
  assert.match(appJs, /elements\.coreChargeRing\.classList\.toggle\("is-overload-ready", isOverloadReady\)/);
  assert.match(appJs, /coreGainPop: document\.querySelector\("#coreGainPop"\)/);
  assert.match(appJs, /let coreEnergyHitTimer = 0/);
  assert.match(appJs, /let coreOverloadReadoutTimer = 0/);
  assert.match(appJs, /coreOverloadBadge: document\.querySelector\("#coreOverloadBadge"\)/);
  assert.match(appJs, /coreOverloadBadgeValue: document\.querySelector\("#coreOverloadBadgeValue"\)/);
  assert.match(appJs, /let coreComboHitTimer = 0/);
  assert.match(appJs, /const comboStatus = getComboStatus\(state\)/);
  assert.match(appJs, /comboStep: comboStatus\.step/);
  assert.match(appJs, /gainText: "\+" \+ formatNumber\(state\.lastGain\)/);
  assert.match(appJs, /elements\.coreGainPop\.textContent = gainText/);
  assert.match(appJs, /elements\.coreGainPop\.classList\.add\("is-showing"\)/);
  assert.match(appJs, /elements\.coreGainPop\.classList\.toggle\("is-overload-gain", overloaded\)/);
  assert.match(appJs, /elements\.energy\.classList\.remove\("is-core-hit", "is-core-overload-hit"\)/);
  assert.match(appJs, /elements\.energy\.classList\.add\(overloaded \? "is-core-overload-hit" : "is-core-hit"\)/);
  assert.match(appJs, /elements\.energy\.classList\.remove\("is-core-hit", "is-core-overload-hit"\)/);
  assert.match(appJs, /elements\.overload\.classList\.remove\("is-core-overload-prize"\)/);
  assert.match(appJs, /elements\.overload\.classList\.add\("is-core-overload-prize"\)/);
  assert.match(appJs, /elements\.overload\.classList\.remove\("is-core-overload-prize"\)/);
  assert.match(appJs, /highlightCoreComboHit\(comboStep, overloaded\)/);
  assert.match(appJs, /function highlightCoreComboHit\(comboStep, overloaded = false\)/);
  assert.match(appJs, /hitDot\.classList\.add\("is-hit"\)/);
  assert.match(appJs, /overloaded \? 620 : 460/);
  assert.match(appJs, /function renderCoreComboTrack\(combo\)/);
  assert.match(appJs, /function renderCoreRewardHint\(coreReward\)/);
  assert.match(appJs, /playCoreSound\(\{ overloaded \}\)/);
  assert.match(appJs, /function playCoreSound\(\{ overloaded = false \} = \{\}\)/);
  assert.match(appJs, /playCoreHaptic\(\{ overloaded \}\)/);
  assert.match(appJs, /function playCoreHaptic\(\{ overloaded = false \} = \{\}\)/);
  assert.match(appJs, /navigator\.vibrate\(overloaded \? \[18, 22, 34\] : 12\)/);
  assert.match(appJs, /elements\.coreButton\.addEventListener\("pointerdown", pressCoreButton\)/);
  assert.match(appJs, /elements\.coreButton\.addEventListener\("pointercancel", releaseCoreButton\)/);
  assert.match(appJs, /elements\.coreButton\.addEventListener\("keydown"/);
  assert.match(appJs, /function pressCoreButton\(event\)/);
  assert.match(appJs, /elements\.coreButton\.classList\.add\("is-pressing"\)/);
  assert.match(appJs, /function releaseCoreButton\(\)/);
  assert.match(appJs, /elements\.coreButton\.classList\.remove\("is-pressing"\)/);
  assert.match(appJs, /event\.key === " " \|\| event\.key === "Enter"/);
  assert.match(appJs, /function positionCoreImpact\(event\)/);
  assert.match(appJs, /typeof event\?\.pointerType === "string"/);
  assert.match(appJs, /isPointerEvent \|\| event\.detail !== 0/);
  assert.match(appJs, /"--core-recoil-x"/);
  assert.match(appJs, /"--core-recoil-y"/);
  assert.match(appJs, /const recoilX = Math\.round/);
  assert.match(appJs, /"--core-gain-x"/);
  assert.match(appJs, /"--core-gain-y"/);
  assert.match(appJs, /"--core-impact-x"/);
  assert.match(appJs, /"--core-impact-y"/);
  assert.match(appJs, /elements\.coreImpactPoint\.classList\.add\("is-showing"\)/);
  assert.match(appJs, /elements\.coreImpactPoint\.classList\.toggle\("is-overload-impact", overloaded\)/);
  assert.match(appJs, /elements\.coreImpactRipple\.classList\.add\("is-showing"\)/);
  assert.match(appJs, /elements\.coreImpactRipple\.classList\.toggle\("is-overload-impact", overloaded\)/);
  assert.match(appJs, /elements\.coreImpactSparks\.classList\.add\("is-showing"\)/);
  assert.match(appJs, /elements\.coreImpactSparks\.classList\.toggle\("is-overload-impact", overloaded\)/);
  assert.match(appJs, /elements\.coreImpactBurst\.classList\.add\("is-showing"\)/);
  assert.match(appJs, /elements\.coreImpactBurst\.classList\.toggle\("is-overload-impact", overloaded\)/);
  assert.match(appJs, /window\.AudioContext \?\? window\.webkitAudioContext/);
  assert.match(appJs, /context\.createOscillator\(\)/);
  assert.match(appJs, /frequency: 392/);
  assert.match(appJs, /elements\.coreOverloadBadgeValue\.textContent = combo\.overloaded/);
  assert.match(appJs, /elements\.coreOverloadBadge\.classList\.toggle\("is-countdown-active", isCharging\)/);
  assert.match(appJs, /elements\.coreOverloadBadge\.classList\.toggle\("is-overload-ready", isOverloadReady\)/);
  assert.match(appJs, /elements\.coreButton\.dataset\.comboStep = String\(combo\.step\)/);
  assert.match(appJs, /const surgeIntensity = combo\.overloaded \? 1 : combo\.progress/);
  assert.match(appJs, /"--core-surge-opacity"/);
  assert.match(appJs, /"--core-surge-scale"/);
  assert.match(appJs, /"--core-surge-speed"/);
  assert.match(appJs, /Math\.round\(\(0\.88 \+ surgeIntensity \* 0\.12\) \* 100\) \/ 100/);
  assert.match(appJs, /Math\.max\(900, Math\.round\(3200 - surgeIntensity \* 1900\)\) \+ "ms"/);
  assert.match(appJs, /const veinIntensity = combo\.overloaded \? 1 : combo\.progress/);
  assert.match(appJs, /"--core-vein-opacity"/);
  assert.match(appJs, /"--core-vein-dash-offset"/);
  assert.match(appJs, /Math\.round\(\(1 - veinIntensity\) \* 34\)/);
  assert.match(appJs, /"--core-combo-progress"/);
  assert.match(appJs, /Math\.round\(combo\.progress \* 100\) \+ "%"/);
  assert.match(appJs, /dot\.classList\.toggle\("is-filled", combo\.step >= step\)/);
  assert.match(appJs, /dot\.classList\.toggle\("is-next", !combo\.overloaded && combo\.step \+ 1 === step\)/);
  assert.match(appJs, /is-combo-charging/);
  assert.match(appJs, /is-overload-ready/);
  assert.match(appJs, /is-overload-hit/);
  assert.match(appJs, /is-overload-impact/);
  assert.match(appJs, /window\.setTimeout/);
  assert.match(styles, /\.core-button::before/);
  assert.match(styles, /touch-action: manipulation/);
  assert.match(styles, /\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\)::after/);
  assert.match(styles, /coreIdleInviteRing 2200ms ease-in-out infinite/);
  assert.match(styles, /\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\) \+ \.core-reward-hint:not\(\.is-overload-ready\):not\(\.is-overload-hit\)/);
  assert.match(styles, /coreRewardHintIdleBeacon 2600ms ease-in-out infinite/);
  assert.match(styles, /\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\):hover \+ \.core-reward-hint:not\(\.is-overload-ready\):not\(\.is-overload-hit\)/);
  assert.match(styles, /\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-label/);
  assert.match(styles, /coreLabelIdleBeacon 2400ms ease-in-out infinite/);
  assert.match(styles, /\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\):hover[\s\S]*\.core-label/);
  assert.match(styles, /\.core-button\.is-pressing/);
  assert.match(styles, /\.core-button\.is-pressing::before/);
  assert.match(styles, /\.core-button\.is-pressing \.core-surge-orbit/);
  assert.match(styles, /animation-duration: 1100ms/);
  assert.match(styles, /\.core-feedback-layer/);
  assert.match(styles, /\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-feedback-layer/);
  assert.match(styles, /coreFeedbackIdleBeacon 3000ms ease-in-out infinite/);
  assert.match(styles, /\.core-button\.is-pulsing:not\(\.is-overload-impact\)/);
  assert.match(styles, /coreButtonHitGlow 360ms ease-out/);
  assert.match(styles, /\.core-button\.is-overload-impact/);
  assert.match(styles, /coreButtonOverloadGlow 520ms ease-out/);
  assert.match(styles, /\.core-stage-aura/);
  assert.match(styles, /--core-stage-angle/);
  assert.match(styles, /\.core-stage-aura\.is-stage-hot/);
  assert.match(styles, /\.core-stage-aura\.is-overload-ready/);
  assert.match(styles, /\.core-button\.is-pulsing:not\(\.is-overload-impact\) \.core-stage-aura/);
  assert.match(styles, /coreStageHitFlash 360ms ease-out/);
  assert.match(styles, /\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-stage-aura/);
  assert.match(styles, /coreStageIdleBeacon 2800ms ease-in-out infinite/);
  assert.match(styles, /--core-surge-opacity/);
  assert.match(styles, /--core-surge-scale/);
  assert.match(styles, /--core-surge-speed/);
  assert.match(styles, /\.core-surge-orbit/);
  assert.match(styles, /\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-surge-orbit/);
  assert.match(styles, /coreSurgeIdleBeacon 2600ms ease-in-out infinite/);
  assert.match(styles, /\.core-button\.is-overload-ready \.core-surge-orbit/);
  assert.match(styles, /\.core-button\.is-overload-hit \.core-surge-orbit/);
  assert.match(styles, /\.core-impact-point/);
  assert.match(styles, /--core-recoil-x/);
  assert.match(styles, /--core-recoil-y/);
  assert.match(styles, /translate\(var\(--core-recoil-x\), var\(--core-recoil-y\)\) scale\(0\.97\)/);
  assert.match(styles, /--core-impact-x/);
  assert.match(styles, /--core-impact-y/);
  assert.match(styles, /\.core-button\.is-pressing \.core-impact-point/);
  assert.match(styles, /drop-shadow\(0 0 16px rgba\(255, 247, 194, 0\.34\)\)/);
  assert.match(styles, /\.core-impact-point\.is-overload-impact/);
  assert.match(styles, /\.core-impact-ripple/);
  assert.match(styles, /\.core-button\.is-pressing \.core-impact-ripple/);
  assert.match(styles, /transform: translate\(-50%, -50%\) scale\(0\.5\)/);
  assert.match(styles, /\.core-impact-ripple\.is-overload-impact/);
  assert.match(styles, /@keyframes coreImpactRipple/);
  assert.match(styles, /\.core-impact-sparks/);
  assert.match(styles, /\.core-button\.is-pressing \.core-impact-sparks/);
  assert.match(styles, /rotate\(18deg\)/);
  assert.match(styles, /\.core-impact-sparks\.is-overload-impact/);
  assert.match(styles, /@keyframes coreImpactSparks/);
  assert.match(styles, /\.core-impact-burst/);
  assert.match(styles, /\.core-impact-burst\.is-showing/);
  assert.match(styles, /\.core-impact-burst\.is-overload-impact/);
  assert.match(styles, /@keyframes coreImpactBurst/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-impact-burst\.is-showing[\s\S]*animation: none/);
  assert.match(styles, /\.core-charge-ring/);
  assert.match(styles, /--core-charge-angle/);
  assert.match(styles, /\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-charge-ring/);
  assert.match(styles, /coreChargeRingIdleBeacon 2600ms ease-in-out infinite/);
  assert.match(styles, /\.core-button\.is-pulsing \.core-charge-ring/);
  assert.match(styles, /coreChargeRingHit 360ms ease-out/);
  assert.match(styles, /\.core-button\.is-overload-impact \.core-charge-ring/);
  assert.match(styles, /coreChargeRingOverloadHit 520ms ease-out/);
  assert.match(styles, /\.core-charge-ring\.is-overload-ready/);
  assert.match(styles, /\.core-gain-pop/);
  assert.match(styles, /--core-gain-x/);
  assert.match(styles, /--core-gain-y/);
  assert.match(styles, /left: clamp\(56px, var\(--core-gain-x\), calc\(100% - 56px\)\)/);
  assert.match(styles, /top: clamp\(44px, calc\(var\(--core-gain-y\) - 28px\), calc\(100% - 54px\)\)/);
  assert.match(styles, /\.core-gain-pop::after/);
  assert.match(styles, /\.core-gain-pop\.is-showing/);
  assert.match(styles, /\.core-gain-pop\.is-showing::after/);
  assert.match(styles, /coreGainPopHalo 620ms ease-out/);
  assert.match(styles, /\.core-gain-pop\.is-overload-gain/);
  assert.match(styles, /\.core-gain-pop\.is-overload-gain\.is-showing::after/);
  assert.match(styles, /coreGainPopOverloadHalo 760ms ease-out/);
  assert.match(styles, /\.core-overload-badge/);
  assert.match(styles, /\.core-overload-badge\.is-countdown-active/);
  assert.match(styles, /\.core-overload-badge\.is-overload-ready/);
  assert.match(styles, /\.core-overload-badge\.is-overload-hit/);
  assert.match(styles, /\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-overload-badge/);
  assert.match(styles, /coreBadgeIdleBeacon 2400ms ease-in-out infinite/);
  assert.match(styles, /\.core-button\.is-pulsing:not\(\.is-overload-impact\) \.core-overload-badge/);
  assert.match(styles, /coreBadgeStepHit 360ms ease-out/);
  assert.match(styles, /\.core-combo-track/);
  assert.match(styles, /--core-combo-progress/);
  assert.match(styles, /\.core-combo-track::before/);
  assert.match(styles, /transform-origin: left center/);
  assert.match(styles, /\.core-combo-track\.is-overload-ready::before/);
  assert.match(styles, /\.core-combo-track\.is-overload-hit::before/);
  assert.match(styles, /\.core-button\.is-pulsing:not\(\.is-overload-impact\) \.core-combo-track::before/);
  assert.match(styles, /coreComboTrackHitSweep 360ms ease-out/);
  assert.match(styles, /\.core-button\.is-overload-impact \.core-combo-track::before/);
  assert.match(styles, /coreComboTrackOverloadSweep 520ms ease-out/);
  assert.match(styles, /\.core-combo-dot\.is-next/);
  assert.match(styles, /\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-combo-dot\.is-next/);
  assert.match(styles, /coreComboNextIdleBeacon 1800ms ease-in-out infinite/);
  assert.match(styles, /\.core-combo-dot\.is-hit/);
  assert.match(styles, /coreComboDotHit 460ms ease-out/);
  assert.match(styles, /\.core-combo-track\.is-overload-hit \.core-combo-dot\.is-hit/);
  assert.match(styles, /coreComboDotOverloadHit 620ms ease-out/);
  assert.match(styles, /\.core-reward-hint/);
  assert.match(styles, /\.core-button\.is-pulsing:not\(\.is-overload-impact\) \+ \.core-reward-hint/);
  assert.match(styles, /coreRewardHintHit 360ms ease-out/);
  assert.match(styles, /\.core-button\.is-overload-impact \+ \.core-reward-hint/);
  assert.match(styles, /coreRewardHintOverloadHit 520ms ease-out/);
  assert.match(styles, /\.core-button\.is-pulsing:not\(\.is-overload-impact\) ~ \.combo-line #comboValue/);
  assert.match(styles, /coreComboReadoutHit 360ms ease-out/);
  assert.match(styles, /\.core-button\.is-overload-impact ~ \.combo-line #comboValue/);
  assert.match(styles, /\.core-button\.is-overload-impact ~ \.combo-line #pulseValue/);
  assert.match(styles, /coreComboReadoutOverloadHit 520ms ease-out/);
  assert.match(styles, /\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*~ \.combo-line #comboValue/);
  assert.match(styles, /coreComboReadoutIdleBeacon 2600ms ease-in-out infinite/);
  assert.match(styles, /\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*~ \.combo-line #pulseValue/);
  assert.match(styles, /coreStableReadoutIdleBeacon 3200ms ease-in-out infinite/);
  assert.match(styles, /\.score-grid dd\.is-core-hit/);
  assert.match(styles, /scoreEnergyReadoutHit 360ms ease-out/);
  assert.match(styles, /\.score-grid dd\.is-core-overload-hit/);
  assert.match(styles, /scoreEnergyReadoutOverloadHit 520ms ease-out/);
  assert.match(styles, /\.score-grid dd\.is-core-overload-prize/);
  assert.match(styles, /scoreOverloadReadoutPrize 560ms ease-out/);
  assert.match(styles, /\.core-label/);
  assert.match(styles, /\.core-button\.is-pulsing:not\(\.is-overload-impact\) \.core-label/);
  assert.match(styles, /coreLabelHitFlash 360ms ease-out/);
  assert.match(styles, /@keyframes coreLabelHitFlash/);
  assert.match(styles, /\.core-button\.is-overload-impact \.core-label/);
  assert.match(styles, /\.core-button\.is-overload-impact \.core-label::after/);
  assert.match(styles, /content: "过载"/);
  assert.match(styles, /coreLabelOverloadFlash 520ms ease-out/);
  assert.match(styles, /@keyframes coreLabelOverloadFlash/);
  assert.match(styles, /@keyframes coreRewardHintHit/);
  assert.match(styles, /@keyframes coreRewardHintOverloadHit/);
  assert.match(styles, /@keyframes coreComboReadoutHit/);
  assert.match(styles, /@keyframes coreComboReadoutOverloadHit/);
  assert.match(styles, /@keyframes coreComboReadoutIdleBeacon/);
  assert.match(styles, /@keyframes coreStableReadoutIdleBeacon/);
  assert.match(styles, /@keyframes coreComboTrackHitSweep/);
  assert.match(styles, /@keyframes coreComboTrackOverloadSweep/);
  assert.match(styles, /@keyframes coreComboNextIdleBeacon/);
  assert.match(styles, /@keyframes coreBadgeIdleBeacon/);
  assert.match(styles, /@keyframes coreBadgeStepHit/);
  assert.match(styles, /@keyframes scoreEnergyReadoutHit/);
  assert.match(styles, /@keyframes scoreEnergyReadoutOverloadHit/);
  assert.match(styles, /@keyframes scoreOverloadReadoutPrize/);
  assert.match(styles, /\.core-button\.is-pressing \.core-label/);
  assert.match(styles, /\.core-button\.is-pressing \.core-art/);
  assert.match(styles, /--core-vein-opacity/);
  assert.match(styles, /--core-vein-dash-offset/);
  assert.match(styles, /\.core-veins/);
  assert.match(styles, /\.core-vein/);
  assert.match(styles, /\.core-button\.is-pulsing:not\(\.is-overload-impact\) \.core-vein/);
  assert.match(styles, /coreVeinHitFlash 360ms ease-out/);
  assert.match(styles, /\.core-button\.is-overload-ready \.core-vein/);
  assert.match(styles, /\.core-button\.is-overload-hit \.core-vein/);
  assert.match(styles, /\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-art/);
  assert.match(styles, /coreArtIdleBeacon 3200ms ease-in-out infinite/);
  assert.match(styles, /\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\):hover[\s\S]*\.core-art/);
  assert.match(styles, /\.core-button:focus-visible/);
  assert.match(styles, /\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\):focus-visible::after/);
  assert.match(styles, /\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\):focus-visible[\s\S]*\.core-label/);
  assert.match(styles, /\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\):focus-visible[\s\S]*\.core-art/);
  assert.match(styles, /\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\):focus-visible \+ \.core-reward-hint:not\(\.is-overload-ready\):not\(\.is-overload-hit\)/);
  assert.match(styles, /coreArtHoverPreheat 1200ms ease-in-out infinite/);
  assert.match(styles, /@keyframes coreVeinHitFlash/);
  assert.match(styles, /@keyframes coreVeinPulse/);
  assert.match(styles, /@keyframes coreVeinBurst/);
  assert.match(styles, /\.core-button\.is-overload-ready/);
  assert.match(styles, /\.core-button\.is-pulsing:not\(\.is-overload-impact\)::before/);
  assert.match(styles, /coreShellHitFlash 360ms ease-out/);
  assert.match(styles, /\.core-button\.is-overload-impact::before/);
  assert.match(styles, /coreShellOverloadFlash 520ms ease-out/);
  assert.match(styles, /\.core-button\.is-overload-impact::after/);
  assert.match(styles, /\.combo-line span\.is-overload-ready/);
  assert.match(styles, /\.feedback-toggle-list/);
  assert.match(styles, /\.feedback-toggle/);
  assert.match(styles, /\.feedback-toggle input/);
  assert.match(styles, /\.feedback-toggle-icon/);
  assert.match(styles, /\.feedback-toggle-icon-sound::before/);
  assert.match(styles, /\.feedback-toggle-icon-haptic::before/);
  assert.match(styles, /@keyframes coreShockwave/);
  assert.match(styles, /@keyframes coreIdleInviteRing/);
  assert.match(styles, /@keyframes coreRewardHintIdleBeacon/);
  assert.match(styles, /@keyframes coreLabelIdleBeacon/);
  assert.match(styles, /@keyframes coreButtonHitGlow/);
  assert.match(styles, /@keyframes coreButtonOverloadGlow/);
  assert.match(styles, /@keyframes coreShellHitFlash/);
  assert.match(styles, /@keyframes coreOverloadShockwave/);
  assert.match(styles, /@keyframes coreShellOverloadFlash/);
  assert.match(styles, /@keyframes coreSparks/);
  assert.match(styles, /@keyframes coreFeedbackIdleBeacon/);
  assert.match(styles, /@keyframes coreArtIdleBeacon/);
  assert.match(styles, /@keyframes coreArtHoverPreheat/);
  assert.match(styles, /@keyframes coreStageHitFlash/);
  assert.match(styles, /@keyframes coreStageIdleBeacon/);
  assert.match(styles, /@keyframes coreStageCharge/);
  assert.match(styles, /@keyframes coreStageBurst/);
  assert.match(styles, /@keyframes coreSurgeOrbit/);
  assert.match(styles, /@keyframes coreSurgeIdleBeacon/);
  assert.match(styles, /@keyframes coreSurgeBurst/);
  assert.match(styles, /@keyframes coreChargeRingIdleBeacon/);
  assert.match(styles, /@keyframes coreChargeRingHit/);
  assert.match(styles, /@keyframes coreChargeRingOverloadHit/);
  assert.match(styles, /@keyframes coreImpactPoint/);
  assert.match(styles, /@keyframes coreGainFloat/);
  assert.match(styles, /@keyframes coreGainPopHalo/);
  assert.match(styles, /@keyframes coreGainPopOverloadHalo/);
  assert.match(styles, /@keyframes coreBadgePulse/);
  assert.match(styles, /@keyframes coreBadgeBurst/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button\.is-pulsing:not\(\.is-overload-impact\)[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\)::after[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\) \+ \.core-reward-hint:not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-label[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-feedback-layer[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-stage-aura[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-surge-orbit[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-charge-ring[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-overload-badge[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*~ \.combo-line #comboValue[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*~ \.combo-line #pulseValue[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\)[\s\S]*\.core-art[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\):hover[\s\S]*\.core-art[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button:not\(\.is-combo-charging\):not\(\.is-pulsing\):not\(\.is-pressing\):not\(\.is-overload-ready\):not\(\.is-overload-hit\):focus-visible[\s\S]*\.core-art[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button\.is-overload-impact[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button\.is-pulsing:not\(\.is-overload-impact\) \.core-stage-aura[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button\.is-pulsing:not\(\.is-overload-impact\) \.core-vein[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-button\.is-pulsing:not\(\.is-overload-impact\) \.core-overload-badge[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.core-gain-pop\.is-showing::after[\s\S]*animation: none/);
  assert.match(styles, /@keyframes coreDotPulse/);
  assert.match(styles, /@keyframes coreComboDotHit/);
  assert.match(styles, /@keyframes coreComboDotOverloadHit/);
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

test("航线策略按钮会渲染可扫视徽记", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="routeStanceList"/);
  assert.match(indexHtml, /route-stance-visual route-stance-visual-balanced/);
  assert.match(indexHtml, /aria-label="均衡航线徽记"/);
  assert.match(indexHtml, /route-stance-visual route-stance-visual-ignition/);
  assert.match(indexHtml, /aria-label="点火优先徽记"/);
  assert.match(indexHtml, /route-stance-visual route-stance-visual-cruise/);
  assert.match(indexHtml, /aria-label="巡航优先徽记"/);
  assert.match(appJs, /ROUTE_STANCE_ICON_DEFS/);
  assert.match(appJs, /function renderRouteStanceVisual\(option\)/);
  assert.match(appJs, /head\.className = "route-stance-head"/);
  assert.match(appJs, /head\.append\(renderRouteStanceVisual\(option\), name\)/);
  assert.match(appJs, /button\.append\(head, summary, mastery\)/);
  assert.match(styles, /\.route-stance-head/);
  assert.match(styles, /\.route-stance-visual/);
  assert.match(styles, /\.route-stance-visual-balanced/);
  assert.match(styles, /\.route-stance-visual-ignition/);
  assert.match(styles, /\.route-stance-visual-cruise/);
});

test("航线指令按钮会渲染可扫视徽记", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /directive-visual directive-visual-ignition-salvo/);
  assert.match(indexHtml, /aria-label="点火齐射徽记"/);
  assert.match(indexHtml, /directive-visual directive-visual-cruise-cache/);
  assert.match(indexHtml, /aria-label="巡航回收徽记"/);
  assert.match(indexHtml, /directive-visual directive-visual-resonance-pulse/);
  assert.match(indexHtml, /aria-label="谐振脉冲徽记"/);
  assert.match(indexHtml, /class="directive-state-orb"/);
  assert.match(indexHtml, /class="directive-cooldown-meter"/);
  assert.match(indexHtml, /aria-label="点火齐射冷却进度"/);
  assert.match(appJs, /DIRECTIVE_ICON_DEFS/);
  assert.match(appJs, /function renderDirectiveVisual\(option\)/);
  assert.match(appJs, /DIRECTIVE_VISIBLE_BADGE_LIMIT = 3/);
  assert.match(appJs, /function compactDirectiveBadges\(badges\)/);
  assert.match(appJs, /function getDirectivePreviewDisplayText\(option\)/);
  assert.match(appJs, /option\.ready \? "is-ready" : ""/);
  assert.match(appJs, /option\.cooling \? "is-cooling" : ""/);
  assert.match(appJs, /option\.recommended \? "is-recommended" : ""/);
  assert.match(appJs, /stateOrb\.className = "directive-state-orb"/);
  assert.match(appJs, /titleGroup\.className = "directive-title-group"/);
  assert.match(appJs, /titleGroup\.append\(renderDirectiveVisual\(option\), name\)/);
  assert.match(appJs, /head\.append\(titleGroup, badges\)/);
  assert.match(appJs, /option\.cooling \? "is-cooling" : ""/);
  assert.match(appJs, /cooldownMeter\.className = "directive-cooldown-meter"/);
  assert.match(appJs, /cooldownMeter\.setAttribute\("role", "meter"\)/);
  assert.match(appJs, /button\.append\(head, summary, preview, cooldownMeter, status\)/);
  assert.match(styles, /\.directive-title-group/);
  assert.match(styles, /\.directive-visual/);
  assert.match(styles, /\.directive-visual-ignition-salvo/);
  assert.match(styles, /\.directive-visual-cruise-cache/);
  assert.match(styles, /\.directive-visual-resonance-pulse/);
  assert.match(styles, /\.directive-state-orb/);
  assert.match(styles, /\.directive-visual\.is-ready \.directive-state-orb/);
  assert.match(styles, /\.directive-visual\.is-cooling \.directive-state-orb/);
  assert.match(styles, /\.directive-button \.directive-badges \.is-collapsed-badge/);
  assert.match(styles, /\.directive-button \.directive-badge-overflow/);
  assert.match(styles, /\.directive-cooldown-meter/);
  assert.match(styles, /\.directive-button\.is-cooling \.directive-cooldown-meter span/);
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

test("星图项目卡片会渲染可视化进度缩略图", () => {
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(appJs, /function renderProjectCardScene\(project\)/);
  assert.match(appJs, /item\.append\(header, renderProjectCardScene\(project\)\)/);
  assert.match(appJs, /--project-card-progress/);
  assert.match(appJs, /project-card-scene-track-mark/);
  assert.match(appJs, /project-card-scene-rail/);
  assert.match(appJs, /project-card-scene-fill/);
  assert.match(appJs, /project-card-scene-marker/);
  assert.match(appJs, /project-card-scene-reward/);
  assert.match(styles, /\.project-card-scene/);
  assert.match(styles, /--project-card-progress/);
  assert.match(styles, /\.project-card-scene-track-mark/);
  assert.match(styles, /\.project-card-scene-fill/);
  assert.match(styles, /\.project-card-scene-marker/);
  assert.match(styles, /\.project-card-scene\.is-energy-track/);
  assert.match(styles, /\.project-card-scene\.is-upgrade-track/);
  assert.match(styles, /\.project-card-scene\.is-reward-click/);
  assert.match(styles, /\.project-card-scene\.is-reward-overload/);
});

test("星图项目卡片会默认折叠非当前航段详情", () => {
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const gameJs = readFileSync(new URL("../src/game.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(appJs, /function renderProjectDetailNodes\(project\)/);
  assert.match(appJs, /function renderProjectDispatchTrack\(project\)/);
  assert.match(appJs, /dispatchTrack = renderProjectDispatchTrack\(project\)/);
  assert.match(appJs, /track\.className = "project-dispatch-track"/);
  assert.match(appJs, /project\.dispatchSteps/);
  assert.match(appJs, /stepItem\.className = "project-dispatch-step"/);
  assert.match(appJs, /stepReward\.className = "project-dispatch-step-reward"/);
  assert.match(gameJs, /rewardText: getFarRouteDispatchLoopStepRewardText/);
  assert.match(appJs, /if \(project\.isCurrent\) \{/);
  assert.match(appJs, /details\.className = "project-card-drawer"/);
  assert.match(appJs, /detailGrid\.className = "project-card-detail-grid"/);
  assert.match(appJs, /detailSummary\.textContent = "航段详情"/);
  assert.match(styles, /\.project-item:not\(\.is-current\)/);
  assert.match(styles, /\.project-card-drawer/);
  assert.match(styles, /\.project-card-detail-grid/);
  assert.match(styles, /\.project-dispatch-track/);
  assert.match(styles, /\.project-dispatch-step/);
  assert.match(styles, /\.project-dispatch-step em/);
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
  const gameJs = readFileSync(new URL("../src/game.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const farDispatchVisual = readFileSync(
    new URL("../src/assets/far-dispatch-visual.svg", import.meta.url),
    "utf8"
  );

  assert.match(indexHtml, /id="directivePlan"/);
  assert.match(indexHtml, /id="directivePlanTrack"/);
  assert.match(indexHtml, /id="directiveTask"/);
  assert.match(indexHtml, /id="farDispatch"/);
  assert.match(indexHtml, /class="directive-plan-step is-next"/);
  assert.match(indexHtml, /aria-label="指令轮换视觉轨"/);
  assert.match(indexHtml, /class="directive-task-meter"/);
  assert.match(indexHtml, /class="far-dispatch-meter"/);
  assert.match(indexHtml, /class="far-dispatch-branch is-locked"/);
  assert.match(indexHtml, /class="far-dispatch-branch-recommendation"/);
  assert.match(indexHtml, /class="far-dispatch-branch-rotation"/);
  assert.match(indexHtml, /class="far-dispatch-branch-route"/);
  assert.match(indexHtml, /class="far-dispatch-branch-plan"/);
  assert.match(indexHtml, /class="far-dispatch-branch-step"/);
  assert.match(indexHtml, /class="far-dispatch-branch-closure"/);
  assert.match(indexHtml, /class="far-dispatch-branch-choices"/);
  assert.match(indexHtml, /class="far-dispatch-loop-meter"/);
  assert.match(indexHtml, /class="far-dispatch-loop-track"/);
  assert.match(indexHtml, /class="far-dispatch-scene-image"/);
  assert.match(indexHtml, /src="\.\/src\/assets\/far-dispatch-visual\.svg"/);
  assert.match(indexHtml, /远航调度三步闭环、协同航线和绕行航线组成的远航插画/);
  assert.match(indexHtml, /aria-label="航线委托进度"/);
  assert.match(indexHtml, /aria-label="远航调度进度"/);
  assert.match(indexHtml, /aria-label="远航闭环进度"/);
  assert.match(indexHtml, /title="指令轮换：累计 100K 能量后解锁 90 秒连携目标/);
  assert.match(indexHtml, /指令轮换：累计 100K 能量后解锁 90 秒连携目标/);
  assert.match(indexHtml, />航线委托：100K 后解锁 3 步任务<\/span>/);
  assert.match(indexHtml, /航线委托：累计 100K 能量后解锁 3 步短期任务/);
  assert.match(indexHtml, />远航调度：20M 后解锁<\/span>/);
  assert.match(
    indexHtml,
    /远航调度：累计 20M 能量后解锁后半段航段调度、目标指令推荐、目标冷却缩短、连携窗口延长、远航续航、远航协同、协同补给、远航绕行、绕行投送、回航校准、分支改道、航段契合、路线稳航、轮替闭环、契合闭环、闭环奖励、远航突破、绕行突破、远航整备、整备续航、绕行整备与整备回航/
  );
  assert.match(indexHtml, /非契合指令起手/);
  assert.match(indexHtml, /第二步继续避开契合指令/);
  assert.match(indexHtml, /3\/3 策略终结/);
  assert.match(indexHtml, /预案执行奖励/);
  assert.match(indexHtml, /指令熟练/);
  assert.match(indexHtml, /回响续航/);
  assert.match(indexHtml, /满层回响/);
  assert.match(farDispatchVisual, /id="farDispatchVisual"/);
  assert.match(farDispatchVisual, /<title id="farDispatchVisualTitle">远航调度闭环插画<\/title>/);
  assert.match(farDispatchVisual, /三步远航闭环、协同航线和绕行航线构成的抽象航线图/);
  assert.match(styles, /\.far-dispatch-scene-image/);
  assert.match(styles, /\.far-dispatch\.is-active \.far-dispatch-scene-image/);
  assert.match(styles, /animation: farDispatchSceneImagePulse 1800ms ease-in-out infinite/);
  assert.match(styles, /@keyframes farDispatchSceneImagePulse/);
  assert.match(styles, /\.far-dispatch\.is-locked \.far-dispatch-scene-image/);
  assert.match(appJs, /rotationReward: result\.rotationReward/);
  assert.match(appJs, /planReward: result\.planReward/);
  assert.match(appJs, /planBonusRate: result\.planBonusRate/);
  assert.match(appJs, /taskReward: result\.taskReward/);
  assert.match(appJs, /taskRewardRate: result\.taskRewardRate/);
  assert.match(appJs, /dispatchReward: result\.dispatchReward/);
  assert.match(appJs, /dispatchRewardRate: result\.dispatchRewardRate/);
  assert.match(appJs, /dispatchRelayReward: result\.dispatchRelayReward/);
  assert.match(appJs, /dispatchRelayRewardRate: result\.dispatchRelayRewardRate/);
  assert.match(appJs, /dispatchRelayRewardText: result\.dispatchRelayRewardText/);
  assert.match(appJs, /dispatchSyncReward: result\.dispatchSyncReward/);
  assert.match(appJs, /dispatchSyncRewardRate: result\.dispatchSyncRewardRate/);
  assert.match(appJs, /dispatchSyncRewardText: result\.dispatchSyncRewardText/);
  assert.match(appJs, /dispatchSyncSupply: result\.dispatchSyncSupply/);
  assert.match(appJs, /dispatchSyncSupplyRate: result\.dispatchSyncSupplyRate/);
  assert.match(appJs, /dispatchSyncSupplyText: result\.dispatchSyncSupplyText/);
  assert.match(appJs, /dispatchDetourReward: result\.dispatchDetourReward/);
  assert.match(appJs, /dispatchDetourRewardRate: result\.dispatchDetourRewardRate/);
  assert.match(appJs, /dispatchDetourRewardText: result\.dispatchDetourRewardText/);
  assert.match(appJs, /dispatchBranchShiftReward: result\.dispatchBranchShiftReward/);
  assert.match(appJs, /dispatchBranchShiftRewardRate: result\.dispatchBranchShiftRewardRate/);
  assert.match(appJs, /dispatchBranchShiftRewardText: result\.dispatchBranchShiftRewardText/);
  assert.match(appJs, /dispatchBranchStabilityReward: result\.dispatchBranchStabilityReward/);
  assert.match(appJs, /dispatchBranchStabilityRewardRate: result\.dispatchBranchStabilityRewardRate/);
  assert.match(appJs, /dispatchBranchStabilityRewardText: result\.dispatchBranchStabilityRewardText/);
  assert.match(appJs, /dispatchBranchFocusReward: result\.dispatchBranchFocusReward/);
  assert.match(appJs, /dispatchBranchFocusRewardRate: result\.dispatchBranchFocusRewardRate/);
  assert.match(appJs, /dispatchBranchFocusRewardText: result\.dispatchBranchFocusRewardText/);
  assert.match(appJs, /dispatchFocusLoopReward: result\.dispatchFocusLoopReward/);
  assert.match(appJs, /dispatchFocusLoopRewardRate: result\.dispatchFocusLoopRewardRate/);
  assert.match(appJs, /dispatchFocusLoopRewardText: result\.dispatchFocusLoopRewardText/);
  assert.match(appJs, /dispatchLoopReward: result\.dispatchLoopReward/);
  assert.match(appJs, /dispatchLoopRewardRate: result\.dispatchLoopRewardRate/);
  assert.match(appJs, /dispatchLoopRewardText: result\.dispatchLoopRewardText/);
  assert.match(appJs, /dispatchLoopStreakReward: result\.dispatchLoopStreakReward/);
  assert.match(appJs, /dispatchLoopStreakRewardRate: result\.dispatchLoopStreakRewardRate/);
  assert.match(appJs, /dispatchLoopStreakStacks: result\.dispatchLoopStreakStacks/);
  assert.match(appJs, /dispatchLoopStreakRewardText: result\.dispatchLoopStreakRewardText/);
  assert.match(appJs, /dispatchLoopStreakCapstoneReward: result\.dispatchLoopStreakCapstoneReward/);
  assert.match(appJs, /dispatchLoopStreakCapstoneRewardRate:/);
  assert.match(appJs, /dispatchLoopStreakCapstoneRewardText:/);
  assert.match(appJs, /dispatchBreakthroughReward: result\.dispatchBreakthroughReward/);
  assert.match(appJs, /dispatchBreakthroughRewardRate: result\.dispatchBreakthroughRewardRate/);
  assert.match(appJs, /dispatchBreakthroughRewardText: result\.dispatchBreakthroughRewardText/);
  assert.match(appJs, /dispatchDetourBreakthroughReward: result\.dispatchDetourBreakthroughReward/);
  assert.match(appJs, /dispatchDetourBreakthroughRewardRate:/);
  assert.match(appJs, /dispatchDetourBreakthroughRewardText:/);
  assert.match(appJs, /dispatchDetourInfusionCost: result\.dispatchDetourInfusionCost/);
  assert.match(appJs, /dispatchDetourInfusionProgress: result\.dispatchDetourInfusionProgress/);
  assert.match(appJs, /dispatchDetourInfusionText: result\.dispatchDetourInfusionText/);
  assert.match(appJs, /dispatchPrepReward: result\.dispatchPrepReward/);
  assert.match(appJs, /dispatchPrepRewardRate: result\.dispatchPrepRewardRate/);
  assert.match(appJs, /dispatchPrepRewardText: result\.dispatchPrepRewardText/);
  assert.match(appJs, /dispatchDetourPrepReward: result\.dispatchDetourPrepReward/);
  assert.match(appJs, /dispatchDetourPrepRewardRate: result\.dispatchDetourPrepRewardRate/);
  assert.match(appJs, /dispatchDetourPrepRewardText: result\.dispatchDetourPrepRewardText/);
  assert.match(appJs, /dispatchReturnReward: result\.dispatchReturnReward/);
  assert.match(appJs, /dispatchReturnRewardRate: result\.dispatchReturnRewardRate/);
  assert.match(appJs, /dispatchReturnRewardText: result\.dispatchReturnRewardText/);
  assert.match(appJs, /dispatchRefreshDirectiveId: result\.dispatchRefreshDirectiveId/);
  assert.match(appJs, /dispatchRefreshDirectiveName: result\.dispatchRefreshDirectiveName/);
  assert.match(appJs, /dispatchRefreshText: result\.dispatchRefreshText/);
  assert.match(appJs, /dispatchCooldownMultiplier: result\.dispatchCooldownMultiplier/);
  assert.match(appJs, /dispatchCooldownText: result\.dispatchCooldownText/);
  assert.match(appJs, /dispatchChainWindowSeconds: result\.dispatchChainWindowSeconds/);
  assert.match(appJs, /dispatchChainWindowText: result\.dispatchChainWindowText/);
  assert.match(appJs, /dispatchRouteStepText: result\.dispatchRouteStepText/);
  assert.match(appJs, /dispatchRouteResultText: result\.dispatchRouteResultText/);
  assert.match(appJs, /masteryCapstoneReward: result\.masteryCapstoneReward/);
  assert.match(appJs, /masteryCapstoneRate: result\.masteryCapstoneRate/);
  assert.match(appJs, /stanceFinisherReward: result\.stanceFinisherReward/);
  assert.match(appJs, /stanceBonus: result\.stanceBonus/);
  assert.match(appJs, /masteryBonus: result\.masteryBonus/);
  assert.match(appJs, /masteryRewardStacks: result\.masteryRewardStacks/);
  assert.match(appJs, /directivePlan: document\.querySelector\("#directivePlan"\)/);
  assert.match(appJs, /directivePlanTrack: document\.querySelector\("#directivePlanTrack"\)/);
  assert.match(appJs, /directiveTask: document\.querySelector\("#directiveTask"\)/);
  assert.match(appJs, /farDispatch: document\.querySelector\("#farDispatch"\)/);
  assert.match(appJs, /setCompactSupportText\(/);
  assert.match(appJs, /function getDirectivePlanDisplayText\(plan\)/);
  assert.match(appJs, /function getDirectiveTaskDisplayText\(task\)/);
  assert.match(appJs, /function getFarDispatchDisplayText\(dispatch\)/);
  assert.match(
    appJs,
    /getDirectivePlanDisplayText\(directives\.plan\),\s+directives\.plan\.text/
  );
  assert.match(appJs, /renderDirectivePlanTrack\(directives\.plan, directives\.options\)/);
  assert.match(appJs, /renderDirectiveTask\(directives\.task\)/);
  assert.match(appJs, /renderFarDispatch\(directives\.dispatch/);
  assert.match(appJs, /function renderDirectivePlanTrack\(plan, options\)/);
  assert.match(appJs, /"directive-plan-step"/);
  assert.match(appJs, /label\.textContent = nextActionText/);
  assert.match(appJs, /function renderDirectiveTask\(task\)/);
  assert.match(appJs, /function renderFarDispatch\(dispatch\)/);
  assert.match(appJs, /branch\.className = "far-dispatch-branch is-" \+ getFarDispatchBranchKind\(dispatch\)/);
  assert.match(appJs, /branchRecommendation\.className = "far-dispatch-branch-recommendation"/);
  assert.match(appJs, /branchRotation\.className = "far-dispatch-branch-rotation"/);
  assert.match(appJs, /branchRoute\.className = "far-dispatch-branch-route"/);
  assert.match(appJs, /branchPlan\.className = "far-dispatch-branch-plan"/);
  assert.match(appJs, /branchPlanStep\.className = "far-dispatch-branch-step"/);
  assert.match(appJs, /branchClosure\.className = "far-dispatch-branch-closure"/);
  assert.match(appJs, /branchClosure\.textContent = dispatch\.branchClosureText \?\? ""/);
  assert.match(appJs, /function renderFarDispatchBranchChoices\(dispatch\)/);
  assert.match(appJs, /track\.className = "far-dispatch-branch-choices"/);
  assert.match(appJs, /renderFarDispatchBranchChoiceLegend\(\)/);
  assert.match(appJs, /renderFarDispatchBranchChoiceSummary\(dispatch\)/);
  assert.match(appJs, /function renderFarDispatchBranchChoiceLegend\(\)/);
  assert.match(appJs, /legend\.className = "far-dispatch-branch-choice-legend"/);
  assert.match(appJs, /legend\.setAttribute\("aria-hidden", "true"\)/);
  assert.match(appJs, /item\.className = "far-dispatch-branch-choice-legend-item"/);
  assert.match(appJs, /item\.dataset\.stepLabel = step/);
  assert.match(appJs, /function renderFarDispatchBranchChoiceSummary\(dispatch\)/);
  assert.match(appJs, /summary\.className = "far-dispatch-branch-choice-summary"/);
  assert.match(appJs, /summary\.hidden = !dispatch\.branchChoiceSummaryText/);
  assert.match(appJs, /dispatch\.branchChoiceSummaryText \?\? ""/);
  assert.match(appJs, /const orderedChoices = choices/);
  assert.match(
    appJs,
    /\.sort\(\s*\(a, b\) => Number\(Boolean\(b\.active\)\) - Number\(Boolean\(a\.active\)\)\s*\)/
  );
  assert.match(
    appJs,
    /summary\.append\(\.\.\.orderedChoices\.map\(renderFarDispatchBranchChoiceSummaryItem\)\)/
  );
  assert.match(appJs, /function renderFarDispatchBranchChoiceSummaryItem\(choice\)/);
  assert.match(appJs, /choice\.routeResourceText/);
  assert.match(appJs, /choice\.routeDecisionSignalText/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-item is-/);
  assert.match(appJs, /choice\.active \? " is-active-route" : ""/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-glyph is-/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-signal is-/);
  assert.match(appJs, /getFarDispatchBranchChoiceDecisionSignalKind\(choice\)/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-phase is-/);
  assert.match(appJs, /phase\.textContent = choice\.routePhaseText \?\? ""/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-action is-/);
  assert.match(appJs, /action\.textContent = choice\.routeActionText \?\? ""/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-reward/);
  assert.match(appJs, /reward\.textContent = choice\.routeRewardSummaryText \?\? ""/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-step/);
  assert.match(appJs, /branchStep\.textContent = choice\.routeBranchStepText \?\? ""/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-payoff/);
  assert.match(appJs, /payoff\.textContent = choice\.routePayoffSummaryText \?\? ""/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-intent is-/);
  assert.match(appJs, /getFarDispatchBranchChoiceRouteIntentKind\(choice\)/);
  assert.match(appJs, /renderFarDispatchBranchChoiceSummaryProgress\(choice\)/);
  assert.match(appJs, /progress\.className =/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-progress is-/);
  assert.match(appJs, /"--summary-route-progress"/);
  assert.match(appJs, /getFarDispatchBranchChoiceRouteProgress\(choice\) \+ "%"/);
  assert.match(appJs, /progress\.setAttribute\("role", "img"\)/);
  assert.match(appJs, /"路线对照进度："/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-progress-node is-/);
  assert.match(appJs, /choice\.routeNodeStates\?\.\[nodeId\]/);
  assert.match(appJs, /getFarDispatchBranchChoiceRouteStepLabel\(\s*choice,\s*nodeId\s*\)/);
  assert.match(appJs, /node\.title = stepTitle/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-cost is-/);
  assert.match(appJs, /far-dispatch-branch-choice-summary-result is-/);
  assert.match(appJs, /choice\.routeLoopStreakText \? " has-loop-streak" : ""/);
  assert.match(appJs, /choice\.routeLoopCapstoneText \? " has-loop-capstone" : ""/);
  assert.match(appJs, /"far-dispatch-branch-choice is-"/);
  assert.match(appJs, /" is-decision-" \+/);
  assert.match(appJs, /header\.className = "far-dispatch-branch-choice-head"/);
  assert.match(appJs, /"far-dispatch-branch-choice-badge is-" \+/);
  assert.match(appJs, /badge\.textContent = choice\.decisionBadgeText \?\? ""/);
  assert.match(appJs, /costBadge\.className =/);
  assert.match(appJs, /far-dispatch-branch-choice-cost is-/);
  assert.match(appJs, /costBadge\.textContent = choice\.routeCostText \?\? ""/);
  assert.match(appJs, /intentBadge\.className =/);
  assert.match(appJs, /far-dispatch-branch-choice-intent is-/);
  assert.match(appJs, /intentBadge\.textContent = choice\.routeIntentText \?\? ""/);
  assert.match(appJs, /function renderFarDispatchBranchChoiceRoute\(choice\)/);
  assert.match(appJs, /"far-dispatch-branch-choice-route is-" \+/);
  assert.match(appJs, /" is-resource-" \+/);
  assert.match(appJs, /" is-route-marker-" \+/);
  assert.match(appJs, /" is-route-phase-" \+/);
  assert.match(appJs, /" is-route-flow-" \+/);
  assert.match(appJs, /"--branch-route-progress"/);
  assert.match(appJs, /getFarDispatchBranchChoiceRouteProgress\(choice\) \+ "%"/);
  assert.match(appJs, /route\.setAttribute\("aria-hidden", "true"\)/);
  assert.match(appJs, /line\.className = "far-dispatch-branch-choice-route-line"/);
  assert.match(appJs, /getFarDispatchBranchChoiceRouteNodeState\(choice, "start"\)/);
  assert.match(appJs, /getFarDispatchBranchChoiceRouteNodeState\(choice, "branch"\)/);
  assert.match(appJs, /getFarDispatchBranchChoiceRouteNodeState\(choice, "return"\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteNodeState\(choice, nodeId\)/);
  assert.match(appJs, /dataset\.stepLabel = getFarDispatchBranchChoiceRouteStepLabel/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteStepLabel\(choice, nodeId\)/);
  assert.match(appJs, /routeResource\.className =/);
  assert.match(appJs, /far-dispatch-branch-choice-route-resource is-/);
  assert.match(appJs, /routeMarker\.className =/);
  assert.match(appJs, /far-dispatch-branch-choice-route-marker is-/);
  assert.match(appJs, /routeMarker\.textContent = choice\.routeMarkerText \?\? ""/);
  assert.match(appJs, /routePhase\.className =/);
  assert.match(appJs, /far-dispatch-branch-choice-route-phase is-/);
  assert.match(appJs, /routePhase\.textContent = choice\.routePhaseText \?\? ""/);
  assert.match(appJs, /routeFlow\.className =/);
  assert.match(appJs, /far-dispatch-branch-choice-route-flow is-/);
  assert.match(appJs, /routeFlow\.textContent = choice\.routeFlowText \?\? ""/);
  assert.match(appJs, /renderFarDispatchBranchChoiceRouteReward\(choice, "start"\)/);
  assert.match(appJs, /renderFarDispatchBranchChoiceRouteReward\(choice, "branch"\)/);
  assert.match(appJs, /renderFarDispatchBranchChoiceRouteReward\(choice, "return"\)/);
  assert.match(appJs, /function renderFarDispatchBranchChoiceRouteReward\(choice, nodeId\)/);
  assert.match(appJs, /far-dispatch-branch-choice-route-reward is-/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteRewardLabel\(choice, nodeId\)/);
  assert.match(appJs, /routeCommand = renderFarDispatchBranchChoiceRouteCommand\(choice\)/);
  assert.match(appJs, /function renderFarDispatchBranchChoiceRouteCommand\(choice\)/);
  assert.match(appJs, /command\.className = "far-dispatch-branch-choice-route-command"/);
  assert.match(appJs, /const commandStatusText = commandSteps/);
  assert.match(appJs, /路线指令状态：/);
  assert.match(appJs, /command\.title = commandStatusText/);
  assert.match(appJs, /choice\.routeCommandLabels\?\.start/);
  assert.match(appJs, /far-dispatch-branch-choice-route-command-step is-/);
  assert.match(appJs, /getFarDispatchBranchChoiceRouteNodeState\(choice, step\)/);
  assert.match(appJs, /item\.dataset\.stepLabel = getFarDispatchBranchChoiceRouteStepLabel\(choice, step\)/);
  assert.match(appJs, /item\.setAttribute\("aria-label", stepTitle\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteNodeStateText\(choice, nodeId\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteCommandStepTitle\(choice, nodeId, label\)/);
  assert.match(appJs, /far-dispatch-branch-choice-route-command-arrow/);
  assert.match(appJs, /details\.className =/);
  assert.match(appJs, /far-dispatch-branch-choice-details is-return-/);
  assert.match(appJs, /detailsSummary\.textContent = choice\.routeReturnText/);
  assert.match(appJs, /"路线明细 · " \+ choice\.routeReturnText/);
  assert.match(appJs, /detailsGrid\.className = "far-dispatch-branch-choice-detail-grid"/);
  assert.match(appJs, /detailsGrid\.append\(objective, followup, next, payoff, caption\)/);
  assert.match(appJs, /details\.append\(detailsSummary, detailsGrid\)/);
  assert.match(appJs, /"far-dispatch-branch-choice-decision is-" \+/);
  assert.match(appJs, /decision\.textContent = choice\.decisionText \?\? ""/);
  assert.match(appJs, /reason\.className = "far-dispatch-branch-choice-reason"/);
  assert.match(appJs, /reason\.textContent = choice\.reasonText \?\? ""/);
  assert.match(appJs, /objective\.className = "far-dispatch-branch-choice-objective"/);
  assert.match(appJs, /objective\.textContent = choice\.objectiveText \?\? ""/);
  assert.match(appJs, /followup\.className = "far-dispatch-branch-choice-followup"/);
  assert.match(appJs, /followup\.textContent = choice\.followupText \?\? ""/);
  assert.match(appJs, /next\.textContent = choice\.nextText \?\? ""/);
  assert.match(appJs, /payoff\.className = "far-dispatch-branch-choice-payoff"/);
  assert.match(appJs, /payoff\.textContent = choice\.payoffText \?\? ""/);
  assert.match(appJs, /getDirectiveTaskDisplayText\(task\)/);
  assert.match(appJs, /getFarDispatchDisplayText\(dispatch\)/);
  assert.match(appJs, /function getFarDispatchBranchKind\(dispatch\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceKind\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRoutePhaseKind\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteCostKind\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteIntentKind\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteReturnKind\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceStatus\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceDecisionKind\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceDecisionSignalKind\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteResourceKind\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteMarkerKind\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteProgress\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteFlowKind\(choice\)/);
  assert.match(appJs, /function getFarDispatchBranchChoiceRouteRewardLabel\(choice, nodeId\)/);
  assert.match(appJs, /meter\.className = "directive-task-meter"/);
  assert.match(appJs, /meter\.className = "far-dispatch-meter"/);
  assert.match(appJs, /loopMeter\.className = "far-dispatch-loop-meter"/);
  assert.match(appJs, /loopStreak\.className = "far-dispatch-loop-streak"/);
  assert.match(appJs, /loopStreak\.textContent = dispatch\.loopStreakText \?\? ""/);
  assert.match(appJs, /loopStreak\.hidden = !dispatch\.loopStreakText/);
  assert.match(appJs, /"has-loop-streak",\s*Boolean\(dispatch\.loopStreakText\)/);
  assert.match(appJs, /function renderFarDispatchSceneImage\(\)/);
  assert.match(appJs, /image\.className = "far-dispatch-scene-image"/);
  assert.match(appJs, /image\.src = "\.\/src\/assets\/far-dispatch-visual\.svg"/);
  assert.match(appJs, /image\.alt = "远航调度三步闭环、协同航线和绕行航线组成的远航插画"/);
  assert.match(appJs, /image\.loading = "lazy"/);
  assert.match(appJs, /const sceneImage = renderFarDispatchSceneImage\(\)/);
  assert.match(appJs, /function renderFarDispatchLoopTrack\(dispatch\)/);
  assert.match(appJs, /track\.className = "far-dispatch-loop-track"/);
  assert.match(appJs, /visual\.className = "far-dispatch-loop-visual"/);
  assert.match(appJs, /"--far-loop-visual-progress"/);
  assert.match(appJs, /far-dispatch-loop-visual-arrow is-segment-/);
  assert.match(appJs, /function getFarDispatchLoopVisualArrowState\(progress, segment\)/);
  assert.match(appJs, /far-dispatch-loop-visual-point is-/);
  assert.match(appJs, /far-dispatch-loop-visual-node is-/);
  assert.match(appJs, /far-dispatch-loop-visual-reward is-/);
  assert.match(appJs, /function getFarDispatchLoopVisualRewardKind\(step, index\)/);
  assert.match(appJs, /function getFarDispatchLoopVisualRewardLabel\(step, index\)/);
  assert.match(appJs, /reward\.dataset\.rewardLabel = getFarDispatchLoopVisualRewardLabel\(step, index\)/);
  assert.match(appJs, /visual\.setAttribute\("aria-hidden", "true"\)/);
  assert.match(appJs, /node\.dataset\.stepLabel = String\(index \+ 1\)/);
  assert.match(appJs, /const stepLinks = steps\.map/);
  assert.match(appJs, /"far-dispatch-loop-link is-" \+ step\.state \+ " is-" \+ rewardKind/);
  assert.match(appJs, /link\.setAttribute\("aria-hidden", "true"\)/);
  assert.match(appJs, /track\.append\(visual, \.\.\.stepLinks, \.\.\.stepItems\)/);
  assert.match(appJs, /stepItem\.className =[\s\S]*"far-dispatch-loop-step is-" \+ step\.state \+ " is-" \+ rewardKind/);
  assert.match(appJs, /stepItem\.dataset\.stepLabel = String\(index \+ 1\)/);
  assert.match(appJs, /const rewardLabel = getFarDispatchLoopVisualRewardLabel\(step, index\)/);
  assert.match(appJs, /reward\.className =[\s\S]*"far-dispatch-step-reward is-" \+ rewardKind \+ " is-" \+ step\.state/);
  assert.match(appJs, /reward\.dataset\.rewardLabel = rewardLabel/);
  assert.match(appJs, /reward\.textContent = step\.rewardText \?\? ""/);
  assert.match(appJs, /reward\.title = rewardLabel \+ " · " \+ reward\.textContent/);
  assert.match(appJs, /meter\.setAttribute\("role", "meter"\)/);
  assert.match(appJs, /loopMeter\.setAttribute\("role", "meter"\)/);
  assert.match(appJs, /elements\.farDispatch\.replaceChildren\(\s*text,\s*sceneImage,\s*branch,/);
  assert.match(appJs, /branchChoices,/);
  assert.match(appJs, /elements\.directiveTask\.classList\.toggle\("is-completed", task\.completed\)/);
  assert.match(appJs, /elements\.directiveTask\.replaceChildren\(text, meter\)/);
  assert.match(appJs, /elements\.farDispatch\.classList\.toggle\("is-active", dispatch\.active\)/);
  assert.match(gameJs, /routeProgressPercent/);
  assert.match(gameJs, /routeRewardLabels/);
  assert.match(gameJs, /routeRewardSummaryText/);
  assert.match(gameJs, /routeFlowText/);
  assert.match(gameJs, /routeDecisionSignalText/);
  assert.match(gameJs, /buildFarRouteDispatchBranchDecisionSignal/);
  assert.match(gameJs, /routeReturnText/);
  assert.match(gameJs, /routeCommandLabels/);
  assert.match(gameJs, /routeCommandText/);
  assert.match(gameJs, /routeBranchStepText/);
  assert.match(gameJs, /routePayoffSummaryText/);
  assert.match(gameJs, /routeActionText/);
  assert.match(gameJs, /branchChoiceSummaryText/);
  assert.match(gameJs, /buildFarRouteDispatchBranchChoiceSummaryText/);
  assert.match(gameJs, /buildFarRouteDispatchBranchRouteBranchStepText/);
  assert.match(gameJs, /buildFarRouteDispatchBranchRouteCommandText/);
  assert.match(gameJs, /function buildFarRouteDispatchBranchRouteRewardText/);
  assert.match(gameJs, /function buildFarRouteDispatchBranchRouteRewardSummaryText/);
  assert.match(gameJs, /function buildFarRouteDispatchBranchPayoffSummaryText/);
  assert.match(gameJs, /function getFarRouteDispatchBranchInstantPayoffRate/);
  assert.match(gameJs, /function buildFarRouteDispatchBranchRouteFlow/);
  assert.match(gameJs, /function buildFarRouteDispatchBranchRouteReturn/);
  assert.match(gameJs, /function buildFarRouteDispatchBranchRouteProgressPercent/);
  assert.match(appJs, /option\.recommended \? "is-recommended" : ""/);
  assert.match(appJs, /option\.cooling \? "is-cooling" : ""/);
  assert.match(appJs, /option\.dispatchRouteStepText \? "is-dispatch-route-step" : ""/);
  assert.match(appJs, /option\.finisherRecommended \? "is-finisher-recommended" : ""/);
  assert.match(appJs, /badges\.className = "directive-badges"/);
  assert.match(appJs, /compactDirectiveBadges\(badges\)/);
  assert.match(appJs, /overflow\.className = "directive-badge-overflow"/);
  assert.match(appJs, /preview\.textContent = getDirectivePreviewDisplayText\(option\)/);
  assert.match(appJs, /preview\.setAttribute\("aria-label", option\.previewText\)/);
  assert.match(appJs, /dispatchRouteStep\.className = "directive-dispatch-route-step"/);
  assert.match(appJs, /dispatchRouteStep\.textContent = option\.dispatchRouteStepText/);
  assert.match(
    appJs,
    /badges\.append\(\s*dispatchRouteStep,\s*dispatchLoopStreak,\s*dispatchLoopStreakCapstone,\s*recommendation,/
  );
  assert.match(appJs, /recommendation\.className = "directive-recommendation"/);
  assert.match(appJs, /recommendation\.textContent = option\.recommendationText/);
  assert.match(appJs, /planBonus\.className = "directive-plan-bonus"/);
  assert.match(appJs, /planBonus\.textContent = option\.planRewardText/);
  assert.match(appJs, /planBonus\.hidden = !option\.planRewardText/);
  assert.match(appJs, /taskBonus\.className = "directive-task-bonus"/);
  assert.match(appJs, /taskBonus\.textContent = option\.taskRewardText/);
  assert.match(appJs, /dispatchBonus\.className = "directive-dispatch-bonus"/);
  assert.match(appJs, /dispatchBonus\.textContent = option\.dispatchRewardText/);
  assert.match(appJs, /dispatchRelay\.className = "directive-dispatch-relay"/);
  assert.match(appJs, /dispatchRelay\.textContent = option\.dispatchRelayRewardText/);
  assert.match(appJs, /dispatchSync\.className = "directive-dispatch-sync"/);
  assert.match(appJs, /dispatchSync\.textContent = option\.dispatchSyncRewardText/);
  assert.match(appJs, /dispatchSyncSupply\.className = "directive-dispatch-sync-supply"/);
  assert.match(appJs, /dispatchSyncSupply\.textContent = option\.dispatchSyncSupplyText/);
  assert.match(appJs, /dispatchDetour\.className = "directive-dispatch-detour"/);
  assert.match(appJs, /dispatchDetour\.textContent = option\.dispatchDetourRewardText/);
  assert.match(appJs, /dispatchBranchShift\.className = "directive-dispatch-branch-shift"/);
  assert.match(appJs, /dispatchBranchShift\.textContent = option\.dispatchBranchShiftRewardText/);
  assert.match(appJs, /dispatchBranchStability\.className = "directive-dispatch-branch-stability"/);
  assert.match(appJs, /dispatchBranchStability\.textContent = option\.dispatchBranchStabilityRewardText/);
  assert.match(appJs, /dispatchBranchFocus\.className = "directive-dispatch-branch-focus"/);
  assert.match(appJs, /dispatchBranchFocus\.textContent = option\.dispatchBranchFocusRewardText/);
  assert.match(appJs, /dispatchBranchRotation\.className = "directive-dispatch-branch-rotation"/);
  assert.match(appJs, /dispatchBranchRotation\.textContent = option\.dispatchBranchRotationRewardText/);
  assert.match(appJs, /dispatchFocusLoop\.className = "directive-dispatch-focus-loop"/);
  assert.match(appJs, /dispatchFocusLoop\.textContent = option\.dispatchFocusLoopRewardText/);
  assert.match(appJs, /dispatchLoop\.className = "directive-dispatch-loop"/);
  assert.match(appJs, /dispatchLoop\.textContent = option\.dispatchLoopRewardText/);
  assert.match(appJs, /dispatchLoopStreak\.className = "directive-dispatch-loop-streak"/);
  assert.match(appJs, /dispatchLoopStreak\.textContent = option\.dispatchLoopStreakRewardText/);
  assert.match(appJs, /dispatchLoopStreakCapstone\.className =[\s\S]*"directive-dispatch-loop-streak-capstone"/);
  assert.match(appJs, /dispatchLoopStreakCapstone\.textContent =[\s\S]*option\.dispatchLoopStreakCapstoneRewardText/);
  assert.match(appJs, /dispatchBreakthrough\.className = "directive-dispatch-breakthrough"/);
  assert.match(appJs, /dispatchBreakthrough\.textContent = option\.dispatchBreakthroughRewardText/);
  assert.match(appJs, /dispatchDetourBreakthrough\.className = "directive-dispatch-detour-breakthrough"/);
  assert.match(appJs, /dispatchDetourBreakthrough\.textContent = option\.dispatchDetourBreakthroughRewardText/);
  assert.match(appJs, /dispatchDetourInfusion\.className = "directive-dispatch-detour-infusion"/);
  assert.match(appJs, /dispatchDetourInfusion\.textContent = option\.dispatchDetourInfusionText/);
  assert.match(appJs, /dispatchPrep\.className = "directive-dispatch-prep"/);
  assert.match(appJs, /dispatchPrep\.textContent = option\.dispatchPrepRewardText/);
  assert.match(appJs, /dispatchDetourPrep\.className = "directive-dispatch-detour-prep"/);
  assert.match(appJs, /dispatchDetourPrep\.textContent = option\.dispatchDetourPrepRewardText/);
  assert.match(appJs, /dispatchReturn\.className = "directive-dispatch-return"/);
  assert.match(appJs, /dispatchReturn\.textContent = option\.dispatchReturnRewardText/);
  assert.match(appJs, /dispatchRefresh\.className = "directive-dispatch-refresh"/);
  assert.match(appJs, /dispatchRefresh\.textContent = option\.dispatchRefreshText/);
  assert.match(appJs, /dispatchCooldown\.className = "directive-dispatch-cooldown"/);
  assert.match(appJs, /dispatchCooldown\.textContent = option\.dispatchCooldownText/);
  assert.match(appJs, /dispatchWindow\.className = "directive-dispatch-window"/);
  assert.match(appJs, /dispatchWindow\.textContent = option\.dispatchChainWindowText/);
  assert.match(appJs, /finisherRecommendation\.className = "directive-finisher-recommendation"/);
  assert.match(appJs, /finisherRecommendation\.textContent = option\.finisherRecommendationText/);
  assert.match(appJs, /masteryBonus\.className = "directive-mastery-bonus"/);
  assert.match(appJs, /masteryBonus\.textContent = option\.masteryBonusText/);
  assert.match(appJs, /stanceBonus\.className = "directive-stance-bonus"/);
  assert.match(appJs, /stanceBonus\.textContent = option\.stanceBonusText/);
  assert.match(appJs, /stateOrb\.className = "directive-state-orb"/);
  assert.match(appJs, /cooldownMeter\.className = "directive-cooldown-meter"/);
  assert.match(appJs, /cooldownMeter\.setAttribute\("aria-valuetext", option\.statusText\)/);
  assert.match(appJs, /cooldownFill\.style\.width/);
  assert.match(styles, /\.directive-plan/);
  assert.match(styles, /\.directive-plan-track/);
  assert.match(styles, /\.directive-plan-step/);
  assert.match(styles, /\.directive-plan-step\.is-complete/);
  assert.match(styles, /\.directive-plan-step\.is-next/);
  assert.match(styles, /\.directive-task/);
  assert.match(styles, /\.directive-task-text,\s+\.far-dispatch-text/);
  assert.match(styles, /\.directive-task-meter/);
  assert.match(styles, /\.directive-task\.is-completed/);
  assert.match(styles, /\.far-dispatch/);
  assert.match(styles, /\.far-dispatch-branch/);
  assert.match(styles, /\.far-dispatch-branch\.is-sync/);
  assert.match(styles, /\.far-dispatch-branch\.is-detour/);
  assert.match(styles, /\.far-dispatch-branch-recommendation/);
  assert.match(styles, /\.far-dispatch-branch-rotation/);
  assert.match(styles, /\.far-dispatch-branch-route/);
  assert.match(styles, /\.far-dispatch-branch-plan/);
  assert.match(styles, /\.far-dispatch-branch-step/);
  assert.match(styles, /\.far-dispatch-branch-closure/);
  assert.match(styles, /\.far-dispatch-branch-choices/);
  assert.match(styles, /\.far-dispatch-branch-choice-legend/);
  assert.match(styles, /grid-column: 1 \/ -1/);
  assert.match(styles, /\.far-dispatch-branch-choice-legend-item/);
  assert.match(styles, /\.far-dispatch-branch-choice-legend-item::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary\[hidden\]/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route strong/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route\.is-detour strong/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary:has\(\.far-dispatch-branch-choice-summary-item\.is-active-route\) \{\s*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route \{[\s\S]*grid-template-areas:\s*\n\s*"glyph label signal action action"/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route \{[\s\S]*"glyph phase step reward payoff"/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route \{[\s\S]*"glyph intent cost result result"/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary:has\(\.far-dispatch-branch-choice-summary-item\.is-active-route\)[\s\S]*\.far-dispatch-branch-choice-summary-item:not\(\.is-active-route\)/);
  assert.match(styles, /filter: saturate\(0\.72\)/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary:has\(\.far-dispatch-branch-choice-summary-item\.is-active-route\)[\s\S]*\.far-dispatch-branch-choice-summary-item:not\(\.is-active-route\):hover/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-progress::after/);
  assert.match(styles, /animation: farDispatchSummaryActiveRouteSweep 1450ms ease-in-out infinite/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-progress-node\.is-next/);
  assert.match(styles, /animation: farDispatchSummaryNextNodePulse 1200ms ease-in-out infinite/);
  assert.match(styles, /grid-template-areas:\s*\n\s*"glyph label signal action step"/);
  assert.match(styles, /"glyph phase reward payoff intent"/);
  assert.match(styles, /"glyph cost result result result"/);
  assert.match(styles, /"progress progress progress progress progress"/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-focused/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-glyph/);
  assert.match(styles, /grid-area: glyph/);
  assert.match(styles, /grid-area: label/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-glyph\.is-current/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-glyph\.is-progress/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-glyph\.is-current/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-glyph\.is-progress/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal/);
  assert.match(styles, /grid-area: signal/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal\.is-archive/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal\.is-archive::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal\.is-focus/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal\.is-focus::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal\.is-stable/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal\.is-stable::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal\.is-shift/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal\.is-shift::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal\.is-completed/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-signal\.is-completed::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-signal/);
  assert.match(styles, /animation: farDispatchSummarySignalBeacon 1450ms ease-in-out infinite/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-phase/);
  assert.match(styles, /grid-area: phase/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-phase\.is-branch/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-phase\.is-complete/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-phase/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-action/);
  assert.match(styles, /grid-area: action/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-action::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-action:not\(\.is-idle\)::before/);
  assert.match(styles, /animation: farDispatchSummaryActionBeacon 1200ms ease-in-out infinite/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-action:not\(\.is-idle\)/);
  assert.match(styles, /animation: farDispatchSummaryActiveActionGlow 1450ms ease-in-out infinite/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-payoff/);
  assert.match(styles, /animation: farDispatchSummaryActivePayoffGlow 1450ms ease-in-out infinite/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-action\.is-return/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-action\.is-prep/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-action\.is-idle::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-reward/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-step/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-payoff/);
  assert.match(styles, /grid-area: reward/);
  assert.match(styles, /grid-area: step/);
  assert.match(styles, /grid-area: payoff/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-reward/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-step/);
  assert.match(styles, /grid-area: intent/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-intent\.is-preserve/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-intent\.is-advance/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-intent/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-intent\.is-advance/);
  assert.match(styles, /grid-area: cost/);
  assert.match(styles, /grid-area: result/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-cost/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-cost\.is-spend/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*\.far-dispatch-branch-choice-summary-result/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-result\.has-loop-streak/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-result\.has-loop-capstone/);
  assert.match(styles, /animation: farDispatchSummaryLoopStreakResultGlow 1450ms ease-in-out infinite/);
  assert.match(styles, /animation: farDispatchSummaryLoopCapstoneResultGlow 1450ms ease-in-out infinite/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-result\.has-loop-streak::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-result\.has-loop-capstone::after/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route\.is-detour[\s\S]*\.far-dispatch-branch-choice-summary-result\.has-loop-streak/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route\.is-detour[\s\S]*\.far-dispatch-branch-choice-summary-result\.has-loop-capstone/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-detour \.far-dispatch-branch-choice-summary-reward/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route\.is-detour[\s\S]*\.far-dispatch-branch-choice-summary-reward/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-detour \.far-dispatch-branch-choice-summary-step/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-active-route\.is-detour[\s\S]*\.far-dispatch-branch-choice-summary-step/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-item\.is-detour \.far-dispatch-branch-choice-summary-payoff/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-cost\.is-safe/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-result\.is-detour/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-progress/);
  assert.match(styles, /grid-area: progress/);
  assert.match(styles, /--summary-route-progress/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-progress::after/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-progress\.is-detour::after/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-progress-node\.is-done/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-progress-node\.is-next/);
  assert.match(styles, /\.far-dispatch-branch-choice-summary-progress-node::before/);
  assert.match(styles, /content: attr\(data-step-label\)/);
  assert.match(styles, /@keyframes farDispatchSummaryActionBeacon/);
  assert.match(styles, /@keyframes farDispatchSummaryActiveRouteSweep/);
  assert.match(styles, /@keyframes farDispatchSummaryNextNodePulse/);
  assert.match(styles, /@keyframes farDispatchSummaryActiveActionGlow/);
  assert.match(styles, /@keyframes farDispatchSummaryActivePayoffGlow/);
  assert.match(styles, /@keyframes farDispatchSummaryLoopStreakResultGlow/);
  assert.match(styles, /@keyframes farDispatchSummaryLoopCapstoneResultGlow/);
  assert.match(styles, /@keyframes farDispatchSummarySignalBeacon/);
  assert.match(styles, /@keyframes farDispatchLoopStreakBeacon/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch-branch-choice-summary-item\.is-active-route[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch-branch-choice-summary-signal[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch-branch-choice-summary-payoff[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch-branch-choice-summary-result\.has-loop-streak[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch-branch-choice-summary-result\.has-loop-capstone[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch\.is-active \.far-dispatch-loop-streak[\s\S]*animation: none/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*\.far-dispatch-branch-choice-summary \{[\s\S]*grid-template-columns: 1fr/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*"glyph label signal action"/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*"glyph phase reward payoff"/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*"glyph step intent cost"/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*"glyph result result result"/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*"progress progress progress progress"/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*\.far-dispatch-branch-choice-summary-item\.is-active-route \{[\s\S]*grid-template-columns: 18px repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*\.far-dispatch-branch-choice-summary-item\.is-active-route \{[\s\S]*"glyph label signal action"/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*\.far-dispatch-branch-choice-summary-item\.is-active-route \{[\s\S]*"glyph phase reward payoff"/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*\.far-dispatch-branch-choice-summary-item\.is-active-route \{[\s\S]*"glyph step intent result"/);
  assert.match(styles, /@media \(max-width: 820px\) \{[\s\S]*\.far-dispatch-branch-choice-summary-item\.is-active-route \{[\s\S]*"glyph cost result result"/);
  assert.match(styles, /\.far-dispatch-branch-choice\.is-sync/);
  assert.match(styles, /\.far-dispatch-branch-choice\.is-detour/);
  assert.match(styles, /\.far-dispatch-branch-choice\.is-shift/);
  assert.match(styles, /\.far-dispatch-branch-choice\.is-focused/);
  assert.match(styles, /\.far-dispatch-branch-choice\.is-decision-recommended/);
  assert.match(styles, /\.far-dispatch-branch-choice\.is-decision-recommended-shift/);
  assert.match(styles, /\.far-dispatch-branch-choice\.is-decision-fallback/);
  assert.match(styles, /\.far-dispatch-branch-choice-head/);
  assert.match(styles, /\.far-dispatch-branch-choice-badge/);
  assert.match(styles, /\.far-dispatch-branch-choice-badge\.is-recommended-shift/);
  assert.match(styles, /\.far-dispatch-branch-choice-cost/);
  assert.match(styles, /\.far-dispatch-branch-choice-cost\.is-safe/);
  assert.match(styles, /\.far-dispatch-branch-choice-cost\.is-spend/);
  assert.match(styles, /\.far-dispatch-branch-choice-intent/);
  assert.match(styles, /\.far-dispatch-branch-choice-intent\.is-preserve/);
  assert.match(styles, /\.far-dispatch-branch-choice-intent\.is-advance/);
  assert.match(styles, /\.far-dispatch-branch-choice-route/);
  assert.match(styles, /--branch-route-progress: 0%/);
  assert.match(styles, /--branch-route-line-fill/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-line/);
  assert.match(styles, /var\(--branch-route-line-fill\) 0 var\(--branch-route-progress\)/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-line::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-line::after/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-node/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-node::after/);
  assert.match(styles, /content: attr\(data-step-label\)/);
  assert.match(styles, /border-left: 6px solid rgba\(248, 243, 231, 0\.56\)/);
  assert.match(styles, /\.far-dispatch-branch-choice-route \.far-dispatch-branch-choice-route-node\.is-done/);
  assert.match(styles, /\.far-dispatch-branch-choice-route \.far-dispatch-branch-choice-route-node\.is-next/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-resource/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-resource\.is-current/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-resource\.is-progress/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-marker/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-marker\.is-current/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-marker\.is-recommended/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-marker\.is-recommended-shift/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-marker\.is-previous/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-marker\.is-shift/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-phase/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-phase\.is-start/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-phase\.is-return/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-phase\.is-complete/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-flow/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-flow\.is-current/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-flow\.is-progress/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-reward/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-reward\.is-start/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-reward\.is-branch/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-reward\.is-return/);
  assert.match(styles, /\.far-dispatch-branch-choice-route\.is-detour \.far-dispatch-branch-choice-route-reward\.is-branch/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-command/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1fr\) auto minmax\(0, 1fr\) auto minmax\(0, 1fr\)/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-command-step/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-command-step::before/);
  assert.match(styles, /content: attr\(data-step-label\)/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-command-step\.is-done/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-command-step\.is-next/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-command-step\.is-waiting/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-command-step\.is-start/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-command-step\.is-branch/);
  assert.match(styles, /\.far-dispatch-branch-choice\.is-detour \.far-dispatch-branch-choice-route-command-step\.is-branch/);
  assert.match(styles, /\.far-dispatch-branch-choice-route-command-arrow/);
  assert.match(styles, /\.far-dispatch-branch-choice-route\.is-sync/);
  assert.match(styles, /\.far-dispatch-branch-choice-route\.is-sync \.far-dispatch-branch-choice-route-line::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-route\.is-detour/);
  assert.match(styles, /\.far-dispatch-branch-choice-route\.is-detour \.far-dispatch-branch-choice-route-line::before/);
  assert.match(styles, /\.far-dispatch-branch-choice-route\.is-shift/);
  assert.match(styles, /\.far-dispatch-branch-choice small/);
  assert.match(styles, /\.far-dispatch-branch-choice-decision/);
  assert.match(styles, /\.far-dispatch-branch-choice-decision\.is-recommended-shift/);
  assert.match(styles, /\.far-dispatch-branch-choice-reason/);
  assert.match(styles, /\.far-dispatch-branch-choice-objective/);
  assert.match(styles, /\.far-dispatch-branch-choice-followup/);
  assert.match(styles, /\.far-dispatch-branch-choice-payoff/);
  assert.match(styles, /\.far-dispatch-branch-choice-details/);
  assert.match(styles, /\.far-dispatch-branch-choice-details summary \{[\s\S]*text-overflow: ellipsis/);
  assert.match(styles, /\.far-dispatch-branch-choice-details\.is-return-far summary/);
  assert.match(styles, /\.far-dispatch-branch-choice-details\.is-return-detour summary/);
  assert.match(styles, /\.far-dispatch-branch-choice-details\[open\] summary::after/);
  assert.match(styles, /\.far-dispatch-branch-choice-detail-grid/);
  assert.match(styles, /\.directive-button \.directive-dispatch-branch-focus/);
  assert.match(styles, /\.directive-button \.directive-dispatch-branch-rotation/);
  assert.match(styles, /\.directive-button \.directive-dispatch-focus-loop/);
  assert.match(styles, /text-overflow: ellipsis/);
  assert.match(styles, /\.far-dispatch-meter/);
  assert.match(styles, /\.far-dispatch\.has-loop-streak/);
  assert.match(styles, /\.far-dispatch-loop-text/);
  assert.match(styles, /\.far-dispatch-loop-streak/);
  assert.match(styles, /\.far-dispatch-loop-streak\[hidden\]/);
  assert.match(styles, /\.far-dispatch-loop-streak::before/);
  assert.match(styles, /\.far-dispatch\.is-active \.far-dispatch-loop-streak/);
  assert.match(styles, /\.far-dispatch-loop-meter/);
  assert.match(styles, /\.far-dispatch-loop-track/);
  assert.match(styles, /\.far-dispatch-loop-visual/);
  assert.match(styles, /--far-loop-visual-progress/);
  assert.match(styles, /\.far-dispatch-loop-visual::before/);
  assert.match(styles, /\.far-dispatch-loop-visual::after/);
  assert.match(styles, /\.far-dispatch\.is-active \.far-dispatch-loop-visual::after/);
  assert.match(styles, /\.far-dispatch-loop-visual-arrow/);
  assert.match(styles, /\.far-dispatch-loop-visual-arrow\.is-segment-1/);
  assert.match(styles, /\.far-dispatch-loop-visual-arrow\.is-segment-2/);
  assert.match(styles, /\.far-dispatch-loop-visual-arrow\.is-completed/);
  assert.match(styles, /\.far-dispatch-loop-visual-arrow\.is-current/);
  assert.match(styles, /farDispatchLoopCurrentArrowPulse/);
  assert.match(styles, /\.far-dispatch-loop-visual-point/);
  assert.match(styles, /\.far-dispatch-loop-visual-point::before/);
  assert.match(styles, /\.far-dispatch\.is-active \.far-dispatch-loop-visual-point\.is-current::before/);
  assert.match(styles, /animation: farDispatchLoopCurrentPointColumnGlow 1450ms ease-in-out infinite/);
  assert.match(styles, /\.far-dispatch-loop-visual-node/);
  assert.match(styles, /\.far-dispatch-loop-visual-node::before/);
  assert.match(styles, /content: attr\(data-step-label\)/);
  assert.match(styles, /\.far-dispatch-loop-visual-node\.is-completed/);
  assert.match(styles, /\.far-dispatch-loop-visual-node\.is-current/);
  assert.match(styles, /\.far-dispatch-loop-visual-node\.is-current::after/);
  assert.match(styles, /@keyframes farDispatchLoopCurrentPulse/);
  assert.match(styles, /@keyframes farDispatchLoopCurrentArrowPulse/);
  assert.match(styles, /@keyframes farDispatchLoopVisualTrackSweep/);
  assert.match(styles, /@keyframes farDispatchLoopCurrentPointColumnGlow/);
  assert.match(styles, /@keyframes farDispatchLoopCurrentStepGlow/);
  assert.match(styles, /@keyframes farDispatchSceneImagePulse/);
  assert.match(styles, /\.far-dispatch-loop-visual-reward/);
  assert.match(styles, /\.far-dispatch-loop-visual-reward::before/);
  assert.match(styles, /content: attr\(data-reward-label\)/);
  assert.match(styles, /\.far-dispatch-loop-visual-reward\.is-target/);
  assert.match(styles, /\.far-dispatch-loop-visual-reward\.is-branch/);
  assert.match(styles, /\.far-dispatch-loop-visual-reward\.is-relay/);
  assert.match(styles, /\.far-dispatch-loop-visual-reward\.is-return/);
  assert.match(styles, /\.far-dispatch-loop-visual-reward\.is-current/);
  assert.match(styles, /\.far-dispatch\.is-active \.far-dispatch-loop-visual-reward\.is-current/);
  assert.match(styles, /animation: farDispatchLoopCurrentRewardGlow 1450ms ease-in-out infinite/);
  assert.match(styles, /@keyframes farDispatchLoopCurrentRewardGlow/);
  assert.match(styles, /\.far-dispatch-loop-link/);
  assert.match(styles, /\.far-dispatch-loop-link::before/);
  assert.match(styles, /\.far-dispatch-loop-link::after/);
  assert.match(styles, /\.far-dispatch-loop-link\.is-target/);
  assert.match(styles, /\.far-dispatch-loop-link\.is-branch,\n\.far-dispatch-loop-link\.is-relay/);
  assert.match(styles, /\.far-dispatch-loop-link\.is-return/);
  assert.match(styles, /\.far-dispatch-loop-link\.is-current/);
  assert.match(styles, /\.far-dispatch-loop-link\.is-completed/);
  assert.match(styles, /\.far-dispatch-loop-link\.is-current::after,\n\.far-dispatch-loop-link\.is-completed::after/);
  assert.match(styles, /\.far-dispatch-loop-link\.is-current::before,\n\.far-dispatch-loop-link\.is-current::after/);
  assert.match(styles, /@keyframes farDispatchLoopCurrentLinkPulse/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch-loop-visual-arrow\.is-current[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch\.is-active \.far-dispatch-scene-image[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch\.is-active \.far-dispatch-loop-visual::after[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch\.is-active \.far-dispatch-loop-visual-point\.is-current::before[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch\.is-active \.far-dispatch-loop-visual-reward\.is-current[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch-loop-visual-node\.is-current::after[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch-loop-link\.is-current::before[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch-loop-step\.is-current[\s\S]*animation: none/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-current/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-current \{[\s\S]*animation: farDispatchLoopCurrentStepGlow 1450ms ease-in-out infinite/);
  assert.match(styles, /\.far-dispatch-loop-step::before/);
  assert.match(styles, /content: attr\(data-step-label\)/);
  assert.match(styles, /\.far-dispatch-loop-step::after/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-target::before/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-branch::before/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-relay::before/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-return::before/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-current strong/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-current strong \{[\s\S]*justify-self: start/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-current strong \{[\s\S]*color: #fff7c2/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-current span/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-current span \{[\s\S]*border-left: 2px solid rgba\(255, 211, 106, 0\.5\)/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-current span \{[\s\S]*color: #fffbe8/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-current::before/);
  assert.match(styles, /\.far-dispatch\.is-active \.far-dispatch-loop-step\.is-current::before/);
  assert.match(styles, /animation: farDispatchLoopCurrentStepBadgeGlow 1450ms ease-in-out infinite/);
  assert.match(styles, /@keyframes farDispatchLoopCurrentStepBadgeGlow/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch\.is-active \.far-dispatch-loop-step\.is-current::before[\s\S]*animation: none/);
  assert.match(styles, /\.far-dispatch\.is-active \.far-dispatch-loop-step\.is-current::after/);
  assert.match(styles, /animation: farDispatchLoopCurrentStepRailGlow 1450ms ease-in-out infinite/);
  assert.match(styles, /@keyframes farDispatchLoopCurrentStepRailGlow/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch\.is-active \.far-dispatch-loop-step\.is-current::after[\s\S]*animation: none/);
  assert.match(styles, /\.far-dispatch-loop-step\.is-completed::before/);
  assert.match(styles, /\.far-dispatch-loop-step em/);
  assert.match(styles, /\.far-dispatch-step-reward/);
  assert.match(styles, /\.far-dispatch-step-reward\.is-target/);
  assert.match(styles, /\.far-dispatch-step-reward\.is-branch,\n\.far-dispatch-step-reward\.is-relay/);
  assert.match(styles, /\.far-dispatch-step-reward\.is-return/);
  assert.match(styles, /\.far-dispatch-step-reward\.is-current/);
  assert.match(styles, /\.far-dispatch\.is-active \.far-dispatch-step-reward\.is-current/);
  assert.match(styles, /animation: farDispatchStepRewardCurrentGlow 1450ms ease-in-out infinite/);
  assert.match(styles, /@keyframes farDispatchStepRewardCurrentGlow/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.far-dispatch\.is-active \.far-dispatch-step-reward\.is-current[\s\S]*animation: none/);
  assert.match(styles, /\.far-dispatch-step-reward\.is-completed/);
  assert.match(styles, /\.far-dispatch\.is-active/);
  assert.match(styles, /\.directive-button \.directive-badges/);
  assert.match(styles, /\.directive-button \.directive-badges \.is-collapsed-badge/);
  assert.match(styles, /\.directive-button \.directive-badge-overflow/);
  assert.match(styles, /\.directive-button\.is-recommended/);
  assert.match(styles, /\.directive-button\.is-dispatch-route-step/);
  assert.match(styles, /animation: directiveDispatchRouteStepBeacon 1450ms ease-in-out infinite/);
  assert.match(styles, /\.directive-button\.is-dispatch-route-step \.directive-visual/);
  assert.match(styles, /\.directive-button\.is-dispatch-route-step \.directive-dispatch-route-step/);
  assert.match(styles, /\.directive-button\.is-dispatch-route-step \.directive-dispatch-loop-streak/);
  assert.match(styles, /\.directive-button\.is-dispatch-route-step \.directive-dispatch-loop-streak::before/);
  assert.match(styles, /animation: directiveDispatchLoopStreakBeacon 1450ms ease-in-out infinite/);
  assert.match(styles, /\.directive-button\.is-dispatch-route-step \.directive-status/);
  assert.match(styles, /\.directive-button\.is-dispatch-route-step \.directive-status::before/);
  assert.match(styles, /animation: directiveDispatchRouteStatusBeacon 1300ms ease-in-out infinite/);
  assert.match(styles, /\.directive-button\.is-dispatch-route-step\.is-ready \.directive-status/);
  assert.match(styles, /\.directive-button\.is-dispatch-route-step\.is-cooling \.directive-status/);
  assert.match(styles, /@keyframes directiveDispatchRouteStepBeacon/);
  assert.match(styles, /@keyframes directiveDispatchRouteStatusBeacon/);
  assert.match(styles, /@keyframes directiveDispatchLoopStreakBeacon/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.directive-button\.is-dispatch-route-step[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.directive-button\.is-dispatch-route-step \.directive-dispatch-loop-streak[\s\S]*animation: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.directive-button\.is-dispatch-route-step \.directive-status::before[\s\S]*animation: none/);
  assert.match(styles, /\.directive-button\.is-finisher-recommended/);
  assert.match(styles, /\.directive-button \.directive-dispatch-route-step/);
  assert.match(styles, /\.directive-button \.directive-recommendation/);
  assert.match(styles, /\.directive-button \.directive-plan-bonus/);
  assert.match(styles, /\.directive-button \.directive-task-bonus/);
  assert.match(styles, /\.directive-button \.directive-dispatch-bonus/);
  assert.match(styles, /\.directive-button \.directive-dispatch-relay/);
  assert.match(styles, /\.directive-button \.directive-dispatch-sync/);
  assert.match(styles, /\.directive-button \.directive-dispatch-sync-supply/);
  assert.match(styles, /\.directive-button \.directive-dispatch-detour/);
  assert.match(styles, /\.directive-button \.directive-dispatch-branch-shift/);
  assert.match(styles, /\.directive-button \.directive-dispatch-branch-stability/);
  assert.match(styles, /\.directive-button \.directive-dispatch-branch-rotation/);
  assert.match(styles, /\.directive-button \.directive-dispatch-focus-loop/);
  assert.match(styles, /\.directive-button \.directive-dispatch-loop/);
  assert.match(styles, /\.directive-button \.directive-dispatch-loop-streak/);
  assert.match(styles, /\.directive-button \.directive-dispatch-loop-streak-capstone/);
  assert.match(styles, /\.directive-button \.directive-dispatch-breakthrough/);
  assert.match(styles, /\.directive-button \.directive-dispatch-detour-breakthrough/);
  assert.match(styles, /\.directive-button \.directive-dispatch-detour-infusion/);
  assert.match(styles, /\.directive-button \.directive-dispatch-prep/);
  assert.match(styles, /\.directive-button \.directive-dispatch-detour-prep/);
  assert.match(styles, /\.directive-button \.directive-dispatch-return/);
  assert.match(styles, /\.directive-button \.directive-dispatch-refresh/);
  assert.match(styles, /\.directive-button \.directive-dispatch-cooldown/);
  assert.match(styles, /\.directive-button \.directive-dispatch-window/);
  assert.match(styles, /\.directive-button \.directive-finisher-recommendation/);
  assert.match(styles, /\.directive-button \.directive-mastery-bonus/);
  assert.match(styles, /\.directive-button \.directive-stance-bonus/);
  assert.match(styles, /\.directive-state-orb/);
  assert.match(styles, /\.directive-visual\.is-ready \.directive-state-orb/);
  assert.match(styles, /\.directive-visual\.is-cooling \.directive-state-orb/);
  assert.match(styles, /\.directive-cooldown-meter/);
  assert.match(styles, /\.directive-cooldown-meter span/);
});

test("静态首页会默认折叠星图详细文本", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /<details class="project-detail-drawer">/);
  assert.doesNotMatch(indexHtml, /<details class="project-detail-drawer" open>/);
  assert.match(indexHtml, /<summary>星图明细<\/summary>/);
  assert.match(indexHtml, /id="projectOverviewDispatch" class="project-overview-dispatch" hidden/);
  assert.match(indexHtml, /projectOverviewTracks/);
  assert.match(indexHtml, /projectOverviewAction/);
  assert.match(indexHtml, /projectOverviewForecast/);
  assert.match(indexHtml, />航线预告：接下来 3 段 · 下一段 1\/57 点亮星图<\/em>/);
  assert.match(indexHtml, /title="航线预告：点亮星图（总产能 \+12%）、谐振校准（过载奖励 \+20%）、透镜阵列（点击产能 \+18%）"/);
  assert.match(appJs, /projectOverviewDispatch: document\.querySelector\("#projectOverviewDispatch"\)/);
  assert.match(appJs, /elements\.projectOverviewDispatch\.textContent = projectOverview\.dispatchText/);
  assert.match(appJs, /elements\.projectOverviewDispatch\.hidden = !projectOverview\.dispatchText/);
  assert.match(appJs, /projectOverview\.forecastDetailText/);
  assert.match(styles, /\.project-detail-drawer/);
  assert.match(styles, /\.project-detail-grid/);
  assert.match(styles, /\.project-overview-dispatch/);
  assert.match(styles, /\.project-overview em \{[\s\S]*text-overflow: ellipsis/);
});

test("静态首页会默认折叠星图筛选长摘要并显示筛选视觉标识", () => {
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
  assert.match(indexHtml, /<button class="project-filter-button is-filter-chapter is-active" type="button" aria-pressed="true">本章 0\/4<\/button>/);
  assert.match(indexHtml, /<button class="project-filter-button is-filter-chapter is-filter-chapter-starter" type="button" aria-pressed="false">首段星图 0\/4<\/button>/);
  assert.match(indexHtml, /<button class="project-filter-button is-filter-chapter is-filter-chapter-tail" type="button" aria-pressed="false">远航长尾 0\/44<\/button>/);
  assert.match(indexHtml, /<button class="project-filter-button is-filter-reward is-filter-reward-overload" type="button" aria-pressed="false">过载 0\/11<\/button>/);
  assert.match(indexHtml, /筛选摘要：本章 0\/4 · 下一条 航段 1\/57 点亮星图/);
  assert.match(indexHtml, /id="projectFilterSummaryBrief"[\s\S]*aria-label="筛选视图：本章 4 段/);
  assert.match(indexHtml, /终点 航段 4\/57 · 首段星图 4\/4 采集阵列/);
  assert.match(appJs, /INITIAL_PROJECT_FILTER_ID/);
  assert.match(appJs, /let projectFilter = INITIAL_PROJECT_FILTER_ID/);
  assert.match(appJs, /getProjectFilterBrief/);
  assert.match(appJs, /PROJECT_FILTER_VISUAL_CLASSES/);
  assert.match(appJs, /getProjectFilterVisualClass\(filter\.id\)/);
  assert.match(appJs, /projectFilterSummaryBrief: document\.querySelector\("#projectFilterSummaryBrief"\)/);
  assert.match(appJs, /setCompactSupportText\(\s*elements\.projectFilterSummaryBrief/);
  assert.match(styles, /\.project-filter-controls/);
  assert.match(styles, /\.project-filter-controls\[open\] summary::after/);
  assert.match(styles, /\.project-filter-button::before/);
  assert.match(styles, /\.project-filter-button\.is-filter-chapter-tail::before/);
  assert.match(styles, /\.project-filter-button\.is-filter-reward-overload::before/);
  assert.match(styles, /\.project-filter-drawer/);
  assert.match(styles, /\.project-filter-drawer summary \{[\s\S]*text-overflow: ellipsis/);
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
    "航线预告：接下来 3 段 · 下一段 2/57 谐振校准"
  );
  assert.equal(
    overview.forecastDetailText,
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
    energy: 3_500_000,
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
  const overview = getProjectOverview(state, 1000);
  const currentProject = getProjectStatuses(state, 1000).find(
    (project) => project.isCurrent
  );
  const plan = getDirectivePlan(state, 1000);
  const status = getDirectiveStatus(state, 1000);
  const ignitionOption = status.options.find((option) => option.id === "ignition-salvo");
  const cruiseOption = status.options.find((option) => option.id === "cruise-cache");
  const resonanceOption = status.options.find(
    (option) => option.id === "resonance-pulse"
  );
  const ignitionResult = activateDirective(state, "ignition-salvo", 1000);
  const cruiseResult = activateDirective(state, "cruise-cache", 1000);
  const cooledState = {
    ...state,
    directives: {
      ...state.directives,
      "ignition-salvo": 1000
    }
  };
  const coolingStatus = getDirectiveStatus(cooledState, 20_000);
  const cooledStatus = getDirectiveStatus(cooledState, 26_000);
  const coolingIgnitionOption = coolingStatus.options.find(
    (option) => option.id === "ignition-salvo"
  );
  const cooledIgnitionOption = cooledStatus.options.find(
    (option) => option.id === "ignition-salvo"
  );
  const cooledIgnitionResult = activateDirective(cooledState, "ignition-salvo", 26_000);
  const relayState = {
    ...state,
    directives: {
      ...state.directives,
      "ignition-salvo": 1000
    },
    directiveChain: {
      lastDirectiveId: "ignition-salvo",
      stacks: 0,
      expiresAt: 121_000
    }
  };
  const relayStatus = getDirectiveStatus(relayState, 30_000);
  const relayPlan = getDirectivePlan(relayState, 30_000);
  const relayCruiseOption = relayStatus.options.find(
    (option) => option.id === "cruise-cache"
  );
  const relayResonanceOption = relayStatus.options.find(
    (option) => option.id === "resonance-pulse"
  );
  const relayDispatch = getFarRouteDispatch(relayState, 30_000);
  const streakOverview = getProjectOverview(
    {
      ...relayState,
      farRouteLoopStreak: 1
    },
    30_000
  );
  const streakProject = getProjectStatuses(
    {
      ...relayState,
      farRouteLoopStreak: 1
    },
    30_000
  ).find((project) => project.isCurrent);
  const relayCruiseResult = activateDirective(relayState, "cruise-cache", 30_000);
  const relayResonanceResult = activateDirective(relayState, "resonance-pulse", 30_000);
  const quickBranchStatus = getDirectiveStatus(relayState, 5_000);
  const quickBranchCruiseOption = quickBranchStatus.options.find(
    (option) => option.id === "cruise-cache"
  );
  const quickBranchResult = activateDirective(relayState, "cruise-cache", 5_000);
  const quickReturnStatus = getDirectiveStatus(quickBranchResult.state, 6_000);
  const quickReturnIgnitionOption = quickReturnStatus.options.find(
    (option) => option.id === "ignition-salvo"
  );
  const quickReturnResult = activateDirective(
    quickBranchResult.state,
    "ignition-salvo",
    6_000
  );
  const detourDispatch = getFarRouteDispatch(relayCruiseResult.state, 31_000);
  const detourPlan = getDirectivePlan(relayCruiseResult.state, 31_000);
  const detourStatus = getDirectiveStatus(relayCruiseResult.state, 31_000);
  const detourIgnitionOption = detourStatus.options.find(
    (option) => option.id === "ignition-salvo"
  );
  const detourIgnitionResult = activateDirective(
    relayCruiseResult.state,
    "ignition-salvo",
    31_000
  );
  const detourCompletedDispatch = getFarRouteDispatch(detourIgnitionResult.state, 32_000);
  const detourCompletedPlan = getDirectivePlan(detourIgnitionResult.state, 32_000);
  const detourCompletedStatus = getDirectiveStatus(detourIgnitionResult.state, 32_000);
  const detourCompletedCruiseOption = detourCompletedStatus.options.find(
    (option) => option.id === "cruise-cache"
  );
  const detourCompletedCruiseResult = activateDirective(
    detourIgnitionResult.state,
    "cruise-cache",
    32_000
  );
  const relayWaitingState = {
    ...relayState,
    directives: {
      ...relayState.directives,
      "cruise-cache": 29_000,
      "resonance-pulse": 29_000
    }
  };
  const relayWaitingStatus = getDirectiveStatus(relayWaitingState, 30_000);
  const relayWaitingResonanceOption = relayWaitingStatus.options.find(
    (option) => option.id === "resonance-pulse"
  );
  const loopState = {
    ...state,
    directives: {
      ...state.directives,
      "ignition-salvo": 1000,
      "resonance-pulse": 20_000
    },
    directiveChain: {
      lastDirectiveId: "resonance-pulse",
      stacks: 1,
      expiresAt: 121_000
    }
  };
  const loopStatus = getDirectiveStatus(loopState, 30_000);
  const loopPlan = getDirectivePlan(loopState, 30_000);
  const loopIgnitionOption = loopStatus.options.find(
    (option) => option.id === "ignition-salvo"
  );
  const loopDispatch = getFarRouteDispatch(loopState, 30_000);
  const loopIgnitionResult = activateDirective(loopState, "ignition-salvo", 30_000);
  const completedDispatch = getFarRouteDispatch(loopIgnitionResult.state, 31_000);
  const completedResonanceResult = activateDirective(
    loopIgnitionResult.state,
    "resonance-pulse",
    31_000
  );
  const returnDispatch = getFarRouteDispatch(completedResonanceResult.state, 56_000);
  const returnPlan = getDirectivePlan(completedResonanceResult.state, 56_000);
  const returnStatus = getDirectiveStatus(completedResonanceResult.state, 56_000);
  const returnIgnitionOption = returnStatus.options.find(
    (option) => option.id === "ignition-salvo"
  );
  const returnIgnitionResult = activateDirective(
    completedResonanceResult.state,
    "ignition-salvo",
    56_000
  );

  assert.equal(FAR_ROUTE_DISPATCH_UNLOCK_ENERGY, 20_000_000);
  assert.equal(FAR_ROUTE_DISPATCH_BONUS_RATE, 0.14);
  assert.equal(FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER, 0.7);
  assert.equal(FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS, 30);
  assert.equal(FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE, 0.08);
  assert.equal(FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE, 0.05);
  assert.equal(FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE, 0.03);
  assert.equal(FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE, 0.16);
  assert.equal(FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE, 0.0005);
  assert.equal(FAR_ROUTE_DISPATCH_PREP_REWARD_RATE, 0.07);
  assert.equal(FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE, 0.06);
  assert.equal(FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE, 0.04);
  assert.equal(FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE, 0.0003);
  assert.equal(FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE, 0.003);
  assert.equal(FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER, 1.5);
  assert.equal(FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE, 0.05);
  assert.equal(FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE, 0.06);
  assert.equal(FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE, 0.04);
  assert.equal(FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE, 0.05);
  assert.equal(FAR_ROUTE_DISPATCH_LOOP_STREAK_REWARD_STEP, 0.03);
  assert.equal(FAR_ROUTE_DISPATCH_LOOP_STREAK_MAX_STACKS, 3);
  assert.equal(locked.unlocked, false);
  assert.equal(locked.loopProgress, 0);
  assert.equal(locked.loopTarget, 3);
  assert.deepEqual(locked.loopSteps, []);
  assert.equal(locked.loopStepText, "");
  assert.equal(locked.branchKind, "locked");
  assert.equal(locked.branchText, "");
  assert.equal(locked.branchRecommendationText, "");
  assert.equal(locked.branchRotationText, "");
  assert.equal(locked.branchRouteText, "");
  assert.equal(locked.branchPlanText, "");
  assert.equal(locked.branchPlanStepText, "");
  assert.equal(locked.branchClosureText, "");
  assert.deepEqual(locked.branchChoices, []);
  assert.equal(locked.branchChoiceText, "");
  assert.equal(locked.loopStatusText, "闭环进度 0/3 · 20M 后解锁");
  assert.equal(
    locked.text,
    "远航调度：累计 20M 能量后解锁后半段航段调度、目标指令推荐、目标冷却缩短、连携窗口延长、远航续航、远航协同、协同补给、远航绕行、绕行投送、回航校准、分支改道、航段契合、路线稳航、轮替闭环、契合闭环、闭环奖励、远航突破、绕行突破、远航整备、整备续航、绕行整备、整备回航与满段回响"
  );
  assert.equal(dispatch.unlocked, true);
  assert.equal(dispatch.active, true);
  assert.equal(dispatch.projectId, "pulse-arc-gate");
  assert.equal(dispatch.projectName, "脉冲航闸");
  assert.equal(dispatch.segmentText, "航段 27/57");
  assert.equal(currentProject.id, "pulse-arc-gate");
  assert.equal(currentProject.dispatchBadgeText, "调度 点火齐射");
  assert.equal(
    currentProject.dispatchText,
    "远航调度：目标 点火齐射 · 协同 谐振脉冲 · 绕行 巡航回收 · 航段契合：协同 谐振脉冲 · 点击/过载航段保留当前资源 · 3/3 回到目标触发闭环"
  );
  assert.equal(
    currentProject.dispatchStepText,
    "调度路径：目标 点火齐射（调度校准 +14%） -> 协同 谐振脉冲 / 绕行 巡航回收（远航协同 +5% · 补给 +3%当前 · 绕行 +4% · 改道 +6% · 稳航 +4% · 投送 -0.3%当前 · 契合 +5%） -> 回目标 点火齐射（远航闭环 +16% · 远航突破 +0.05%剩余 · 绕行突破 +0.03%剩余 · 轮替闭环 +9% · 契合闭环 +7%）"
  );
  assert.deepEqual(
    currentProject.dispatchSteps.map((step) => step.rewardText),
    [
      "调度校准 +14%",
      "远航协同 +5% · 补给 +3%当前 · 绕行 +4% · 改道 +6% · 稳航 +4% · 投送 -0.3%当前 · 契合 +5%",
      "远航闭环 +16% · 远航突破 +0.05%剩余 · 绕行突破 +0.03%剩余 · 轮替闭环 +9% · 契合闭环 +7%"
    ]
  );
  assert.deepEqual(
    currentProject.dispatchSteps.map((step) => step.text),
    ["目标 点火齐射", "协同 谐振脉冲 / 绕行 巡航回收", "回目标 点火齐射"]
  );
  assert.equal(currentProject.dispatchTargetDirectiveId, "ignition-salvo");
  assert.equal(currentProject.dispatchRelayDirectiveId, "resonance-pulse");
  assert.equal(currentProject.dispatchDetourDirectiveId, "cruise-cache");
  assert.equal(dispatch.targetDirectiveId, "ignition-salvo");
  assert.equal(dispatch.targetDirectiveName, "点火齐射");
  assert.equal(dispatch.relayDirectiveId, "resonance-pulse");
  assert.equal(dispatch.relayDirectiveName, "谐振脉冲");
  assert.equal(dispatch.refreshDirectiveId, "resonance-pulse");
  assert.equal(dispatch.refreshDirectiveName, "谐振脉冲");
  assert.equal(dispatch.refreshText, "远航整备刷新谐振脉冲冷却");
  assert.equal(dispatch.rewardText, "调度校准 +14%");
  assert.equal(dispatch.relayRewardRate, FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE);
  assert.equal(dispatch.relayRewardText, "远航续航 +8%");
  assert.equal(dispatch.syncRewardRate, FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE);
  assert.equal(dispatch.syncRewardText, "远航协同 +5%");
  assert.equal(dispatch.syncSupplyRate, FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE);
  assert.equal(dispatch.syncSupplyText, "协同补给 +3%当前");
  assert.equal(dispatch.detourRewardRate, FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE);
  assert.equal(dispatch.detourRewardText, "远航绕行 +4%");
  assert.equal(
    dispatch.branchShiftRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE
  );
  assert.equal(dispatch.branchShiftRewardText, "分支改道 +6%");
  assert.equal(
    dispatch.branchStabilityRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE
  );
  assert.equal(dispatch.branchStabilityRewardText, "路线稳航 +4%");
  assert.equal(
    dispatch.branchFocusRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE
  );
  assert.equal(dispatch.branchFocusRewardText, "航段契合 +5%");
  assert.equal(
    dispatch.branchRotationRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE
  );
  assert.equal(dispatch.branchRotationRewardText, "轮替闭环 +9%");
  assert.equal(dispatch.branchFocusKind, "sync");
  assert.equal(
    dispatch.branchFocusText,
    "航段契合：协同 谐振脉冲 · 点击/过载航段保留当前资源"
  );
  assert.equal(
    dispatch.branchFocusReasonText,
    "推荐原因：点击/过载航段保留当前资源"
  );
  assert.equal(dispatch.branchFocusDirectiveId, "resonance-pulse");
  assert.equal(dispatch.branchFocusDirectiveName, "谐振脉冲");
  assert.equal(
    dispatch.branchRecommendationText,
    "推荐分支：协同 谐振脉冲 · 可选择 · 补当前资源 · 推荐原因：点击/过载航段保留当前资源 · 后续协同回航触发闭环与远航突破 · 航段契合 +5%"
  );
  assert.equal(
    dispatch.branchRotationText,
    "分支轮替：先完成协同或绕行闭环，下一轮开启分支改道"
  );
  assert.equal(
    dispatch.branchRouteText,
    "路线履历：记录 无 · 本轮 待选择 · 先完成任一分支闭环"
  );
  assert.equal(
    dispatch.branchPlanText,
    "路线预案：推荐 目标 点火齐射 -> 协同 谐振脉冲 -> 回目标 点火齐射"
  );
  assert.equal(
    dispatch.branchPlanStepText,
    "路线步骤：第 1/3 执行目标 点火齐射"
  );
  assert.equal(dispatch.branchClosureText, "");
  assert.equal(
    dispatch.detourInfusionCostRate,
    FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE
  );
  assert.equal(
    dispatch.detourInfusionProgressMultiplier,
    FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER
  );
  assert.equal(dispatch.detourInfusionText, "绕行投送 -0.3%当前 / +150%累计");
  assert.equal(dispatch.loopRewardRate, FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE);
  assert.equal(dispatch.loopRewardText, "远航闭环 +16%");
  assert.equal(dispatch.loopStreak, 0);
  assert.equal(dispatch.loopStreakMaxStacks, FAR_ROUTE_DISPATCH_LOOP_STREAK_MAX_STACKS);
  assert.equal(dispatch.loopStreakRewardStep, FAR_ROUTE_DISPATCH_LOOP_STREAK_REWARD_STEP);
  assert.equal(dispatch.loopStreakRewardText, "远航连段 +3%/层");
  assert.equal(dispatch.loopStreakText, "");
  assert.equal(dispatch.breakthroughRewardRate, FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE);
  assert.equal(dispatch.breakthroughRewardText, "远航突破 +0.05%剩余");
  assert.equal(
    dispatch.detourBreakthroughRewardRate,
    FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE
  );
  assert.equal(dispatch.detourBreakthroughRewardText, "绕行突破 +0.03%剩余");
  assert.equal(dispatch.prepRewardRate, FAR_ROUTE_DISPATCH_PREP_REWARD_RATE);
  assert.equal(dispatch.prepRewardText, "整备续航 +7%");
  assert.equal(
    dispatch.detourPrepRewardRate,
    FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE
  );
  assert.equal(dispatch.detourPrepRewardText, "绕行整备 +5%");
  assert.equal(dispatch.returnRewardRate, FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE);
  assert.equal(dispatch.returnRewardText, "整备回航 +6%");
  assert.equal(dispatch.breakthroughBase, 5_000_000);
  assert.equal(dispatch.cooldownMultiplier, FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER);
  assert.equal(dispatch.cooldownText, "目标指令冷却 -30%");
  assert.equal(dispatch.chainWindowExtensionSeconds, FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS);
  assert.equal(dispatch.chainWindowSeconds, 120);
  assert.equal(dispatch.chainWindowText, "调度接力 +30 秒");
  assert.equal(dispatch.loopProgress, 0);
  assert.equal(dispatch.loopTarget, 3);
  assert.equal(
    dispatch.loopStepText,
    "远航路径：下一步 目标 点火齐射（调度校准 +14%） -> 待推进 协同/绕行 谐振脉冲/巡航回收（远航协同 +5% · 补给 +3%当前 · 绕行 +4% · 改道 +6% · 稳航 +4% · 投送 -0.3%当前 · 契合 +5%） -> 待推进 回目标 点火齐射（远航闭环 +16% · 远航突破 +0.05%剩余 · 绕行突破 +0.03%剩余 · 轮替闭环 +9%）"
  );
  assert.deepEqual(
    dispatch.loopSteps.map(
      (step) => step.label + ":" + step.stateText + ":" + step.text + ":" + step.rewardText
    ),
    [
      "目标:下一步:点火齐射:调度校准 +14%",
      "协同/绕行:待推进:谐振脉冲/巡航回收:远航协同 +5% · 补给 +3%当前 · 绕行 +4% · 改道 +6% · 稳航 +4% · 投送 -0.3%当前 · 契合 +5%",
      "回目标:待推进:点火齐射:远航闭环 +16% · 远航突破 +0.05%剩余 · 绕行突破 +0.03%剩余 · 轮替闭环 +9%"
    ]
  );
  assert.equal(dispatch.branchKind, "pending");
  assert.equal(dispatch.branchText, "分支 待选择：先执行目标");
  assert.equal(dispatch.branchDirectiveId, "ignition-salvo");
  assert.equal(dispatch.branchDirectiveName, "点火齐射");
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) =>
        choice.kind +
        ":" +
        choice.directiveName +
        ":" +
        choice.statusText +
        ":" +
        choice.caption +
        ":" +
        choice.reasonText +
        ":" +
        choice.objectiveText +
        ":" +
        choice.followupText +
        ":" +
        choice.nextText +
        ":" +
        choice.payoffText +
        ":" +
        choice.rewardText +
        ":focused=" +
        choice.focused
    ),
    [
      "sync:谐振脉冲:可选择:补当前资源:推荐原因：点击/过载航段保留当前资源:路线目标：按当前航段推荐建立协同路线:下一步：先执行目标 点火齐射，再选协同 谐振脉冲:后续协同回航触发闭环与远航突破:本步合计 +13% · 回目标 远航闭环 +16% + 远航突破 +0.05%剩余 + 契合闭环 +7%:远航协同 +5% · 协同补给 +3%当前 · 航段契合 +5%:focused=true",
      "detour:巡航回收:可选择:投送累计航段::路线目标：建立绕行路线，记录为下轮对照:下一步：先执行目标 点火齐射，再选绕行 巡航回收:后续绕行回航触发闭环与绕行突破:本步合计 +4% · 投送累计 · 回目标 远航闭环 +16% + 远航突破 +0.05%剩余 + 绕行突破 +0.03%剩余:远航绕行 +4% · 绕行投送 -0.3%当前:focused=false"
    ]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.decisionText),
    ["路线判断：当前航段首推", "路线判断：备选建档"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.decisionKind),
    ["recommended", "fallback"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.decisionBadgeText),
    ["首推", "建档"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.routeDecisionSignalKind + ":" + choice.routeDecisionSignalText
    ),
    ["focus:航段契合", "archive:新路线"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.routeResourceKind + ":" + choice.routeResourceText
    ),
    ["current:保留当前", "progress:投送累计"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.routeFlowKind + ":" + choice.routeFlowText
    ),
    ["current:当前+", "progress:当前->累计"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.routeCostKind + ":" + choice.routeCostText
    ),
    ["safe:无消耗", "spend:消耗当前"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.routeIntentKind + ":" + choice.routeIntentText
    ),
    ["preserve:保当前", "advance:推累计"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.routeReturnKind + ":" + choice.routeReturnText
    ),
    ["far:远航突破 · 连段 1/3", "detour:绕行突破 · 连段 1/3"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.routeLoopStreakText),
    ["连段 1/3", "连段 1/3"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.routeLoopCapstoneText),
    ["", ""]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) =>
        choice.routeCommandLabels.start +
        ":" +
        choice.routeCommandLabels.branch +
        ":" +
        choice.routeCommandLabels.return +
        ":" +
        choice.routeCommandText
    ),
    [
      "点火齐射:谐振脉冲:点火齐射:路线指令：点火齐射 -> 谐振脉冲 -> 点火齐射",
      "点火齐射:巡航回收:点火齐射:路线指令：点火齐射 -> 巡航回收 -> 点火齐射"
    ]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.routeBranchStepText),
    ["2 谐振脉冲", "2 巡航回收"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.routeMarkerKind + ":" + choice.routeMarkerText
    ),
    ["recommended:推荐", "available:备选"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) =>
        choice.routeNodeStates.start +
        ":" +
        choice.routeNodeStates.branch +
        ":" +
        choice.routeNodeStates.return
    ),
    ["next:waiting:waiting", "next:waiting:waiting"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.routeProgressPercent),
    [0, 0]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.routePhaseKind + ":" + choice.routePhaseText
    ),
    ["start:0/3 起手", "start:0/3 起手"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.routeActionKind + ":" + choice.routeActionText
    ),
    ["target:下一步 1 点火齐射", "target:下一步 1 点火齐射"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) =>
        choice.routeStepLabels.start +
        ":" +
        choice.routeStepLabels.branch +
        ":" +
        choice.routeStepLabels.return
    ),
    ["1:2:3", "1:2:3"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) =>
        choice.routeRewardLabels.start +
        ":" +
        choice.routeRewardLabels.branch +
        ":" +
        choice.routeRewardLabels.return +
        ":" +
        choice.routeRewardSummaryText +
        ":" +
        choice.routeRewardText
    ),
    [
      "校准:补给:闭环:校准/补给/闭环:收益点：校准 -> 补给 -> 闭环",
      "校准:投送:闭环:校准/投送/闭环:收益点：校准 -> 投送 -> 闭环"
    ]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.routePayoffSummaryText),
    ["本步 +13%", "本步 +4%"]
  );
  assert.equal(
    dispatch.branchChoiceText,
    "分支选择：协同 谐振脉冲（可选择 · 首推 · 航段契合 · 0/3 起手 · 下一步 1 点火齐射 · 校准/补给/闭环 · 收益点：校准 -> 补给 -> 闭环 · 无消耗 · 保当前 · 远航突破 · 连段 1/3 · 2 谐振脉冲 · 本步 +13% · 路线指令：点火齐射 -> 谐振脉冲 -> 点火齐射 · 补当前资源 · 推荐原因：点击/过载航段保留当前资源 · 路线判断：当前航段首推 · 路线目标：按当前航段推荐建立协同路线 · 下一步：先执行目标 点火齐射，再选协同 谐振脉冲 · 后续协同回航触发闭环与远航突破 · 本步合计 +13% · 回目标 远航闭环 +16% + 远航突破 +0.05%剩余 + 契合闭环 +7% · 远航协同 +5% · 协同补给 +3%当前 · 航段契合 +5%） / 绕行 巡航回收（可选择 · 建档 · 新路线 · 0/3 起手 · 下一步 1 点火齐射 · 校准/投送/闭环 · 收益点：校准 -> 投送 -> 闭环 · 消耗当前 · 推累计 · 绕行突破 · 连段 1/3 · 2 巡航回收 · 本步 +4% · 路线指令：点火齐射 -> 巡航回收 -> 点火齐射 · 投送累计航段 · 路线判断：备选建档 · 路线目标：建立绕行路线，记录为下轮对照 · 下一步：先执行目标 点火齐射，再选绕行 巡航回收 · 后续绕行回航触发闭环与绕行突破 · 本步合计 +4% · 投送累计 · 回目标 远航闭环 +16% + 远航突破 +0.05%剩余 + 绕行突破 +0.03%剩余 · 远航绕行 +4% · 绕行投送 -0.3%当前）"
  );
  assert.equal(
    dispatch.branchChoiceSummaryText,
    "路线对照：协同 首推 · 航段契合 · 0/3 起手 · 下一步 1 点火齐射 · 校准/补给/闭环 · 2 谐振脉冲 · 本步 +13% · 保当前 · 无消耗 · 远航突破 · 连段 1/3 / 绕行 建档 · 新路线 · 0/3 起手 · 下一步 1 点火齐射 · 校准/投送/闭环 · 2 巡航回收 · 本步 +4% · 推累计 · 消耗当前 · 绕行突破 · 连段 1/3"
  );
  assert.equal(
    dispatch.loopStatusText,
    "闭环进度 0/3 · 下一步 点火齐射 · 分支 待选择：先执行目标"
  );
  assert.equal(
    overview.dispatchText,
    "远航调度总览：航段 27/57 脉冲航闸 · 目标 点火齐射 · 协同 谐振脉冲 · 分支 待选择：先执行目标 · 航段契合：协同 谐振脉冲 · 点击/过载航段保留当前资源 · 推荐分支：协同 谐振脉冲 · 可选择 · 补当前资源 · 推荐原因：点击/过载航段保留当前资源 · 后续协同回航触发闭环与远航突破 · 航段契合 +5% · 分支轮替：先完成协同或绕行闭环，下一轮开启分支改道 · 路线履历：记录 无 · 本轮 待选择 · 先完成任一分支闭环 · 路线预案：推荐 目标 点火齐射 -> 协同 谐振脉冲 -> 回目标 点火齐射 · 路线步骤：第 1/3 执行目标 点火齐射 · 闭环 0/3 · 下一步 目标 点火齐射"
  );
  assert.match(streakOverview.dispatchText, /连段 1\/3 · 闭环 1\/3/);
  assert.equal(
    streakOverview.currentVisual.dispatchBadgeText,
    "调度 点火齐射 · 连段 1/3"
  );
  assert.match(streakOverview.currentVisual.title, /调度 点火齐射 · 连段 1\/3/);
  assert.equal(streakProject.dispatchBadgeText, "调度 点火齐射 · 连段 1/3");
  assert.match(streakProject.dispatchText, /连段 1\/3 · 3\/3 回到目标触发闭环/);
  assert.match(streakProject.dispatchStepText, /契合闭环 \+7% · 连段 1\/3/);
  assert.match(streakProject.dispatchSteps[2].rewardText, /连段 1\/3$/);
  assert.equal(
    dispatch.text,
    "远航调度：航段 27/57 脉冲航闸指定点火齐射 · 执行目标指令获得调度校准 +14% · 目标指令冷却 -30% · 调度接力 +30 秒 · 分支 待选择：先执行目标 · 航段契合：协同 谐振脉冲 · 点击/过载航段保留当前资源 · 推荐分支：协同 谐振脉冲 · 可选择 · 补当前资源 · 推荐原因：点击/过载航段保留当前资源 · 后续协同回航触发闭环与远航突破 · 航段契合 +5% · 分支轮替：先完成协同或绕行闭环，下一轮开启分支改道 · 路线履历：记录 无 · 本轮 待选择 · 先完成任一分支闭环 · 路线预案：推荐 目标 点火齐射 -> 协同 谐振脉冲 -> 回目标 点火齐射 · 路线步骤：第 1/3 执行目标 点火齐射 · 目标后优先谐振脉冲触发远航协同 +5%并获得协同补给 +3%当前，另一个非目标可触发远航绕行 +4%并消耗当前能量进行绕行投送 -0.3%当前 / +150%累计；执行协同或绕行分支会触发回航校准刷新目标指令冷却；若续走上一轮分支，会触发路线稳航 +4%；若本轮选择与上一轮不同的分支，还会触发分支改道 +6%，回到目标闭环时触发轮替闭环 +9%；若用当前航段契合分支回到目标，还会触发契合闭环 +7%；若选择当前航段契合分支，还会触发航段契合 +5%，所有非目标仍触发远航续航 +8% · 3/3 回到目标指令触发远航闭环 +16%、远航连段 +3%/层，连段满层额外触发满段回响 +10%、远航突破 +0.05%剩余，绕行路线额外触发绕行突破 +0.03%剩余 · 完成闭环后远航整备刷新谐振脉冲冷却，下一步触发整备续航 +7%；若上一轮选择绕行，则改为触发绕行整备 +5%，再回到目标触发整备回航 +6%"
  );
  assert.equal(Math.round(dispatch.progress * 100), 83);
  assert.deepEqual(plan.nextDirectiveIds, ["ignition-salvo"]);
  assert.equal(plan.recommendationText, "调度目标");
  assert.equal(plan.waitingRecommendationText, "等待调度");
  assert.equal(plan.summaryText, "指令轮换 0/3 · 调度目标 点火齐射");
  assert.match(plan.text, /远航调度指定点火齐射/);
  assert.equal(ignitionOption.dispatchReward > 0, true);
  assert.match(ignitionOption.dispatchRewardText, /调度校准 \+/);
  assert.equal(ignitionOption.dispatchRelayReward, 0);
  assert.equal(ignitionOption.dispatchRelayRewardText, "");
  assert.equal(ignitionOption.dispatchSyncReward, 0);
  assert.equal(ignitionOption.dispatchSyncRewardText, "");
  assert.equal(ignitionOption.dispatchSyncSupply, 0);
  assert.equal(ignitionOption.dispatchSyncSupplyText, "");
  assert.equal(ignitionOption.dispatchDetourReward, 0);
  assert.equal(ignitionOption.dispatchDetourRewardText, "");
  assert.equal(ignitionOption.dispatchBranchStabilityReward, 0);
  assert.equal(ignitionOption.dispatchBranchStabilityRewardText, "");
  assert.equal(ignitionOption.dispatchBranchFocusReward, 0);
  assert.equal(ignitionOption.dispatchBranchFocusRewardText, "");
  assert.equal(ignitionOption.dispatchFocusLoopReward, 0);
  assert.equal(ignitionOption.dispatchFocusLoopRewardText, "");
  assert.equal(ignitionOption.dispatchLoopReward, 0);
  assert.equal(ignitionOption.dispatchLoopRewardText, "");
  assert.equal(ignitionOption.dispatchLoopStreakReward, 0);
  assert.equal(ignitionOption.dispatchLoopStreakRewardText, "");
  assert.equal(ignitionOption.dispatchLoopStreakStacks, 0);
  assert.equal(ignitionOption.dispatchBreakthroughReward, 0);
  assert.equal(ignitionOption.dispatchBreakthroughRewardText, "");
  assert.equal(ignitionOption.dispatchDetourBreakthroughReward, 0);
  assert.equal(ignitionOption.dispatchDetourBreakthroughRewardText, "");
  assert.equal(ignitionOption.dispatchPrepReward, 0);
  assert.equal(ignitionOption.dispatchPrepRewardText, "");
  assert.equal(ignitionOption.dispatchRefreshText, "");
  assert.equal(ignitionOption.dispatchCooldownMultiplier, FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER);
  assert.equal(ignitionOption.dispatchCooldownText, "调度冷却 -30%");
  assert.equal(ignitionOption.dispatchChainWindowSeconds, 120);
  assert.equal(ignitionOption.dispatchChainWindowText, "调度接力 +30 秒");
  assert.equal(ignitionOption.dispatchRouteStepText, "路线 1/3 目标");
  assert.equal(
    ignitionOption.dispatchRouteResultText,
    "路线反馈：已完成目标 点火齐射 · 下一步选择推荐协同 谐振脉冲，或绕行 巡航回收"
  );
  assert.match(ignitionOption.previewText, /调度校准 \+/);
  assert.match(ignitionOption.previewText, /调度冷却 -30%/);
  assert.match(ignitionOption.previewText, /调度接力 \+30 秒/);
  assert.match(ignitionOption.previewText, /路线 1\/3 目标/);
  assert.equal(ignitionOption.recommended, true);
  assert.equal(ignitionOption.recommendationText, "调度目标");
  assert.equal(cruiseOption.dispatchReward, 0);
  assert.equal(cruiseOption.dispatchRewardText, "");
  assert.equal(cruiseOption.dispatchRelayReward, 0);
  assert.equal(cruiseOption.dispatchSyncReward, 0);
  assert.equal(cruiseOption.dispatchSyncSupply, 0);
  assert.equal(cruiseOption.dispatchDetourReward, 0);
  assert.equal(cruiseOption.dispatchBranchStabilityReward, 0);
  assert.equal(cruiseOption.dispatchBranchFocusReward, 0);
  assert.equal(cruiseOption.dispatchFocusLoopReward, 0);
  assert.equal(cruiseOption.dispatchLoopReward, 0);
  assert.equal(cruiseOption.dispatchLoopStreakReward, 0);
  assert.equal(cruiseOption.dispatchBreakthroughReward, 0);
  assert.equal(cruiseOption.dispatchDetourBreakthroughReward, 0);
  assert.equal(cruiseOption.dispatchPrepReward, 0);
  assert.equal(cruiseOption.dispatchRefreshText, "");
  assert.equal(cruiseOption.dispatchCooldownText, "");
  assert.equal(cruiseOption.dispatchChainWindowSeconds, 90);
  assert.equal(cruiseOption.dispatchChainWindowText, "");
  assert.equal(cruiseOption.dispatchRouteStepText, "");
  assert.equal(cruiseOption.dispatchRouteResultText, "");
  assert.equal(resonanceOption.recommended, false);
  assert.equal(coolingIgnitionOption.ready, false);
  assert.equal(coolingIgnitionOption.statusText, "冷却 6 秒");
  assert.equal(cooledIgnitionOption.ready, true);
  assert.equal(cooledIgnitionOption.statusText, "可执行");
  assert.equal(ignitionResult.dispatchReward > 0, true);
  assert.equal(ignitionResult.dispatchRewardRate, FAR_ROUTE_DISPATCH_BONUS_RATE);
  assert.equal(ignitionResult.dispatchRelayReward, 0);
  assert.equal(ignitionResult.dispatchSyncReward, 0);
  assert.equal(ignitionResult.dispatchSyncSupply, 0);
  assert.equal(ignitionResult.dispatchDetourReward, 0);
  assert.equal(ignitionResult.dispatchBranchStabilityReward, 0);
  assert.equal(ignitionResult.dispatchBranchFocusReward, 0);
  assert.equal(ignitionResult.dispatchFocusLoopReward, 0);
  assert.equal(ignitionResult.dispatchLoopReward, 0);
  assert.equal(ignitionResult.dispatchLoopStreakReward, 0);
  assert.equal(ignitionResult.dispatchLoopStreakStacks, 0);
  assert.equal(ignitionResult.dispatchBreakthroughReward, 0);
  assert.equal(ignitionResult.dispatchDetourBreakthroughReward, 0);
  assert.equal(ignitionResult.dispatchPrepReward, 0);
  assert.equal(ignitionResult.dispatchCooldownMultiplier, FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER);
  assert.equal(ignitionResult.dispatchCooldownText, "调度冷却 -30%");
  assert.equal(ignitionResult.dispatchChainWindowSeconds, 120);
  assert.equal(ignitionResult.dispatchChainWindowText, "调度接力 +30 秒");
  assert.equal(ignitionResult.dispatchRouteStepText, "路线 1/3 目标");
  assert.equal(
    ignitionResult.dispatchRouteResultText,
    "路线反馈：已完成目标 点火齐射 · 下一步选择推荐协同 谐振脉冲，或绕行 巡航回收"
  );
  assert.equal(ignitionResult.state.directiveChain.expiresAt, 121_000);
  assert.match(ignitionResult.notice, /调度校准 \+/);
  assert.match(ignitionResult.notice, /调度接力 \+30 秒/);
  assert.match(ignitionResult.notice, /路线执行：1\/3 目标/);
  assert.match(ignitionResult.notice, /路线反馈：已完成目标 点火齐射/);
  assert.equal(cooledIgnitionResult.activated, true);
  assert.equal(relayDispatch.loopProgress, 1);
  assert.equal(relayDispatch.branchKind, "pending");
  assert.equal(relayDispatch.branchText, "分支 待选择：协同或绕行");
  assert.equal(
    relayDispatch.branchRotationText,
    "分支轮替：先完成协同或绕行闭环，下一轮开启分支改道"
  );
  assert.equal(
    relayDispatch.branchRouteText,
    "路线履历：记录 无 · 本轮 待选择 · 先完成任一分支闭环"
  );
  assert.equal(
    relayDispatch.branchPlanText,
    "路线预案：推荐 目标 点火齐射 -> 协同 谐振脉冲 -> 回目标 点火齐射"
  );
  assert.equal(
    relayDispatch.branchPlanStepText,
    "路线步骤：第 2/3 选择推荐协同 谐振脉冲，或绕行 巡航回收"
  );
  assert.deepEqual(
    relayDispatch.branchChoices.map((choice) => choice.statusText),
    ["可选择", "可选择"]
  );
  assert.deepEqual(
    relayDispatch.branchChoices.map(
      (choice) => choice.routeMarkerKind + ":" + choice.routeMarkerText
    ),
    ["recommended:推荐", "available:备选"]
  );
  assert.deepEqual(
    relayDispatch.branchChoices.map(
      (choice) =>
        choice.routeNodeStates.start +
        ":" +
        choice.routeNodeStates.branch +
        ":" +
        choice.routeNodeStates.return
    ),
    ["done:next:waiting", "done:next:waiting"]
  );
  assert.deepEqual(
    relayDispatch.branchChoices.map((choice) => choice.routeProgressPercent),
    [50, 50]
  );
  assert.deepEqual(
    relayDispatch.branchChoices.map(
      (choice) => choice.routePhaseKind + ":" + choice.routePhaseText
    ),
    ["branch:1/3 分支", "branch:1/3 分支"]
  );
  assert.deepEqual(
    relayDispatch.branchChoices.map(
      (choice) => choice.routeActionKind + ":" + choice.routeActionText
    ),
    ["branch:下一步 2 谐振脉冲", "branch:下一步 2 巡航回收"]
  );
  assert.match(relayDispatch.loopStatusText, /闭环进度 1\/3/);
  assert.match(relayDispatch.loopStatusText, /优先谐振脉冲触发远航协同/);
  assert.match(relayDispatch.loopStatusText, /另一非目标触发远航绕行/);
  assert.match(relayDispatch.loopStatusText, /分支 待选择：协同或绕行/);
  assert.deepEqual(
    relayDispatch.loopSteps.map((step) => step.label + ":" + step.stateText),
    ["目标:已完成", "协同/绕行:下一步", "回目标:待推进"]
  );
  assert.deepEqual(relayPlan.nextDirectiveIds, ["cruise-cache", "resonance-pulse"]);
  assert.equal(relayPlan.recommendationText, "远航续航");
  assert.equal(relayPlan.waitingRecommendationText, "等待续航");
  assert.match(relayPlan.hintText, /优先谐振脉冲触发远航协同/);
  assert.equal(relayCruiseOption.recommended, true);
  assert.equal(relayCruiseOption.recommendationText, "远航绕行");
  assert.equal(relayCruiseOption.dispatchRouteStepText, "路线 2/3 绕行");
  assert.equal(
    relayCruiseOption.dispatchRouteResultText,
    "路线反馈：已选择绕行 巡航回收 · 下一步回目标 点火齐射"
  );
  assert.equal(relayResonanceOption.recommended, true);
  assert.equal(relayResonanceOption.recommendationText, "推荐协同");
  assert.equal(relayResonanceOption.dispatchRouteStepText, "路线 2/3 推荐协同");
  assert.equal(
    relayResonanceOption.dispatchRouteResultText,
    "路线反馈：已选择协同 谐振脉冲 · 下一步回目标 点火齐射"
  );
  assert.equal(relayWaitingResonanceOption.ready, false);
  assert.equal(relayWaitingResonanceOption.recommended, true);
  assert.equal(relayWaitingResonanceOption.recommendationText, "等待推荐协同");
  assert.equal(relayCruiseOption.dispatchRelayReward > 0, true);
  assert.equal(relayCruiseOption.dispatchRelayRewardRate, FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE);
  assert.match(relayCruiseOption.dispatchRelayRewardText, /远航续航 \+/);
  assert.equal(relayCruiseOption.dispatchSyncReward, 0);
  assert.equal(relayCruiseOption.dispatchSyncSupply, 0);
  assert.equal(relayCruiseOption.dispatchDetourReward > 0, true);
  assert.equal(
    relayCruiseOption.dispatchDetourRewardRate,
    FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE
  );
  assert.match(relayCruiseOption.dispatchDetourRewardText, /远航绕行 \+/);
  assert.equal(relayCruiseOption.dispatchBranchFocusReward, 0);
  assert.equal(relayCruiseOption.dispatchBranchFocusRewardText, "");
  assert.equal(relayCruiseOption.dispatchBranchStabilityReward, 0);
  assert.equal(relayCruiseOption.dispatchBranchStabilityRewardText, "");
  assert.equal(relayCruiseOption.dispatchFocusLoopReward, 0);
  assert.equal(relayCruiseOption.dispatchFocusLoopRewardText, "");
  assert.equal(relayCruiseOption.dispatchBreakthroughReward, 0);
  assert.equal(relayCruiseOption.dispatchDetourBreakthroughReward, 0);
  assert.equal(relayCruiseOption.dispatchDetourInfusionCost, 1500);
  assert.equal(relayCruiseOption.dispatchDetourInfusionProgress, 2250);
  assert.equal(
    relayCruiseOption.dispatchDetourInfusionCostRate,
    FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE
  );
  assert.equal(
    relayCruiseOption.dispatchDetourInfusionProgressMultiplier,
    FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER
  );
  assert.equal(
    relayCruiseOption.dispatchDetourInfusionText,
    "绕行投送 -1.5K当前 / +2.3K累计"
  );
  assert.equal(relayCruiseOption.dispatchPrepReward, 0);
  assert.equal(relayCruiseOption.dispatchRefreshDirectiveId, "ignition-salvo");
  assert.equal(relayCruiseOption.dispatchRefreshDirectiveName, "点火齐射");
  assert.equal(relayCruiseOption.dispatchRefreshText, "回航校准 点火齐射冷却刷新");
  assert.match(relayCruiseOption.previewText, /远航续航 \+/);
  assert.match(relayCruiseOption.previewText, /远航绕行 \+/);
  assert.match(relayCruiseOption.previewText, /绕行投送 -1.5K当前 \/ \+2.3K累计/);
  assert.match(relayCruiseOption.previewText, /回航校准 点火齐射冷却刷新/);
  assert.match(relayCruiseOption.previewText, /路线 2\/3 绕行/);
  assert.equal(relayResonanceOption.dispatchRelayReward > 0, true);
  assert.equal(relayResonanceOption.dispatchSyncReward > 0, true);
  assert.equal(relayResonanceOption.dispatchSyncRewardRate, FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE);
  assert.match(relayResonanceOption.dispatchSyncRewardText, /远航协同 \+/);
  assert.equal(relayResonanceOption.dispatchSyncSupply > 0, true);
  assert.equal(
    relayResonanceOption.dispatchSyncSupplyRate,
    FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE
  );
  assert.match(relayResonanceOption.dispatchSyncSupplyText, /协同补给 \+/);
  assert.equal(relayResonanceOption.dispatchDetourReward, 0);
  assert.equal(relayResonanceOption.dispatchBranchStabilityReward, 0);
  assert.equal(relayResonanceOption.dispatchBranchFocusReward > 0, true);
  assert.equal(
    relayResonanceOption.dispatchBranchFocusRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE
  );
  assert.match(relayResonanceOption.dispatchBranchFocusRewardText, /航段契合 \+/);
  assert.equal(relayResonanceOption.dispatchFocusLoopReward, 0);
  assert.equal(relayResonanceOption.dispatchRefreshDirectiveId, "ignition-salvo");
  assert.equal(relayResonanceOption.dispatchRefreshText, "回航校准 点火齐射冷却刷新");
  assert.match(relayResonanceOption.previewText, /远航协同 \+/);
  assert.match(relayResonanceOption.previewText, /协同补给 \+/);
  assert.match(relayResonanceOption.previewText, /航段契合 \+/);
  assert.match(relayResonanceOption.previewText, /回航校准 点火齐射冷却刷新/);
  assert.match(relayResonanceOption.previewText, /路线 2\/3 推荐协同/);
  assert.equal(quickBranchCruiseOption.dispatchRefreshText, "回航校准 点火齐射冷却刷新");
  assert.equal(quickBranchCruiseOption.dispatchRouteStepText, "路线 2/3 绕行");
  assert.equal(quickBranchResult.dispatchRefreshDirectiveId, "ignition-salvo");
  assert.equal(quickBranchResult.dispatchRefreshDirectiveName, "点火齐射");
  assert.equal(quickBranchResult.dispatchRefreshText, "回航校准 点火齐射冷却刷新");
  assert.equal(quickBranchResult.state.directives["ignition-salvo"], 0);
  assert.match(quickBranchResult.notice, /回航校准 点火齐射冷却刷新/);
  assert.equal(quickReturnIgnitionOption.ready, true);
  assert.equal(quickReturnIgnitionOption.recommended, true);
  assert.equal(quickReturnIgnitionOption.dispatchRouteStepText, "路线 3/3 绕行回航");
  assert.equal(quickReturnResult.activated, true);
  assert.equal(quickReturnResult.dispatchLoopReward > 0, true);
  assert.equal(relayCruiseResult.activated, true);
  assert.equal(relayCruiseResult.chainStacks, 1);
  assert.equal(relayCruiseResult.dispatchRelayReward > 0, true);
  assert.equal(relayCruiseResult.dispatchRelayRewardRate, FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE);
  assert.equal(relayCruiseResult.dispatchSyncReward, 0);
  assert.equal(relayCruiseResult.dispatchSyncSupply, 0);
  assert.equal(relayCruiseResult.dispatchDetourReward > 0, true);
  assert.equal(
    relayCruiseResult.dispatchDetourRewardRate,
    FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE
  );
  assert.equal(relayCruiseResult.dispatchDetourInfusionCost > 0, true);
  assert.equal(relayCruiseResult.dispatchBranchFocusReward, 0);
  assert.equal(relayCruiseResult.dispatchBranchStabilityReward, 0);
  assert.equal(relayCruiseResult.dispatchFocusLoopReward, 0);
  assert.equal(relayCruiseResult.dispatchDetourInfusionProgress > 0, true);
  assert.equal(
    relayCruiseResult.dispatchDetourInfusionCostRate,
    FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE
  );
  assert.equal(
    relayCruiseResult.dispatchDetourInfusionProgressMultiplier,
    FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER
  );
  assert.match(relayCruiseResult.dispatchDetourInfusionText, /绕行投送 -/);
  assert.equal(
    relayCruiseResult.state.totalEnergy >
      relayState.totalEnergy + relayCruiseResult.dispatchDetourInfusionProgress,
    true
  );
  assert.match(relayCruiseResult.dispatchRelayRewardText, /远航续航 \+/);
  assert.match(relayCruiseResult.dispatchDetourRewardText, /远航绕行 \+/);
  assert.equal(relayCruiseResult.dispatchRefreshText, "回航校准 点火齐射冷却刷新");
  assert.equal(relayCruiseResult.state.directives["ignition-salvo"], 0);
  assert.match(relayCruiseResult.notice, /远航续航 \+/);
  assert.match(relayCruiseResult.notice, /远航绕行 \+/);
  assert.match(relayCruiseResult.notice, /绕行投送 -/);
  assert.match(relayCruiseResult.notice, /回航校准 点火齐射冷却刷新/);
  assert.match(relayCruiseResult.notice, /路线执行：2\/3 绕行/);
  assert.match(relayCruiseResult.notice, /路线反馈：已选择绕行 巡航回收/);
  assert.equal(detourDispatch.loopProgress, 2);
  assert.equal(detourDispatch.branchKind, "detour");
  assert.equal(detourDispatch.branchText, "分支 绕行：巡航回收");
  assert.equal(
    detourDispatch.branchRotationText,
    "分支轮替：续走绕行 巡航回收触发路线稳航 +4%，或改走协同 谐振脉冲触发分支改道 +6%，回到目标闭环触发轮替闭环 +9%"
  );
  assert.equal(
    detourDispatch.branchRouteText,
    "路线履历：记录 绕行 巡航回收 · 本轮 绕行 巡航回收 · 回目标后记录当前路线"
  );
  assert.equal(
    detourDispatch.branchPlanText,
    "路线预案：本轮 目标 点火齐射 -> 绕行 巡航回收 -> 回目标 点火齐射"
  );
  assert.equal(
    detourDispatch.branchPlanStepText,
    "路线步骤：第 3/3 绕行回航 点火齐射"
  );
  assert.deepEqual(
    detourDispatch.branchChoices.map((choice) => choice.statusText),
    ["可改道", "当前路线"]
  );
  assert.deepEqual(
    detourDispatch.branchChoices.map(
      (choice) => choice.routeMarkerKind + ":" + choice.routeMarkerText
    ),
    ["recommended-shift:推荐改道", "current:本轮"]
  );
  assert.deepEqual(
    detourDispatch.branchChoices.map(
      (choice) =>
        choice.routeNodeStates.start +
        ":" +
        choice.routeNodeStates.branch +
        ":" +
        choice.routeNodeStates.return
    ),
    ["done:waiting:waiting", "done:done:next"]
  );
  assert.deepEqual(
    detourDispatch.branchChoices.map((choice) => choice.routeProgressPercent),
    [0, 100]
  );
  assert.deepEqual(
    detourDispatch.branchChoices.map(
      (choice) => choice.routePhaseKind + ":" + choice.routePhaseText
    ),
    ["inactive:未选", "return:2/3 回航"]
  );
  assert.deepEqual(
    detourDispatch.branchChoices.map(
      (choice) => choice.routeActionKind + ":" + choice.routeActionText
    ),
    ["idle:待选", "return:下一步 3 点火齐射"]
  );
  assert.deepEqual(
    detourDispatch.branchChoices.map(
      (choice) => choice.routeReturnKind + ":" + choice.routeReturnText
    ),
    ["far:远航突破", "detour:绕行突破 · 连段 1/3"]
  );
  assert.deepEqual(
    detourDispatch.branchChoices.map((choice) => choice.routeLoopStreakText),
    ["", "连段 1/3"]
  );
  assert.match(detourDispatch.loopStatusText, /闭环进度 2\/3/);
  assert.match(detourDispatch.loopStatusText, /触发远航闭环与绕行突破/);
  assert.match(detourDispatch.loopStatusText, /分支 绕行：巡航回收/);
  assert.deepEqual(
    detourDispatch.loopSteps.map((step) => step.label + ":" + step.stateText),
    ["目标:已完成", "协同/绕行:已完成", "回目标:下一步"]
  );
  assert.deepEqual(detourPlan.nextDirectiveIds, ["ignition-salvo"]);
  assert.equal(detourPlan.recommendationText, "绕行回航");
  assert.equal(detourPlan.waitingRecommendationText, "等待绕行");
  assert.match(detourPlan.hintText, /触发远航闭环与绕行突破/);
  assert.equal(detourIgnitionOption.recommended, true);
  assert.equal(detourIgnitionOption.recommendationText, "绕行回航");
  assert.equal(detourIgnitionOption.dispatchRouteStepText, "路线 3/3 绕行回航");
  assert.equal(
    detourIgnitionOption.dispatchRouteResultText,
    "路线反馈：已完成绕行回航 点火齐射 · 下一步绕行整备 巡航回收"
  );
  assert.equal(detourIgnitionOption.dispatchLoopReward > 0, true);
  assert.equal(detourIgnitionOption.dispatchFocusLoopReward, 0);
  assert.equal(detourIgnitionOption.dispatchBreakthroughReward > 0, true);
  assert.equal(detourIgnitionOption.dispatchDetourBreakthroughReward > 0, true);
  assert.equal(
    detourIgnitionOption.dispatchDetourBreakthroughRewardRate,
    FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE
  );
  assert.match(detourIgnitionOption.dispatchDetourBreakthroughRewardText, /绕行突破 \+/);
  assert.match(detourIgnitionOption.previewText, /绕行突破 \+/);
  assert.match(detourIgnitionOption.previewText, /路线 3\/3 绕行回航/);
  assert.equal(detourIgnitionResult.activated, true);
  assert.equal(detourIgnitionResult.dispatchDetourBreakthroughReward > 0, true);
  assert.equal(detourIgnitionResult.dispatchFocusLoopReward, 0);
  assert.equal(
    detourIgnitionResult.dispatchDetourBreakthroughRewardRate,
    FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE
  );
  assert.match(detourIgnitionResult.dispatchDetourBreakthroughRewardText, /绕行突破 \+/);
  assert.match(detourIgnitionResult.notice, /绕行突破 \+/);
  assert.match(detourIgnitionResult.notice, /路线执行：3\/3 绕行回航/);
  assert.match(detourIgnitionResult.notice, /路线反馈：已完成绕行回航 点火齐射/);
  assert.equal(detourIgnitionResult.dispatchRefreshDirectiveId, "cruise-cache");
  assert.equal(detourIgnitionResult.dispatchRefreshDirectiveName, "巡航回收");
  assert.equal(detourIgnitionResult.dispatchRefreshText, "绕行整备 巡航回收冷却刷新");
  assert.equal(detourIgnitionResult.state.directives["cruise-cache"], 0);
  assert.equal(detourIgnitionResult.state.farRouteLastBranchDirectiveId, "cruise-cache");
  assert.equal(detourCompletedDispatch.loopProgress, 3);
  assert.equal(detourCompletedDispatch.branchKind, "detour-prep");
  assert.equal(detourCompletedDispatch.branchText, "分支 绕行整备：巡航回收");
  assert.equal(
    detourCompletedDispatch.branchPlanStepText,
    "路线步骤：绕行整备 巡航回收，随后回目标 点火齐射"
  );
  assert.equal(
    detourCompletedDispatch.branchClosureText,
    "闭环复盘：刚完成绕行 巡航回收 · 已触发远航闭环 +16%、远航突破 +0.05%剩余、绕行突破 +0.03%剩余、连段 1/3 · 下一步绕行整备 巡航回收"
  );
  assert.deepEqual(
    detourCompletedDispatch.branchChoices.map((choice) => choice.statusText),
    ["可改道", "当前路线"]
  );
  assert.deepEqual(
    detourCompletedDispatch.branchChoices.map(
      (choice) => choice.routePhaseKind + ":" + choice.routePhaseText
    ),
    ["inactive:未选", "complete:3/3 完成"]
  );
  assert.deepEqual(
    detourCompletedDispatch.branchChoices.map(
      (choice) => choice.routeActionKind + ":" + choice.routeActionText
    ),
    ["idle:待选", "prep:下一步 绕行整备 巡航回收"]
  );
  assert.match(
    detourCompletedDispatch.loopStatusText,
    /已完成 · 绕行整备优先巡航回收触发绕行整备/
  );
  assert.match(detourCompletedDispatch.loopStatusText, /分支 绕行整备：巡航回收/);
  assert.deepEqual(detourCompletedPlan.nextDirectiveIds, ["cruise-cache"]);
  assert.equal(detourCompletedPlan.recommendationText, "绕行整备");
  assert.equal(detourCompletedPlan.waitingRecommendationText, "等待绕行整备");
  assert.match(detourCompletedPlan.hintText, /触发绕行整备/);
  assert.equal(detourCompletedCruiseOption.ready, true);
  assert.equal(detourCompletedCruiseOption.recommended, true);
  assert.equal(detourCompletedCruiseOption.recommendationText, "绕行整备");
  assert.equal(detourCompletedCruiseOption.dispatchRouteStepText, "路线 绕行整备");
  assert.equal(
    detourCompletedCruiseOption.dispatchRouteResultText,
    "路线反馈：已完成绕行整备 巡航回收 · 下一步回目标 点火齐射"
  );
  assert.equal(detourCompletedCruiseOption.dispatchDetourPrepReward > 0, true);
  assert.equal(
    detourCompletedCruiseOption.dispatchDetourPrepRewardRate,
    FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE
  );
  assert.match(detourCompletedCruiseOption.dispatchDetourPrepRewardText, /绕行整备 \+/);
  assert.match(detourCompletedCruiseOption.previewText, /绕行整备 \+/);
  assert.equal(detourCompletedCruiseResult.activated, true);
  assert.equal(detourCompletedCruiseResult.dispatchDetourPrepReward > 0, true);
  assert.equal(
    detourCompletedCruiseResult.dispatchDetourPrepRewardRate,
    FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE
  );
  assert.match(detourCompletedCruiseResult.dispatchDetourPrepRewardText, /绕行整备 \+/);
  assert.match(detourCompletedCruiseResult.notice, /绕行整备 \+/);
  assert.match(detourCompletedCruiseResult.notice, /路线执行：绕行整备/);
  assert.match(
    detourCompletedCruiseResult.notice,
    /路线反馈：已完成绕行整备 巡航回收/
  );
  assert.equal(relayResonanceResult.activated, true);
  assert.equal(relayResonanceResult.chainStacks, 1);
  assert.equal(relayResonanceResult.dispatchRelayReward > 0, true);
  assert.equal(relayResonanceResult.dispatchSyncReward > 0, true);
  assert.equal(relayResonanceResult.dispatchSyncRewardRate, FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE);
  assert.equal(relayResonanceResult.dispatchSyncSupply > 0, true);
  assert.equal(
    relayResonanceResult.dispatchSyncSupplyRate,
    FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE
  );
  assert.equal(relayResonanceResult.dispatchDetourReward, 0);
  assert.equal(relayResonanceResult.dispatchBranchStabilityReward, 0);
  assert.equal(relayResonanceResult.dispatchBranchFocusReward > 0, true);
  assert.equal(
    relayResonanceResult.dispatchBranchFocusRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE
  );
  assert.match(relayResonanceResult.dispatchSyncRewardText, /远航协同 \+/);
  assert.match(relayResonanceResult.dispatchSyncSupplyText, /协同补给 \+/);
  assert.match(relayResonanceResult.dispatchBranchFocusRewardText, /航段契合 \+/);
  assert.equal(relayResonanceResult.dispatchFocusLoopReward, 0);
  assert.equal(
    relayResonanceResult.state.energy >
      relayState.energy + relayResonanceResult.gain,
    true
  );
  assert.match(relayResonanceResult.notice, /远航协同 \+/);
  assert.match(relayResonanceResult.notice, /协同补给 \+/);
  assert.match(relayResonanceResult.notice, /航段契合 \+/);
  assert.equal(loopDispatch.loopProgress, 2);
  assert.equal(loopDispatch.loopTarget, 3);
  assert.equal(loopDispatch.branchKind, "sync");
  assert.equal(loopDispatch.branchText, "分支 协同：谐振脉冲");
  assert.deepEqual(
    loopDispatch.branchChoices.map((choice) => choice.statusText),
    ["当前路线", "可选择"]
  );
  assert.deepEqual(
    loopDispatch.branchChoices.map(
      (choice) => choice.routeMarkerKind + ":" + choice.routeMarkerText
    ),
    ["current:本轮", "available:备选"]
  );
  assert.deepEqual(
    loopDispatch.branchChoices.map(
      (choice) =>
        choice.routeNodeStates.start +
        ":" +
        choice.routeNodeStates.branch +
        ":" +
        choice.routeNodeStates.return
    ),
    ["done:done:next", "done:waiting:waiting"]
  );
  assert.deepEqual(
    loopDispatch.branchChoices.map((choice) => choice.routeProgressPercent),
    [100, 0]
  );
  assert.deepEqual(
    loopDispatch.branchChoices.map(
      (choice) => choice.routePhaseKind + ":" + choice.routePhaseText
    ),
    ["return:2/3 回航", "inactive:未选"]
  );
  assert.deepEqual(
    loopDispatch.branchChoices.map(
      (choice) => choice.routeActionKind + ":" + choice.routeActionText
    ),
    ["return:下一步 3 点火齐射", "idle:待选"]
  );
  assert.match(loopDispatch.loopStatusText, /闭环进度 2\/3/);
  assert.match(loopDispatch.loopStatusText, /协同回航到点火齐射触发远航闭环/);
  assert.match(loopDispatch.loopStatusText, /分支 协同：谐振脉冲/);
  assert.deepEqual(
    loopDispatch.loopSteps.map((step) => step.label + ":" + step.stateText),
    ["目标:已完成", "协同/绕行:已完成", "回目标:下一步"]
  );
  assert.deepEqual(loopPlan.nextDirectiveIds, ["ignition-salvo"]);
  assert.equal(loopPlan.recommendationText, "协同回航");
  assert.equal(loopPlan.waitingRecommendationText, "等待协同");
  assert.match(loopPlan.hintText, /触发远航闭环与远航突破/);
  assert.equal(loopIgnitionOption.recommended, true);
  assert.equal(loopIgnitionOption.recommendationText, "协同回航");
  assert.equal(loopIgnitionOption.dispatchRouteStepText, "路线 3/3 协同回航");
  assert.equal(
    loopIgnitionOption.dispatchRouteResultText,
    "路线反馈：已完成协同回航 点火齐射 · 下一步整备 谐振脉冲"
  );
  assert.equal(loopIgnitionOption.dispatchLoopReward > 0, true);
  assert.match(loopIgnitionOption.dispatchLoopRewardText, /远航闭环 \+/);
  assert.equal(loopIgnitionOption.dispatchLoopStreakReward > 0, true);
  assert.equal(
    loopIgnitionOption.dispatchLoopStreakRewardRate,
    FAR_ROUTE_DISPATCH_LOOP_STREAK_REWARD_STEP
  );
  assert.equal(loopIgnitionOption.dispatchLoopStreakStacks, 1);
  assert.match(loopIgnitionOption.dispatchLoopStreakRewardText, /远航连段 \+/);
  assert.equal(loopIgnitionOption.dispatchFocusLoopReward > 0, true);
  assert.equal(
    loopIgnitionOption.dispatchFocusLoopRewardRate,
    FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE
  );
  assert.match(loopIgnitionOption.dispatchFocusLoopRewardText, /契合闭环 \+/);
  assert.equal(loopIgnitionOption.dispatchBreakthroughReward, 2500);
  assert.equal(
    loopIgnitionOption.dispatchBreakthroughRewardRate,
    FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE
  );
  assert.equal(loopIgnitionOption.dispatchBreakthroughRewardText, "远航突破 +2.5K");
  assert.equal(loopIgnitionOption.dispatchDetourBreakthroughReward, 0);
  assert.equal(loopIgnitionOption.dispatchRefreshDirectiveId, "resonance-pulse");
  assert.equal(loopIgnitionOption.dispatchRefreshDirectiveName, "谐振脉冲");
  assert.equal(loopIgnitionOption.dispatchRefreshText, "远航整备 谐振脉冲冷却刷新");
  assert.match(loopIgnitionOption.previewText, /远航闭环 \+/);
  assert.match(loopIgnitionOption.previewText, /远航连段 \+/);
  assert.match(loopIgnitionOption.previewText, /契合闭环 \+/);
  assert.match(loopIgnitionOption.previewText, /远航突破 \+2.5K/);
  assert.match(loopIgnitionOption.previewText, /远航整备 谐振脉冲冷却刷新/);
  assert.match(loopIgnitionOption.previewText, /路线 3\/3 协同回航/);
  assert.equal(loopIgnitionResult.activated, true);
  assert.equal(loopIgnitionResult.chainStacks, 2);
  assert.equal(loopIgnitionResult.dispatchLoopReward > 0, true);
  assert.equal(loopIgnitionResult.dispatchLoopRewardRate, FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE);
  assert.match(loopIgnitionResult.dispatchLoopRewardText, /远航闭环 \+/);
  assert.equal(loopIgnitionResult.dispatchLoopStreakReward > 0, true);
  assert.equal(
    loopIgnitionResult.dispatchLoopStreakRewardRate,
    FAR_ROUTE_DISPATCH_LOOP_STREAK_REWARD_STEP
  );
  assert.equal(loopIgnitionResult.dispatchLoopStreakStacks, 1);
  assert.match(loopIgnitionResult.dispatchLoopStreakRewardText, /远航连段 \+/);
  assert.equal(loopIgnitionResult.dispatchFocusLoopReward > 0, true);
  assert.equal(
    loopIgnitionResult.dispatchFocusLoopRewardRate,
    FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE
  );
  assert.match(loopIgnitionResult.dispatchFocusLoopRewardText, /契合闭环 \+/);
  assert.equal(loopIgnitionResult.dispatchBreakthroughReward, 2352.8212);
  assert.equal(
    loopIgnitionResult.dispatchBreakthroughRewardRate,
    FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE
  );
  assert.equal(loopIgnitionResult.dispatchBreakthroughRewardText, "远航突破 +2.4K");
  assert.equal(loopIgnitionResult.dispatchDetourBreakthroughReward, 0);
  assert.equal(loopIgnitionResult.dispatchRefreshDirectiveId, "resonance-pulse");
  assert.equal(loopIgnitionResult.dispatchRefreshDirectiveName, "谐振脉冲");
  assert.equal(loopIgnitionResult.dispatchRefreshText, "远航整备 谐振脉冲冷却刷新");
  assert.equal(loopIgnitionResult.state.directives["resonance-pulse"], 0);
  assert.equal(loopIgnitionResult.state.farRouteLoopStreak, 1);
  assert.match(loopIgnitionResult.notice, /远航闭环 \+/);
  assert.match(loopIgnitionResult.notice, /远航连段 \+/);
  assert.match(loopIgnitionResult.notice, /契合闭环 \+/);
  assert.match(loopIgnitionResult.notice, /远航突破 \+2.4K/);
  assert.match(loopIgnitionResult.notice, /远航整备 谐振脉冲冷却刷新/);
  assert.match(loopIgnitionResult.notice, /路线反馈：已完成协同回航 点火齐射/);
  assert.equal(loopIgnitionResult.state.directiveChain.expiresAt, 150_000);
  assert.equal(completedDispatch.loopProgress, 3);
  assert.equal(completedDispatch.loopStreak, 1);
  assert.equal(completedDispatch.loopStreakText, "连段 1/3");
  assert.equal(completedDispatch.branchKind, "sync-prep");
  assert.equal(completedDispatch.branchText, "分支 协同整备：谐振脉冲");
  assert.equal(
    completedDispatch.branchRotationText,
    "分支轮替：续走协同 谐振脉冲触发路线稳航 +4%，或改走绕行 巡航回收触发分支改道 +6%，回到目标闭环触发轮替闭环 +9%"
  );
  assert.equal(
    completedDispatch.branchRouteText,
    "路线履历：记录 协同 谐振脉冲 · 本轮 协同 谐振脉冲 · 已记录当前路线，下一轮可改道"
  );
  assert.equal(
    completedDispatch.branchPlanText,
    "路线预案：下一轮 目标 点火齐射 -> 绕行 巡航回收 -> 回目标 点火齐射"
  );
  assert.equal(
    completedDispatch.branchPlanStepText,
    "路线步骤：整备 谐振脉冲，随后回目标 点火齐射"
  );
  assert.equal(
    completedDispatch.branchClosureText,
    "闭环复盘：刚完成协同 谐振脉冲 · 已触发远航闭环 +16%、远航突破 +0.05%剩余、契合闭环 +7%、连段 1/3 · 下一步整备 谐振脉冲"
  );
  assert.deepEqual(
    completedDispatch.branchChoices.map((choice) => choice.statusText),
    ["当前路线", "可改道"]
  );
  assert.deepEqual(
    completedDispatch.branchChoices.map(
      (choice) => choice.routeReturnKind + ":" + choice.routeReturnText
    ),
    ["far:远航突破 · 连段 1/3", "detour:绕行突破"]
  );
  assert.deepEqual(
    completedDispatch.branchChoices.map((choice) => choice.routeLoopStreakText),
    ["连段 1/3", ""]
  );
  assert.match(completedDispatch.loopStatusText, /闭环进度 3\/3/);
  assert.match(completedDispatch.loopStatusText, /已完成 · 远航整备优先谐振脉冲触发整备续航/);
  assert.match(completedDispatch.loopStatusText, /分支 协同整备：谐振脉冲/);
  assert.deepEqual(
    completedDispatch.loopSteps.map((step) => step.label + ":" + step.stateText),
    ["目标:已完成", "协同/绕行:已完成", "回目标:已完成"]
  );
  const completedPlan = getDirectivePlan(loopIgnitionResult.state, 31_000);
  const completedStatus = getDirectiveStatus(loopIgnitionResult.state, 31_000);
  const completedResonanceOption = completedStatus.options.find(
    (option) => option.id === "resonance-pulse"
  );
  const legacyCompletedPlan = getDirectivePlan(
    {
      ...loopIgnitionResult.state,
      farRouteLastBranchDirectiveId: null
    },
    31_000
  );
  assert.deepEqual(completedPlan.nextDirectiveIds, ["resonance-pulse"]);
  assert.equal(completedPlan.recommendationText, "整备续航");
  assert.equal(completedPlan.waitingRecommendationText, "等待整备");
  assert.deepEqual(legacyCompletedPlan.nextDirectiveIds, ["resonance-pulse"]);
  assert.equal(legacyCompletedPlan.recommendationText, "整备续航");
  assert.match(completedPlan.hintText, /远航整备优先谐振脉冲/);
  assert.match(completedPlan.hintText, /触发整备续航/);
  assert.equal(completedResonanceOption.ready, true);
  assert.equal(completedResonanceOption.recommended, true);
  assert.equal(completedResonanceOption.recommendationText, "整备续航");
  assert.equal(completedResonanceOption.dispatchRouteStepText, "路线 整备续航");
  assert.equal(
    completedResonanceOption.dispatchRouteResultText,
    "路线反馈：已完成整备 谐振脉冲 · 下一步回目标 点火齐射"
  );
  assert.equal(completedResonanceOption.dispatchPrepReward > 0, true);
  assert.equal(
    completedResonanceOption.dispatchPrepRewardRate,
    FAR_ROUTE_DISPATCH_PREP_REWARD_RATE
  );
  assert.match(completedResonanceOption.dispatchPrepRewardText, /整备续航 \+/);
  assert.match(completedResonanceOption.previewText, /整备续航 \+/);
  assert.match(completedResonanceOption.previewText, /路线 整备续航/);
  assert.equal(completedResonanceResult.activated, true);
  assert.equal(completedResonanceResult.dispatchPrepReward > 0, true);
  assert.equal(
    completedResonanceResult.dispatchPrepRewardRate,
    FAR_ROUTE_DISPATCH_PREP_REWARD_RATE
  );
  assert.match(completedResonanceResult.dispatchPrepRewardText, /整备续航 \+/);
  assert.match(completedResonanceResult.notice, /整备续航 \+/);
  assert.match(completedResonanceResult.notice, /路线执行：整备续航/);
  assert.match(completedResonanceResult.notice, /路线反馈：已完成整备 谐振脉冲/);
  assert.equal(returnDispatch.loopProgress, 3);
  assert.equal(returnDispatch.branchKind, "sync-prep");
  assert.equal(returnDispatch.branchText, "分支 协同整备：谐振脉冲");
  assert.equal(returnDispatch.branchPlanStepText, "路线步骤：整备回航 点火齐射");
  assert.equal(
    returnDispatch.branchClosureText,
    "闭环复盘：协同 谐振脉冲 已整备 · 连段 1/3 · 下一步回目标触发整备回航 +6%"
  );
  assert.match(returnDispatch.loopStatusText, /已完成 · 回到点火齐射触发整备回航/);
  assert.match(returnDispatch.loopStatusText, /分支 协同整备：谐振脉冲/);
  assert.deepEqual(returnPlan.nextDirectiveIds, ["ignition-salvo"]);
  assert.equal(returnPlan.recommendationText, "整备回航");
  assert.equal(returnPlan.waitingRecommendationText, "等待回航");
  assert.match(returnPlan.hintText, /触发整备回航/);
  assert.equal(returnIgnitionOption.ready, true);
  assert.equal(returnIgnitionOption.recommended, true);
  assert.equal(returnIgnitionOption.recommendationText, "整备回航");
  assert.equal(returnIgnitionOption.dispatchRouteStepText, "路线 整备回航");
  assert.equal(
    returnIgnitionOption.dispatchRouteResultText,
    "路线反馈：已完成整备回航 点火齐射 · 下一轮可重新选择协同或绕行"
  );
  assert.equal(returnIgnitionOption.dispatchReturnReward > 0, true);
  assert.equal(
    returnIgnitionOption.dispatchReturnRewardRate,
    FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE
  );
  assert.match(returnIgnitionOption.dispatchReturnRewardText, /整备回航 \+/);
  assert.equal(returnIgnitionOption.dispatchLoopStreakReward > 0, true);
  assert.equal(returnIgnitionOption.dispatchLoopStreakStacks, 2);
  assert.match(returnIgnitionOption.dispatchLoopStreakRewardText, /远航连段 \+/);
  assert.match(returnIgnitionOption.previewText, /远航连段 \+/);
  assert.match(returnIgnitionOption.previewText, /整备回航 \+/);
  assert.match(returnIgnitionOption.previewText, /路线 整备回航/);
  assert.equal(returnIgnitionResult.activated, true);
  assert.equal(returnIgnitionResult.dispatchReturnReward > 0, true);
  assert.equal(
    returnIgnitionResult.dispatchReturnRewardRate,
    FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE
  );
  assert.match(returnIgnitionResult.dispatchReturnRewardText, /整备回航 \+/);
  assert.equal(returnIgnitionResult.dispatchLoopStreakReward > 0, true);
  assert.equal(returnIgnitionResult.dispatchLoopStreakStacks, 2);
  assert.match(returnIgnitionResult.dispatchLoopStreakRewardText, /远航连段 \+/);
  assert.equal(returnIgnitionResult.state.farRouteLoopStreak, 2);
  assert.match(returnIgnitionResult.notice, /远航连段 \+/);
  assert.match(returnIgnitionResult.notice, /整备回航 \+/);
  assert.match(returnIgnitionResult.notice, /路线执行：整备回航/);
  assert.match(returnIgnitionResult.notice, /路线反馈：已完成整备回航 点火齐射/);
  const capstoneLoopState = {
    ...returnIgnitionResult.state,
    energy: 5_000_000,
    totalEnergy: 25_000_000,
    farRouteLoopStreak: FAR_ROUTE_DISPATCH_LOOP_STREAK_MAX_STACKS - 1,
    farRouteLastBranchDirectiveId: "resonance-pulse",
    directives: {
      ...returnIgnitionResult.state.directives,
      "ignition-salvo": 0
    },
    directiveChain: {
      lastDirectiveId: "resonance-pulse",
      stacks: 1,
      expiresAt: 180_000
    }
  };
  const capstoneDispatch = getFarRouteDispatch(capstoneLoopState, 60_000);
  const capstoneStatus = getDirectiveStatus(capstoneLoopState, 60_000);
  const capstoneIgnitionOption = capstoneStatus.options.find(
    (option) => option.id === "ignition-salvo"
  );
  const capstoneIgnitionResult = activateDirective(
    capstoneLoopState,
    "ignition-salvo",
    60_000
  );
  assert.deepEqual(
    capstoneDispatch.branchChoices.map((choice) => choice.routeLoopCapstoneText),
    ["满段回响 +10%", ""]
  );
  assert.deepEqual(
    capstoneDispatch.branchChoices.map((choice) => choice.routeReturnText),
    ["远航突破 · 连段 3/3 · 满段回响 +10%", "绕行突破"]
  );
  assert.equal(capstoneIgnitionOption.dispatchLoopStreakStacks, 3);
  assert.equal(capstoneIgnitionOption.dispatchLoopStreakCapstoneReward > 0, true);
  assert.equal(
    capstoneIgnitionOption.dispatchLoopStreakCapstoneRewardRate,
    FAR_ROUTE_DISPATCH_LOOP_STREAK_CAPSTONE_RATE
  );
  assert.match(
    capstoneIgnitionOption.dispatchLoopStreakCapstoneRewardText,
    /满段回响 \+/
  );
  assert.match(capstoneIgnitionOption.previewText, /满段回响 \+/);
  assert.equal(capstoneIgnitionResult.dispatchLoopStreakStacks, 3);
  assert.equal(capstoneIgnitionResult.dispatchLoopStreakCapstoneReward > 0, true);
  assert.equal(
    capstoneIgnitionResult.dispatchLoopStreakCapstoneRewardRate,
    FAR_ROUTE_DISPATCH_LOOP_STREAK_CAPSTONE_RATE
  );
  assert.match(
    capstoneIgnitionResult.dispatchLoopStreakCapstoneRewardText,
    /满段回响 \+/
  );
  assert.equal(capstoneIgnitionResult.state.farRouteLoopStreak, 3);
  assert.match(capstoneIgnitionResult.notice, /满段回响 \+/);
  assert.equal(cruiseResult.dispatchReward, 0);
  assert.equal(cruiseResult.dispatchRelayReward, 0);
  assert.equal(cruiseResult.dispatchSyncReward, 0);
  assert.equal(cruiseResult.dispatchSyncSupply, 0);
  assert.equal(cruiseResult.dispatchDetourReward, 0);
  assert.equal(cruiseResult.dispatchFocusLoopReward, 0);
  assert.equal(cruiseResult.dispatchBreakthroughReward, 0);
  assert.equal(cruiseResult.dispatchDetourBreakthroughReward, 0);
  assert.equal(cruiseResult.dispatchLoopStreakReward, 0);
  assert.equal(cruiseResult.dispatchPrepReward, 0);
  assert.equal(cruiseResult.dispatchDetourPrepReward, 0);
  assert.equal(cruiseResult.dispatchReturnReward, 0);
  assert.equal(cruiseResult.dispatchChainWindowSeconds, 90);
  assert.equal(cruiseResult.dispatchChainWindowText, "");
});

test("远航调度会优先接管常规收束起手推荐", () => {
  const state = {
    ...createInitialState(0),
    totalEnergy: 35_000_000,
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
  const plan = getDirectivePlan(state, 1000);
  const status = getDirectiveStatus(state, 1000);
  const cruiseOption = status.options.find((option) => option.id === "cruise-cache");
  const ignitionOption = status.options.find((option) => option.id === "ignition-salvo");
  const targetUsedState = {
    ...state,
    directives: {
      ...state.directives,
      "cruise-cache": 1000
    },
    directiveChain: {
      lastDirectiveId: "cruise-cache",
      stacks: 0,
      expiresAt: 121_000
    }
  };
  const relayStatus = getDirectiveStatus(targetUsedState, 30_000);
  const relayIgnitionOption = relayStatus.options.find(
    (option) => option.id === "ignition-salvo"
  );
  const relayResonanceOption = relayStatus.options.find(
    (option) => option.id === "resonance-pulse"
  );
  const focusDetourResult = activateDirective(
    targetUsedState,
    "resonance-pulse",
    30_000
  );
  const focusDetourClosureStatus = getDirectiveStatus(focusDetourResult.state, 44_000);
  const focusDetourClosureOption = focusDetourClosureStatus.options.find(
    (option) => option.id === "cruise-cache"
  );
  const focusDetourClosureResult = activateDirective(
    focusDetourResult.state,
    "cruise-cache",
    44_000
  );

  assert.equal(dispatch.projectId, "glow-orbit-harbor");
  assert.equal(dispatch.targetDirectiveId, "cruise-cache");
  assert.equal(dispatch.branchFocusKind, "detour");
  assert.equal(dispatch.branchFocusDirectiveId, "resonance-pulse");
  assert.equal(
    dispatch.branchFocusText,
    "航段契合：绕行 谐振脉冲 · 自动/总产能航段投送累计航段"
  );
  assert.equal(
    dispatch.branchFocusReasonText,
    "推荐原因：自动/总产能航段投送累计航段"
  );
  assert.deepEqual(plan.nextDirectiveIds, ["cruise-cache"]);
  assert.equal(plan.recommendationText, "调度目标");
  assert.equal(plan.summaryText, "指令轮换 0/3 · 调度目标 巡航回收");
  assert.match(plan.hintText, /当前航段调度优先于常规收束起手/);
  assert.equal(cruiseOption.recommended, true);
  assert.equal(cruiseOption.recommendationText, "调度目标");
  assert.equal(cruiseOption.dispatchReward > 0, true);
  assert.equal(cruiseOption.dispatchCooldownText, "调度冷却 -30%");
  assert.equal(cruiseOption.dispatchChainWindowText, "调度接力 +30 秒");
  assert.equal(ignitionOption.recommended, false);
  assert.equal(relayIgnitionOption.recommended, true);
  assert.equal(relayIgnitionOption.recommendationText, "远航协同");
  assert.equal(relayResonanceOption.recommended, true);
  assert.equal(relayResonanceOption.recommendationText, "推荐绕行");
  assert.equal(relayResonanceOption.dispatchBranchFocusReward > 0, true);
  assert.match(relayResonanceOption.dispatchBranchFocusRewardText, /航段契合 \+/);
  assert.equal(focusDetourClosureOption.dispatchFocusLoopReward > 0, true);
  assert.equal(
    focusDetourClosureOption.dispatchFocusLoopRewardRate,
    FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE
  );
  assert.match(focusDetourClosureOption.dispatchFocusLoopRewardText, /契合闭环 \+/);
  assert.match(focusDetourClosureOption.previewText, /契合闭环 \+/);
  assert.equal(focusDetourClosureResult.dispatchFocusLoopReward > 0, true);
  assert.match(focusDetourClosureResult.notice, /契合闭环 \+/);
});

test("远航调度会奖励切换上一轮分支", () => {
  const state = {
    ...createInitialState(0),
    energy: 3_500_000,
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
    },
    directives: {
      ...createInitialState(0).directives,
      "ignition-salvo": 1000
    },
    directiveChain: {
      lastDirectiveId: "ignition-salvo",
      stacks: 0,
      expiresAt: 121_000
    },
    farRouteLastBranchDirectiveId: "resonance-pulse"
  };
  const dispatch = getFarRouteDispatch(state, 30_000);
  const status = getDirectiveStatus(state, 30_000);
  const cruiseOption = status.options.find((option) => option.id === "cruise-cache");
  const resonanceOption = status.options.find(
    (option) => option.id === "resonance-pulse"
  );
  const resonanceResult = activateDirective(state, "resonance-pulse", 30_000);
  const cruiseResult = activateDirective(state, "cruise-cache", 30_000);
  const rotationClosureStatus = getDirectiveStatus(cruiseResult.state, 31_000);
  const rotationClosureOption = rotationClosureStatus.options.find(
    (option) => option.id === "ignition-salvo"
  );
  const rotationClosureResult = activateDirective(
    cruiseResult.state,
    "ignition-salvo",
    31_000
  );
  const detourLastState = {
    ...state,
    farRouteLastBranchDirectiveId: "cruise-cache"
  };
  const detourLastDispatch = getFarRouteDispatch(detourLastState, 30_000);
  const detourLastStatus = getDirectiveStatus(detourLastState, 30_000);
  const detourLastCruiseOption = detourLastStatus.options.find(
    (option) => option.id === "cruise-cache"
  );
  const detourLastResonanceOption = detourLastStatus.options.find(
    (option) => option.id === "resonance-pulse"
  );

  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.kind + ":" + choice.statusText + ":" + choice.rewardText
    ),
    [
      "sync:上轮路线:远航协同 +5% · 协同补给 +3%当前 · 路线稳航 +4% · 航段契合 +5%",
      "detour:可改道:远航绕行 +4% · 绕行投送 -0.3%当前 · 分支改道 +6%"
    ]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.payoffText),
    [
      "本步合计 +17% · 回目标 远航闭环 +16% + 远航突破 +0.05%剩余 + 契合闭环 +7%",
      "本步合计 +10% · 投送累计 · 回目标 远航闭环 +16% + 远航突破 +0.05%剩余 + 绕行突破 +0.03%剩余 + 轮替闭环 +9%"
    ]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.objectiveText),
    [
      "路线目标：续走上轮推荐协同，触发路线稳航",
      "路线目标：改走绕行，开启轮替闭环"
    ]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.decisionText),
    ["路线判断：推荐稳航", "路线判断：备选改道"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.decisionKind),
    ["recommended-stable", "fallback-shift"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.decisionBadgeText),
    ["稳航", "备选改道"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map(
      (choice) => choice.routeMarkerKind + ":" + choice.routeMarkerText
    ),
    ["recommended-previous:推荐上轮", "shift:改道"]
  );
  assert.deepEqual(
    dispatch.branchChoices.map((choice) => choice.followupText),
    [
      "下一步：执行协同 谐振脉冲，再回目标 点火齐射",
      "下一步：执行绕行 巡航回收，再回目标 点火齐射"
    ]
  );
  assert.equal(
    dispatch.branchRecommendationText,
    "推荐分支：协同 谐振脉冲 · 上轮路线 · 补当前资源 · 推荐原因：点击/过载航段保留当前资源 · 后续协同回航触发闭环与远航突破 · 航段契合 +5% · 路线稳航 +4%"
  );
  assert.equal(cruiseOption.dispatchBranchShiftReward > 0, true);
  assert.equal(
    cruiseOption.dispatchBranchShiftRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE
  );
  assert.match(cruiseOption.dispatchBranchShiftRewardText, /分支改道 \+/);
  assert.match(cruiseOption.previewText, /分支改道 \+/);
  assert.equal(cruiseOption.dispatchBranchStabilityReward, 0);
  assert.equal(resonanceOption.dispatchBranchShiftReward, 0);
  assert.equal(resonanceOption.dispatchBranchStabilityReward > 0, true);
  assert.equal(
    resonanceOption.dispatchBranchStabilityRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE
  );
  assert.match(resonanceOption.dispatchBranchStabilityRewardText, /路线稳航 \+/);
  assert.match(resonanceOption.previewText, /路线稳航 \+/);
  assert.equal(resonanceOption.dispatchBranchFocusReward > 0, true);
  assert.match(resonanceOption.dispatchBranchFocusRewardText, /航段契合 \+/);
  assert.equal(resonanceResult.dispatchBranchShiftReward, 0);
  assert.equal(resonanceResult.dispatchBranchStabilityReward > 0, true);
  assert.equal(
    resonanceResult.dispatchBranchStabilityRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE
  );
  assert.match(resonanceResult.dispatchBranchStabilityRewardText, /路线稳航 \+/);
  assert.match(resonanceResult.notice, /路线稳航 \+/);
  assert.equal(cruiseResult.dispatchBranchShiftReward > 0, true);
  assert.equal(
    cruiseResult.dispatchBranchShiftRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE
  );
  assert.match(cruiseResult.dispatchBranchShiftRewardText, /分支改道 \+/);
  assert.match(cruiseResult.notice, /分支改道 \+/);
  assert.equal(cruiseResult.dispatchBranchStabilityReward, 0);
  assert.equal(cruiseResult.state.farRouteLastBranchDirectiveId, "cruise-cache");
  assert.equal(rotationClosureOption.dispatchBranchRotationReward > 0, true);
  assert.equal(
    rotationClosureOption.dispatchBranchRotationRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE
  );
  assert.match(
    rotationClosureOption.dispatchBranchRotationRewardText,
    /轮替闭环 \+/
  );
  assert.match(rotationClosureOption.previewText, /轮替闭环 \+/);
  assert.equal(rotationClosureResult.activated, true);
  assert.equal(rotationClosureResult.dispatchBranchRotationReward > 0, true);
  assert.equal(
    rotationClosureResult.dispatchBranchRotationRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE
  );
  assert.match(rotationClosureResult.dispatchBranchRotationRewardText, /轮替闭环 \+/);
  assert.match(rotationClosureResult.notice, /轮替闭环 \+/);
  assert.deepEqual(
    detourLastDispatch.branchChoices.map(
      (choice) => choice.kind + ":" + choice.statusText + ":" + choice.rewardText
    ),
    [
      "sync:可改道:远航协同 +5% · 协同补给 +3%当前 · 分支改道 +6% · 航段契合 +5%",
      "detour:上轮路线:远航绕行 +4% · 绕行投送 -0.3%当前 · 路线稳航 +4%"
    ]
  );
  assert.deepEqual(
    detourLastDispatch.branchChoices.map((choice) => choice.payoffText),
    [
      "本步合计 +19% · 回目标 远航闭环 +16% + 远航突破 +0.05%剩余 + 轮替闭环 +9% + 契合闭环 +7%",
      "本步合计 +8% · 投送累计 · 回目标 远航闭环 +16% + 远航突破 +0.05%剩余 + 绕行突破 +0.03%剩余"
    ]
  );
  assert.deepEqual(
    detourLastDispatch.branchChoices.map((choice) => choice.objectiveText),
    [
      "路线目标：改走推荐协同，开启轮替闭环",
      "路线目标：续走上轮绕行，触发路线稳航"
    ]
  );
  assert.deepEqual(
    detourLastDispatch.branchChoices.map((choice) => choice.decisionText),
    ["路线判断：推荐改道", "路线判断：备选稳航"]
  );
  assert.deepEqual(
    detourLastDispatch.branchChoices.map((choice) => choice.decisionKind),
    ["recommended-shift", "fallback-stable"]
  );
  assert.deepEqual(
    detourLastDispatch.branchChoices.map((choice) => choice.decisionBadgeText),
    ["改道", "备选稳航"]
  );
  assert.deepEqual(
    detourLastDispatch.branchChoices.map(
      (choice) => choice.routeMarkerKind + ":" + choice.routeMarkerText
    ),
    ["recommended-shift:推荐改道", "previous:上轮"]
  );
  assert.deepEqual(
    detourLastDispatch.branchChoices.map((choice) => choice.followupText),
    [
      "下一步：执行协同 谐振脉冲，再回目标 点火齐射",
      "下一步：执行绕行 巡航回收，再回目标 点火齐射"
    ]
  );
  assert.equal(
    detourLastDispatch.branchRecommendationText,
    "推荐分支：协同 谐振脉冲 · 可改道 · 补当前资源 · 推荐原因：点击/过载航段保留当前资源 · 后续协同回航触发闭环与远航突破 · 航段契合 +5% · 分支改道 +6%"
  );
  assert.equal(detourLastCruiseOption.dispatchBranchShiftReward, 0);
  assert.equal(detourLastCruiseOption.dispatchBranchStabilityReward > 0, true);
  assert.equal(
    detourLastCruiseOption.dispatchBranchStabilityRewardRate,
    FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE
  );
  assert.match(
    detourLastCruiseOption.dispatchBranchStabilityRewardText,
    /路线稳航 \+/
  );
  assert.match(detourLastCruiseOption.previewText, /路线稳航 \+/);
  assert.equal(detourLastResonanceOption.dispatchBranchShiftReward > 0, true);
  assert.equal(detourLastResonanceOption.dispatchBranchStabilityReward, 0);
  assert.equal(detourLastResonanceOption.dispatchBranchFocusReward > 0, true);
  assert.match(detourLastResonanceOption.dispatchBranchShiftRewardText, /分支改道 \+/);
  assert.match(detourLastResonanceOption.dispatchBranchFocusRewardText, /航段契合 \+/);
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
    "筛选摘要：本章 1/5 · 下一条 航段 5/57 点火航校 · 剩余 4 段"
  );
  assert.equal(
    getProjectFilterBrief(active, "chapter-long-tail"),
    "筛选摘要：远航长尾 0/44 · 下一条 航段 14/57 星门远征 · 剩余 44 段"
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
  assert.equal(getProjectChapterVisuals(active)[1].heroNodes.length, 5);
  assert.equal(getProjectChapterVisuals(active)[1].heroNodes[0].status, "current");
  assert.equal(getProjectChapterVisuals(active)[1].heroNodes[2].status, "completed");
  assert.equal(getProjectChapterVisuals(active)[3].heroNodes.length, PROJECT_CHAPTER_HERO_NODE_LIMIT);
  assert.equal(getProjectChapterVisuals(active)[3].heroNodes[0].label, "1-5/44");
  assert.equal(getProjectChapterVisuals(completed)[3].status, "completed");
  assert.equal(getProjectChapterVisuals(completed)[3].nextText, "已完成");
  assert.equal(getProjectChapterVisuals(completed)[3].heroNodes[7].status, "completed");
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
  assert.equal(overview.forecastDetailText, "航线预告：等待下一段航线");
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

test("反馈表单字段会渲染视觉短标", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /class="feedback-field-label"/);
  assert.match(indexHtml, /class="feedback-field-icon feedback-field-icon-type" aria-hidden="true"/);
  assert.match(indexHtml, /class="feedback-field-icon feedback-field-icon-rating" aria-hidden="true"/);
  assert.match(indexHtml, /class="feedback-field-icon feedback-field-icon-message" aria-hidden="true"/);
  assert.match(indexHtml, /<span>类型<\/span>/);
  assert.match(indexHtml, /<span>评分<\/span>/);
  assert.match(indexHtml, /<span>内容<\/span>/);
  assert.match(styles, /\.feedback-field-label/);
  assert.match(styles, /\.feedback-field-icon/);
  assert.match(styles, /\.feedback-field-icon-type::before/);
  assert.match(styles, /\.feedback-field-icon-rating::before/);
  assert.match(styles, /\.feedback-field-icon-message::before/);
  assert.match(styles, /\.feedback-field-icon-message::after/);
});

test("反馈表单标题会渲染视觉短标", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="feedback-title" class="feedback-heading"/);
  assert.match(indexHtml, /class="feedback-heading-icon" aria-hidden="true"/);
  assert.match(indexHtml, /<span>反馈<\/span>/);
  assert.match(styles, /\.feedback-heading \{/);
  assert.match(styles, /\.feedback-heading-icon/);
  assert.match(styles, /\.feedback-heading-icon::before/);
  assert.match(styles, /\.feedback-heading-icon::after/);
});

test("反馈表单会渲染本地反馈插画", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const feedbackVisual = readFileSync(
    new URL("../src/assets/feedback-visual.svg", import.meta.url),
    "utf8"
  );

  assert.match(indexHtml, /class="feedback-scene-image"/);
  assert.match(indexHtml, /src="\.\/src\/assets\/feedback-visual\.svg"/);
  assert.match(indexHtml, /alt="反馈草稿、评分和 Issue 投递路径组成的插画"/);
  assert.match(styles, /\.feedback-scene-image/);
  assert.match(styles, /aspect-ratio: 16 \/ 5/);
  assert.match(feedbackVisual, /反馈草稿视觉插画/);
  assert.match(feedbackVisual, /id="feedbackAccent"/);
});

test("反馈提交按钮会渲染发送短标", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /class="feedback-submit" type="submit"/);
  assert.match(indexHtml, /class="feedback-submit-icon" aria-hidden="true"/);
  assert.match(indexHtml, /<span>提交反馈<\/span>/);
  assert.match(styles, /\.feedback-submit \{/);
  assert.match(styles, /grid-template-columns: 22px auto/);
  assert.match(styles, /\.feedback-submit-icon/);
  assert.match(styles, /\.feedback-submit-icon::before/);
  assert.match(styles, /\.feedback-submit-icon::after/);
});

test("反馈状态回执会渲染视觉短标", () => {
  const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(indexHtml, /id="feedbackStatus" class="feedback-status" aria-live="polite"/);
  assert.match(styles, /\.feedback-status \{/);
  assert.match(styles, /\.feedback-status:not\(:empty\) \{/);
  assert.match(styles, /grid-template-columns: 20px minmax\(0, 1fr\)/);
  assert.match(styles, /\.feedback-status:not\(:empty\)::before/);
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
  assert.match(body, /远航续航、远航协同、协同补给、远航绕行、绕行投送、回航校准、分支改道、航段契合、路线稳航、轮替闭环、契合闭环、闭环奖励、远航突破、绕行突破、远航整备、整备续航、绕行整备、整备回航与满段回响/);
  assert.match(body, /闭环进度 0\/3 · 20M 后解锁/);
  assert.match(body, /lens:1/);
});

test("反馈快照会记录当前远航连段层数", () => {
  const state = {
    ...createInitialState(0),
    energy: 3_472_075,
    totalEnergy: 24_768_842,
    energyPerClick: 16,
    energyPerSecond: 17.5,
    overloadBonus: 27,
    routeStance: "cruise",
    directiveMastery: {
      stacks: 2,
      expiresAt: Number.MAX_SAFE_INTEGER
    },
    directiveChain: {
      lastDirectiveId: "ignition-salvo",
      stacks: 1,
      expiresAt: Number.MAX_SAFE_INTEGER
    },
    farRouteLoopStreak: 1,
    upgrades: {
      lens: 15,
      collector: 25,
      stabilizer: 21,
      resonator: 11
    }
  };
  const entry = createFeedbackEntry({
    type: "experience",
    rating: 3,
    message: "后半段路线变化还是不明显",
    state,
    goal: { value: "脉冲航闸" },
    sessionId: "far-streak-session",
    createdAt: "2026-05-05T09:10:00.000Z"
  });

  const body = createFeedbackIssueBody(entry);

  assert.match(body, /远航调度：航段 27\/57 脉冲航闸/);
  assert.match(body, /闭环进度 2\/3/);
  assert.match(body, /- 远航连段：连段 1\/3/);
});

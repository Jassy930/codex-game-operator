import {
  DEFAULT_ROUTE_STANCE_ID,
  DIRECTIVE_MASTERY_MAX_STACKS,
  INITIAL_PROJECT_FILTER_ID,
  PROJECT_FILTER_DEFS,
  UPGRADE_DEFS,
  formatNumber,
  getCoreRewardPreview,
  getDirectivePlan,
  getDirectiveTaskStatus,
  getFarRouteDispatch,
  getProjectFilterBrief,
  getProjectOverview,
  getProjectStatuses,
  getUpgradeAffordability,
  ROUTE_STANCE_DEFS
} from "./game.js";

export const FEEDBACK_TYPES = {
  experience: {
    label: "体验反馈",
    labels: ["feedback"]
  },
  bug: {
    label: "问题/Bug",
    labels: ["feedback", "bug"]
  },
  balance: {
    label: "平衡建议",
    labels: ["feedback", "balance"]
  },
  idea: {
    label: "新想法",
    labels: ["feedback", "idea"]
  }
};

const DEFAULT_ISSUE_URL =
  "https://github.com/Jassy930/codex-game-operator/issues/new";
const MAX_MESSAGE_LENGTH = 1200;

export function createFeedbackEntry({
  type,
  rating,
  message,
  state,
  goal,
  sessionId,
  preferences,
  view,
  createdAt = new Date().toISOString(),
  now = Date.now()
}) {
  const feedbackType = FEEDBACK_TYPES[type] ? type : "experience";
  const currentState = state ?? {};
  const currentGoal = goal ?? {};
  const coreFeedback = getCoreRewardPreview(currentState, now);
  const directivePlan = getDirectivePlan(currentState, now);
  const directiveTask = getDirectiveTaskStatus(currentState, now);
  const farRouteDispatch = getFarRouteDispatch(currentState, now);
  const projectOverview = getProjectOverview(currentState, now);
  const projectStatuses = getProjectStatuses(currentState, now);
  const upgradeAffordability = formatFeedbackUpgradeAffordability(
    currentState,
    currentGoal
  );
  const projectFilter = formatFeedbackProjectFilter(
    projectStatuses,
    getFeedbackProjectFilterId(view?.projectFilter)
  );
  const farRouteLoopStreak = formatFeedbackFarRouteLoopStreak(farRouteDispatch);
  const farRouteLoopCapstone =
    formatFeedbackFarRouteLoopCapstone(farRouteDispatch);
  const farRouteBranchChoices =
    formatFeedbackFarRouteBranchChoices(farRouteDispatch);

  return {
    id:
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: feedbackType,
    typeLabel: FEEDBACK_TYPES[feedbackType].label,
    rating: clampRating(rating),
    message: String(message ?? "").trim().slice(0, MAX_MESSAGE_LENGTH),
    sessionId,
    createdAt,
    snapshot: {
      energy: currentState.energy ?? 0,
      totalEnergy: currentState.totalEnergy ?? 0,
      energyPerSecond: currentState.energyPerSecond ?? 0,
      energyPerClick: currentState.energyPerClick ?? 1,
      multiplier: currentState.multiplier ?? 1,
      overloadBonus: currentState.overloadBonus ?? 5,
      coreFeedback: formatFeedbackCoreFeedback(coreFeedback, preferences),
      routeStance: getFeedbackRouteStanceId(currentState.routeStance),
      projectOverview: formatFeedbackProjectOverview(projectOverview),
      projectChapter: formatFeedbackProjectChapter(projectOverview),
      projectFilter,
      upgradeAffordability,
      directiveMastery: getFeedbackDirectiveMastery(currentState.directiveMastery),
      directivePlan: formatFeedbackDirectivePlan(directivePlan),
      directiveTask: formatFeedbackDirectiveTask(directiveTask),
      farRouteDispatch: formatFeedbackFarRouteDispatch(farRouteDispatch),
      farRouteBranchChoices,
      farRouteLoopStreak,
      farRouteLoopCapstone,
      combo: currentState.combo ?? 0,
      goal: currentGoal.value ?? "未知",
      upgrades: currentState.upgrades ?? {}
    }
  };
}

export function buildFeedbackIssueUrl(entry, baseUrl = DEFAULT_ISSUE_URL) {
  const url = new URL(baseUrl);
  url.searchParams.set("title", `[反馈] ${entry.typeLabel} - ${entry.rating}/5`);
  url.searchParams.set("labels", FEEDBACK_TYPES[entry.type].labels.join(","));
  url.searchParams.set("body", createFeedbackIssueBody(entry));
  return url.toString();
}

export function createFeedbackIssueBody(entry) {
  const snapshot = entry.snapshot;
  const upgrades = Object.entries(snapshot.upgrades)
    .map(([id, level]) => `${id}:${level}`)
    .join(", ");
  const farRouteLoopStreakLine = snapshot.farRouteLoopStreak
    ? [`- 远航连段：${snapshot.farRouteLoopStreak}`]
    : [];
  const farRouteLoopCapstoneLine = snapshot.farRouteLoopCapstone
    ? [`- 远航满段回响：${snapshot.farRouteLoopCapstone}`]
    : [];
  const farRouteBranchChoicesLine = snapshot.farRouteBranchChoices
    ? [`- 远航路线对照：${snapshot.farRouteBranchChoices}`]
    : [];

  return [
    "## 玩家反馈",
    "",
    `类型：${entry.typeLabel}`,
    `评分：${entry.rating}/5`,
    `反馈编号：${entry.id}`,
    "",
    entry.message,
    "",
    "## 游戏快照",
    "",
    `- 能量：${snapshot.energy}`,
    `- 累计能量：${snapshot.totalEnergy}`,
    `- 每秒产能：${snapshot.energyPerSecond}`,
    `- 每次产能：${snapshot.energyPerClick}`,
    `- 产能倍率：${snapshot.multiplier}`,
    `- 过载奖励：${snapshot.overloadBonus}`,
    `- 点火反馈：${snapshot.coreFeedback}`,
    `- 航线策略：${getFeedbackRouteStanceName(snapshot.routeStance)}`,
    `- 星图进度：${snapshot.projectOverview}`,
    `- 星图章节：${snapshot.projectChapter}`,
    `- 星图筛选：${snapshot.projectFilter}`,
    `- 指令熟练：${snapshot.directiveMastery.stacks}/${DIRECTIVE_MASTERY_MAX_STACKS}`,
    `- 指令轮换：${snapshot.directivePlan}`,
    `- 航线委托：${snapshot.directiveTask}`,
    `- 远航调度：${snapshot.farRouteDispatch}`,
    ...farRouteBranchChoicesLine,
    ...farRouteLoopStreakLine,
    ...farRouteLoopCapstoneLine,
    `- 连击：${snapshot.combo}`,
    `- 当前目标：${snapshot.goal}`,
    `- 升级购买态：${snapshot.upgradeAffordability}`,
    `- 升级：${upgrades || "无"}`,
    `- Session：${entry.sessionId ?? "未知"}`,
    `- 创建时间：${entry.createdAt}`
  ].join("\n");
}

function getFeedbackRouteStanceId(routeStanceId) {
  return ROUTE_STANCE_DEFS.some((item) => item.id === routeStanceId)
    ? routeStanceId
    : DEFAULT_ROUTE_STANCE_ID;
}

function getFeedbackRouteStanceName(routeStanceId) {
  return (
    ROUTE_STANCE_DEFS.find((item) => item.id === routeStanceId)?.name ??
    ROUTE_STANCE_DEFS[0].name
  );
}

function getFeedbackDirectiveMastery(directiveMastery) {
  const stacks = Number(directiveMastery?.stacks ?? 0);

  return {
    stacks: Number.isFinite(stacks)
      ? Math.min(DIRECTIVE_MASTERY_MAX_STACKS, Math.max(0, Math.floor(stacks)))
      : 0
  };
}

function formatFeedbackCoreFeedback(coreFeedback, preferences) {
  const preferenceText = [
    typeof preferences?.soundEnabled === "boolean"
      ? "音效 " + (preferences.soundEnabled ? "开" : "关")
      : "",
    typeof preferences?.hapticEnabled === "boolean"
      ? "触感 " + (preferences.hapticEnabled ? "开" : "关")
      : ""
  ].filter(Boolean);

  return [coreFeedback?.text ?? "下一击未知", ...preferenceText]
    .filter(Boolean)
    .join(" · ");
}

function formatFeedbackProjectOverview(overview) {
  const summaryText = stripFeedbackLabel(
    overview?.summaryText ?? "未知",
    "星图进度"
  );
  const detailText = String(overview?.detailText ?? "");

  return [
    summaryText,
    detailText && !summaryText.includes(detailText) ? detailText : ""
  ]
    .filter(Boolean)
    .join(" · ");
}

function formatFeedbackProjectChapter(overview) {
  const chapterText = stripFeedbackLabel(
    overview?.chapterText ?? "未知",
    "阶段导航"
  );
  const currentText = chapterText.split("；当前 ")[1];

  return currentText ? "当前 " + currentText : chapterText;
}

function getFeedbackProjectFilterId(filterId) {
  return PROJECT_FILTER_DEFS.some((item) => item.id === filterId)
    ? filterId
    : INITIAL_PROJECT_FILTER_ID;
}

function formatFeedbackProjectFilter(projects, filterId) {
  return stripFeedbackLabel(
    getProjectFilterBrief(projects, filterId),
    "筛选摘要"
  );
}

function formatFeedbackUpgradeAffordability(state, goal) {
  const entries = UPGRADE_DEFS.map((upgrade) => ({
    upgrade,
    affordability: getUpgradeAffordability(state, upgrade.id)
  }));
  const readyEntries = entries.filter((entry) => entry.affordability.canBuy);
  const goalEntry = goal?.upgradeId
    ? entries.find((entry) => entry.upgrade.id === goal.upgradeId)
    : null;
  const nearestWaiting = entries
    .filter((entry) => !entry.affordability.canBuy)
    .sort(
      (left, right) =>
        left.affordability.remaining - right.affordability.remaining
    )[0];
  const readyText = readyEntries.length
    ? "可购买 " + readyEntries.map((entry) => entry.upgrade.name).join("、")
    : "无可购买升级";
  const goalText = goalEntry
    ? "目标 " +
      goalEntry.upgrade.name +
      " " +
      (goalEntry.affordability.canBuy
        ? "可购买"
        : "还差 " + formatNumber(goalEntry.affordability.remaining) + " 能量")
    : "";
  const nearestText =
    !readyEntries.length &&
    nearestWaiting &&
    (!goalEntry || nearestWaiting.upgrade.id !== goalEntry.upgrade.id)
      ? "最近 " +
        nearestWaiting.upgrade.name +
        " 还差 " +
        formatNumber(nearestWaiting.affordability.remaining) +
        " 能量"
      : "";

  return [readyText, goalText, nearestText].filter(Boolean).join(" · ");
}

function formatFeedbackDirectivePlan(plan) {
  const summaryText = stripFeedbackLabel(
    plan?.summaryText ?? plan?.text ?? "未知",
    "指令轮换"
  );
  const recommendationText = String(
    plan?.recommendationText ?? plan?.waitingRecommendationText ?? ""
  );
  const rewardText = plan?.nextRewardText
    ? "下一步收益 " + plan.nextRewardText
    : "";

  return [
    summaryText,
    recommendationText && !summaryText.includes(recommendationText)
      ? recommendationText
      : "",
    rewardText
  ]
    .filter(Boolean)
    .join(" · ");
}

function formatFeedbackDirectiveTask(task) {
  if (!task?.unlocked) {
    return stripFeedbackLabel(task?.text ?? "未知", "航线委托");
  }

  if (task.completed) {
    return [
      task.completedStepText,
      task.completedFollowupText,
      task.rewardText
    ]
      .filter(Boolean)
      .join(" · ");
  }

  const progressText = (task.progress ?? 0) + "/" + Math.max(1, task.target ?? 3);
  const rewardText = task.nextRewardText
    ? "下一步收益 " + task.nextRewardText
    : "";

  return [
    progressText,
    task.nextStepText,
    task.nextIntentText,
    task.nextActionText,
    task.nextStatusText,
    rewardText
  ]
    .filter(Boolean)
    .join(" · ");
}

function formatFeedbackFarRouteDispatch(dispatch) {
  const text = String(dispatch?.text ?? "未知").replace(/^远航调度：/, "");
  const loopStatusText = dispatch?.loopStatusText ? " · " + dispatch.loopStatusText : "";
  return text + loopStatusText;
}

function formatFeedbackFarRouteBranchChoices(dispatch) {
  return stripFeedbackLabel(dispatch?.branchChoiceSummaryText ?? "", "路线对照");
}

function formatFeedbackFarRouteLoopStreak(dispatch) {
  return String(dispatch?.loopStreakText ?? "");
}

function formatFeedbackFarRouteLoopCapstone(dispatch) {
  return String(dispatch?.loopCapstoneText ?? "");
}

function stripFeedbackLabel(text, label) {
  const value = String(text ?? "未知");
  const colonLabel = label + "：";
  const asciiColonLabel = label + ":";
  const spacedLabel = label + " ";

  if (value.startsWith(colonLabel)) {
    return value.slice(colonLabel.length);
  }

  if (value.startsWith(asciiColonLabel)) {
    return value.slice(asciiColonLabel.length);
  }

  if (value.startsWith(spacedLabel)) {
    return value.slice(spacedLabel.length);
  }

  return value;
}

function clampRating(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 3;
  }
  return Math.min(5, Math.max(1, Math.round(number)));
}

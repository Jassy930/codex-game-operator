import {
  DEFAULT_ROUTE_STANCE_ID,
  DIRECTIVE_MASTERY_MAX_STACKS,
  getFarRouteDispatch,
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
  createdAt = new Date().toISOString()
}) {
  const feedbackType = FEEDBACK_TYPES[type] ? type : "experience";
  const currentState = state ?? {};
  const currentGoal = goal ?? {};
  const farRouteDispatch = getFarRouteDispatch(currentState);
  const farRouteLoopStreak = formatFeedbackFarRouteLoopStreak(farRouteDispatch);

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
      routeStance: getFeedbackRouteStanceId(currentState.routeStance),
      directiveMastery: getFeedbackDirectiveMastery(currentState.directiveMastery),
      farRouteDispatch: formatFeedbackFarRouteDispatch(farRouteDispatch),
      farRouteLoopStreak,
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

  return [
    "## 玩家反馈",
    "",
    `类型：${entry.typeLabel}`,
    `评分：${entry.rating}/5`,
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
    `- 航线策略：${getFeedbackRouteStanceName(snapshot.routeStance)}`,
    `- 指令熟练：${snapshot.directiveMastery.stacks}/${DIRECTIVE_MASTERY_MAX_STACKS}`,
    `- 远航调度：${snapshot.farRouteDispatch}`,
    ...farRouteLoopStreakLine,
    `- 连击：${snapshot.combo}`,
    `- 当前目标：${snapshot.goal}`,
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

function formatFeedbackFarRouteDispatch(dispatch) {
  const text = String(dispatch?.text ?? "未知").replace(/^远航调度：/, "");
  const loopStatusText = dispatch?.loopStatusText ? " · " + dispatch.loopStatusText : "";
  return text + loopStatusText;
}

function formatFeedbackFarRouteLoopStreak(dispatch) {
  return String(dispatch?.loopStreakText ?? "");
}

function clampRating(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 3;
  }
  return Math.min(5, Math.max(1, Math.round(number)));
}

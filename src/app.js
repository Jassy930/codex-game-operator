import {
  UPGRADE_DEFS,
  buildActionNoticeWithGoalTransition,
  buildClickActionNotice,
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
  normalizeState,
  purchaseUpgrade,
  setRouteStance,
  settleOfflineProgress,
  tick
} from "./game.js";
import { buildFeedbackIssueUrl, createFeedbackEntry } from "./feedback.js";

const STORAGE_KEY = "codex-game-operator.state";
const EVENT_KEY = "codex-game-operator.events";
const FEEDBACK_KEY = "codex-game-operator.feedback";
const SESSION_ID = globalThis.crypto?.randomUUID?.() ?? String(Date.now());

const elements = {
  energy: document.querySelector("#energyValue"),
  perSecond: document.querySelector("#perSecondValue"),
  perClick: document.querySelector("#perClickValue"),
  overload: document.querySelector("#overloadValue"),
  coreButton: document.querySelector("#coreButton"),
  combo: document.querySelector("#comboValue"),
  pulse: document.querySelector("#pulseValue"),
  goalLabel: document.querySelector("#goalLabel"),
  goalValue: document.querySelector("#goalValue"),
  goalHint: document.querySelector("#goalHint"),
  goalMeter: document.querySelector("#goalMeter"),
  offlineNotice: document.querySelector("#offlineNotice"),
  actionNotice: document.querySelector("#actionNotice"),
  upgradeList: document.querySelector("#upgradeList"),
  projectOverview: document.querySelector("#projectOverview"),
  projectOverviewDetail: document.querySelector("#projectOverviewDetail"),
  projectOverviewBonus: document.querySelector("#projectOverviewBonus"),
  projectOverviewForecast: document.querySelector("#projectOverviewForecast"),
  routeStanceList: document.querySelector("#routeStanceList"),
  projectList: document.querySelector("#projectList"),
  resetButton: document.querySelector("#resetButton"),
  feedbackForm: document.querySelector("#feedbackForm"),
  feedbackType: document.querySelector("#feedbackType"),
  feedbackRating: document.querySelector("#feedbackRating"),
  feedbackMessage: document.querySelector("#feedbackMessage"),
  feedbackStatus: document.querySelector("#feedbackStatus")
};

const loadedState = loadState();
let state = loadedState.state;
let offlineSummary = loadedState.offlineSummary;
let actionNotice = "";
let lastFirstUpgradeAt = state.firstUpgradeAt;

recordEvent("session", {
  startedAt: new Date().toISOString()
});
if (offlineSummary) {
  recordEvent("offline_gain", {
    gained: Math.round(offlineSummary.gained * 10) / 10,
    elapsedSeconds: offlineSummary.elapsedSeconds,
    capped: offlineSummary.capped
  });
}
persistState();
render();

elements.coreButton.addEventListener("click", () => {
  offlineSummary = null;
  const previousGoal = getCurrentGoal(state);
  state = clickCore(state);
  applyActionNoticeWithGoalTransition(previousGoal, state, buildClickActionNotice(state));
  recordEvent("click", {
    energy: Math.floor(state.energy),
    combo: state.combo
  });
  animateCore();
  saveAndRender();
});

elements.resetButton.addEventListener("click", () => {
  state = createInitialState();
  offlineSummary = null;
  actionNotice = "已重置工坊。";
  lastFirstUpgradeAt = null;
  recordEvent("reset");
  saveAndRender();
});

elements.feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = elements.feedbackMessage.value.trim();

  if (message.length < 6) {
    elements.feedbackStatus.textContent = "请至少写 6 个字。";
    return;
  }

  const current = normalizeState(state);
  const goal = getCurrentGoal(current);
  const entry = createFeedbackEntry({
    type: elements.feedbackType.value,
    rating: elements.feedbackRating.value,
    message,
    state: current,
    goal,
    sessionId: SESSION_ID
  });
  const issueUrl = buildFeedbackIssueUrl(entry);

  saveFeedbackEntry(entry);
  recordEvent("feedback_sent", {
    type: entry.type,
    rating: entry.rating,
    messageLength: entry.message.length
  });

  elements.feedbackStatus.textContent = "已生成 GitHub Issue 草稿。";
  elements.feedbackMessage.value = "";

  const feedbackWindow = window.open(issueUrl, "_blank", "noopener,noreferrer");
  if (!feedbackWindow) {
    window.location.href = issueUrl;
  }
});

setInterval(() => {
  const previousGoal = getCurrentGoal(state);
  state = tick(state);
  applyActionNoticeWithGoalTransition(previousGoal, state);
  saveAndRender();
}, 250);

function render() {
  const current = normalizeState(state);
  const goal = getCurrentGoal(current);
  const combo = getComboStatus(current);
  const production = getEffectiveProduction(current);
  const projectOverview = getProjectOverview(current);
  const routeStance = getRouteStanceStatus(current);

  elements.energy.textContent = formatNumber(current.energy);
  elements.perSecond.textContent = formatNumber(production.perSecond);
  elements.perClick.textContent = formatNumber(production.perClick);
  elements.overload.textContent = "+" + formatNumber(production.overloadBonus);
  elements.combo.textContent = "连击 " + combo.count + " · " + combo.progressText;
  elements.pulse.textContent = combo.overloaded ? current.lastPulse : combo.hintText;
  elements.goalLabel.textContent = goal.label;
  elements.goalValue.textContent = goal.value;
  elements.goalHint.textContent = goal.progressText;
  elements.goalMeter.style.width = Math.round(goal.progress * 100) + "%";
  renderOfflineNotice();
  renderActionNotice();
  elements.projectOverview.textContent = projectOverview.summaryText;
  elements.projectOverviewDetail.textContent = projectOverview.detailText;
  elements.projectOverviewBonus.textContent = projectOverview.bonusText;
  elements.projectOverviewForecast.textContent = projectOverview.forecastText;
  renderRouteStances(routeStance);

  elements.upgradeList.replaceChildren(
    ...UPGRADE_DEFS.map((upgrade) => renderUpgrade(upgrade, current, goal))
  );
  elements.projectList.replaceChildren(
    ...getProjectStatuses(current).map((project) => renderProject(project))
  );
}

function renderUpgrade(upgrade, current, goal) {
  const affordability = getUpgradeAffordability(current, upgrade.id);
  const cost = affordability.cost;
  const level = current.upgrades[upgrade.id] ?? 0;
  const canBuy = affordability.canBuy;
  const isGoalTarget = goal.upgradeId === upgrade.id;
  const button = document.createElement("button");
  button.className = isGoalTarget ? "upgrade-card is-goal-target" : "upgrade-card";
  button.type = "button";
  button.disabled = !canBuy;
  button.addEventListener("click", () => {
    offlineSummary = null;
    const previousGoal = getCurrentGoal(state);
    const result = purchaseUpgrade(state, upgrade.id);
    state = result.state;
    if (result.purchased) {
      applyActionNoticeWithGoalTransition(
        previousGoal,
        state,
        buildUpgradePurchaseNotice(result)
      );
      recordEvent("upgrade_purchase", {
        upgrade: upgrade.id,
        level: state.upgrades[upgrade.id],
        cost: result.cost
      });
      if (!lastFirstUpgradeAt && state.firstUpgradeAt) {
        lastFirstUpgradeAt = state.firstUpgradeAt;
        recordEvent("first_upgrade_time", {
          milliseconds: state.firstUpgradeAt - state.createdAt
        });
      }
    }
    saveAndRender();
  });

  const header = document.createElement("span");
  header.className = "upgrade-name";
  header.textContent = upgrade.name;

  const goalBadge = document.createElement("span");
  goalBadge.className = "upgrade-goal-badge";
  goalBadge.textContent = "目标推荐";
  goalBadge.hidden = !isGoalTarget;

  const summary = document.createElement("span");
  summary.className = "upgrade-summary";
  summary.textContent = upgrade.summary;

  const meta = document.createElement("span");
  meta.className = "upgrade-meta";
  meta.textContent = "Lv." + level + " · 成本 " + formatNumber(cost);

  const affordance = document.createElement("span");
  affordance.className = "upgrade-affordance";
  affordance.textContent = canBuy
    ? "可购买"
    : "还差 " + formatNumber(affordability.remaining);

  const meter = document.createElement("span");
  meter.className = "upgrade-meter";
  meter.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.style.width = Math.round(affordability.progress * 100) + "%";
  meter.append(fill);

  button.append(header, goalBadge, summary, meta, affordance, meter);
  return button;
}

function renderRouteStances(routeStance) {
  elements.routeStanceList.replaceChildren(
    ...routeStance.options.map((option) => renderRouteStance(option, routeStance))
  );
}

function renderRouteStance(option, routeStance) {
  const button = document.createElement("button");
  button.className = option.selected
    ? "route-stance-button is-active"
    : "route-stance-button";
  button.type = "button";
  button.disabled = option.disabled;
  button.setAttribute("aria-pressed", option.selected ? "true" : "false");
  button.addEventListener("click", () => {
    offlineSummary = null;
    const result = setRouteStance(state, option.id);
    state = result.state;

    if (result.changed) {
      actionNotice = "已切换航线策略：" + result.stance.name;
      recordEvent("route_stance", {
        routeStance: result.stance.id
      });
    } else if (result.reason === "locked") {
      actionNotice = routeStance.unlockText;
    }

    saveAndRender();
  });

  const name = document.createElement("strong");
  name.textContent = option.name;

  const summary = document.createElement("span");
  summary.textContent = routeStance.unlocked ? option.summary : routeStance.unlockText;

  const mastery = document.createElement("span");
  mastery.className = "route-stance-mastery";
  mastery.textContent = option.masteryText;
  mastery.hidden = !routeStance.unlocked;

  button.append(name, summary, mastery);
  return button;
}

function renderProject(project) {
  const item = document.createElement("article");
  item.className = [
    "project-item",
    project.completed ? "is-complete" : "",
    project.isCurrent ? "is-current" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const header = document.createElement("div");
  header.className = "project-header";

  const name = document.createElement("strong");
  name.textContent = project.name;

  const segmentBadge = document.createElement("span");
  segmentBadge.className = "project-segment-badge";
  segmentBadge.textContent = project.segmentText;

  const currentBadge = document.createElement("span");
  currentBadge.className = "project-current-badge";
  currentBadge.textContent = "当前航段";
  currentBadge.hidden = !project.isCurrent;

  const summary = document.createElement("span");
  summary.className = "project-summary";
  summary.textContent = project.summary;

  const progress = document.createElement("span");
  progress.className = "project-progress";
  progress.textContent = project.progressText;

  const reward = document.createElement("span");
  reward.className = "project-reward";
  reward.textContent = project.reward;

  const meter = document.createElement("span");
  meter.className = "project-meter";
  meter.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.style.width = Math.round(project.progress * 100) + "%";
  meter.append(fill);

  header.append(name, segmentBadge, currentBadge);
  item.append(header, summary, progress, reward, meter);
  return item;
}

function renderActionNotice() {
  elements.actionNotice.hidden = actionNotice.length === 0;
  elements.actionNotice.textContent = actionNotice;
}

function saveAndRender() {
  persistState();
  render();
}

function applyActionNoticeWithGoalTransition(previousGoal, nextState, primaryNotice = "") {
  const nextGoal = getCurrentGoal(nextState);
  const notice = buildActionNoticeWithGoalTransition(primaryNotice, previousGoal, nextGoal);

  if (notice) {
    actionNotice = notice;
  }

  if (previousGoal.id !== nextGoal.id) {
    recordEvent("goal_complete", {
      completedGoal: previousGoal.id,
      nextGoal: nextGoal.id
    });
  }
}

function loadState() {
  try {
    const now = Date.now();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    const result = settleOfflineProgress(normalizeState(saved, now), now);
    return {
      state: result.state,
      offlineSummary: result.summary
    };
  } catch {
    return {
      state: createInitialState(),
      offlineSummary: null
    };
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderOfflineNotice() {
  if (!offlineSummary) {
    elements.offlineNotice.hidden = true;
    elements.offlineNotice.textContent = "";
    return;
  }

  const cappedText = offlineSummary.capped ? "，已按 8 小时上限结算" : "";
  elements.offlineNotice.hidden = false;
  elements.offlineNotice.textContent =
    "离线 " +
    formatElapsed(offlineSummary.elapsedSeconds) +
    "，回收 " +
    formatNumber(offlineSummary.gained) +
    " 能量" +
    cappedText +
    "。";
}

function formatElapsed(seconds) {
  if (seconds >= 3600) {
    return Math.floor(seconds / 3600) + " 小时";
  }
  if (seconds >= 60) {
    return Math.floor(seconds / 60) + " 分钟";
  }
  return Math.max(1, seconds) + " 秒";
}

function recordEvent(type, payload = {}) {
  try {
    const events = JSON.parse(localStorage.getItem(EVENT_KEY) ?? "[]");
    events.push({
      type,
      payload,
      sessionId: SESSION_ID,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(EVENT_KEY, JSON.stringify(events.slice(-200)));
  } catch {
    // Metrics are best-effort in the browser-only bootstrap.
  }
}

function saveFeedbackEntry(entry) {
  try {
    const entries = JSON.parse(localStorage.getItem(FEEDBACK_KEY) ?? "[]");
    entries.push(entry);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries.slice(-50)));
  } catch {
    // Feedback drafts still open in GitHub even if localStorage is unavailable.
  }
}

function animateCore() {
  elements.coreButton.classList.remove("is-pulsing");
  requestAnimationFrame(() => {
    elements.coreButton.classList.add("is-pulsing");
  });
}

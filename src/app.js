import {
  INITIAL_PROJECT_FILTER_ID,
  PROJECT_FILTER_DEFS,
  UPGRADE_DEFS,
  activateDirective,
  buildActionNoticeWithGoalTransition,
  buildClickActionNotice,
  buildUpgradePurchaseNotice,
  clickCore,
  createInitialState,
  filterProjectStatuses,
  formatNumber,
  getComboStatus,
  getCurrentGoal,
  getDirectiveStatus,
  getEffectiveProduction,
  getProjectFilterBrief,
  getProjectFilterSummary,
  getProjectFilterButtonText,
  getProjectOverview,
  getProjectStatuses,
  getProjectVisualMap,
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
const SVG_NS = "http://www.w3.org/2000/svg";
const UPGRADE_ICON_DEFS = {
  lens: {
    label: "聚能透镜图标",
    nodes: [
      ["circle", { cx: 24, cy: 24, r: 10, fill: "none", stroke: "currentColor", "stroke-width": 4 }],
      ["circle", { cx: 24, cy: 24, r: 4, fill: "currentColor", opacity: 0.36 }],
      ["path", { d: "M7 24h8M33 24h8M24 7v8M24 33v8", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round" }]
    ]
  },
  collector: {
    label: "自动采集臂图标",
    nodes: [
      ["path", { d: "M10 36h28", stroke: "currentColor", "stroke-width": 5, "stroke-linecap": "round" }],
      ["path", { d: "M14 34l10-12 10 12", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linejoin": "round" }],
      ["circle", { cx: 24, cy: 19, r: 6, fill: "none", stroke: "currentColor", "stroke-width": 4 }],
      ["path", { d: "M18 13l-4-4M30 13l4-4", stroke: "currentColor", "stroke-width": 3, "stroke-linecap": "round" }]
    ]
  },
  stabilizer: {
    label: "星核稳定器图标",
    nodes: [
      ["path", { d: "M24 6l15 8v12c0 8-6 14-15 18C15 40 9 34 9 26V14z", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linejoin": "round" }],
      ["path", { d: "M17 25l5 5 10-12", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }]
    ]
  },
  resonator: {
    label: "星核谐振器图标",
    nodes: [
      ["circle", { cx: 24, cy: 24, r: 5, fill: "currentColor", opacity: 0.34 }],
      ["circle", { cx: 24, cy: 24, r: 12, fill: "none", stroke: "currentColor", "stroke-width": 4 }],
      ["circle", { cx: 24, cy: 24, r: 19, fill: "none", stroke: "currentColor", "stroke-width": 3, "stroke-dasharray": "4 5" }],
      ["path", { d: "M24 5v6M24 37v6M5 24h6M37 24h6", stroke: "currentColor", "stroke-width": 3, "stroke-linecap": "round" }]
    ]
  }
};
const PROJECT_CARD_ICON_DEFS = {
  energy: {
    label: "累计航段图标",
    nodes: [
      ["path", { d: "M24 5l13 15-13 23L11 20z", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linejoin": "round" }],
      ["path", { d: "M24 12v24M15 21h18", stroke: "currentColor", "stroke-width": 3, "stroke-linecap": "round" }]
    ]
  },
  upgrade: {
    label: "升级航段图标",
    nodes: [
      ["path", { d: "M12 34h24", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round" }],
      ["path", { d: "M24 8v26M15 17l9-9 9 9", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }]
    ]
  },
  total: {
    label: "总产能奖励图标",
    nodes: [
      ["circle", { cx: 24, cy: 24, r: 13, fill: "none", stroke: "currentColor", "stroke-width": 4 }],
      ["path", { d: "M24 7v6M24 35v6M7 24h6M35 24h6", stroke: "currentColor", "stroke-width": 3, "stroke-linecap": "round" }]
    ]
  },
  click: {
    label: "点击奖励图标",
    nodes: [
      ["path", { d: "M17 10l14 14-7 2 5 11-5 2-5-11-6 5z", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linejoin": "round" }]
    ]
  },
  second: {
    label: "自动奖励图标",
    nodes: [
      ["path", { d: "M14 32a12 12 0 1 1 20 0", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round" }],
      ["path", { d: "M24 13v12l8 4", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }]
    ]
  },
  overload: {
    label: "过载奖励图标",
    nodes: [
      ["path", { d: "M27 5L12 27h11l-2 16 15-23H25z", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linejoin": "round" }]
    ]
  }
};

const elements = {
  energy: document.querySelector("#energyValue"),
  perSecond: document.querySelector("#perSecondValue"),
  perClick: document.querySelector("#perClickValue"),
  overload: document.querySelector("#overloadValue"),
  coreButton: document.querySelector("#coreButton"),
  combo: document.querySelector("#comboValue"),
  pulse: document.querySelector("#pulseValue"),
  directiveList: document.querySelector("#directiveList"),
  directivePlan: document.querySelector("#directivePlan"),
  goalLabel: document.querySelector("#goalLabel"),
  goalValue: document.querySelector("#goalValue"),
  goalHint: document.querySelector("#goalHint"),
  goalMeter: document.querySelector("#goalMeter"),
  offlineNotice: document.querySelector("#offlineNotice"),
  actionNotice: document.querySelector("#actionNotice"),
  upgradeList: document.querySelector("#upgradeList"),
  projectOverview: document.querySelector("#projectOverview"),
  projectOverviewDetail: document.querySelector("#projectOverviewDetail"),
  projectOverviewTracks: document.querySelector("#projectOverviewTracks"),
  projectOverviewChapter: document.querySelector("#projectOverviewChapter"),
  projectOverviewChapterTargets: document.querySelector("#projectOverviewChapterTargets"),
  projectOverviewChapterRewards: document.querySelector("#projectOverviewChapterRewards"),
  projectOverviewRewardProgress: document.querySelector("#projectOverviewRewardProgress"),
  projectOverviewRewardTargets: document.querySelector("#projectOverviewRewardTargets"),
  projectOverviewMilestones: document.querySelector("#projectOverviewMilestones"),
  projectOverviewRouteFocus: document.querySelector("#projectOverviewRouteFocus"),
  projectOverviewComposition: document.querySelector("#projectOverviewComposition"),
  projectOverviewBonus: document.querySelector("#projectOverviewBonus"),
  projectOverviewAction: document.querySelector("#projectOverviewAction"),
  projectOverviewForecast: document.querySelector("#projectOverviewForecast"),
  projectMapSummary: document.querySelector("#projectMapSummary"),
  projectMapFilter: document.querySelector("#projectMapFilter"),
  projectMapTrack: document.querySelector("#projectMapTrack"),
  routeStanceList: document.querySelector("#routeStanceList"),
  projectFilterList: document.querySelector("#projectFilterList"),
  projectFilterSummaryBrief: document.querySelector("#projectFilterSummaryBrief"),
  projectFilterSummary: document.querySelector("#projectFilterSummary"),
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
let projectFilter = INITIAL_PROJECT_FILTER_ID;

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
  const projects = getProjectStatuses(current);
  const routeStance = getRouteStanceStatus(current);
  const directives = getDirectiveStatus(current);

  elements.energy.textContent = formatNumber(current.energy);
  elements.perSecond.textContent = formatNumber(production.perSecond);
  elements.perClick.textContent = formatNumber(production.perClick);
  elements.overload.textContent = "+" + formatNumber(production.overloadBonus);
  elements.combo.textContent = "连击 " + combo.count + " · " + combo.progressText;
  elements.pulse.textContent = combo.overloaded ? current.lastPulse : combo.hintText;
  renderDirectives(directives);
  elements.directivePlan.textContent = directives.plan.text;
  elements.goalLabel.textContent = goal.label;
  elements.goalValue.textContent = goal.value;
  elements.goalHint.textContent = goal.progressText;
  elements.goalMeter.style.width = Math.round(goal.progress * 100) + "%";
  renderOfflineNotice();
  renderActionNotice();
  elements.projectOverview.textContent = projectOverview.summaryText;
  elements.projectOverviewDetail.textContent = projectOverview.detailText;
  elements.projectOverviewTracks.textContent = projectOverview.trackText;
  elements.projectOverviewChapter.textContent = projectOverview.chapterText;
  elements.projectOverviewChapterTargets.textContent = projectOverview.chapterTargetText;
  elements.projectOverviewChapterRewards.textContent = projectOverview.chapterRewardText;
  elements.projectOverviewRewardProgress.textContent = projectOverview.rewardProgressText;
  elements.projectOverviewRewardTargets.textContent = projectOverview.rewardTargetText;
  elements.projectOverviewMilestones.textContent = projectOverview.milestoneText;
  elements.projectOverviewRouteFocus.textContent = projectOverview.routeFocusText;
  elements.projectOverviewComposition.textContent = projectOverview.compositionText;
  elements.projectOverviewBonus.textContent = projectOverview.bonusText;
  elements.projectOverviewAction.textContent = projectOverview.actionText;
  elements.projectOverviewForecast.textContent = projectOverview.forecastText;
  renderProjectMap(getProjectVisualMap(projects, projectFilter));
  renderRouteStances(routeStance);
  renderProjectFilters(projects);
  elements.projectFilterSummaryBrief.textContent = getProjectFilterBrief(
    projects,
    projectFilter
  );
  elements.projectFilterSummary.textContent = getProjectFilterSummary(projects, projectFilter);

  elements.upgradeList.replaceChildren(
    ...UPGRADE_DEFS.map((upgrade) => renderUpgrade(upgrade, current, goal))
  );
  renderProjectList(projects);
}

function renderDirectives(directives) {
  elements.directiveList.replaceChildren(
    ...directives.options.map((option) => renderDirective(option))
  );
}

function renderDirective(option) {
  const button = document.createElement("button");
  button.className = [
    "directive-button",
    option.ready ? "is-ready" : "",
    option.recommended ? "is-recommended" : "",
    option.finisherRecommended ? "is-finisher-recommended" : ""
  ]
    .filter(Boolean)
    .join(" ");
  button.type = "button";
  button.disabled = option.disabled;
  button.addEventListener("click", () => {
    offlineSummary = null;
    const previousGoal = getCurrentGoal(state);
    const result = activateDirective(state, option.id);
    state = result.state;

    if (result.activated) {
      applyActionNoticeWithGoalTransition(previousGoal, state, result.notice);
      recordEvent("directive", {
        directive: option.id,
        gain: result.gain,
        rotationReward: result.rotationReward,
        stanceFinisherReward: result.stanceFinisherReward,
        stanceBonus: result.stanceBonus,
        stanceBonusRate: result.stanceBonusRate,
        chainStacks: result.chainStacks,
        chainMultiplier: result.chainMultiplier
      });
    } else {
      actionNotice = result.notice;
    }

    saveAndRender();
  });

  const name = document.createElement("strong");
  name.textContent = option.name;

  const head = document.createElement("span");
  head.className = "directive-head";

  const badges = document.createElement("span");
  badges.className = "directive-badges";

  const recommendation = document.createElement("span");
  recommendation.className = "directive-recommendation";
  recommendation.textContent = option.recommendationText;
  recommendation.hidden = !option.recommended;

  const finisherRecommendation = document.createElement("span");
  finisherRecommendation.className = "directive-finisher-recommendation";
  finisherRecommendation.textContent = option.finisherRecommendationText;
  finisherRecommendation.hidden = !option.finisherRecommended;

  const stanceBonus = document.createElement("span");
  stanceBonus.className = "directive-stance-bonus";
  stanceBonus.textContent = option.stanceBonusText;
  stanceBonus.hidden = !option.stanceMatched;

  badges.append(recommendation, finisherRecommendation, stanceBonus);
  head.append(name, badges);

  const summary = document.createElement("span");
  summary.textContent = option.summary;

  const preview = document.createElement("span");
  preview.className = "directive-preview";
  preview.textContent = option.previewText;

  const status = document.createElement("span");
  status.className = "directive-status";
  status.textContent = option.statusText;

  button.append(head, summary, preview, status);
  return button;
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

  const head = document.createElement("span");
  head.className = "upgrade-card-head";

  const titleGroup = document.createElement("span");
  titleGroup.className = "upgrade-title-group";
  titleGroup.append(header, goalBadge);

  head.append(renderUpgradeIcon(upgrade), titleGroup);

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

  button.append(head, summary, meta, affordance, meter);
  return button;
}

function renderUpgradeIcon(upgrade) {
  const iconDef = UPGRADE_ICON_DEFS[upgrade.id] ?? UPGRADE_ICON_DEFS.stabilizer;
  const wrapper = document.createElement("span");
  wrapper.className = "upgrade-icon upgrade-icon-" + upgrade.id;
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", iconDef.label);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  iconDef.nodes.forEach(([tagName, attributes]) => {
    svg.append(createSvgElement(tagName, attributes));
  });

  wrapper.append(svg);
  return wrapper;
}

function createSvgElement(tagName, attributes) {
  const element = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, String(value));
  });
  return element;
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

function renderProjectFilters(projects) {
  elements.projectFilterList.replaceChildren(
    ...PROJECT_FILTER_DEFS.map((filter) => renderProjectFilter(filter, projects))
  );
}

function renderProjectMap(map) {
  elements.projectMapSummary.textContent = map.summaryText;
  elements.projectMapFilter.textContent = map.filterText;
  elements.projectMapTrack.replaceChildren(...map.nodes.map(renderProjectMapNode));
}

function renderProjectMapNode(node) {
  const item = document.createElement("span");
  item.className = [
    "project-map-node",
    "is-" + node.status,
    node.selected ? "" : "is-dimmed"
  ]
    .filter(Boolean)
    .join(" ");
  item.setAttribute("role", "listitem");
  item.title = node.title;
  item.setAttribute("aria-label", node.title);
  return item;
}

function renderProjectFilter(filter, projects) {
  const button = document.createElement("button");
  button.className =
    filter.id === projectFilter ? "project-filter-button is-active" : "project-filter-button";
  button.type = "button";
  button.setAttribute("aria-pressed", filter.id === projectFilter ? "true" : "false");
  button.textContent = getProjectFilterButtonText(projects, filter.id);
  button.addEventListener("click", () => {
    projectFilter = filter.id;
    render();
  });

  return button;
}

function renderProjectList(projects) {
  const visibleProjects = filterProjectStatuses(projects, projectFilter);
  const children = visibleProjects.length
    ? visibleProjects.map((project) => renderProject(project))
    : [renderProjectEmptyState()];

  elements.projectList.replaceChildren(...children);
}

function renderProjectEmptyState() {
  const item = document.createElement("p");
  item.className = "project-empty-state";
  item.textContent = "没有匹配航段。";
  return item;
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

  const title = document.createElement("span");
  title.className = "project-title";

  const cardIcons = document.createElement("span");
  cardIcons.className = "project-card-icons";
  cardIcons.append(
    renderProjectCardIcon(getProjectTrackIconId(project), "track"),
    renderProjectCardIcon(getProjectRewardIconId(project), "reward")
  );

  title.append(cardIcons, name);

  const segmentBadge = document.createElement("span");
  segmentBadge.className = "project-segment-badge";
  segmentBadge.textContent = project.segmentText;

  const chapterBadge = document.createElement("span");
  chapterBadge.className = "project-chapter-badge";
  chapterBadge.textContent = project.chapterText;

  const tagBadge = document.createElement("span");
  tagBadge.className = "project-tag-badge";
  tagBadge.textContent = project.tagText;

  const statusBadge = document.createElement("span");
  statusBadge.className = [
    "project-status-badge",
    project.completed ? "is-complete" : "",
    project.isCurrent ? "is-current" : "",
    !project.completed && !project.isCurrent ? "is-pending" : ""
  ]
    .filter(Boolean)
    .join(" ");
  statusBadge.textContent = project.statusText;

  header.append(title, segmentBadge, chapterBadge, tagBadge, statusBadge);
  item.append(header);

  const detailNodes = renderProjectDetailNodes(project);
  if (project.isCurrent) {
    item.append(...detailNodes);
  } else {
    const details = document.createElement("details");
    details.className = "project-card-drawer";

    const detailSummary = document.createElement("summary");
    detailSummary.textContent = "航段详情";

    const detailGrid = document.createElement("div");
    detailGrid.className = "project-card-detail-grid";
    detailGrid.append(...detailNodes);

    details.append(detailSummary, detailGrid);
    item.append(details);
  }
  return item;
}

function renderProjectDetailNodes(project) {
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

  return [summary, progress, reward, meter];
}

function getProjectTrackIconId(project) {
  return project.upgradeId ? "upgrade" : "energy";
}

function getProjectRewardIconId(project) {
  const effect = project.effect ?? {};

  if (effect.clickMultiplier) {
    return "click";
  }
  if (effect.secondMultiplier) {
    return "second";
  }
  if (effect.overloadMultiplier) {
    return "overload";
  }
  return "total";
}

function renderProjectCardIcon(iconId, variant) {
  const iconDef = PROJECT_CARD_ICON_DEFS[iconId] ?? PROJECT_CARD_ICON_DEFS.total;
  const wrapper = document.createElement("span");
  wrapper.className = [
    "project-card-icon",
    "project-card-icon-" + variant,
    "project-card-icon-" + iconId
  ].join(" ");
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", iconDef.label);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  iconDef.nodes.forEach(([tagName, attributes]) => {
    svg.append(createSvgElement(tagName, attributes));
  });

  wrapper.append(svg);
  return wrapper;
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

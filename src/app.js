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
  getCoreRewardPreview,
  getCurrentGoal,
  getDirectiveStatus,
  getEffectiveProduction,
  getFarRouteDispatch,
  getProjectFilterBrief,
  getProjectFilterSummary,
  getProjectFilterButtonText,
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
const SOUND_KEY = "codex-game-operator.sound-enabled";
const HAPTIC_KEY = "codex-game-operator.haptic-enabled";
const SESSION_ID = globalThis.crypto?.randomUUID?.() ?? String(Date.now());
const SVG_NS = "http://www.w3.org/2000/svg";
const DIRECTIVE_VISIBLE_BADGE_LIMIT = 3;
const ROUTE_STANCE_ICON_DEFS = {
  balanced: {
    label: "均衡航线徽记",
    nodes: [
      ["circle", { cx: 24, cy: 24, r: 14, fill: "none", stroke: "currentColor", "stroke-width": 4 }],
      ["circle", { cx: 24, cy: 24, r: 4, fill: "currentColor", opacity: 0.42 }],
      ["path", { d: "M24 10v8M12 31l7-4M36 31l-7-4", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round" }]
    ]
  },
  ignition: {
    label: "点火优先徽记",
    nodes: [
      ["path", { d: "M27 5L13 27h10l-3 16 15-23H25z", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linejoin": "round" }],
      ["path", { d: "M14 34c4 6 16 6 20 0", fill: "none", stroke: "currentColor", "stroke-width": 3, "stroke-linecap": "round" }]
    ]
  },
  cruise: {
    label: "巡航优先徽记",
    nodes: [
      ["path", { d: "M8 29c5-13 27-13 32 0", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round" }],
      ["path", { d: "M15 30l9 9 9-9", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }],
      ["circle", { cx: 24, cy: 19, r: 5, fill: "currentColor", opacity: 0.34 }]
    ]
  }
};
const DIRECTIVE_ICON_DEFS = {
  "ignition-salvo": {
    label: "点火齐射徽记",
    nodes: [
      ["path", { d: "M24 5l9 15h-7l5 23-16-26h8z", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linejoin": "round" }],
      ["path", { d: "M10 33c4 5 10 8 14 8s10-3 14-8", fill: "none", stroke: "currentColor", "stroke-width": 3, "stroke-linecap": "round" }],
      ["path", { d: "M11 18h5M32 18h5", stroke: "currentColor", "stroke-width": 3, "stroke-linecap": "round" }]
    ]
  },
  "cruise-cache": {
    label: "巡航回收徽记",
    nodes: [
      ["path", { d: "M9 19c5-6 12-9 21-8l4-5 3 12-12 2 4-5c-7 0-12 2-16 7", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }],
      ["path", { d: "M39 29c-5 6-12 9-21 8l-4 5-3-12 12-2-4 5c7 0 12-2 16-7", fill: "none", stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }]
    ]
  },
  "resonance-pulse": {
    label: "谐振脉冲徽记",
    nodes: [
      ["circle", { cx: 24, cy: 24, r: 5, fill: "currentColor", opacity: 0.42 }],
      ["circle", { cx: 24, cy: 24, r: 13, fill: "none", stroke: "currentColor", "stroke-width": 4 }],
      ["path", { d: "M24 5v7M24 36v7M5 24h7M36 24h7", stroke: "currentColor", "stroke-width": 3, "stroke-linecap": "round" }],
      ["path", { d: "M12 12l5 5M36 12l-5 5M12 36l5-5M36 36l-5-5", stroke: "currentColor", "stroke-width": 3, "stroke-linecap": "round" }]
    ]
  }
};
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
const PROJECT_FILTER_VISUAL_CLASSES = {
  all: "is-filter-all",
  current: "is-filter-current",
  "current-chapter": "is-filter-chapter",
  "chapter-starter-map": "is-filter-chapter is-filter-chapter-starter",
  "chapter-mastery": "is-filter-chapter is-filter-chapter-mastery",
  "chapter-deep-infra": "is-filter-chapter is-filter-chapter-infra",
  "chapter-long-tail": "is-filter-chapter is-filter-chapter-tail",
  "energy-track": "is-filter-track is-filter-energy",
  "upgrade-track": "is-filter-track is-filter-upgrade",
  "total-reward": "is-filter-reward is-filter-reward-total",
  "click-reward": "is-filter-reward is-filter-reward-click",
  "second-reward": "is-filter-reward is-filter-reward-second",
  "overload-reward": "is-filter-reward is-filter-reward-overload",
  incomplete: "is-filter-state is-filter-incomplete",
  completed: "is-filter-state is-filter-completed"
};

const elements = {
  energy: document.querySelector("#energyValue"),
  perSecond: document.querySelector("#perSecondValue"),
  perClick: document.querySelector("#perClickValue"),
  overload: document.querySelector("#overloadValue"),
  coreButton: document.querySelector("#coreButton"),
  coreStageAura: document.querySelector("#coreButton .core-stage-aura"),
  coreChargeRing: document.querySelector("#coreButton .core-charge-ring"),
  coreImpactPoint: document.querySelector("#coreImpactPoint"),
  coreImpactRipple: document.querySelector("#coreImpactRipple"),
  coreImpactSparks: document.querySelector("#coreImpactSparks"),
  coreGainPop: document.querySelector("#coreGainPop"),
  coreOverloadBadge: document.querySelector("#coreOverloadBadge"),
  coreOverloadBadgeValue: document.querySelector("#coreOverloadBadgeValue"),
  coreComboTrack: document.querySelector("#coreButton .core-combo-track"),
  coreRewardHint: document.querySelector("#coreRewardHint"),
  soundToggle: document.querySelector("#soundToggle"),
  hapticToggle: document.querySelector("#hapticToggle"),
  combo: document.querySelector("#comboValue"),
  pulse: document.querySelector("#pulseValue"),
  directiveList: document.querySelector("#directiveList"),
  directivePlan: document.querySelector("#directivePlan"),
  directivePlanTrack: document.querySelector("#directivePlanTrack"),
  directiveTask: document.querySelector("#directiveTask"),
  farDispatch: document.querySelector("#farDispatch"),
  goalLabel: document.querySelector("#goalLabel"),
  goalValue: document.querySelector("#goalValue"),
  goalHint: document.querySelector("#goalHint"),
  goalMeter: document.querySelector("#goalMeter"),
  offlineNotice: document.querySelector("#offlineNotice"),
  actionNotice: document.querySelector("#actionNotice"),
  upgradeList: document.querySelector("#upgradeList"),
  projectOverview: document.querySelector("#projectOverview"),
  projectOverviewDetail: document.querySelector("#projectOverviewDetail"),
  projectOverviewDispatch: document.querySelector("#projectOverviewDispatch"),
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
  projectCurrentVisual: document.querySelector("#projectCurrentVisual"),
  projectForecastMap: document.querySelector("#projectForecastMap"),
  projectRewardMap: document.querySelector("#projectRewardMap"),
  projectMapSummary: document.querySelector("#projectMapSummary"),
  projectMapFilter: document.querySelector("#projectMapFilter"),
  projectMapTrack: document.querySelector("#projectMapTrack"),
  projectChapterHero: document.querySelector("#projectChapterHero"),
  projectChapterMap: document.querySelector("#projectChapterMap"),
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
let corePulseTimer = 0;
let coreGainTimer = 0;
let coreImpactTimer = 0;
let coreComboHitTimer = 0;
let coreEnergyHitTimer = 0;
let coreOverloadReadoutTimer = 0;
let soundEnabled = loadSoundPreference();
let hapticEnabled = loadHapticPreference();
let audioContext = null;

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
elements.soundToggle.checked = soundEnabled;
elements.hapticToggle.checked = hapticEnabled;
render();

elements.coreButton.addEventListener("pointerdown", pressCoreButton);
elements.coreButton.addEventListener("pointerup", releaseCoreButton);
elements.coreButton.addEventListener("pointercancel", releaseCoreButton);
elements.coreButton.addEventListener("pointerleave", releaseCoreButton);
elements.coreButton.addEventListener("blur", releaseCoreButton);
elements.coreButton.addEventListener("keydown", (event) => {
  if (!isCorePressKey(event) || event.repeat) {
    return;
  }

  pressCoreButton(null);
});
elements.coreButton.addEventListener("keyup", (event) => {
  if (isCorePressKey(event)) {
    releaseCoreButton();
  }
});

elements.coreButton.addEventListener("click", (event) => {
  offlineSummary = null;
  const previousGoal = getCurrentGoal(state);
  state = clickCore(state);
  const comboStatus = getComboStatus(state);
  const overloaded = comboStatus.overloaded;
  applyActionNoticeWithGoalTransition(previousGoal, state, buildClickActionNotice(state));
  recordEvent("click", {
    energy: Math.floor(state.energy),
    combo: state.combo
  });
  playCoreSound({ overloaded });
  playCoreHaptic({ overloaded });
  animateCore({
    gainText: "+" + formatNumber(state.lastGain),
    overloaded,
    comboStep: comboStatus.step,
    pointerEvent: event
  });
  saveAndRender();
});

elements.soundToggle.addEventListener("change", () => {
  soundEnabled = elements.soundToggle.checked;
  persistSoundPreference();
  recordEvent("sound_toggle", {
    enabled: soundEnabled
  });
});

elements.hapticToggle.addEventListener("change", () => {
  hapticEnabled = elements.hapticToggle.checked;
  persistHapticPreference();
  recordEvent("haptic_toggle", {
    enabled: hapticEnabled
  });
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
  const now = Date.now();
  const current = normalizeState(state);
  const goal = getCurrentGoal(current);
  const combo = getComboStatus(current, now);
  const coreReward = getCoreRewardPreview(current, now);
  const production = getEffectiveProduction(current);
  const projectOverview = getProjectOverview(current, now);
  const projects = getProjectStatuses(current);
  const routeStance = getRouteStanceStatus(current);
  const directives = getDirectiveStatus(current);

  renderCoreFeedback(combo);
  renderCoreRewardHint(coreReward);
  elements.energy.textContent = formatNumber(current.energy);
  elements.perSecond.textContent = formatNumber(production.perSecond);
  elements.perClick.textContent = formatNumber(production.perClick);
  elements.overload.textContent = "+" + formatNumber(production.overloadBonus);
  elements.combo.textContent = "连击 " + combo.count + " · " + combo.progressText;
  elements.pulse.textContent = combo.overloaded ? current.lastPulse : combo.hintText;
  renderDirectives(directives);
  setCompactSupportText(
    elements.directivePlan,
    getDirectivePlanDisplayText(directives.plan),
    directives.plan.text
  );
  renderDirectivePlanTrack(directives.plan, directives.options);
  renderDirectiveTask(directives.task);
  renderFarDispatch(directives.dispatch ?? getFarRouteDispatch(current, now));
  elements.goalLabel.textContent = goal.label;
  elements.goalValue.textContent = goal.value;
  elements.goalHint.textContent = goal.progressText;
  elements.goalMeter.style.width = Math.round(goal.progress * 100) + "%";
  renderOfflineNotice();
  renderActionNotice();
  elements.projectOverview.textContent = projectOverview.summaryText;
  elements.projectOverviewDetail.textContent = projectOverview.detailText;
  elements.projectOverviewDispatch.textContent = projectOverview.dispatchText;
  elements.projectOverviewDispatch.hidden = !projectOverview.dispatchText;
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
  setCompactSupportText(
    elements.projectOverviewForecast,
    projectOverview.forecastText,
    projectOverview.forecastDetailText
  );
  renderProjectCurrentVisual(projectOverview.currentVisual ?? getProjectCurrentVisual(projects));
  renderProjectForecastMap(projectOverview.forecastVisuals ?? getProjectForecastVisuals(projects));
  renderProjectRewardMap(projectOverview.rewardVisuals ?? getProjectRewardVisuals(projects));
  renderProjectMap(getProjectVisualMap(projects, projectFilter));
  const projectChapters = getProjectChapterVisuals(projects);
  renderProjectChapterHero(projectChapters);
  renderProjectChapterMap(projectChapters);
  renderRouteStances(routeStance);
  renderProjectFilters(projects);
  const projectFilterSummary = getProjectFilterSummary(projects, projectFilter);
  setCompactSupportText(
    elements.projectFilterSummaryBrief,
    getProjectFilterBrief(projects, projectFilter),
    projectFilterSummary
  );
  elements.projectFilterSummary.textContent = projectFilterSummary;

  elements.upgradeList.replaceChildren(
    ...UPGRADE_DEFS.map((upgrade) => renderUpgrade(upgrade, current, goal))
  );
  renderProjectList(projects);
}

function renderCoreFeedback(combo) {
  const isCharging = combo.count > 0 && !combo.overloaded;
  const isOverloadReady = isCharging && combo.remaining === 1;
  const veinIntensity = combo.overloaded ? 1 : combo.progress;
  const surgeIntensity = combo.overloaded ? 1 : combo.progress;
  const surgeOpacity =
    combo.count > 0 || combo.overloaded
      ? Math.max(0.18, Math.round(surgeIntensity * 100) / 100)
      : 0.1;

  elements.coreButton.dataset.comboStep = String(combo.step);
  elements.coreButton.style.setProperty("--core-surge-opacity", String(surgeOpacity));
  elements.coreButton.style.setProperty(
    "--core-surge-scale",
    String(Math.round((0.88 + surgeIntensity * 0.12) * 100) / 100)
  );
  elements.coreButton.style.setProperty(
    "--core-surge-speed",
    Math.max(900, Math.round(3200 - surgeIntensity * 1900)) + "ms"
  );
  elements.coreButton.style.setProperty(
    "--core-vein-opacity",
    String(Math.max(0.12, Math.round(veinIntensity * 100) / 100))
  );
  elements.coreButton.style.setProperty(
    "--core-vein-dash-offset",
    String(Math.round((1 - veinIntensity) * 34))
  );
  elements.coreButton.classList.toggle("is-combo-charging", isCharging);
  elements.coreButton.classList.toggle("is-overload-ready", isOverloadReady);
  elements.coreButton.classList.toggle("is-overload-hit", combo.overloaded);
  elements.coreStageAura.style.setProperty(
    "--core-stage-angle",
    Math.round(combo.progress * 360) + "deg"
  );
  elements.coreStageAura.classList.toggle(
    "is-stage-warm",
    combo.step >= 3 && !combo.overloaded
  );
  elements.coreStageAura.classList.toggle(
    "is-stage-hot",
    combo.step >= 6 && !combo.overloaded
  );
  elements.coreStageAura.classList.toggle("is-overload-ready", isOverloadReady);
  elements.coreStageAura.classList.toggle("is-overload-hit", combo.overloaded);
  elements.coreChargeRing.style.setProperty(
    "--core-charge-angle",
    Math.round(combo.progress * 360) + "deg"
  );
  elements.coreChargeRing.classList.toggle("is-charging", isCharging);
  elements.coreChargeRing.classList.toggle("is-overload-ready", isOverloadReady);
  elements.coreChargeRing.classList.toggle("is-overload-hit", combo.overloaded);
  elements.coreOverloadBadgeValue.textContent = combo.overloaded
    ? "!"
    : String(combo.remaining);
  elements.coreOverloadBadge.classList.toggle("is-countdown-active", isCharging);
  elements.coreOverloadBadge.classList.toggle("is-overload-ready", isOverloadReady);
  elements.coreOverloadBadge.classList.toggle("is-overload-hit", combo.overloaded);
  elements.pulse.classList.toggle("is-overload-ready", isOverloadReady);
  elements.pulse.classList.toggle("is-overload-hit", combo.overloaded);
  renderCoreComboTrack(combo);
}

function renderCoreComboTrack(combo) {
  elements.coreComboTrack.style.setProperty(
    "--core-combo-progress",
    Math.round(combo.progress * 100) + "%"
  );
  elements.coreComboTrack.classList.toggle(
    "is-overload-ready",
    combo.remaining === 1 && !combo.overloaded
  );
  elements.coreComboTrack.classList.toggle("is-overload-hit", combo.overloaded);

  Array.from(elements.coreComboTrack.children).forEach((dot, index) => {
    const step = index + 1;
    dot.classList.toggle("is-filled", combo.step >= step);
    dot.classList.toggle("is-next", !combo.overloaded && combo.step + 1 === step);
    dot.classList.toggle("is-overload-dot", step === combo.interval);
  });
}

function renderCoreRewardHint(coreReward) {
  elements.coreRewardHint.textContent = coreReward.text;
  elements.coreRewardHint.classList.toggle(
    "is-overload-ready",
    coreReward.isOverloadReady
  );
  elements.coreRewardHint.classList.toggle("is-overload-hit", coreReward.isOverloadHit);
}

function renderDirectives(directives) {
  elements.directiveList.replaceChildren(
    ...directives.options.map((option) => renderDirective(option))
  );
}

function renderDirectivePlanTrack(plan, options) {
  const target = Math.max(1, plan.target ?? 3);
  const progress = Math.max(0, Math.min(target, plan.progress ?? 0));
  const nextNames = (plan.nextDirectiveIds ?? [])
    .map((directiveId) => options.find((option) => option.id === directiveId)?.name)
    .filter(Boolean);
  const nextText = nextNames.length
    ? nextNames.join(" / ")
    : plan.unlocked
      ? "等待指令"
      : "100K 解锁";
  const nextActionText = [plan.recommendationText ?? "下一步", nextText]
    .filter(Boolean)
    .join(" ");

  elements.directivePlanTrack.replaceChildren(
    ...Array.from({ length: target }, (_item, index) => {
      const step = index + 1;
      const item = document.createElement("span");
      const isComplete = plan.unlocked && progress >= step;
      const isNext = !isComplete && step === Math.min(progress + 1, target);
      item.className = [
        "directive-plan-step",
        isComplete ? "is-complete" : "",
        isNext ? "is-next" : "",
        !isComplete && !isNext ? "is-pending" : ""
      ]
        .filter(Boolean)
        .join(" ");

      const marker = document.createElement("strong");
      marker.textContent = step + "/" + target;

      const label = document.createElement("span");
      if (!plan.unlocked) {
        label.textContent = step === 1 ? "100K 解锁" : "待解锁";
      } else if (progress >= target) {
        label.textContent = step === target ? "轮换完成" : "已完成";
      } else if (step <= progress) {
        label.textContent = "已完成";
      } else if (step === progress + 1) {
        label.textContent = nextActionText;
      } else {
        label.textContent = "待推进";
      }

      item.append(marker, label);
      return item;
    })
  );
}

function renderDirectiveTask(task) {
  const progress = Math.max(0, task.progress ?? 0);
  const target = Math.max(1, task.target ?? 3);
  const progressText = progress + "/" + target;
  const meterValue = Math.min(100, Math.round((progress / target) * 100));

  const text = document.createElement("span");
  text.className = "directive-task-text";
  setCompactSupportText(text, getDirectiveTaskDisplayText(task), task.text);

  const meter = document.createElement("span");
  meter.className = "directive-task-meter";
  meter.setAttribute("role", "meter");
  meter.setAttribute("aria-label", "航线委托进度");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", String(target));
  meter.setAttribute("aria-valuenow", String(Math.min(progress, target)));
  meter.setAttribute("aria-valuetext", progressText);

  const fill = document.createElement("span");
  fill.style.width = meterValue + "%";
  meter.append(fill);

  elements.directiveTask.classList.toggle("is-completed", task.completed);
  elements.directiveTask.replaceChildren(text, meter);
}

function renderFarDispatchSceneImage() {
  const image = document.createElement("img");
  image.className = "far-dispatch-scene-image";
  image.src = "./src/assets/far-dispatch-visual.svg";
  image.alt = "远航调度三步闭环、协同航线和绕行航线组成的远航插画";
  image.loading = "lazy";
  return image;
}

function renderFarDispatch(dispatch) {
  const progress = Math.max(0, Math.min(1, Number(dispatch.progress) || 0));
  const meterValue = Math.round(progress * 100);
  const loopProgress = Math.max(0, dispatch.loopProgress ?? 0);
  const loopTarget = Math.max(1, dispatch.loopTarget ?? 3);
  const loopValue = Math.min(loopTarget, loopProgress);
  const loopMeterValue = Math.round((loopValue / loopTarget) * 100);
  const loopProgressText = loopValue + "/" + loopTarget;

  const text = document.createElement("span");
  text.className = "far-dispatch-text";
  setCompactSupportText(text, getFarDispatchDisplayText(dispatch), dispatch.text);

  const sceneImage = renderFarDispatchSceneImage();

  const branch = document.createElement("span");
  branch.className = "far-dispatch-branch is-" + getFarDispatchBranchKind(dispatch);
  branch.textContent = dispatch.branchText ?? "";
  branch.hidden = !dispatch.branchText;

  const branchRecommendation = document.createElement("span");
  branchRecommendation.className = "far-dispatch-branch-recommendation";
  branchRecommendation.textContent = dispatch.branchRecommendationText ?? "";
  branchRecommendation.hidden = !dispatch.branchRecommendationText;

  const branchRotation = document.createElement("span");
  branchRotation.className = "far-dispatch-branch-rotation";
  branchRotation.textContent = dispatch.branchRotationText ?? "";
  branchRotation.hidden = !dispatch.branchRotationText;

  const branchRoute = document.createElement("span");
  branchRoute.className = "far-dispatch-branch-route";
  branchRoute.textContent = dispatch.branchRouteText ?? "";
  branchRoute.hidden = !dispatch.branchRouteText;

  const branchPlan = document.createElement("span");
  branchPlan.className = "far-dispatch-branch-plan";
  branchPlan.textContent = dispatch.branchPlanText ?? "";
  branchPlan.hidden = !dispatch.branchPlanText;

  const branchPlanStep = document.createElement("span");
  branchPlanStep.className = "far-dispatch-branch-step";
  branchPlanStep.textContent = dispatch.branchPlanStepText ?? "";
  branchPlanStep.hidden = !dispatch.branchPlanStepText;

  const branchClosure = document.createElement("span");
  branchClosure.className = "far-dispatch-branch-closure";
  branchClosure.textContent = dispatch.branchClosureText ?? "";
  branchClosure.hidden = !dispatch.branchClosureText;

  const branchChoices = renderFarDispatchBranchChoices(dispatch);

  const loopText = document.createElement("span");
  loopText.className = "far-dispatch-loop-text";
  loopText.textContent = dispatch.loopStatusText;

  const meter = document.createElement("span");
  meter.className = "far-dispatch-meter";
  meter.setAttribute("role", "meter");
  meter.setAttribute("aria-label", "远航调度进度");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", "100");
  meter.setAttribute("aria-valuenow", String(meterValue));
  meter.setAttribute("aria-valuetext", meterValue + "%");

  const fill = document.createElement("span");
  fill.style.width = meterValue + "%";
  meter.append(fill);

  const loopMeter = document.createElement("span");
  loopMeter.className = "far-dispatch-loop-meter";
  loopMeter.setAttribute("role", "meter");
  loopMeter.setAttribute("aria-label", "远航闭环进度");
  loopMeter.setAttribute("aria-valuemin", "0");
  loopMeter.setAttribute("aria-valuemax", String(loopTarget));
  loopMeter.setAttribute("aria-valuenow", String(loopValue));
  loopMeter.setAttribute("aria-valuetext", loopProgressText);

  const loopFill = document.createElement("span");
  loopFill.style.width = loopMeterValue + "%";
  loopMeter.append(loopFill);

  const loopTrack = renderFarDispatchLoopTrack(dispatch);

  elements.farDispatch.classList.toggle("is-locked", !dispatch.unlocked);
  elements.farDispatch.classList.toggle("is-active", dispatch.active);
  elements.farDispatch.replaceChildren(
    text,
    sceneImage,
    branch,
    branchRecommendation,
    branchRotation,
    branchRoute,
    branchPlan,
    branchPlanStep,
    branchClosure,
    branchChoices,
    meter,
    loopText,
    loopMeter,
    loopTrack
  );
}

function renderFarDispatchBranchChoices(dispatch) {
  const track = document.createElement("div");
  track.className = "far-dispatch-branch-choices";

  const choices = Array.isArray(dispatch.branchChoices) ? dispatch.branchChoices : [];
  track.hidden = choices.length === 0;
  if (track.hidden) {
    return track;
  }

  track.setAttribute("aria-label", dispatch.branchChoiceText ?? "");
  track.append(
    renderFarDispatchBranchChoiceLegend(),
    renderFarDispatchBranchChoiceSummary(dispatch),
    ...choices.map((choice) => {
      const item = document.createElement("article");
      item.className =
        "far-dispatch-branch-choice is-" +
        getFarDispatchBranchChoiceKind(choice) +
        " is-" +
        getFarDispatchBranchChoiceStatus(choice) +
        " is-decision-" +
        getFarDispatchBranchChoiceDecisionKind(choice) +
        (choice.focused ? " is-focused" : "");
      item.title = choice.text ?? "";

      const header = document.createElement("span");
      header.className = "far-dispatch-branch-choice-head";

      const label = document.createElement("strong");
      label.textContent = choice.label + " · " + choice.statusText;

      const badge = document.createElement("span");
      badge.className =
        "far-dispatch-branch-choice-badge is-" +
        getFarDispatchBranchChoiceDecisionKind(choice);
      badge.textContent = choice.decisionBadgeText ?? "";
      badge.hidden = !choice.decisionBadgeText;

      const costBadge = document.createElement("span");
      costBadge.className =
        "far-dispatch-branch-choice-cost is-" +
        getFarDispatchBranchChoiceRouteCostKind(choice);
      costBadge.textContent = choice.routeCostText ?? "";
      costBadge.hidden = !choice.routeCostText;

      const intentBadge = document.createElement("span");
      intentBadge.className =
        "far-dispatch-branch-choice-intent is-" +
        getFarDispatchBranchChoiceRouteIntentKind(choice);
      intentBadge.textContent = choice.routeIntentText ?? "";
      intentBadge.hidden = !choice.routeIntentText;
      header.append(label, badge, costBadge, intentBadge);

      const routeVisual = renderFarDispatchBranchChoiceRoute(choice);
      const routeCommand = renderFarDispatchBranchChoiceRouteCommand(choice);

      const decision = document.createElement("small");
      decision.className =
        "far-dispatch-branch-choice-decision is-" +
        getFarDispatchBranchChoiceDecisionKind(choice);
      decision.textContent = choice.decisionText ?? "";
      decision.hidden = !choice.decisionText;

      const reason = document.createElement("small");
      reason.className = "far-dispatch-branch-choice-reason";
      reason.textContent = choice.reasonText ?? "";
      reason.hidden = !choice.reasonText;

      const objective = document.createElement("small");
      objective.className = "far-dispatch-branch-choice-objective";
      objective.textContent = choice.objectiveText ?? "";
      objective.hidden = !choice.objectiveText;

      const followup = document.createElement("small");
      followup.className = "far-dispatch-branch-choice-followup";
      followup.textContent = choice.followupText ?? "";
      followup.hidden = !choice.followupText;

      const next = document.createElement("small");
      next.textContent = choice.nextText ?? "";

      const payoff = document.createElement("small");
      payoff.className = "far-dispatch-branch-choice-payoff";
      payoff.textContent = choice.payoffText ?? "";
      payoff.hidden = !choice.payoffText;

      const caption = document.createElement("em");
      caption.textContent = choice.caption + " · " + choice.rewardText;

      const details = document.createElement("details");
      details.className =
        "far-dispatch-branch-choice-details is-return-" +
        getFarDispatchBranchChoiceRouteReturnKind(choice);

      const detailsSummary = document.createElement("summary");
      detailsSummary.textContent = choice.routeReturnText
        ? "路线明细 · " + choice.routeReturnText
        : "路线明细";

      const detailsGrid = document.createElement("span");
      detailsGrid.className = "far-dispatch-branch-choice-detail-grid";
      detailsGrid.append(objective, followup, next, payoff, caption);
      details.append(detailsSummary, detailsGrid);

      item.append(
        header,
        routeVisual,
        routeCommand,
        decision,
        reason,
        details
      );
      return item;
    })
  );

  return track;
}

function renderFarDispatchBranchChoiceSummary(dispatch) {
  const summary = document.createElement("div");
  summary.className = "far-dispatch-branch-choice-summary";
  summary.hidden = !dispatch.branchChoiceSummaryText;
  summary.setAttribute("aria-label", dispatch.branchChoiceSummaryText ?? "");

  const choices = Array.isArray(dispatch.branchChoices) ? dispatch.branchChoices : [];
  const orderedChoices = choices
    .slice()
    .sort(
      (a, b) => Number(Boolean(b.active)) - Number(Boolean(a.active))
    );
  summary.append(...orderedChoices.map(renderFarDispatchBranchChoiceSummaryItem));
  return summary;
}

function renderFarDispatchBranchChoiceSummaryItem(choice) {
  const item = document.createElement("span");
  item.className =
    "far-dispatch-branch-choice-summary-item is-" +
    getFarDispatchBranchChoiceKind(choice) +
    " is-decision-" +
    getFarDispatchBranchChoiceDecisionKind(choice) +
    (choice.active ? " is-active-route" : "") +
    (choice.focused ? " is-focused" : "");
  item.title = [
    choice.label,
    choice.decisionBadgeText,
    choice.routeResourceText,
    choice.routePhaseText,
    choice.routeActionText,
    choice.routeRewardSummaryText,
    choice.routeBranchStepText,
    choice.routePayoffSummaryText,
    choice.routeIntentText,
    choice.routeCostText,
    choice.routeReturnText
  ]
    .filter(Boolean)
    .join(" · ");

  const glyph = document.createElement("span");
  glyph.className =
    "far-dispatch-branch-choice-summary-glyph is-" +
    getFarDispatchBranchChoiceRouteResourceKind(choice);
  glyph.setAttribute("aria-hidden", "true");

  const label = document.createElement("strong");
  label.textContent = choice.label + " · " + (choice.decisionBadgeText ?? "");

  const phase = document.createElement("span");
  phase.className =
    "far-dispatch-branch-choice-summary-phase is-" +
    getFarDispatchBranchChoiceRoutePhaseKind(choice);
  phase.textContent = choice.routePhaseText ?? "";
  phase.hidden = !choice.routePhaseText;

  const action = document.createElement("span");
  action.className =
    "far-dispatch-branch-choice-summary-action is-" +
    getFarDispatchBranchChoiceRouteActionKind(choice);
  action.textContent = choice.routeActionText ?? "";
  action.hidden = !choice.routeActionText;

  const reward = document.createElement("span");
  reward.className = "far-dispatch-branch-choice-summary-reward";
  reward.textContent = choice.routeRewardSummaryText ?? "";
  reward.hidden = !choice.routeRewardSummaryText;

  const branchStep = document.createElement("span");
  branchStep.className = "far-dispatch-branch-choice-summary-step";
  branchStep.textContent = choice.routeBranchStepText ?? "";
  branchStep.hidden = !choice.routeBranchStepText;

  const payoff = document.createElement("span");
  payoff.className = "far-dispatch-branch-choice-summary-payoff";
  payoff.textContent = choice.routePayoffSummaryText ?? "";
  payoff.hidden = !choice.routePayoffSummaryText;

  const intent = document.createElement("span");
  intent.className =
    "far-dispatch-branch-choice-summary-intent is-" +
    getFarDispatchBranchChoiceRouteIntentKind(choice);
  intent.textContent = choice.routeIntentText ?? "";

  const cost = document.createElement("span");
  cost.className =
    "far-dispatch-branch-choice-summary-cost is-" +
    getFarDispatchBranchChoiceRouteCostKind(choice);
  cost.textContent = choice.routeCostText ?? "";

  const result = document.createElement("span");
  result.className =
    "far-dispatch-branch-choice-summary-result is-" +
    getFarDispatchBranchChoiceRouteReturnKind(choice) +
    (choice.routeLoopStreakText ? " has-loop-streak" : "");
  result.textContent = choice.routeReturnText ?? "";

  const progress = renderFarDispatchBranchChoiceSummaryProgress(choice);

  item.append(
    glyph,
    label,
    phase,
    action,
    reward,
    branchStep,
    payoff,
    intent,
    cost,
    result,
    progress
  );
  return item;
}

function renderFarDispatchBranchChoiceSummaryProgress(choice) {
  const progress = document.createElement("span");
  const nodes = [
    ["start", choice.routeCommandLabels?.start],
    ["branch", choice.routeCommandLabels?.branch],
    ["return", choice.routeCommandLabels?.return]
  ];
  const progressStatusText = nodes
    .map(([nodeId, label]) =>
      getFarDispatchBranchChoiceRouteCommandStepTitle(choice, nodeId, label)
    )
    .filter(Boolean)
    .join(" -> ");
  progress.className =
    "far-dispatch-branch-choice-summary-progress is-" +
    getFarDispatchBranchChoiceKind(choice);
  progress.style.setProperty(
    "--summary-route-progress",
    getFarDispatchBranchChoiceRouteProgress(choice) + "%"
  );
  progress.setAttribute("role", "img");
  progress.setAttribute(
    "aria-label",
    progressStatusText ? "路线对照进度：" + progressStatusText : ""
  );
  progress.title = progressStatusText;

  nodes.forEach(([nodeId, label]) => {
    const stepTitle = getFarDispatchBranchChoiceRouteCommandStepTitle(
      choice,
      nodeId,
      label
    );
    const node = document.createElement("span");
    node.className =
      "far-dispatch-branch-choice-summary-progress-node is-" +
      String(choice.routeNodeStates?.[nodeId] ?? "waiting");
    node.dataset.stepLabel = getFarDispatchBranchChoiceRouteStepLabel(
      choice,
      nodeId
    );
    node.setAttribute("aria-hidden", "true");
    node.title = stepTitle;
    progress.append(node);
  });

  return progress;
}

function renderFarDispatchBranchChoiceLegend() {
  const legend = document.createElement("div");
  legend.className = "far-dispatch-branch-choice-legend";
  legend.setAttribute("aria-hidden", "true");

  [
    ["1", "目标"],
    ["2", "分支"],
    ["3", "回目标"]
  ].forEach(([step, label]) => {
    const item = document.createElement("span");
    item.className = "far-dispatch-branch-choice-legend-item";
    item.dataset.stepLabel = step;
    item.textContent = label;
    legend.append(item);
  });

  return legend;
}

function renderFarDispatchBranchChoiceRoute(choice) {
  const route = document.createElement("span");
  route.className =
    "far-dispatch-branch-choice-route is-" +
    getFarDispatchBranchChoiceKind(choice) +
    " is-" +
    getFarDispatchBranchChoiceStatus(choice) +
    " is-decision-" +
    getFarDispatchBranchChoiceDecisionKind(choice) +
    " is-resource-" +
    getFarDispatchBranchChoiceRouteResourceKind(choice) +
    " is-route-marker-" +
    getFarDispatchBranchChoiceRouteMarkerKind(choice) +
    " is-route-phase-" +
    getFarDispatchBranchChoiceRoutePhaseKind(choice) +
    " is-route-flow-" +
    getFarDispatchBranchChoiceRouteFlowKind(choice) +
    (choice.focused ? " is-focused" : "");
  route.style.setProperty(
    "--branch-route-progress",
    getFarDispatchBranchChoiceRouteProgress(choice) + "%"
  );
  route.setAttribute("aria-hidden", "true");

  const line = document.createElement("span");
  line.className = "far-dispatch-branch-choice-route-line";

  const start = document.createElement("span");
  start.className =
    "far-dispatch-branch-choice-route-node is-start is-" +
    getFarDispatchBranchChoiceRouteNodeState(choice, "start");
  start.dataset.stepLabel = getFarDispatchBranchChoiceRouteStepLabel(choice, "start");

  const branch = document.createElement("span");
  branch.className =
    "far-dispatch-branch-choice-route-node is-branch is-" +
    getFarDispatchBranchChoiceRouteNodeState(choice, "branch");
  branch.dataset.stepLabel = getFarDispatchBranchChoiceRouteStepLabel(choice, "branch");

  const returnNode = document.createElement("span");
  returnNode.className =
    "far-dispatch-branch-choice-route-node is-return is-" +
    getFarDispatchBranchChoiceRouteNodeState(choice, "return");
  returnNode.dataset.stepLabel = getFarDispatchBranchChoiceRouteStepLabel(choice, "return");

  const routeResource = document.createElement("span");
  routeResource.className =
    "far-dispatch-branch-choice-route-resource is-" +
    getFarDispatchBranchChoiceRouteResourceKind(choice);

  const routeMarker = document.createElement("span");
  routeMarker.className =
    "far-dispatch-branch-choice-route-marker is-" +
    getFarDispatchBranchChoiceRouteMarkerKind(choice);
  routeMarker.textContent = choice.routeMarkerText ?? "";
  routeMarker.hidden = !choice.routeMarkerText;

  const routePhase = document.createElement("span");
  routePhase.className =
    "far-dispatch-branch-choice-route-phase is-" +
    getFarDispatchBranchChoiceRoutePhaseKind(choice);
  routePhase.textContent = choice.routePhaseText ?? "";
  routePhase.hidden = !choice.routePhaseText;

  const routeFlow = document.createElement("span");
  routeFlow.className =
    "far-dispatch-branch-choice-route-flow is-" +
    getFarDispatchBranchChoiceRouteFlowKind(choice);
  routeFlow.textContent = choice.routeFlowText ?? "";
  routeFlow.hidden = !choice.routeFlowText;

  const startReward = renderFarDispatchBranchChoiceRouteReward(choice, "start");
  const branchReward = renderFarDispatchBranchChoiceRouteReward(choice, "branch");
  const returnReward = renderFarDispatchBranchChoiceRouteReward(choice, "return");

  route.append(
    line,
    start,
    branch,
    returnNode,
    routeResource,
    routeMarker,
    routePhase,
    routeFlow,
    startReward,
    branchReward,
    returnReward
  );
  return route;
}

function renderFarDispatchBranchChoiceRouteCommand(choice) {
  const command = document.createElement("span");
  const commandSteps = [
    ["start", choice.routeCommandLabels?.start],
    ["branch", choice.routeCommandLabels?.branch],
    ["return", choice.routeCommandLabels?.return]
  ];
  const commandStatusText = commandSteps
    .map(([step, label]) =>
      getFarDispatchBranchChoiceRouteCommandStepTitle(choice, step, label)
    )
    .filter(Boolean)
    .join(" -> ");

  command.className = "far-dispatch-branch-choice-route-command";
  command.hidden = !choice.routeCommandText;
  command.setAttribute(
    "aria-label",
    commandStatusText ? "路线指令状态：" + commandStatusText : choice.routeCommandText ?? ""
  );
  command.title = commandStatusText || choice.routeCommandText || "";

  commandSteps.forEach(([step, label], index) => {
    const item = document.createElement("span");
    const stepTitle = getFarDispatchBranchChoiceRouteCommandStepTitle(
      choice,
      step,
      label
    );
    item.className =
      "far-dispatch-branch-choice-route-command-step is-" +
      step +
      " is-" +
      getFarDispatchBranchChoiceRouteNodeState(choice, step);
    item.dataset.stepLabel = getFarDispatchBranchChoiceRouteStepLabel(choice, step);
    item.setAttribute("aria-label", stepTitle);
    item.title = stepTitle;
    item.textContent = label ?? "";
    command.append(item);

    if (index < 2) {
      const arrow = document.createElement("span");
      arrow.className = "far-dispatch-branch-choice-route-command-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "->";
      command.append(arrow);
    }
  });

  return command;
}

function renderFarDispatchBranchChoiceRouteReward(choice, nodeId) {
  const reward = document.createElement("span");
  reward.className = "far-dispatch-branch-choice-route-reward is-" + nodeId;
  reward.textContent = getFarDispatchBranchChoiceRouteRewardLabel(choice, nodeId);
  reward.hidden = !reward.textContent;
  return reward;
}

function renderFarDispatchLoopTrack(dispatch) {
  const track = document.createElement("span");
  track.className = "far-dispatch-loop-track";

  const steps = Array.isArray(dispatch.loopSteps) ? dispatch.loopSteps : [];
  track.hidden = steps.length === 0;
  if (track.hidden) {
    return track;
  }

  track.setAttribute("aria-label", dispatch.loopStepText);
  const visualTarget = Math.max(1, Number(dispatch.loopTarget) || 3);
  const visualProgressValue = Math.min(
    Math.max(0, Number(dispatch.loopProgress) || 0),
    visualTarget
  );
  const visualProgress = Math.round((visualProgressValue / visualTarget) * 100);

  const visual = document.createElement("span");
  visual.className = "far-dispatch-loop-visual";
  visual.style.setProperty("--far-loop-visual-progress", visualProgress + "%");
  visual.setAttribute("aria-hidden", "true");
  [1, 2].forEach((segment) => {
    const arrow = document.createElement("span");
    arrow.className =
      "far-dispatch-loop-visual-arrow is-segment-" +
      segment +
      " is-" +
      getFarDispatchLoopVisualArrowState(visualProgressValue, segment);
    visual.append(arrow);
  });
  steps.forEach((step, index) => {
    const rewardKind = getFarDispatchLoopVisualRewardKind(step, index);
    const point = document.createElement("span");
    point.className =
      "far-dispatch-loop-visual-point is-" +
      step.state +
      " is-" +
      rewardKind;

    const node = document.createElement("span");
    node.className = "far-dispatch-loop-visual-node is-" + step.state;
    node.dataset.stepLabel = String(index + 1);

    const reward = document.createElement("span");
    reward.className =
      "far-dispatch-loop-visual-reward is-" +
      rewardKind +
      " is-" +
      step.state;
    reward.dataset.rewardLabel = getFarDispatchLoopVisualRewardLabel(step, index);
    reward.hidden = !step.rewardText;

    point.append(node, reward);
    visual.append(point);
  });

  const stepLinks = steps.map((step, index) => {
    const rewardKind = getFarDispatchLoopVisualRewardKind(step, index);
    const link = document.createElement("span");
    link.className =
      "far-dispatch-loop-link is-" + step.state + " is-" + rewardKind;
    link.setAttribute("aria-hidden", "true");
    return link;
  });

  const stepItems = steps.map((step, index) => {
    const rewardKind = getFarDispatchLoopVisualRewardKind(step, index);
    const stepItem = document.createElement("span");
    stepItem.className =
      "far-dispatch-loop-step is-" + step.state + " is-" + rewardKind;
    stepItem.dataset.stepLabel = String(index + 1);

    const label = document.createElement("strong");
    label.textContent = step.label;

    const text = document.createElement("span");
    text.textContent = step.stateText + " · " + step.text;

    const reward = document.createElement("em");
    const rewardLabel = getFarDispatchLoopVisualRewardLabel(step, index);
    reward.className =
      "far-dispatch-step-reward is-" + rewardKind + " is-" + step.state;
    reward.dataset.rewardLabel = rewardLabel;
    reward.textContent = step.rewardText ?? "";
    reward.hidden = !step.rewardText;
    if (reward.textContent) {
      reward.title = rewardLabel + " · " + reward.textContent;
    }

    stepItem.append(label, text, reward);
    return stepItem;
  });

  track.append(visual, ...stepLinks, ...stepItems);

  return track;
}

function getFarDispatchLoopVisualArrowState(progress, segment) {
  if (progress > segment) {
    return "completed";
  }

  if (progress === segment) {
    return "current";
  }

  return "pending";
}

function getFarDispatchLoopVisualRewardKind(step, index) {
  if (index === 0) {
    return "target";
  }

  if (index === 2) {
    return "return";
  }

  return step?.label === "续航" ? "relay" : "branch";
}

function getFarDispatchLoopVisualRewardLabel(step, index) {
  const kind = getFarDispatchLoopVisualRewardKind(step, index);

  if (kind === "target") {
    return "校准";
  }

  if (kind === "return") {
    return "闭环";
  }

  if (kind === "relay") {
    return "续航";
  }

  return "分支";
}

function setCompactSupportText(element, displayText, fullText) {
  element.textContent = displayText;
  if (fullText && fullText !== displayText) {
    element.title = fullText;
    element.setAttribute("aria-label", fullText);
  } else {
    element.removeAttribute("title");
    element.removeAttribute("aria-label");
  }
}

function getDirectivePlanDisplayText(plan) {
  return plan.summaryText || plan.text;
}

function getDirectiveTaskDisplayText(task) {
  const progress = Math.max(0, task.progress ?? 0);
  const target = Math.max(1, task.target ?? 3);

  if (!task.unlocked) {
    return "航线委托：100K 后解锁 " + target + " 步任务";
  }

  if (task.completed) {
    return "航线委托 " + target + "/" + target + " · 已完成";
  }

  return "航线委托 " + progress + "/" + target + " · " + task.rewardText;
}

function getFarDispatchDisplayText(dispatch) {
  if (!dispatch.unlocked) {
    return "远航调度：20M 后解锁";
  }

  if (!dispatch.active) {
    return "远航调度：全部航段已完成";
  }

  return [
    "远航调度：" + dispatch.segmentText,
    dispatch.projectName,
    "目标 " + dispatch.targetDirectiveName,
    dispatch.loopStreakText
  ]
    .filter(Boolean)
    .join(" · ");
}

function getFarDispatchBranchKind(dispatch) {
  const kind = String(dispatch.branchKind ?? "none");
  return kind.replace(/[^a-z-]/g, "") || "none";
}

function getFarDispatchBranchChoiceKind(choice) {
  const kind = String(choice.kind ?? "none");
  return kind.replace(/[^a-z-]/g, "") || "none";
}

function getFarDispatchBranchChoiceStatus(choice) {
  const status = String(choice.status ?? "available");
  return status.replace(/[^a-z-]/g, "") || "available";
}

function getFarDispatchBranchChoiceDecisionKind(choice) {
  const decisionKind = String(choice.decisionKind ?? "fallback");
  return decisionKind.replace(/[^a-z-]/g, "") || "fallback";
}

function getFarDispatchBranchChoiceRouteResourceKind(choice) {
  const resourceKind = String(choice.routeResourceKind ?? "none");
  return resourceKind.replace(/[^a-z-]/g, "") || "none";
}

function getFarDispatchBranchChoiceRouteMarkerKind(choice) {
  const markerKind = String(choice.routeMarkerKind ?? "available");
  return markerKind.replace(/[^a-z-]/g, "") || "available";
}

function getFarDispatchBranchChoiceRoutePhaseKind(choice) {
  const phaseKind = String(choice.routePhaseKind ?? "inactive");
  return phaseKind.replace(/[^a-z-]/g, "") || "inactive";
}

function getFarDispatchBranchChoiceRouteActionKind(choice) {
  const actionKind = String(choice.routeActionKind ?? "idle");
  return actionKind.replace(/[^a-z-]/g, "") || "idle";
}

function getFarDispatchBranchChoiceRouteFlowKind(choice) {
  const flowKind = String(choice.routeFlowKind ?? "none");
  return flowKind.replace(/[^a-z-]/g, "") || "none";
}

function getFarDispatchBranchChoiceRouteCostKind(choice) {
  const costKind = String(choice.routeCostKind ?? "none");
  return costKind.replace(/[^a-z-]/g, "") || "none";
}

function getFarDispatchBranchChoiceRouteIntentKind(choice) {
  const intentKind = String(choice.routeIntentKind ?? "none");
  return intentKind.replace(/[^a-z-]/g, "") || "none";
}

function getFarDispatchBranchChoiceRouteReturnKind(choice) {
  const returnKind = String(choice.routeReturnKind ?? "none");
  return returnKind.replace(/[^a-z-]/g, "") || "none";
}

function getFarDispatchBranchChoiceRouteNodeState(choice, nodeId) {
  const routeNodeStates = choice.routeNodeStates ?? {};
  const state = String(routeNodeStates[nodeId] ?? "waiting");
  return state.replace(/[^a-z-]/g, "") || "waiting";
}

function getFarDispatchBranchChoiceRouteNodeStateText(choice, nodeId) {
  const state = getFarDispatchBranchChoiceRouteNodeState(choice, nodeId);
  if (state === "done") {
    return "已完成";
  }

  if (state === "next") {
    return "下一步";
  }

  return "待推进";
}

function getFarDispatchBranchChoiceRouteCommandStepName(nodeId) {
  if (nodeId === "start") {
    return "目标";
  }

  if (nodeId === "branch") {
    return "分支";
  }

  if (nodeId === "return") {
    return "回目标";
  }

  return "路线";
}

function getFarDispatchBranchChoiceRouteCommandStepTitle(choice, nodeId, label) {
  const stepLabel = getFarDispatchBranchChoiceRouteStepLabel(choice, nodeId);
  const stepName = getFarDispatchBranchChoiceRouteCommandStepName(nodeId);
  return [
    [stepLabel, stepName].filter(Boolean).join(" "),
    String(label ?? ""),
    getFarDispatchBranchChoiceRouteNodeStateText(choice, nodeId)
  ]
    .filter(Boolean)
    .join(" · ");
}

function getFarDispatchBranchChoiceRouteStepLabel(choice, nodeId) {
  const routeStepLabels = choice.routeStepLabels ?? {};
  const label = String(routeStepLabels[nodeId] ?? "");
  return label.replace(/[^0-9/]/g, "").slice(0, 3);
}

function getFarDispatchBranchChoiceRouteRewardLabel(choice, nodeId) {
  const routeRewardLabels = choice.routeRewardLabels ?? {};
  return String(routeRewardLabels[nodeId] ?? "")
    .replace(/[^\u4e00-\u9fa5A-Za-z0-9/+%-]/g, "")
    .slice(0, 4);
}

function getFarDispatchBranchChoiceRouteProgress(choice) {
  const progress = Number(choice.routeProgressPercent ?? 0);
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(progress)));
}

function renderDirective(option) {
  const button = document.createElement("button");
  button.className = [
    "directive-button",
    option.ready ? "is-ready" : "",
    option.cooling ? "is-cooling" : "",
    option.recommended ? "is-recommended" : "",
    option.dispatchRouteStepText ? "is-dispatch-route-step" : "",
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
        masteryBonus: result.masteryBonus,
        masteryBonusRate: result.masteryBonusRate,
        masteryStacks: result.masteryStacks,
        planReward: result.planReward,
        planBonusRate: result.planBonusRate,
        taskReward: result.taskReward,
        taskRewardRate: result.taskRewardRate,
        dispatchReward: result.dispatchReward,
        dispatchRewardRate: result.dispatchRewardRate,
        dispatchRelayReward: result.dispatchRelayReward,
        dispatchRelayRewardRate: result.dispatchRelayRewardRate,
        dispatchRelayRewardText: result.dispatchRelayRewardText,
        dispatchSyncReward: result.dispatchSyncReward,
        dispatchSyncRewardRate: result.dispatchSyncRewardRate,
        dispatchSyncRewardText: result.dispatchSyncRewardText,
        dispatchSyncSupply: result.dispatchSyncSupply,
        dispatchSyncSupplyRate: result.dispatchSyncSupplyRate,
        dispatchSyncSupplyText: result.dispatchSyncSupplyText,
        dispatchDetourReward: result.dispatchDetourReward,
        dispatchDetourRewardRate: result.dispatchDetourRewardRate,
        dispatchDetourRewardText: result.dispatchDetourRewardText,
        dispatchBranchShiftReward: result.dispatchBranchShiftReward,
        dispatchBranchShiftRewardRate: result.dispatchBranchShiftRewardRate,
        dispatchBranchShiftRewardText: result.dispatchBranchShiftRewardText,
        dispatchBranchStabilityReward: result.dispatchBranchStabilityReward,
        dispatchBranchStabilityRewardRate: result.dispatchBranchStabilityRewardRate,
        dispatchBranchStabilityRewardText: result.dispatchBranchStabilityRewardText,
        dispatchBranchFocusReward: result.dispatchBranchFocusReward,
        dispatchBranchFocusRewardRate: result.dispatchBranchFocusRewardRate,
        dispatchBranchFocusRewardText: result.dispatchBranchFocusRewardText,
        dispatchBranchRotationReward: result.dispatchBranchRotationReward,
        dispatchBranchRotationRewardRate: result.dispatchBranchRotationRewardRate,
        dispatchBranchRotationRewardText: result.dispatchBranchRotationRewardText,
        dispatchFocusLoopReward: result.dispatchFocusLoopReward,
        dispatchFocusLoopRewardRate: result.dispatchFocusLoopRewardRate,
        dispatchFocusLoopRewardText: result.dispatchFocusLoopRewardText,
        dispatchLoopReward: result.dispatchLoopReward,
        dispatchLoopRewardRate: result.dispatchLoopRewardRate,
        dispatchLoopRewardText: result.dispatchLoopRewardText,
        dispatchLoopStreakReward: result.dispatchLoopStreakReward,
        dispatchLoopStreakRewardRate: result.dispatchLoopStreakRewardRate,
        dispatchLoopStreakStacks: result.dispatchLoopStreakStacks,
        dispatchLoopStreakRewardText: result.dispatchLoopStreakRewardText,
        dispatchBreakthroughReward: result.dispatchBreakthroughReward,
        dispatchBreakthroughRewardRate: result.dispatchBreakthroughRewardRate,
        dispatchBreakthroughRewardText: result.dispatchBreakthroughRewardText,
        dispatchDetourBreakthroughReward: result.dispatchDetourBreakthroughReward,
        dispatchDetourBreakthroughRewardRate:
          result.dispatchDetourBreakthroughRewardRate,
        dispatchDetourBreakthroughRewardText:
          result.dispatchDetourBreakthroughRewardText,
        dispatchDetourInfusionCost: result.dispatchDetourInfusionCost,
        dispatchDetourInfusionProgress: result.dispatchDetourInfusionProgress,
        dispatchDetourInfusionCostRate: result.dispatchDetourInfusionCostRate,
        dispatchDetourInfusionProgressMultiplier:
          result.dispatchDetourInfusionProgressMultiplier,
        dispatchDetourInfusionText: result.dispatchDetourInfusionText,
        dispatchPrepReward: result.dispatchPrepReward,
        dispatchPrepRewardRate: result.dispatchPrepRewardRate,
        dispatchPrepRewardText: result.dispatchPrepRewardText,
        dispatchDetourPrepReward: result.dispatchDetourPrepReward,
        dispatchDetourPrepRewardRate: result.dispatchDetourPrepRewardRate,
        dispatchDetourPrepRewardText: result.dispatchDetourPrepRewardText,
        dispatchReturnReward: result.dispatchReturnReward,
        dispatchReturnRewardRate: result.dispatchReturnRewardRate,
        dispatchReturnRewardText: result.dispatchReturnRewardText,
        dispatchRefreshDirectiveId: result.dispatchRefreshDirectiveId,
        dispatchRefreshDirectiveName: result.dispatchRefreshDirectiveName,
        dispatchRefreshText: result.dispatchRefreshText,
        dispatchCooldownMultiplier: result.dispatchCooldownMultiplier,
        dispatchCooldownText: result.dispatchCooldownText,
        dispatchChainWindowSeconds: result.dispatchChainWindowSeconds,
        dispatchChainWindowText: result.dispatchChainWindowText,
        dispatchRouteStepText: result.dispatchRouteStepText,
        dispatchRouteResultText: result.dispatchRouteResultText,
        masteryRewardGained: result.masteryRewardGained,
        masteryRewardStacks: result.masteryRewardStacks,
        rotationReward: result.rotationReward,
        masteryCapstoneReward: result.masteryCapstoneReward,
        masteryCapstoneRate: result.masteryCapstoneRate,
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

  const titleGroup = document.createElement("span");
  titleGroup.className = "directive-title-group";
  titleGroup.append(renderDirectiveVisual(option), name);

  const badges = document.createElement("span");
  badges.className = "directive-badges";

  const dispatchRouteStep = document.createElement("span");
  dispatchRouteStep.className = "directive-dispatch-route-step";
  dispatchRouteStep.textContent = option.dispatchRouteStepText;
  dispatchRouteStep.hidden = !option.dispatchRouteStepText;

  const recommendation = document.createElement("span");
  recommendation.className = "directive-recommendation";
  recommendation.textContent = option.recommendationText;
  recommendation.hidden = !option.recommended;

  const planBonus = document.createElement("span");
  planBonus.className = "directive-plan-bonus";
  planBonus.textContent = option.planRewardText;
  planBonus.hidden = !option.planRewardText;

  const taskBonus = document.createElement("span");
  taskBonus.className = "directive-task-bonus";
  taskBonus.textContent = option.taskRewardText;
  taskBonus.hidden = !option.taskRewardText;

  const dispatchBonus = document.createElement("span");
  dispatchBonus.className = "directive-dispatch-bonus";
  dispatchBonus.textContent = option.dispatchRewardText;
  dispatchBonus.hidden = !option.dispatchRewardText;

  const dispatchRelay = document.createElement("span");
  dispatchRelay.className = "directive-dispatch-relay";
  dispatchRelay.textContent = option.dispatchRelayRewardText;
  dispatchRelay.hidden = !option.dispatchRelayRewardText;

  const dispatchSync = document.createElement("span");
  dispatchSync.className = "directive-dispatch-sync";
  dispatchSync.textContent = option.dispatchSyncRewardText;
  dispatchSync.hidden = !option.dispatchSyncRewardText;

  const dispatchSyncSupply = document.createElement("span");
  dispatchSyncSupply.className = "directive-dispatch-sync-supply";
  dispatchSyncSupply.textContent = option.dispatchSyncSupplyText;
  dispatchSyncSupply.hidden = !option.dispatchSyncSupplyText;

  const dispatchDetour = document.createElement("span");
  dispatchDetour.className = "directive-dispatch-detour";
  dispatchDetour.textContent = option.dispatchDetourRewardText;
  dispatchDetour.hidden = !option.dispatchDetourRewardText;

  const dispatchBranchShift = document.createElement("span");
  dispatchBranchShift.className = "directive-dispatch-branch-shift";
  dispatchBranchShift.textContent = option.dispatchBranchShiftRewardText;
  dispatchBranchShift.hidden = !option.dispatchBranchShiftRewardText;

  const dispatchBranchStability = document.createElement("span");
  dispatchBranchStability.className = "directive-dispatch-branch-stability";
  dispatchBranchStability.textContent = option.dispatchBranchStabilityRewardText;
  dispatchBranchStability.hidden = !option.dispatchBranchStabilityRewardText;

  const dispatchBranchFocus = document.createElement("span");
  dispatchBranchFocus.className = "directive-dispatch-branch-focus";
  dispatchBranchFocus.textContent = option.dispatchBranchFocusRewardText;
  dispatchBranchFocus.hidden = !option.dispatchBranchFocusRewardText;

  const dispatchBranchRotation = document.createElement("span");
  dispatchBranchRotation.className = "directive-dispatch-branch-rotation";
  dispatchBranchRotation.textContent = option.dispatchBranchRotationRewardText;
  dispatchBranchRotation.hidden = !option.dispatchBranchRotationRewardText;

  const dispatchFocusLoop = document.createElement("span");
  dispatchFocusLoop.className = "directive-dispatch-focus-loop";
  dispatchFocusLoop.textContent = option.dispatchFocusLoopRewardText;
  dispatchFocusLoop.hidden = !option.dispatchFocusLoopRewardText;

  const dispatchLoop = document.createElement("span");
  dispatchLoop.className = "directive-dispatch-loop";
  dispatchLoop.textContent = option.dispatchLoopRewardText;
  dispatchLoop.hidden = !option.dispatchLoopRewardText;

  const dispatchLoopStreak = document.createElement("span");
  dispatchLoopStreak.className = "directive-dispatch-loop-streak";
  dispatchLoopStreak.textContent = option.dispatchLoopStreakRewardText;
  dispatchLoopStreak.hidden = !option.dispatchLoopStreakRewardText;

  const dispatchBreakthrough = document.createElement("span");
  dispatchBreakthrough.className = "directive-dispatch-breakthrough";
  dispatchBreakthrough.textContent = option.dispatchBreakthroughRewardText;
  dispatchBreakthrough.hidden = !option.dispatchBreakthroughRewardText;

  const dispatchDetourBreakthrough = document.createElement("span");
  dispatchDetourBreakthrough.className = "directive-dispatch-detour-breakthrough";
  dispatchDetourBreakthrough.textContent = option.dispatchDetourBreakthroughRewardText;
  dispatchDetourBreakthrough.hidden = !option.dispatchDetourBreakthroughRewardText;

  const dispatchDetourInfusion = document.createElement("span");
  dispatchDetourInfusion.className = "directive-dispatch-detour-infusion";
  dispatchDetourInfusion.textContent = option.dispatchDetourInfusionText;
  dispatchDetourInfusion.hidden = !option.dispatchDetourInfusionText;

  const dispatchPrep = document.createElement("span");
  dispatchPrep.className = "directive-dispatch-prep";
  dispatchPrep.textContent = option.dispatchPrepRewardText;
  dispatchPrep.hidden = !option.dispatchPrepRewardText;

  const dispatchDetourPrep = document.createElement("span");
  dispatchDetourPrep.className = "directive-dispatch-detour-prep";
  dispatchDetourPrep.textContent = option.dispatchDetourPrepRewardText;
  dispatchDetourPrep.hidden = !option.dispatchDetourPrepRewardText;

  const dispatchReturn = document.createElement("span");
  dispatchReturn.className = "directive-dispatch-return";
  dispatchReturn.textContent = option.dispatchReturnRewardText;
  dispatchReturn.hidden = !option.dispatchReturnRewardText;

  const dispatchRefresh = document.createElement("span");
  dispatchRefresh.className = "directive-dispatch-refresh";
  dispatchRefresh.textContent = option.dispatchRefreshText;
  dispatchRefresh.hidden = !option.dispatchRefreshText;

  const dispatchCooldown = document.createElement("span");
  dispatchCooldown.className = "directive-dispatch-cooldown";
  dispatchCooldown.textContent = option.dispatchCooldownText;
  dispatchCooldown.hidden = !option.dispatchCooldownText;

  const dispatchWindow = document.createElement("span");
  dispatchWindow.className = "directive-dispatch-window";
  dispatchWindow.textContent = option.dispatchChainWindowText;
  dispatchWindow.hidden = !option.dispatchChainWindowText;

  const finisherRecommendation = document.createElement("span");
  finisherRecommendation.className = "directive-finisher-recommendation";
  finisherRecommendation.textContent = option.finisherRecommendationText;
  finisherRecommendation.hidden = !option.finisherRecommended;

  const masteryBonus = document.createElement("span");
  masteryBonus.className = "directive-mastery-bonus";
  masteryBonus.textContent = option.masteryBonusText;
  masteryBonus.hidden = !option.masteryMatched;

  const stanceBonus = document.createElement("span");
  stanceBonus.className = "directive-stance-bonus";
  stanceBonus.textContent = option.stanceBonusText;
  stanceBonus.hidden = !option.stanceMatched;

  badges.append(
    dispatchRouteStep,
    dispatchLoopStreak,
    recommendation,
    planBonus,
    taskBonus,
    dispatchBonus,
    dispatchRelay,
    dispatchSync,
    dispatchSyncSupply,
    dispatchDetour,
    dispatchBranchShift,
    dispatchBranchStability,
    dispatchBranchFocus,
    dispatchBranchRotation,
    dispatchFocusLoop,
    dispatchLoop,
    dispatchBreakthrough,
    dispatchDetourBreakthrough,
    dispatchDetourInfusion,
    dispatchPrep,
    dispatchDetourPrep,
    dispatchReturn,
    dispatchRefresh,
    dispatchCooldown,
    dispatchWindow,
    finisherRecommendation,
    masteryBonus,
    stanceBonus
  );
  compactDirectiveBadges(badges);
  head.append(titleGroup, badges);

  const summary = document.createElement("span");
  summary.textContent = option.summary;

  const preview = document.createElement("span");
  preview.className = "directive-preview";
  preview.textContent = getDirectivePreviewDisplayText(option);
  if (preview.textContent !== option.previewText) {
    preview.title = option.previewText;
    preview.setAttribute("aria-label", option.previewText);
  }

  const status = document.createElement("span");
  status.className = "directive-status";
  status.textContent = option.statusText;

  const cooldownMeter = document.createElement("span");
  cooldownMeter.className = "directive-cooldown-meter";
  cooldownMeter.setAttribute("role", "meter");
  cooldownMeter.setAttribute("aria-label", option.name + "冷却进度");
  cooldownMeter.setAttribute("aria-valuemin", "0");
  cooldownMeter.setAttribute("aria-valuemax", "100");
  cooldownMeter.setAttribute(
    "aria-valuenow",
    String(Math.round((option.cooldownProgress ?? 0) * 100))
  );
  cooldownMeter.setAttribute("aria-valuetext", option.statusText);

  const cooldownFill = document.createElement("span");
  cooldownFill.style.width =
    Math.round(Math.max(0, Math.min(1, option.cooldownProgress ?? 0)) * 100) + "%";
  cooldownMeter.append(cooldownFill);

  button.append(head, summary, preview, cooldownMeter, status);
  return button;
}

function compactDirectiveBadges(badges) {
  const visibleBadges = Array.from(badges.children).filter(
    (item) => !item.hidden && item.textContent
  );
  visibleBadges.forEach((item, index) => {
    item.classList.toggle("is-collapsed-badge", index >= DIRECTIVE_VISIBLE_BADGE_LIMIT);
  });

  const hiddenCount = Math.max(0, visibleBadges.length - DIRECTIVE_VISIBLE_BADGE_LIMIT);
  if (hiddenCount > 0) {
    const overflow = document.createElement("span");
    overflow.className = "directive-badge-overflow";
    overflow.textContent = "+" + hiddenCount;
    overflow.title = visibleBadges.map((item) => item.textContent).join("，");
    badges.append(overflow);
  }
}

function getDirectivePreviewDisplayText(option) {
  if (option.statusText === "未解锁") {
    return option.previewText;
  }

  const detailCount = getDirectivePreviewDetailTexts(option).length;
  return (
    "预计 +" +
    formatNumber(option.gain) +
    " 能量" +
    (detailCount > 0 ? " · " + detailCount + " 项明细" : "")
  );
}

function getDirectivePreviewDetailTexts(option) {
  return [
    option.masteryBonusText,
    option.planRewardText,
    option.taskRewardText,
    option.dispatchRewardText,
    option.dispatchRelayRewardText,
    option.dispatchSyncRewardText,
    option.dispatchSyncSupplyText,
    option.dispatchDetourRewardText,
    option.dispatchBranchShiftRewardText,
    option.dispatchBranchFocusRewardText,
    option.dispatchBranchRotationRewardText,
    option.dispatchFocusLoopRewardText,
    option.dispatchLoopRewardText,
    option.dispatchLoopStreakRewardText,
    option.dispatchBreakthroughRewardText,
    option.dispatchDetourBreakthroughRewardText,
    option.dispatchDetourInfusionText,
    option.dispatchPrepRewardText,
    option.dispatchDetourPrepRewardText,
    option.dispatchReturnRewardText,
    option.dispatchRefreshText,
    option.dispatchCooldownText,
    option.dispatchChainWindowText,
    option.dispatchRouteStepText,
    option.chainBonusText,
    option.rotationRewardText,
    option.masteryCapstoneText,
    option.stanceFinisherText,
    option.stanceBonusText
  ].filter(Boolean);
}

function renderDirectiveVisual(option) {
  const iconDef =
    DIRECTIVE_ICON_DEFS[option.id] ?? DIRECTIVE_ICON_DEFS["resonance-pulse"];
  const wrapper = document.createElement("span");
  wrapper.className = [
    "directive-visual",
    "directive-visual-" + option.id,
    option.ready ? "is-ready" : "",
    option.cooling ? "is-cooling" : "",
    option.recommended ? "is-recommended" : ""
  ]
    .filter(Boolean)
    .join(" ");
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", iconDef.label);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  iconDef.nodes.forEach(([tagName, attributes]) => {
    svg.append(createSvgElement(tagName, attributes));
  });

  const stateOrb = document.createElement("span");
  stateOrb.className = "directive-state-orb";
  stateOrb.setAttribute("aria-hidden", "true");

  wrapper.append(svg, stateOrb);
  return wrapper;
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

  const head = document.createElement("span");
  head.className = "route-stance-head";
  head.append(renderRouteStanceVisual(option), name);

  const summary = document.createElement("span");
  summary.textContent = routeStance.unlocked ? option.summary : routeStance.unlockText;

  const mastery = document.createElement("span");
  mastery.className = "route-stance-mastery";
  mastery.textContent = option.masteryText;
  mastery.hidden = !routeStance.unlocked;

  button.append(head, summary, mastery);
  return button;
}

function renderRouteStanceVisual(option) {
  const iconDef = ROUTE_STANCE_ICON_DEFS[option.id] ?? ROUTE_STANCE_ICON_DEFS.balanced;
  const wrapper = document.createElement("span");
  wrapper.className = "route-stance-visual route-stance-visual-" + option.id;
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

function renderProjectChapterMap(chapters) {
  elements.projectChapterMap.replaceChildren(...chapters.map(renderProjectChapterTile));
}

function renderProjectChapterHero(chapters) {
  const chapter = getActiveProjectChapter(chapters);
  if (!chapter) {
    elements.projectChapterHero.hidden = true;
    elements.projectChapterHero.replaceChildren();
    return;
  }

  elements.projectChapterHero.hidden = false;
  elements.projectChapterHero.className = [
    "project-chapter-hero",
    chapter.visualClass,
    "is-" + chapter.status
  ]
    .filter(Boolean)
    .join(" ");
  elements.projectChapterHero.setAttribute("role", "img");
  elements.projectChapterHero.setAttribute(
    "aria-label",
    "当前章节：" +
      chapter.name +
      " " +
      chapter.progressText +
      " · " +
      chapter.focusText +
      " · " +
      chapter.nextText
  );
  elements.projectChapterHero.title = elements.projectChapterHero.getAttribute("aria-label");

  const scene = document.createElement("span");
  scene.className = "project-chapter-hero-scene";
  scene.setAttribute("aria-hidden", "true");

  const lane = document.createElement("span");
  lane.className = "project-chapter-hero-lane";

  const gate = document.createElement("span");
  gate.className = "project-chapter-hero-gate";

  const signal = document.createElement("span");
  signal.className = "project-chapter-hero-signal";

  const beacon = document.createElement("span");
  beacon.className = "project-chapter-hero-beacon";

  const route = document.createElement("span");
  route.className = "project-chapter-hero-route";
  route.setAttribute("aria-hidden", "true");
  route.append(...chapter.heroNodes.map(renderProjectChapterHeroNode));

  scene.append(lane, gate, signal, beacon, route);

  const meta = document.createElement("span");
  meta.className = "project-chapter-hero-meta";

  const kicker = document.createElement("span");
  kicker.className = "project-chapter-hero-kicker";
  kicker.textContent = "当前章节";

  const name = document.createElement("strong");
  name.textContent = chapter.name;

  const progress = document.createElement("span");
  progress.textContent = chapter.progressText + " · " + chapter.focusText;

  const next = document.createElement("span");
  next.textContent = chapter.nextText;

  meta.append(kicker, name, progress, next);

  const meter = document.createElement("span");
  meter.className = "project-chapter-hero-meter";
  meter.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.style.width = Math.round(chapter.progress * 100) + "%";
  meter.append(fill);

  elements.projectChapterHero.replaceChildren(scene, meta, meter);
}

function renderProjectChapterHeroNode(node) {
  const item = document.createElement("span");
  item.className = ["project-chapter-hero-node", "is-" + node.status]
    .filter(Boolean)
    .join(" ");
  item.title = node.title;
  return item;
}

function getActiveProjectChapter(chapters) {
  return (
    chapters.find((chapter) => chapter.filterId === projectFilter) ??
    (projectFilter === INITIAL_PROJECT_FILTER_ID
      ? chapters.find((chapter) => chapter.status === "current")
      : null) ??
    chapters.find((chapter) => chapter.status === "current") ??
    chapters[0] ??
    null
  );
}

function renderProjectRewardMap(rewards) {
  elements.projectRewardMap.replaceChildren(
    ...rewards.map((reward) => renderProjectRewardTile(reward))
  );
}

function renderProjectCurrentVisual(project) {
  if (!project) {
    elements.projectCurrentVisual.hidden = true;
    elements.projectCurrentVisual.replaceChildren();
    return;
  }

  elements.projectCurrentVisual.hidden = false;
  elements.projectCurrentVisual.className = [
    "project-current-visual",
    "is-" + project.status,
    "is-track-" + project.trackId,
    "is-reward-" + project.rewardId
  ]
    .filter(Boolean)
    .join(" ");
  elements.projectCurrentVisual.setAttribute("role", "img");
  elements.projectCurrentVisual.setAttribute("aria-label", project.title);
  elements.projectCurrentVisual.title = project.title;

  const orbit = document.createElement("span");
  orbit.className = "project-current-orbit";
  orbit.setAttribute("aria-hidden", "true");

  const meta = document.createElement("span");
  meta.className = "project-current-meta";

  const kicker = document.createElement("span");
  kicker.className = "project-current-kicker";
  kicker.textContent = "当前航段";

  const name = document.createElement("strong");
  name.textContent = project.name;

  const segment = document.createElement("span");
  segment.className = "project-current-segment";
  segment.textContent = project.segmentText + " · " + project.chapterText;

  const track = document.createElement("span");
  track.className = "project-current-track";

  const trackText = document.createElement("span");
  trackText.textContent = project.trackText;

  const reward = document.createElement("span");
  reward.textContent = project.reward;

  track.append(trackText, reward);
  meta.append(kicker, name, segment, track);

  const meter = document.createElement("span");
  meter.className = "project-current-meter";
  meter.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.style.width = Math.round(project.progress * 100) + "%";
  meter.append(fill);

  elements.projectCurrentVisual.replaceChildren(orbit, meta, meter);
}

function renderProjectForecastMap(projects) {
  elements.projectForecastMap.replaceChildren(
    ...projects.map((project) => renderProjectForecastTile(project))
  );
  elements.projectForecastMap.hidden = projects.length === 0;
}

function renderProjectForecastTile(project) {
  const item = document.createElement("span");
  item.className = [
    "project-forecast-tile",
    "is-" + project.status,
    "is-track-" + project.trackId,
    "is-reward-" + project.rewardId
  ]
    .filter(Boolean)
    .join(" ");
  item.setAttribute("role", "img");
  item.setAttribute("aria-label", project.title);
  item.title = project.title;

  const path = document.createElement("span");
  path.className = "project-forecast-path";
  path.setAttribute("aria-hidden", "true");

  const meta = document.createElement("span");
  meta.className = "project-forecast-meta";

  const segment = document.createElement("span");
  segment.className = "project-forecast-segment";
  segment.textContent = project.segmentText;

  const name = document.createElement("strong");
  name.textContent = project.name;

  const reward = document.createElement("span");
  reward.className = "project-forecast-reward";
  reward.textContent = project.reward;

  const meter = document.createElement("span");
  meter.className = "project-forecast-meter";
  meter.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.style.width = Math.round(project.progress * 100) + "%";
  meter.append(fill);

  meta.append(segment, name, reward);
  item.append(path, meta, meter);
  return item;
}

function renderProjectRewardTile(reward) {
  const item = document.createElement("span");
  item.className = [
    "project-reward-tile",
    "project-reward-" + reward.id,
    "is-" + reward.status
  ]
    .filter(Boolean)
    .join(" ");
  item.setAttribute("role", "img");
  item.setAttribute("aria-label", reward.title);
  item.title = reward.title;

  const icon = document.createElement("span");
  icon.className = "project-reward-icon";
  icon.setAttribute("aria-hidden", "true");

  const meta = document.createElement("span");
  meta.className = "project-reward-meta";

  const label = document.createElement("strong");
  label.textContent = reward.label;

  const progress = document.createElement("span");
  progress.textContent = reward.progressText;

  const meter = document.createElement("span");
  meter.className = "project-reward-meter";
  meter.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.style.width = Math.round(reward.progress * 100) + "%";
  meter.append(fill);

  meta.append(label, progress);
  item.append(icon, meta, meter);
  return item;
}

function renderProjectChapterTile(chapter) {
  const isActive =
    chapter.filterId === projectFilter ||
    (projectFilter === INITIAL_PROJECT_FILTER_ID && chapter.status === "current");
  const button = document.createElement("button");
  button.className = [
    "project-chapter-tile",
    "is-" + chapter.status,
    isActive ? "is-active" : ""
  ]
    .filter(Boolean)
    .join(" ");
  button.type = "button";
  button.title = chapter.title;
  button.setAttribute("aria-pressed", isActive ? "true" : "false");
  button.addEventListener("click", () => {
    projectFilter = chapter.filterId;
    render();
  });

  const visual = document.createElement("span");
  visual.className = ["project-chapter-visual", chapter.visualClass].filter(Boolean).join(" ");
  visual.setAttribute("aria-hidden", "true");

  const scene = document.createElement("span");
  scene.className = "project-chapter-scene";

  const sceneTrack = document.createElement("span");
  sceneTrack.className = "project-chapter-scene-track";

  const sceneGate = document.createElement("span");
  sceneGate.className = "project-chapter-scene-gate";

  const sceneSignal = document.createElement("span");
  sceneSignal.className = "project-chapter-scene-signal";

  scene.append(sceneTrack, sceneGate, sceneSignal);

  const orbit = document.createElement("span");
  orbit.className = "project-chapter-orbit";

  const core = document.createElement("span");
  core.className = "project-chapter-core";

  const emblem = document.createElement("span");
  emblem.className = "project-chapter-emblem";

  const progress = document.createElement("span");
  progress.className = "project-chapter-progress";

  const progressFill = document.createElement("span");
  progressFill.style.width = Math.round(chapter.progress * 100) + "%";
  progress.append(progressFill);
  visual.append(scene, orbit, core, emblem, progress);

  const name = document.createElement("strong");
  name.textContent = chapter.name;

  const meta = document.createElement("span");
  meta.className = "project-chapter-meta";
  meta.textContent = chapter.progressText;

  const focus = document.createElement("span");
  focus.className = "project-chapter-focus";
  focus.textContent = chapter.focusText;

  const next = document.createElement("span");
  next.className = "project-chapter-next";
  next.textContent = chapter.nextText;

  button.append(visual, name, meta, focus, next);
  return button;
}

function renderProjectFilter(filter, projects) {
  const button = document.createElement("button");
  button.className = [
    "project-filter-button",
    getProjectFilterVisualClass(filter.id),
    filter.id === projectFilter ? "is-active" : ""
  ]
    .filter(Boolean)
    .join(" ");
  button.type = "button";
  button.setAttribute("aria-pressed", filter.id === projectFilter ? "true" : "false");
  button.textContent = getProjectFilterButtonText(projects, filter.id);
  button.addEventListener("click", () => {
    projectFilter = filter.id;
    render();
  });

  return button;
}

function getProjectFilterVisualClass(filterId) {
  return PROJECT_FILTER_VISUAL_CLASSES[filterId] ?? "is-filter-all";
}

function renderProjectList(projects) {
  const visibleProjects = filterProjectStatuses(projects, projectFilter);
  const projectWindow = getProjectListWindow(visibleProjects);
  const children = projectWindow.visibleProjects.length
    ? projectWindow.visibleProjects.map((project) => renderProject(project))
    : [renderProjectEmptyState()];

  if (projectWindow.collapsedProjects.length > 0) {
    children.push(renderProjectListDrawer(projectWindow));
  }

  elements.projectList.replaceChildren(...children);
}

function renderProjectEmptyState() {
  const item = document.createElement("p");
  item.className = "project-empty-state";
  item.textContent = "没有匹配航段。";
  return item;
}

function renderProjectListDrawer(projectWindow) {
  const details = document.createElement("details");
  details.className = "project-list-drawer";

  const summary = document.createElement("summary");
  summary.textContent = projectWindow.summaryText;

  const grid = document.createElement("div");
  grid.className = "project-list-drawer-grid";
  grid.append(...projectWindow.collapsedProjects.map((project) => renderProject(project)));

  details.append(summary, grid);
  return details;
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

  const dispatchBadge = document.createElement("span");
  dispatchBadge.className = "project-dispatch-badge";
  dispatchBadge.textContent = project.dispatchBadgeText;
  dispatchBadge.hidden = !project.dispatchBadgeText;

  header.append(title, segmentBadge, chapterBadge, tagBadge, statusBadge, dispatchBadge);
  item.append(header, renderProjectCardScene(project));

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

function renderProjectCardScene(project) {
  const rewardIconId = getProjectRewardIconId(project);
  const progressPercent = Math.round(Math.max(0, Math.min(1, project.progress)) * 100);
  const scene = document.createElement("span");
  scene.className = [
    "project-card-scene",
    project.completed ? "is-complete" : "",
    project.isCurrent ? "is-current" : "is-pending",
    project.upgradeId ? "is-upgrade-track" : "is-energy-track",
    "is-reward-" + rewardIconId
  ]
    .filter(Boolean)
    .join(" ");
  scene.style.setProperty("--project-card-progress", progressPercent + "%");
  scene.setAttribute("role", "img");
  scene.setAttribute(
    "aria-label",
    project.name + "航段缩略图：" + project.progressText + "，奖励 " + project.reward
  );

  const trackMark = document.createElement("span");
  trackMark.className = "project-card-scene-track-mark";
  trackMark.setAttribute("aria-hidden", "true");

  const rail = document.createElement("span");
  rail.className = "project-card-scene-rail";
  rail.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.className = "project-card-scene-fill";

  const marker = document.createElement("span");
  marker.className = "project-card-scene-marker";

  rail.append(fill, marker);

  const rewardMark = document.createElement("span");
  rewardMark.className = "project-card-scene-reward";
  rewardMark.setAttribute("aria-hidden", "true");

  scene.append(trackMark, rail, rewardMark);
  return scene;
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

  const dispatch = document.createElement("span");
  dispatch.className = "project-dispatch";
  dispatch.textContent = project.dispatchText;
  dispatch.hidden = !project.dispatchText;

  const dispatchTrack = renderProjectDispatchTrack(project);

  const meter = document.createElement("span");
  meter.className = "project-meter";
  meter.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.style.width = Math.round(project.progress * 100) + "%";
  meter.append(fill);

  return [summary, progress, reward, dispatch, dispatchTrack, meter];
}

function renderProjectDispatchTrack(project) {
  const track = document.createElement("span");
  track.className = "project-dispatch-track";

  const steps = Array.isArray(project.dispatchSteps) ? project.dispatchSteps : [];
  track.hidden = steps.length === 0;
  if (track.hidden) {
    return track;
  }

  track.setAttribute("aria-label", project.dispatchStepText);
  track.append(
    ...steps.map((step, index) => {
      const stepItem = document.createElement("span");
      stepItem.className = "project-dispatch-step";

      const stepIndex = document.createElement("strong");
      stepIndex.textContent = String(index + 1);

      const stepLabel = document.createElement("span");
      stepLabel.textContent = step.text;

      const stepReward = document.createElement("em");
      stepReward.className = "project-dispatch-step-reward";
      stepReward.textContent = step.rewardText ?? "";
      stepReward.hidden = !step.rewardText;

      stepItem.append(stepIndex, stepLabel, stepReward);
      return stepItem;
    })
  );

  return track;
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

function loadSoundPreference() {
  try {
    const saved = localStorage.getItem(SOUND_KEY);
    return saved === null ? true : saved === "true";
  } catch {
    return true;
  }
}

function persistSoundPreference() {
  try {
    localStorage.setItem(SOUND_KEY, soundEnabled ? "true" : "false");
  } catch {
    // The sound toggle is a local preference; gameplay state does not depend on it.
  }
}

function loadHapticPreference() {
  try {
    const saved = localStorage.getItem(HAPTIC_KEY);
    return saved === null ? true : saved === "true";
  } catch {
    return true;
  }
}

function persistHapticPreference() {
  try {
    localStorage.setItem(HAPTIC_KEY, hapticEnabled ? "true" : "false");
  } catch {
    // The haptic toggle is a local preference; gameplay state does not depend on it.
  }
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

function animateCore({
  gainText = "",
  overloaded = false,
  comboStep = 0,
  pointerEvent = null
} = {}) {
  window.clearTimeout(corePulseTimer);
  window.clearTimeout(coreGainTimer);
  window.clearTimeout(coreImpactTimer);
  window.clearTimeout(coreEnergyHitTimer);
  window.clearTimeout(coreOverloadReadoutTimer);
  elements.coreButton.classList.remove("is-pulsing", "is-overload-impact");
  elements.energy.classList.remove("is-core-hit", "is-core-overload-hit");
  elements.overload.classList.remove("is-core-overload-prize");
  elements.coreGainPop.textContent = gainText;
  elements.coreGainPop.classList.remove("is-showing", "is-overload-gain");
  positionCoreImpact(pointerEvent);
  elements.coreImpactPoint.classList.remove("is-showing", "is-overload-impact");
  elements.coreImpactRipple.classList.remove("is-showing", "is-overload-impact");
  elements.coreImpactSparks.classList.remove("is-showing", "is-overload-impact");
  requestAnimationFrame(() => {
    elements.coreButton.classList.add("is-pulsing");
    elements.coreButton.classList.toggle("is-overload-impact", overloaded);
    elements.coreImpactPoint.classList.add("is-showing");
    elements.coreImpactPoint.classList.toggle("is-overload-impact", overloaded);
    elements.coreImpactRipple.classList.add("is-showing");
    elements.coreImpactRipple.classList.toggle("is-overload-impact", overloaded);
    elements.coreImpactSparks.classList.add("is-showing");
    elements.coreImpactSparks.classList.toggle("is-overload-impact", overloaded);
    elements.coreGainPop.classList.add("is-showing");
    elements.coreGainPop.classList.toggle("is-overload-gain", overloaded);
    elements.energy.classList.add(overloaded ? "is-core-overload-hit" : "is-core-hit");
    if (overloaded) {
      elements.overload.classList.add("is-core-overload-prize");
    }
    highlightCoreComboHit(comboStep, overloaded);
    corePulseTimer = window.setTimeout(
      () => {
        elements.coreButton.classList.remove("is-pulsing", "is-overload-impact");
      },
      overloaded ? 520 : 360
    );
    coreGainTimer = window.setTimeout(
      () => {
        elements.coreGainPop.classList.remove("is-showing", "is-overload-gain");
      },
      overloaded ? 760 : 620
    );
    coreImpactTimer = window.setTimeout(
      () => {
        elements.coreImpactPoint.classList.remove("is-showing", "is-overload-impact");
        elements.coreImpactRipple.classList.remove("is-showing", "is-overload-impact");
        elements.coreImpactSparks.classList.remove("is-showing", "is-overload-impact");
      },
      overloaded ? 620 : 420
    );
    coreEnergyHitTimer = window.setTimeout(
      () => {
        elements.energy.classList.remove("is-core-hit", "is-core-overload-hit");
      },
      overloaded ? 520 : 360
    );
    if (overloaded) {
      coreOverloadReadoutTimer = window.setTimeout(() => {
        elements.overload.classList.remove("is-core-overload-prize");
      }, 560);
    }
  });
}

function highlightCoreComboHit(comboStep, overloaded = false) {
  window.clearTimeout(coreComboHitTimer);
  Array.from(elements.coreComboTrack.children).forEach((dot) => {
    dot.classList.remove("is-hit");
  });

  const hitDot = elements.coreComboTrack.children[Math.max(0, comboStep - 1)];
  if (!hitDot) {
    return;
  }

  hitDot.classList.add("is-hit");
  coreComboHitTimer = window.setTimeout(
    () => {
      hitDot.classList.remove("is-hit");
    },
    overloaded ? 620 : 460
  );
}

function pressCoreButton(event) {
  positionCoreImpact(event);
  elements.coreButton.classList.add("is-pressing");
}

function releaseCoreButton() {
  elements.coreButton.classList.remove("is-pressing");
}

function isCorePressKey(event) {
  return event.key === " " || event.key === "Enter";
}

function positionCoreImpact(event) {
  const rect = elements.coreButton.getBoundingClientRect();
  const isPointerEvent =
    typeof event?.pointerType === "string" && event.pointerType.length > 0;
  const usePointer =
    event &&
    (isPointerEvent || event.detail !== 0) &&
    Number.isFinite(event.clientX) &&
    Number.isFinite(event.clientY);
  const x = usePointer ? event.clientX - rect.left : rect.width / 2;
  const y = usePointer ? event.clientY - rect.top : rect.height / 2;
  const width = Math.max(rect.width, 1);
  const height = Math.max(rect.height, 1);
  const clampedX = Math.min(Math.max(x, 0), rect.width);
  const clampedY = Math.min(Math.max(y, 0), rect.height);
  const recoilX = Math.round(((clampedX - rect.width / 2) / width) * 80) / 10;
  const recoilY = Math.round(((clampedY - rect.height / 2) / height) * 80) / 10;

  elements.coreButton.style.setProperty("--core-recoil-x", recoilX + "px");
  elements.coreButton.style.setProperty("--core-recoil-y", recoilY + "px");
  elements.coreGainPop.style.setProperty("--core-gain-x", clampedX + "px");
  elements.coreGainPop.style.setProperty("--core-gain-y", clampedY + "px");

  [
    elements.coreImpactPoint,
    elements.coreImpactRipple,
    elements.coreImpactSparks
  ].forEach((element) => {
    element.style.setProperty("--core-impact-x", clampedX + "px");
    element.style.setProperty("--core-impact-y", clampedY + "px");
  });
}

function playCoreSound({ overloaded = false } = {}) {
  if (!soundEnabled) {
    return;
  }

  const context = getAudioContext();
  if (!context) {
    return;
  }

  const now = context.currentTime;
  if (overloaded) {
    playTone(context, {
      frequency: 196,
      start: now,
      duration: 0.14,
      gain: 0.16,
      type: "sawtooth"
    });
    playTone(context, {
      frequency: 392,
      start: now + 0.05,
      duration: 0.2,
      gain: 0.14,
      type: "triangle"
    });
    return;
  }

  playTone(context, {
    frequency: 330,
    start: now,
    duration: 0.08,
    gain: 0.09,
    type: "triangle"
  });
  playTone(context, {
    frequency: 494,
    start: now + 0.035,
    duration: 0.1,
    gain: 0.08,
    type: "sine"
  });
}

function playCoreHaptic({ overloaded = false } = {}) {
  if (!hapticEnabled || typeof navigator.vibrate !== "function") {
    return;
  }

  try {
    navigator.vibrate(overloaded ? [18, 22, 34] : 12);
  } catch {
    // Haptics are best-effort and unavailable in many desktop browsers.
  }
}

function getAudioContext() {
  const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextCtor) {
    return null;
  }

  audioContext ??= new AudioContextCtor();
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone(context, { frequency, start, duration, gain, type }) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const end = start + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, end);
  oscillator.connect(gainNode).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.02);
}

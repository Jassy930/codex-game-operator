import {
  UPGRADE_DEFS,
  clickCore,
  createInitialState,
  formatNumber,
  getCurrentGoal,
  getUpgradeCost,
  normalizeState,
  purchaseUpgrade,
  tick
} from "./game.js";

const STORAGE_KEY = "codex-game-operator.state";
const EVENT_KEY = "codex-game-operator.events";
const SESSION_ID = crypto.randomUUID?.() ?? String(Date.now());

const elements = {
  energy: document.querySelector("#energyValue"),
  perSecond: document.querySelector("#perSecondValue"),
  perClick: document.querySelector("#perClickValue"),
  coreButton: document.querySelector("#coreButton"),
  combo: document.querySelector("#comboValue"),
  pulse: document.querySelector("#pulseValue"),
  goalLabel: document.querySelector("#goalLabel"),
  goalValue: document.querySelector("#goalValue"),
  goalMeter: document.querySelector("#goalMeter"),
  upgradeList: document.querySelector("#upgradeList"),
  resetButton: document.querySelector("#resetButton")
};

let state = loadState();
let lastFirstUpgradeAt = state.firstUpgradeAt;

recordEvent("session", {
  startedAt: new Date().toISOString()
});
render();

elements.coreButton.addEventListener("click", () => {
  state = clickCore(state);
  recordEvent("click", {
    energy: Math.floor(state.energy),
    combo: state.combo
  });
  animateCore();
  saveAndRender();
});

elements.resetButton.addEventListener("click", () => {
  state = createInitialState();
  lastFirstUpgradeAt = null;
  recordEvent("reset");
  saveAndRender();
});

setInterval(() => {
  state = tick(state);
  saveAndRender();
}, 250);

function render() {
  const current = normalizeState(state);
  const goal = getCurrentGoal(current);

  elements.energy.textContent = formatNumber(current.energy);
  elements.perSecond.textContent = formatNumber(current.energyPerSecond * current.multiplier);
  elements.perClick.textContent = formatNumber(current.energyPerClick * current.multiplier);
  elements.combo.textContent = "连击 " + current.combo;
  elements.pulse.textContent = current.lastPulse;
  elements.goalLabel.textContent = goal.label;
  elements.goalValue.textContent = goal.value;
  elements.goalMeter.style.width = Math.round(goal.progress * 100) + "%";

  elements.upgradeList.replaceChildren(
    ...UPGRADE_DEFS.map((upgrade) => renderUpgrade(upgrade, current))
  );
}

function renderUpgrade(upgrade, current) {
  const cost = getUpgradeCost(current, upgrade.id);
  const level = current.upgrades[upgrade.id] ?? 0;
  const canBuy = current.energy >= cost;
  const button = document.createElement("button");
  button.className = "upgrade-card";
  button.type = "button";
  button.disabled = !canBuy;
  button.addEventListener("click", () => {
    const result = purchaseUpgrade(state, upgrade.id);
    state = result.state;
    if (result.purchased) {
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

  const summary = document.createElement("span");
  summary.className = "upgrade-summary";
  summary.textContent = upgrade.summary;

  const meta = document.createElement("span");
  meta.className = "upgrade-meta";
  meta.textContent = "Lv." + level + " · " + formatNumber(cost);

  button.append(header, summary, meta);
  return button;
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return normalizeState(saved);
  } catch {
    return createInitialState();
  }
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

function animateCore() {
  elements.coreButton.classList.remove("is-pulsing");
  requestAnimationFrame(() => {
    elements.coreButton.classList.add("is-pulsing");
  });
}

export const UPGRADE_DEFS = [
  {
    id: "lens",
    name: "聚能透镜",
    summary: "点击产能 +1",
    baseCost: 10,
    costGrowth: 1.55,
    apply(state) {
      return {
        ...state,
        energyPerClick: state.energyPerClick + 1
      };
    }
  },
  {
    id: "collector",
    name: "自动采集臂",
    summary: "自动产能 +0.7/s",
    baseCost: 24,
    costGrowth: 1.62,
    apply(state) {
      return {
        ...state,
        energyPerSecond: state.energyPerSecond + 0.7
      };
    }
  },
  {
    id: "stabilizer",
    name: "星核稳定器",
    summary: "总产能 +18%",
    baseCost: 85,
    costGrowth: 1.75,
    apply(state) {
      return {
        ...state,
        multiplier: roundTo(state.multiplier * 1.18, 4)
      };
    }
  }
];

export const GOALS = [
  {
    id: "first-upgrade",
    label: "当前目标",
    value: "购买第一次升级",
    target: 1,
    current(state) {
      return getPurchasedUpgradeCount(state);
    }
  },
  {
    id: "passive-production",
    label: "当前目标",
    value: "启动自动采集",
    target: 1,
    current(state) {
      return state.upgrades.collector ?? 0;
    }
  },
  {
    id: "hundred-energy",
    label: "当前目标",
    value: "累计 100 能量",
    target: 100,
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "stable-core",
    label: "当前目标",
    value: "安装稳定器",
    target: 1,
    current(state) {
      return state.upgrades.stabilizer ?? 0;
    }
  }
];

const INITIAL_UPGRADES = Object.fromEntries(
  UPGRADE_DEFS.map((upgrade) => [upgrade.id, 0])
);
const MAX_OFFLINE_SECONDS = 8 * 60 * 60;

export function createInitialState(now = Date.now()) {
  return {
    energy: 0,
    totalEnergy: 0,
    energyPerClick: 1,
    energyPerSecond: 0,
    multiplier: 1,
    combo: 0,
    comboExpiresAt: 0,
    clicks: 0,
    createdAt: now,
    firstUpgradeAt: null,
    lastTick: now,
    lastPulse: "稳定",
    upgrades: { ...INITIAL_UPGRADES }
  };
}

export function normalizeState(state, now = Date.now()) {
  const initial = createInitialState(now);
  const source = state && typeof state === "object" ? state : {};
  const upgrades = { ...INITIAL_UPGRADES, ...(source.upgrades ?? {}) };

  return {
    ...initial,
    ...source,
    energy: Math.max(0, Number(source.energy ?? initial.energy) || 0),
    totalEnergy: Math.max(0, Number(source.totalEnergy ?? initial.totalEnergy) || 0),
    energyPerClick: Math.max(1, Number(source.energyPerClick ?? initial.energyPerClick) || 1),
    energyPerSecond: Math.max(0, Number(source.energyPerSecond ?? initial.energyPerSecond) || 0),
    multiplier: Math.max(1, Number(source.multiplier ?? initial.multiplier) || 1),
    combo: Math.max(0, Number(source.combo ?? initial.combo) || 0),
    comboExpiresAt: readNumber(source.comboExpiresAt, initial.comboExpiresAt),
    clicks: Math.max(0, Number(source.clicks ?? initial.clicks) || 0),
    createdAt: readNumber(source.createdAt, initial.createdAt),
    lastTick: readNumber(source.lastTick, now),
    upgrades
  };
}

export function tick(state, now = Date.now()) {
  const current = normalizeState(state, now);
  const elapsedSeconds = Math.max(
    0,
    Math.min(MAX_OFFLINE_SECONDS, (now - current.lastTick) / 1000)
  );
  const gain = current.energyPerSecond * current.multiplier * elapsedSeconds;

  return {
    ...current,
    energy: current.energy + gain,
    totalEnergy: current.totalEnergy + gain,
    lastTick: now,
    combo: now > current.comboExpiresAt ? 0 : current.combo
  };
}

export function clickCore(state, now = Date.now()) {
  const current = tick(state, now);
  const activeCombo = now <= current.comboExpiresAt ? current.combo : 0;
  const combo = activeCombo + 1;
  const overloadBonus = combo % 8 === 0 ? 5 : 0;
  const gain = (current.energyPerClick + overloadBonus) * current.multiplier;

  return {
    ...current,
    energy: current.energy + gain,
    totalEnergy: current.totalEnergy + gain,
    combo,
    comboExpiresAt: now + 2200,
    clicks: current.clicks + 1,
    lastPulse: overloadBonus > 0 ? "过载 +" + formatNumber(overloadBonus) : "稳定"
  };
}

export function getUpgradeCost(state, upgradeId) {
  const current = normalizeState(state);
  const upgrade = UPGRADE_DEFS.find((item) => item.id === upgradeId);
  if (!upgrade) {
    throw new Error(`Unknown upgrade: ${upgradeId}`);
  }
  const level = current.upgrades[upgradeId] ?? 0;
  return Math.floor(upgrade.baseCost * upgrade.costGrowth ** level);
}

export function purchaseUpgrade(state, upgradeId, now = Date.now()) {
  const current = tick(state, now);
  const upgrade = UPGRADE_DEFS.find((item) => item.id === upgradeId);
  if (!upgrade) {
    return { purchased: false, state: current, reason: "unknown-upgrade" };
  }

  const cost = getUpgradeCost(current, upgradeId);
  if (current.energy < cost) {
    return { purchased: false, state: current, reason: "insufficient-energy", cost };
  }

  const upgraded = upgrade.apply({
    ...current,
    energy: current.energy - cost,
    upgrades: {
      ...current.upgrades,
      [upgradeId]: (current.upgrades[upgradeId] ?? 0) + 1
    },
    firstUpgradeAt: current.firstUpgradeAt ?? now
  });

  return { purchased: true, state: upgraded, cost, upgrade };
}

export function getCurrentGoal(state) {
  const current = normalizeState(state);
  const goal =
    GOALS.find((item) => item.current(current) < item.target) ??
    buildLoopGoal(current);
  const progress = Math.min(1, goal.current(current) / goal.target);

  return {
    ...goal,
    progress
  };
}

export function getPurchasedUpgradeCount(state) {
  const current = normalizeState(state);
  return Object.values(current.upgrades).reduce((sum, count) => sum + count, 0);
}

export function formatNumber(value) {
  const number = Number(value) || 0;
  if (number < 1000) {
    return roundTo(number, number % 1 === 0 ? 0 : 1).toLocaleString("zh-CN");
  }

  const units = [
    { value: 1_000_000_000, suffix: "B" },
    { value: 1_000_000, suffix: "M" },
    { value: 1_000, suffix: "K" }
  ];
  const unit = units.find((item) => number >= item.value);
  return `${roundTo(number / unit.value, 1)}${unit.suffix}`;
}

function buildLoopGoal(state) {
  const target = Math.max(500, Math.ceil((state.totalEnergy + 1) / 500) * 500);
  return {
    id: "loop-" + target,
    label: "当前目标",
    value: "累计 " + formatNumber(target) + " 能量",
    target,
    current(currentState) {
      return currentState.totalEnergy;
    }
  };
}

function roundTo(value, precision) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function readNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

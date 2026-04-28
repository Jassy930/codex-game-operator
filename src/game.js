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

export const OVERLOAD_INTERVAL = 8;
export const GOALS = [
  {
    id: "first-upgrade",
    label: "当前目标",
    value: "购买第一次升级",
    upgradeId: "lens",
    unit: "次升级",
    target: 1,
    current(state) {
      return getPurchasedUpgradeCount(state);
    },
    action(state) {
      return buildUpgradeActionText(state, "lens");
    }
  },
  {
    id: "passive-production",
    label: "当前目标",
    value: "启动自动采集",
    upgradeId: "collector",
    unit: "级",
    target: 1,
    current(state) {
      return state.upgrades.collector ?? 0;
    },
    action(state) {
      return buildUpgradeActionText(state, "collector");
    }
  },
  {
    id: "hundred-energy",
    label: "当前目标",
    value: "累计 100 能量",
    unit: "能量",
    target: 100,
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "stable-core",
    label: "当前目标",
    value: "安装稳定器",
    upgradeId: "stabilizer",
    unit: "级",
    target: 1,
    current(state) {
      return state.upgrades.stabilizer ?? 0;
    },
    action(state) {
      return buildUpgradeActionText(state, "stabilizer");
    }
  }
];

export const PROJECT_DEFS = [
  {
    id: "stellar-map",
    name: "点亮星图",
    summary: "累计 100K 能量后展开星图计划。",
    unit: "能量",
    target: 100_000,
    reward: "总产能 +12%",
    effect: {
      totalMultiplier: 1.12
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "lens-array",
    name: "透镜阵列",
    summary: "将聚能透镜扩展到 12 级。",
    upgradeId: "lens",
    unit: "级",
    target: 12,
    reward: "点击产能 +18%",
    effect: {
      clickMultiplier: 1.18
    },
    current(state) {
      return state.upgrades.lens ?? 0;
    }
  },
  {
    id: "collector-grid",
    name: "采集阵列",
    summary: "将自动采集臂扩展到 12 级。",
    upgradeId: "collector",
    unit: "级",
    target: 12,
    reward: "自动产能 +18%",
    effect: {
      secondMultiplier: 1.18
    },
    current(state) {
      return state.upgrades.collector ?? 0;
    }
  },
  {
    id: "starbridge-trial",
    name: "星桥试运行",
    summary: "累计 250K 能量，打开下一段循环。",
    unit: "能量",
    target: 250_000,
    reward: "总产能 +25%",
    effect: {
      totalMultiplier: 1.25
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "stabilizer-matrix",
    name: "稳定矩阵",
    summary: "将星核稳定器扩展到 12 级。",
    upgradeId: "stabilizer",
    unit: "级",
    target: 12,
    reward: "总产能 +18%",
    effect: {
      totalMultiplier: 1.18
    },
    current(state) {
      return state.upgrades.stabilizer ?? 0;
    }
  },
  {
    id: "farstar-relay",
    name: "远星中继",
    summary: "累计 500K 能量，维持远星航线。",
    unit: "能量",
    target: 500_000,
    reward: "自动产能 +24%",
    effect: {
      secondMultiplier: 1.24
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "deep-space-mine",
    name: "深空矿带",
    summary: "累计 750K 能量，锁定远星资源带。",
    unit: "能量",
    target: 750_000,
    reward: "点击产能 +26%",
    effect: {
      clickMultiplier: 1.26
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "orbital-foundry",
    name: "星环工厂",
    summary: "将自动采集臂扩展到 16 级。",
    upgradeId: "collector",
    unit: "级",
    target: 16,
    reward: "自动产能 +30%",
    effect: {
      secondMultiplier: 1.3
    },
    current(state) {
      return state.upgrades.collector ?? 0;
    }
  },
  {
    id: "stellar-anchor",
    name: "恒星锚点",
    summary: "将星核稳定器扩展到 16 级。",
    upgradeId: "stabilizer",
    unit: "级",
    target: 16,
    reward: "总产能 +22%",
    effect: {
      totalMultiplier: 1.22
    },
    current(state) {
      return state.upgrades.stabilizer ?? 0;
    }
  }
];

export const PROJECT_GOAL_UNLOCK_ENERGY = 100_000;

const INITIAL_UPGRADES = Object.fromEntries(
  UPGRADE_DEFS.map((upgrade) => [upgrade.id, 0])
);
export const MAX_OFFLINE_SECONDS = 8 * 60 * 60;

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
    lastGain: 0,
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
    lastGain: Math.max(0, Number(source.lastGain ?? initial.lastGain) || 0),
    upgrades
  };
}

export function tick(state, now = Date.now()) {
  const current = normalizeState(state, now);
  const elapsedSeconds = Math.max(
    0,
    Math.min(MAX_OFFLINE_SECONDS, (now - current.lastTick) / 1000)
  );
  const production = getEffectiveProduction(current);
  const gain = production.perSecond * elapsedSeconds;

  return {
    ...current,
    energy: current.energy + gain,
    totalEnergy: current.totalEnergy + gain,
    lastTick: now,
    combo: now > current.comboExpiresAt ? 0 : current.combo
  };
}

export function settleOfflineProgress(
  state,
  now = Date.now(),
  { minimumGain = 1, minimumSeconds = 30 } = {}
) {
  const current = normalizeState(state, now);
  const rawElapsedSeconds = Math.max(0, (now - current.lastTick) / 1000);
  const elapsedSeconds = Math.min(MAX_OFFLINE_SECONDS, rawElapsedSeconds);
  const updated = tick(current, now);
  const gained = Math.max(0, updated.energy - current.energy);
  const shouldNotify = gained >= minimumGain && elapsedSeconds >= minimumSeconds;

  return {
    state: updated,
    summary: shouldNotify
      ? {
          gained,
          elapsedSeconds: Math.floor(elapsedSeconds),
          capped: rawElapsedSeconds > MAX_OFFLINE_SECONDS
        }
      : null
  };
}

export function clickCore(state, now = Date.now()) {
  const current = tick(state, now);
  const activeCombo = now <= current.comboExpiresAt ? current.combo : 0;
  const combo = activeCombo + 1;
  const overloadBonus = combo % OVERLOAD_INTERVAL === 0 ? 5 : 0;
  const production = getEffectiveProduction(current);
  const gain = roundTo(
    (current.energyPerClick + overloadBonus) * production.clickGainMultiplier,
    4
  );

  return {
    ...current,
    energy: current.energy + gain,
    totalEnergy: current.totalEnergy + gain,
    combo,
    comboExpiresAt: now + 2200,
    clicks: current.clicks + 1,
    lastPulse: overloadBonus > 0 ? "过载 +" + formatNumber(overloadBonus) : "稳定",
    lastGain: gain
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

export function getUpgradeAffordability(state, upgradeId) {
  const current = normalizeState(state);
  const cost = getUpgradeCost(current, upgradeId);
  const energy = Math.max(0, current.energy);
  const remaining = Math.max(0, cost - energy);

  return {
    cost,
    energy,
    remaining,
    progress: cost > 0 ? Math.min(1, energy / cost) : 1,
    canBuy: remaining <= 0
  };
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
    buildNextProjectGoal(current) ??
    buildLoopGoal(current);
  const currentValue = Math.max(0, goal.current(current));
  const target = Math.max(1, goal.target);
  const remaining = Math.max(0, target - currentValue);
  const progress = Math.min(1, currentValue / target);

  return {
    ...goal,
    currentValue,
    remaining,
    progress,
    progressText: buildGoalProgressText(goal, currentValue, target, remaining, current)
  };
}

export function getPurchasedUpgradeCount(state) {
  const current = normalizeState(state);
  return Object.values(current.upgrades).reduce((sum, count) => sum + count, 0);
}

export function getComboStatus(state, now = Date.now()) {
  const current = normalizeState(state, now);
  const count = now <= current.comboExpiresAt ? current.combo : 0;
  const modulo = count % OVERLOAD_INTERVAL;
  const step = count > 0 && modulo === 0 ? OVERLOAD_INTERVAL : modulo;
  const remaining = step === OVERLOAD_INTERVAL ? 0 : OVERLOAD_INTERVAL - step;
  const overloaded = step === OVERLOAD_INTERVAL;

  return {
    count,
    interval: OVERLOAD_INTERVAL,
    step,
    remaining,
    progress: step / OVERLOAD_INTERVAL,
    progressText: "过载 " + step + "/" + OVERLOAD_INTERVAL,
    hintText: overloaded ? "过载已触发" : "距过载 " + remaining + " 次",
    overloaded
  };
}

export function getProjectStatuses(state) {
  const current = normalizeState(state);

  return PROJECT_DEFS.map((project) => {
    const currentValue = Math.max(0, project.current(current));
    const target = Math.max(1, project.target);
    const remaining = Math.max(0, target - currentValue);
    const progress = Math.min(1, currentValue / target);
    const completed = remaining <= 0;

    return {
      ...project,
      currentValue,
      remaining,
      progress,
      completed,
      progressText: buildProjectProgressText(project, currentValue, target, remaining)
    };
  });
}

export function getProjectOverview(state) {
  const projects = getProjectStatuses(state);
  const completed = projects.filter((project) => project.completed).length;
  const nextProject = projects.find((project) => !project.completed) ?? null;
  const bonusText = buildProjectBonusText(getProjectBonusesFromStatuses(projects));

  if (!nextProject) {
    return {
      completed,
      total: projects.length,
      nextProjectId: null,
      upcomingProjectIds: [],
      summaryText: "星图进度 " + completed + "/" + projects.length + " · 全部航段已完成",
      detailText: "所有星图奖励已生效，继续累计能量等待下一段航线。",
      bonusText,
      forecastText: "航线预告：等待下一段航线"
    };
  }

  const upcomingProjects = projects.filter((project) => !project.completed).slice(0, 3);

  return {
    completed,
    total: projects.length,
    nextProjectId: nextProject.id,
    upcomingProjectIds: upcomingProjects.map((project) => project.id),
    summaryText:
      "星图进度 " +
      completed +
      "/" +
      projects.length +
      " · 下一段：" +
      nextProject.name +
      " · 奖励 " +
      nextProject.reward,
    detailText: nextProject.progressText,
    bonusText,
    forecastText:
      "航线预告：" + upcomingProjects.map(formatForecastProject).join("、")
  };
}

export function getProjectBonuses(state) {
  return getProjectBonusesFromStatuses(getProjectStatuses(state));
}

function getProjectBonusesFromStatuses(projects) {
  const completedProjects = projects.filter((project) => project.completed);
  return completedProjects.reduce(
    (bonuses, project) => {
      const effect = project.effect ?? {};
      return {
        totalMultiplier: roundTo(
          bonuses.totalMultiplier * (effect.totalMultiplier ?? 1),
          4
        ),
        clickMultiplier: roundTo(
          bonuses.clickMultiplier * (effect.clickMultiplier ?? 1),
          4
        ),
        secondMultiplier: roundTo(
          bonuses.secondMultiplier * (effect.secondMultiplier ?? 1),
          4
        ),
        completed: bonuses.completed + 1,
        projectIds: [...bonuses.projectIds, project.id]
      };
    },
    {
      totalMultiplier: 1,
      clickMultiplier: 1,
      secondMultiplier: 1,
      completed: 0,
      projectIds: []
    }
  );
}

export function getEffectiveProduction(state) {
  const current = normalizeState(state);
  const bonuses = getProjectBonuses(current);
  const clickGainMultiplier = current.multiplier * bonuses.totalMultiplier * bonuses.clickMultiplier;
  const secondGainMultiplier = current.multiplier * bonuses.totalMultiplier * bonuses.secondMultiplier;

  return {
    perClick: roundTo(current.energyPerClick * clickGainMultiplier, 4),
    perSecond: roundTo(current.energyPerSecond * secondGainMultiplier, 4),
    totalMultiplier: roundTo(current.multiplier * bonuses.totalMultiplier, 4),
    clickGainMultiplier: roundTo(clickGainMultiplier, 4),
    secondGainMultiplier: roundTo(secondGainMultiplier, 4),
    projectBonuses: bonuses
  };
}

export function buildClickActionNotice(state) {
  const current = normalizeState(state);

  if (current.lastGain <= 0) {
    return "";
  }

  const overloadText = String(current.lastPulse).startsWith("过载") ? "（含过载）" : "";
  return "+" + formatNumber(current.lastGain) + " 能量" + overloadText;
}

export function buildUpgradePurchaseNotice(result) {
  if (!result?.purchased || !result.upgrade) {
    return "";
  }

  const current = normalizeState(result.state);
  const level = current.upgrades[result.upgrade.id] ?? 0;
  return (
    "已购买" +
    result.upgrade.name +
    " Lv." +
    level +
    "，" +
    describeUpgradeProduction(result.upgrade.id, current)
  );
}

export function buildGoalCompletionNotice(previousGoal, nextGoal) {
  if (!previousGoal || !nextGoal || previousGoal.id === nextGoal.id) {
    return "";
  }

  const rewardText = previousGoal.reward ? "；获得奖励：" + previousGoal.reward : "";
  return "目标完成：" + previousGoal.value + rewardText + "；下一目标：" + nextGoal.value;
}

export function buildActionNoticeWithGoalTransition(actionText, previousGoal, nextGoal) {
  const primaryText = String(actionText ?? "").trim();
  const goalText = buildGoalCompletionNotice(previousGoal, nextGoal);

  if (!goalText) {
    return primaryText;
  }
  if (!primaryText) {
    return goalText;
  }

  return primaryText + " · " + goalText;
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
    unit: "能量",
    target,
    current(currentState) {
      return currentState.totalEnergy;
    }
  };
}

function buildProjectBonusText(bonuses) {
  if (!bonuses.completed) {
    return "生效加成：等待首个星图奖励";
  }

  const bonusParts = [
    ["总产能", bonuses.totalMultiplier],
    ["点击", bonuses.clickMultiplier],
    ["自动", bonuses.secondMultiplier]
  ]
    .filter(([, multiplier]) => multiplier > 1)
    .map(([label, multiplier]) => label + " x" + formatMultiplier(multiplier));

  return "生效加成：" + bonusParts.join(" · ");
}

function formatForecastProject(project) {
  return project.name + "（" + project.reward + "）";
}

function formatMultiplier(value) {
  return roundTo(value, 2).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function buildNextProjectGoal(state) {
  if (state.totalEnergy < PROJECT_GOAL_UNLOCK_ENERGY) {
    return null;
  }

  const project = PROJECT_DEFS.find((item) => item.current(state) < item.target);
  if (!project) {
    return null;
  }

  return {
    id: "project-" + project.id,
    label: "星图计划",
    value: project.name,
    upgradeId: project.upgradeId,
    reward: project.reward,
    unit: project.unit,
    target: project.target,
    current: project.current,
    action: project.upgradeId
      ? (currentState) => buildUpgradeActionText(currentState, project.upgradeId)
      : undefined
  };
}

function buildGoalProgressText(goal, currentValue, target, remaining, state) {
  const currentText = formatGoalAmount(goal, Math.min(currentValue, target));
  const targetText = formatGoalAmount(goal, target);
  const rewardText = goal.reward ? " · 奖励 " + goal.reward : "";
  if (remaining <= 0) {
    return "进度 " + targetText + " / " + targetText + " · 已完成" + rewardText;
  }
  const actionText = typeof goal.action === "function" ? goal.action(state) : null;
  const suffixText = actionText ?? "还差 " + formatGoalAmount(goal, remaining);
  return (
    "进度 " +
    currentText +
    " / " +
    targetText +
    " · " +
    suffixText +
    rewardText
  );
}

function formatGoalAmount(goal, value) {
  const unit = goal.unit ? " " + goal.unit : "";
  return formatNumber(value) + unit;
}

function buildProjectProgressText(project, currentValue, target, remaining) {
  const currentText = formatProjectAmount(project, Math.min(currentValue, target));
  const targetText = formatProjectAmount(project, target);

  if (remaining <= 0) {
    return "进度 " + targetText + " / " + targetText + " · 已完成";
  }

  return (
    "进度 " +
    currentText +
    " / " +
    targetText +
    " · 还差 " +
    formatProjectAmount(project, remaining)
  );
}

function formatProjectAmount(project, value) {
  const unit = project.unit ? " " + project.unit : "";
  return formatNumber(value) + unit;
}

function buildUpgradeActionText(state, upgradeId) {
  const upgrade = UPGRADE_DEFS.find((item) => item.id === upgradeId);
  const affordability = getUpgradeAffordability(state, upgradeId);

  if (affordability.canBuy) {
    return "可购买" + upgrade.name;
  }

  return "还差 " + formatNumber(affordability.remaining) + " 能量购买" + upgrade.name;
}

function describeUpgradeProduction(upgradeId, state) {
  const production = getEffectiveProduction(state);

  if (upgradeId === "lens") {
    return "每次产能 " + formatNumber(production.perClick);
  }
  if (upgradeId === "collector") {
    return "每秒产能 " + formatNumber(production.perSecond);
  }
  if (upgradeId === "stabilizer") {
    return "总产能倍率 " + formatNumber(production.totalMultiplier) + "x";
  }
  return "产能已提升";
}

function roundTo(value, precision) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function readNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

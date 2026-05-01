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
  },
  {
    id: "resonator",
    name: "星核谐振器",
    summary: "过载奖励 +2",
    baseCost: 520,
    costGrowth: 1.65,
    apply(state) {
      return {
        ...state,
        overloadBonus: roundTo(state.overloadBonus + 2, 4)
      };
    }
  }
];

export const OVERLOAD_INTERVAL = 8;
export const BASE_OVERLOAD_BONUS = 5;
export const DEFAULT_ROUTE_STANCE_ID = "balanced";
export const DEFAULT_PROJECT_FILTER_ID = "all";
export const INITIAL_PROJECT_FILTER_ID = "current-chapter";
export const PROJECT_LIST_PREVIEW_LIMIT = 8;
export const PROJECT_CHAPTER_HERO_NODE_LIMIT = 8;
export const PROJECT_FILTER_DEFS = [
  {
    id: DEFAULT_PROJECT_FILTER_ID,
    name: "全部"
  },
  {
    id: "current",
    name: "当前"
  },
  {
    id: "current-chapter",
    name: "本章"
  },
  {
    id: "chapter-starter-map",
    name: "首段星图",
    chapterName: "首段星图"
  },
  {
    id: "chapter-mastery",
    name: "专精校准",
    chapterName: "专精校准"
  },
  {
    id: "chapter-deep-infra",
    name: "深空基建",
    chapterName: "深空基建"
  },
  {
    id: "chapter-long-tail",
    name: "远航长尾",
    chapterName: "远航长尾"
  },
  {
    id: "energy-track",
    name: "累计"
  },
  {
    id: "upgrade-track",
    name: "升级"
  },
  {
    id: "total-reward",
    name: "总产能"
  },
  {
    id: "click-reward",
    name: "点击"
  },
  {
    id: "second-reward",
    name: "自动"
  },
  {
    id: "overload-reward",
    name: "过载"
  },
  {
    id: "incomplete",
    name: "未完成"
  },
  {
    id: "completed",
    name: "已完成"
  }
];
const PROJECT_REWARD_FILTER_EFFECTS = {
  "total-reward": "totalMultiplier",
  "click-reward": "clickMultiplier",
  "second-reward": "secondMultiplier",
  "overload-reward": "overloadMultiplier"
};
const PROJECT_REWARD_SUMMARY_DEFS = [
  ["总产能", "totalMultiplier", "total"],
  ["点击", "clickMultiplier", "click"],
  ["自动", "secondMultiplier", "second"],
  ["过载", "overloadMultiplier", "overload"]
];
export const ROUTE_STANCE_DEFS = [
  {
    id: DEFAULT_ROUTE_STANCE_ID,
    name: "均衡航线",
    summary: "保持当前产能分配，谐振脉冲 +10%",
    masteryProjectId: "balanced-tuning",
    directiveId: "resonance-pulse",
    effect: {
      clickMultiplier: 1,
      secondMultiplier: 1,
      overloadMultiplier: 1
    }
  },
  {
    id: "ignition",
    name: "点火优先",
    summary: "点击产能 +14%，过载奖励 +8%，点火齐射 +10%",
    masteryProjectId: "ignition-drill",
    directiveId: "ignition-salvo",
    effect: {
      clickMultiplier: 1.14,
      secondMultiplier: 1,
      overloadMultiplier: 1.08
    }
  },
  {
    id: "cruise",
    name: "巡航优先",
    summary: "自动产能 +16%，巡航回收 +10%",
    masteryProjectId: "cruise-drill",
    directiveId: "cruise-cache",
    effect: {
      clickMultiplier: 1,
      secondMultiplier: 1.16,
      overloadMultiplier: 1
    }
  }
];
export const DIRECTIVE_DEFS = [
  {
    id: "ignition-salvo",
    name: "点火齐射",
    summary: "立即结算 8 次点火收益",
    cooldownSeconds: 35,
    getGain(_state, production) {
      return production.perClick * 8;
    }
  },
  {
    id: "cruise-cache",
    name: "巡航回收",
    summary: "立即回收 45 秒自动收益",
    cooldownSeconds: 60,
    getGain(_state, production) {
      return Math.max(production.perSecond * 45, production.perClick * 4);
    }
  },
  {
    id: "resonance-pulse",
    name: "谐振脉冲",
    summary: "立即释放 2 次过载收益",
    cooldownSeconds: 75,
    getGain(_state, production) {
      return production.overloadBonus * 2;
    }
  }
];
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
    id: "resonance-calibration",
    name: "谐振校准",
    summary: "将星核谐振器扩展到 6 级，强化主动点击节奏。",
    upgradeId: "resonator",
    unit: "级",
    target: 6,
    reward: "过载奖励 +20%",
    effect: {
      overloadMultiplier: 1.2
    },
    current(state) {
      return state.upgrades.resonator ?? 0;
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
    id: "ignition-drill",
    name: "点火航校",
    summary: "将聚能透镜扩展到 14 级，配合点火优先航线。",
    upgradeId: "lens",
    unit: "级",
    target: 14,
    reward: "点击产能 +16%",
    effect: {
      clickMultiplier: 1.16
    },
    current(state) {
      return state.upgrades.lens ?? 0;
    }
  },
  {
    id: "cruise-drill",
    name: "巡航航校",
    summary: "将自动采集臂扩展到 14 级，配合巡航优先航线。",
    upgradeId: "collector",
    unit: "级",
    target: 14,
    reward: "自动产能 +16%",
    effect: {
      secondMultiplier: 1.16
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
    id: "balanced-tuning",
    name: "均衡校准",
    summary: "将星核稳定器扩展到 14 级，强化均衡航线底盘。",
    upgradeId: "stabilizer",
    unit: "级",
    target: 14,
    reward: "总产能 +14%",
    effect: {
      totalMultiplier: 1.14
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
  },
  {
    id: "void-gate-expedition",
    name: "星门远征",
    summary: "累计 1.5M 能量，开启更远深空航线。",
    unit: "能量",
    target: 1_500_000,
    reward: "总产能 +16%",
    effect: {
      totalMultiplier: 1.16
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "outer-ring-beacon",
    name: "外环信标",
    summary: "累计 2M 能量，在星门外环布置信标。",
    unit: "能量",
    target: 2_000_000,
    reward: "点击产能 +14%",
    effect: {
      clickMultiplier: 1.14
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "comet-tail-dock",
    name: "彗尾船坞",
    summary: "累计 2.75M 能量，在彗尾航道建立自动补给船坞。",
    unit: "能量",
    target: 2_750_000,
    reward: "自动产能 +18%",
    effect: {
      secondMultiplier: 1.18
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "gravity-beacon",
    name: "引力航标",
    summary: "累计 3.5M 能量，在深空引力井校准回航航标。",
    unit: "能量",
    target: 3_500_000,
    reward: "总产能 +15%",
    effect: {
      totalMultiplier: 1.15
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "dark-current-observatory",
    name: "暗流观测站",
    summary: "累计 4.5M 能量，在引力航标外侧观测深空暗流。",
    unit: "能量",
    target: 4_500_000,
    reward: "过载奖励 +15%",
    effect: {
      overloadMultiplier: 1.15
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "void-compass",
    name: "虚空罗盘",
    summary: "累计 5.75M 能量，在暗流观测站外校准远航罗盘。",
    unit: "能量",
    target: 5_750_000,
    reward: "点击产能 +15%",
    effect: {
      clickMultiplier: 1.15
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "nebula-archive",
    name: "星云档案库",
    summary: "累计 7.25M 能量，在虚空罗盘指向的星云边界建立档案库。",
    unit: "能量",
    target: 7_250_000,
    reward: "自动产能 +17%",
    effect: {
      secondMultiplier: 1.17
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "deep-sky-ranging-array",
    name: "深穹测距阵",
    summary: "累计 9M 能量，在星云档案库外部署深穹测距阵。",
    unit: "能量",
    target: 9_000_000,
    reward: "总产能 +17%",
    effect: {
      totalMultiplier: 1.17
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "silent-light-relay",
    name: "寂光中继环",
    summary: "累计 11M 能量，在深穹测距阵外接入寂光中继环。",
    unit: "能量",
    target: 11_000_000,
    reward: "过载奖励 +16%",
    effect: {
      overloadMultiplier: 1.16
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "daybreak-warp-well",
    name: "极昼折跃井",
    summary: "累计 13.5M 能量，在寂光中继环外稳定极昼折跃井。",
    unit: "能量",
    target: 13_500_000,
    reward: "点击产能 +16%",
    effect: {
      clickMultiplier: 1.16
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "corona-corridor",
    name: "日冕回廊",
    summary: "累计 16.5M 能量，在极昼折跃井外铺设日冕回廊。",
    unit: "能量",
    target: 16_500_000,
    reward: "自动产能 +16%",
    effect: {
      secondMultiplier: 1.16
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "mag-sail-dome",
    name: "磁帆穹顶",
    summary: "累计 20M 能量，在日冕回廊外展开磁帆穹顶。",
    unit: "能量",
    target: 20_000_000,
    reward: "总产能 +18%",
    effect: {
      totalMultiplier: 1.18
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "tidal-star-ring",
    name: "引潮星环",
    summary: "累计 24M 能量，在磁帆穹顶外调校引潮星环。",
    unit: "能量",
    target: 24_000_000,
    reward: "过载奖励 +18%",
    effect: {
      overloadMultiplier: 1.18
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "pulse-arc-gate",
    name: "脉冲航闸",
    summary: "累计 30M 能量，在引潮星环外开启脉冲航闸。",
    unit: "能量",
    target: 30_000_000,
    reward: "点击产能 +18%",
    effect: {
      clickMultiplier: 1.18
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "glow-orbit-harbor",
    name: "离辉轨道港",
    summary: "累计 38M 能量，在脉冲航闸外建设离辉轨道港。",
    unit: "能量",
    target: 38_000_000,
    reward: "自动产能 +18%",
    effect: {
      secondMultiplier: 1.18
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "far-dawn-lighthouse",
    name: "远曦灯塔",
    summary: "累计 50M 能量，在离辉轨道港外点亮远曦灯塔。",
    unit: "能量",
    target: 50_000_000,
    reward: "总产能 +19%",
    effect: {
      totalMultiplier: 1.19
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "star-crown-echo-station",
    name: "星冠回声站",
    summary: "累计 65M 能量，在远曦灯塔外架设星冠回声站。",
    unit: "能量",
    target: 65_000_000,
    reward: "过载奖励 +19%",
    effect: {
      overloadMultiplier: 1.19
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "dawn-abyss-observatory",
    name: "晨渊观星台",
    summary: "累计 85M 能量，在星冠回声站外校准晨渊观星台。",
    unit: "能量",
    target: 85_000_000,
    reward: "点击产能 +19%",
    effect: {
      clickMultiplier: 1.19
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "solar-veil-dome",
    name: "曜幕天穹",
    summary: "累计 110M 能量，在晨渊观星台外展开曜幕天穹。",
    unit: "能量",
    target: 110_000_000,
    reward: "自动产能 +20%",
    effect: {
      secondMultiplier: 1.2
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "abyss-echo-gate",
    name: "星渊回声门",
    summary: "累计 145M 能量，在曜幕天穹外打开星渊回声门。",
    unit: "能量",
    target: 145_000_000,
    reward: "总产能 +20%",
    effect: {
      totalMultiplier: 1.2
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "voidflare-resonator",
    name: "虚曜谐振塔",
    summary: "累计 190M 能量，在星渊回声门外架设虚曜谐振塔。",
    unit: "能量",
    target: 190_000_000,
    reward: "过载奖励 +20%",
    effect: {
      overloadMultiplier: 1.2
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "glimmer-shadow-vault",
    name: "烁影星匣",
    summary: "累计 250M 能量，在虚曜谐振塔外封存烁影星匣。",
    unit: "能量",
    target: 250_000_000,
    reward: "点击产能 +21%",
    effect: {
      clickMultiplier: 1.21
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "radiant-tide-cruise-ring",
    name: "辉潮巡航环",
    summary: "累计 320M 能量，在烁影星匣外铺设辉潮巡航环。",
    unit: "能量",
    target: 320_000_000,
    reward: "自动产能 +21%",
    effect: {
      secondMultiplier: 1.21
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "starwave-confluence-court",
    name: "星澜汇流庭",
    summary: "累计 420M 能量，在辉潮巡航环外汇聚星澜航道。",
    unit: "能量",
    target: 420_000_000,
    reward: "总产能 +22%",
    effect: {
      totalMultiplier: 1.22
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "skysea-prism",
    name: "穹海棱镜",
    summary: "累计 550M 能量，在星澜汇流庭外折射穹海航路。",
    unit: "能量",
    target: 550_000_000,
    reward: "过载奖励 +22%",
    effect: {
      overloadMultiplier: 1.22
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "aurora-spectrum-station",
    name: "极光谱站",
    summary: "累计 720M 能量，在穹海棱镜外校准极光谱站。",
    unit: "能量",
    target: 720_000_000,
    reward: "点击产能 +23%",
    effect: {
      clickMultiplier: 1.23
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "silverwing-dawn-ring",
    name: "银翼曙环",
    summary: "累计 950M 能量，在极光谱站外铺设银翼曙环。",
    unit: "能量",
    target: 950_000_000,
    reward: "自动产能 +23%",
    effect: {
      secondMultiplier: 1.23
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "morningstar-ark",
    name: "晨星方舟",
    summary: "累计 1.2B 能量，在银翼曙环外启航晨星方舟。",
    unit: "能量",
    target: 1_200_000_000,
    reward: "总产能 +24%",
    effect: {
      totalMultiplier: 1.24
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "startide-resonance-court",
    name: "星潮谐振庭",
    summary: "累计 1.6B 能量，在晨星方舟外接入星潮谐振庭。",
    unit: "能量",
    target: 1_600_000_000,
    reward: "过载奖励 +24%",
    effect: {
      overloadMultiplier: 1.24
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "starglow-far-harbor",
    name: "星辉远港",
    summary: "累计 2.1B 能量，在星潮谐振庭外建设星辉远港。",
    unit: "能量",
    target: 2_100_000_000,
    reward: "点击产能 +25%",
    effect: {
      clickMultiplier: 1.25
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "radiant-wing-cruise-haven",
    name: "辉翼巡航港",
    summary: "累计 2.8B 能量，在星辉远港外铺设辉翼巡航港。",
    unit: "能量",
    target: 2_800_000_000,
    reward: "自动产能 +25%",
    effect: {
      secondMultiplier: 1.25
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "stardome-navigation-spire",
    name: "星穹导航塔",
    summary: "累计 3.7B 能量，在辉翼巡航港外立起星穹导航塔。",
    unit: "能量",
    target: 3_700_000_000,
    reward: "总产能 +26%",
    effect: {
      totalMultiplier: 1.26
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "starfall-resonance-gate",
    name: "星瀑谐振门",
    summary: "累计 4.9B 能量，在星穹导航塔外开启星瀑谐振门。",
    unit: "能量",
    target: 4_900_000_000,
    reward: "过载奖励 +26%",
    effect: {
      overloadMultiplier: 1.26
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "starflame-pilot-ring",
    name: "星焰引航环",
    summary: "累计 6.5B 能量，在星瀑谐振门外点亮星焰引航环。",
    unit: "能量",
    target: 6_500_000_000,
    reward: "点击产能 +27%",
    effect: {
      clickMultiplier: 1.27
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "starcrown-voyage-harbor",
    name: "星冕远航港",
    summary: "累计 8.6B 能量，在星焰引航环外建设星冕远航港。",
    unit: "能量",
    target: 8_600_000_000,
    reward: "自动产能 +27%",
    effect: {
      secondMultiplier: 1.27
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "radiant-crown-stargate",
    name: "曜冕星门",
    summary: "累计 11.4B 能量，在星冕远航港外开启曜冕星门。",
    unit: "能量",
    target: 11_400_000_000,
    reward: "总产能 +28%",
    effect: {
      totalMultiplier: 1.28
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "radiant-tide-resonance-gate",
    name: "曜潮谐振门",
    summary: "累计 15.2B 能量，在曜冕星门外开启曜潮谐振门。",
    unit: "能量",
    target: 15_200_000_000,
    reward: "过载奖励 +28%",
    effect: {
      overloadMultiplier: 1.28
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "starflare-transition-spire",
    name: "星耀跃迁塔",
    summary: "累计 20.4B 能量，在曜潮谐振门外点亮星耀跃迁塔。",
    unit: "能量",
    target: 20_400_000_000,
    reward: "点击产能 +29%",
    effect: {
      clickMultiplier: 1.29
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "starwing-voyage-haven",
    name: "星翼远航港",
    summary: "累计 27.5B 能量，在星耀跃迁塔外建设星翼远航港。",
    unit: "能量",
    target: 27_500_000_000,
    reward: "自动产能 +29%",
    effect: {
      secondMultiplier: 1.29
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "radiant-wing-stargate",
    name: "曜翼星门",
    summary: "累计 37.2B 能量，在星翼远航港外开启曜翼星门。",
    unit: "能量",
    target: 37_200_000_000,
    reward: "总产能 +30%",
    effect: {
      totalMultiplier: 1.3
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "radiant-abyss-resonance-gate",
    name: "曜渊谐振门",
    summary: "累计 50B 能量，在曜翼星门外开启曜渊谐振门。",
    unit: "能量",
    target: 50_000_000_000,
    reward: "过载奖励 +30%",
    effect: {
      overloadMultiplier: 1.3
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "abyss-ignition-spire",
    name: "星渊点火塔",
    summary: "累计 67.5B 能量，在曜渊谐振门外点亮星渊点火塔。",
    unit: "能量",
    target: 67_500_000_000,
    reward: "点击产能 +31%",
    effect: {
      clickMultiplier: 1.31
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "abyss-cruise-ring",
    name: "星渊巡航环",
    summary: "累计 91B 能量，在星渊点火塔外铺设星渊巡航环。",
    unit: "能量",
    target: 91_000_000_000,
    reward: "自动产能 +31%",
    effect: {
      secondMultiplier: 1.31
    },
    current(state) {
      return state.totalEnergy;
    }
  },
  {
    id: "abyss-ark",
    name: "星渊方舟",
    summary: "累计 122B 能量，在星渊巡航环外启航星渊方舟。",
    unit: "能量",
    target: 122_000_000_000,
    reward: "总产能 +32%",
    effect: {
      totalMultiplier: 1.32
    },
    current(state) {
      return state.totalEnergy;
    }
  }
];

export const PROJECT_CHAPTER_DEFS = [
  {
    name: "首段星图",
    startId: "stellar-map",
    endId: "collector-grid",
    visualClass: "is-starter",
    focusText: "星核点亮"
  },
  {
    name: "专精校准",
    startId: "ignition-drill",
    endId: "balanced-tuning",
    visualClass: "is-mastery",
    focusText: "策略校准"
  },
  {
    name: "深空基建",
    startId: "farstar-relay",
    endId: "stellar-anchor",
    visualClass: "is-infra",
    focusText: "基建扩展"
  },
  {
    name: "远航长尾",
    startId: "void-gate-expedition",
    endId: "abyss-ark",
    visualClass: "is-long-tail",
    focusText: "远航航线"
  }
];

export const PROJECT_GOAL_UNLOCK_ENERGY = 100_000;
export const DIRECTIVE_UNLOCK_ENERGY = PROJECT_GOAL_UNLOCK_ENERGY;
export const DIRECTIVE_CHAIN_WINDOW_SECONDS = 90;
export const DIRECTIVE_CHAIN_BONUS_STEP = 0.12;
export const DIRECTIVE_CHAIN_MAX_STACKS = 2;
export const DIRECTIVE_ROTATION_REWARD_RATE = 0.18;
export const DIRECTIVE_PLAN_BONUS_RATE = 0.06;
export const DIRECTIVE_TASK_REWARD_RATE = 0.08;
export const DIRECTIVE_STANCE_BONUS_RATE = 0.1;
export const DIRECTIVE_STANCE_FINISHER_RATE = 0.12;
export const DIRECTIVE_MASTERY_WINDOW_SECONDS = 180;
export const DIRECTIVE_MASTERY_BONUS_STEP = 0.05;
export const DIRECTIVE_MASTERY_MAX_STACKS = 3;
export const DIRECTIVE_MASTERY_CAPSTONE_RATE = 0.1;
export const FAR_ROUTE_DISPATCH_UNLOCK_ENERGY = 20_000_000;
export const FAR_ROUTE_DISPATCH_BONUS_RATE = 0.14;
export const FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER = 0.7;
export const FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS = 30;
export const FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE = 0.08;
export const FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE = 0.05;
export const FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE = 0.03;
export const FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE = 0.16;
export const FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE = 0.0005;
export const FAR_ROUTE_DISPATCH_PREP_REWARD_RATE = 0.07;
export const FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE = 0.06;
export const FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE = 0.04;
export const FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE = 0.0003;
export const FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE = 0.003;
export const FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER = 1.5;
export const FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE = 0.05;
export const FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE = 0.06;
export const FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE = 0.04;
export const FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE = 0.05;
export const FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE = 0.09;
export const FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE = 0.07;
const FAR_ROUTE_DISPATCH_BRANCH_ROUTE_STEP_LABELS = Object.freeze({
  start: "1",
  branch: "2",
  return: "3"
});
const FAR_ROUTE_DISPATCH_BRANCH_ROUTE_REWARD_LABELS = Object.freeze({
  sync: Object.freeze({
    start: "校准",
    branch: "补给",
    return: "闭环"
  }),
  detour: Object.freeze({
    start: "校准",
    branch: "投送",
    return: "闭环"
  })
});
const FAR_ROUTE_DISPATCH_BRANCH_ROUTE_FLOW_LABELS = Object.freeze({
  sync: Object.freeze({
    kind: "current",
    text: "当前+"
  }),
  detour: Object.freeze({
    kind: "progress",
    text: "当前->累计"
  })
});
const FAR_ROUTE_DISPATCH_BRANCH_ROUTE_COST_LABELS = Object.freeze({
  sync: Object.freeze({
    kind: "safe",
    text: "无消耗"
  }),
  detour: Object.freeze({
    kind: "spend",
    text: "消耗当前"
  })
});
const FAR_ROUTE_DISPATCH_BRANCH_ROUTE_INTENT_LABELS = Object.freeze({
  sync: Object.freeze({
    kind: "preserve",
    text: "保当前"
  }),
  detour: Object.freeze({
    kind: "advance",
    text: "推累计"
  })
});
const FAR_ROUTE_DISPATCH_BRANCH_ROUTE_RETURN_LABELS = Object.freeze({
  sync: Object.freeze({
    kind: "far",
    text: "远航突破"
  }),
  detour: Object.freeze({
    kind: "detour",
    text: "绕行突破"
  })
});

const INITIAL_UPGRADES = Object.fromEntries(
  UPGRADE_DEFS.map((upgrade) => [upgrade.id, 0])
);
const INITIAL_DIRECTIVES = Object.fromEntries(
  DIRECTIVE_DEFS.map((directive) => [directive.id, 0])
);
export const MAX_OFFLINE_SECONDS = 8 * 60 * 60;

export function createInitialState(now = Date.now()) {
  return {
    energy: 0,
    totalEnergy: 0,
    energyPerClick: 1,
    energyPerSecond: 0,
    multiplier: 1,
    overloadBonus: BASE_OVERLOAD_BONUS,
    combo: 0,
    comboExpiresAt: 0,
    clicks: 0,
    routeStance: DEFAULT_ROUTE_STANCE_ID,
    createdAt: now,
    firstUpgradeAt: null,
    lastTick: now,
    lastPulse: "稳定",
    lastGain: 0,
    directiveChain: {
      lastDirectiveId: null,
      stacks: 0,
      expiresAt: 0
    },
    directiveMastery: {
      stacks: 0,
      expiresAt: 0
    },
    farRouteLastBranchDirectiveId: null,
    farRouteBranchRotationDirectiveId: null,
    directives: { ...INITIAL_DIRECTIVES },
    upgrades: { ...INITIAL_UPGRADES }
  };
}

export function normalizeState(state, now = Date.now()) {
  const initial = createInitialState(now);
  const source = state && typeof state === "object" ? state : {};
  const upgrades = { ...INITIAL_UPGRADES, ...(source.upgrades ?? {}) };
  const sourceDirectives =
    source.directives && typeof source.directives === "object" ? source.directives : {};
  const directives = Object.fromEntries(
    DIRECTIVE_DEFS.map((directive) => [
      directive.id,
      Math.max(0, readNumber(sourceDirectives[directive.id], 0))
    ])
  );
  const sourceDirectiveChain =
    source.directiveChain && typeof source.directiveChain === "object"
      ? source.directiveChain
      : {};
  const directiveChain = {
    lastDirectiveId: getValidDirectiveId(sourceDirectiveChain.lastDirectiveId),
    stacks: Math.min(
      DIRECTIVE_CHAIN_MAX_STACKS,
      Math.max(0, Math.floor(readNumber(sourceDirectiveChain.stacks, 0)))
    ),
    expiresAt: readNumber(sourceDirectiveChain.expiresAt, 0)
  };
  const sourceDirectiveMastery =
    source.directiveMastery && typeof source.directiveMastery === "object"
      ? source.directiveMastery
      : {};
  const directiveMasteryExpiresAt = readNumber(sourceDirectiveMastery.expiresAt, 0);
  const directiveMasteryActive = directiveMasteryExpiresAt >= now;
  const directiveMastery = {
    stacks: directiveMasteryActive
      ? Math.min(
          DIRECTIVE_MASTERY_MAX_STACKS,
          Math.max(0, Math.floor(readNumber(sourceDirectiveMastery.stacks, 0)))
        )
      : 0,
    expiresAt: directiveMasteryActive ? directiveMasteryExpiresAt : 0
  };

  return {
    ...initial,
    ...source,
    energy: Math.max(0, Number(source.energy ?? initial.energy) || 0),
    totalEnergy: Math.max(0, Number(source.totalEnergy ?? initial.totalEnergy) || 0),
    energyPerClick: Math.max(1, Number(source.energyPerClick ?? initial.energyPerClick) || 1),
    energyPerSecond: Math.max(0, Number(source.energyPerSecond ?? initial.energyPerSecond) || 0),
    multiplier: Math.max(1, Number(source.multiplier ?? initial.multiplier) || 1),
    overloadBonus: Math.max(
      0,
      Number(source.overloadBonus ?? initial.overloadBonus) || initial.overloadBonus
    ),
    combo: Math.max(0, Number(source.combo ?? initial.combo) || 0),
    comboExpiresAt: readNumber(source.comboExpiresAt, initial.comboExpiresAt),
    clicks: Math.max(0, Number(source.clicks ?? initial.clicks) || 0),
    routeStance: getValidRouteStanceId(source.routeStance),
    createdAt: readNumber(source.createdAt, initial.createdAt),
    lastTick: readNumber(source.lastTick, now),
    lastGain: Math.max(0, Number(source.lastGain ?? initial.lastGain) || 0),
    directiveChain,
    directiveMastery,
    farRouteLastBranchDirectiveId: getValidDirectiveId(
      source.farRouteLastBranchDirectiveId
    ),
    farRouteBranchRotationDirectiveId: getValidDirectiveId(
      source.farRouteBranchRotationDirectiveId
    ),
    directives,
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
  const production = getEffectiveProduction(current);
  const overloadBonus = combo % OVERLOAD_INTERVAL === 0 ? production.overloadBonus : 0;
  const gain = roundTo(production.perClick + overloadBonus, 4);

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

export function activateDirective(state, directiveId, now = Date.now()) {
  const current = tick(state, now);
  const directive = getDirectiveDef(directiveId);

  if (!directive) {
    return {
      activated: false,
      reason: "unknown-directive",
      state: current,
      notice: "未知航线指令。"
    };
  }

  if (current.totalEnergy < DIRECTIVE_UNLOCK_ENERGY) {
    return {
      activated: false,
      reason: "locked",
      directive,
      state: current,
      notice: "累计 100K 能量后解锁航线指令。"
    };
  }

  const dispatch = getFarRouteDispatch(current, now);
  const cooldownMs = getDirectiveCooldownMs(directive, dispatch);
  const chainWindowSeconds = getDirectiveChainWindowSeconds(directive, dispatch);
  const lastUsedAt = current.directives[directive.id] ?? 0;
  const remainingMs = lastUsedAt > 0 ? Math.max(0, lastUsedAt + cooldownMs - now) : 0;

  if (remainingMs > 0) {
    return {
      activated: false,
      reason: "cooldown",
      directive,
      state: current,
      remainingSeconds: Math.ceil(remainingMs / 1000),
      notice:
        directive.name +
        "冷却中，还需 " +
        formatDuration(remainingMs / 1000) +
        "。"
    };
  }

  const production = getEffectiveProduction(current);
  const baseGain = roundTo(Math.max(0, directive.getGain(current, production)), 4);
  const mastery = getDirectiveMastery(current, now);
  const masteryBonus = getDirectiveMasteryBonus(baseGain, mastery);
  const effectiveBaseGain = roundTo(baseGain + masteryBonus, 4);
  const plan = getDirectivePlan(current, now);
  const planReward = getDirectivePlanReward(effectiveBaseGain, plan, directive.id);
  const chain = getDirectiveChainForUse(current, directive.id, now);
  const taskReward = getDirectiveTaskReward(effectiveBaseGain, plan, directive.id, chain);
  const dispatchReward = getFarRouteDispatchReward(effectiveBaseGain, dispatch, directive.id);
  const dispatchRelayReward = getFarRouteDispatchRelayReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchSyncReward = getFarRouteDispatchSyncReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchSyncSupply = getFarRouteDispatchSyncSupply(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchDetourReward = getFarRouteDispatchDetourReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchBranchShiftReward = getFarRouteDispatchBranchShiftReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchBranchStabilityReward = getFarRouteDispatchBranchStabilityReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchBranchFocusReward = getFarRouteDispatchBranchFocusReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchBranchRotationReward = getFarRouteDispatchBranchRotationReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchFocusLoopReward = getFarRouteDispatchFocusLoopReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchLoopReward = getFarRouteDispatchLoopReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain
  );
  const dispatchBreakthroughReward = getFarRouteDispatchBreakthroughReward(
    dispatch,
    directive.id,
    chain
  );
  const dispatchDetourBreakthroughReward =
    getFarRouteDispatchDetourBreakthroughReward(
      dispatch,
      directive.id,
      chain,
      current,
      now
    );
  const dispatchDetourInfusion = getFarRouteDispatchDetourInfusion(
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchPrepReward = getFarRouteDispatchPrepReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchDetourPrepReward = getFarRouteDispatchDetourPrepReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchReturnReward = getFarRouteDispatchReturnReward(
    effectiveBaseGain,
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const dispatchRefresh = getFarRouteDispatchRefresh(
    dispatch,
    directive.id,
    chain,
    current,
    now
  );
  const rotationReward = getDirectiveRotationReward(effectiveBaseGain, chain);
  const masteryCapstoneReward = getDirectiveMasteryCapstoneReward(
    effectiveBaseGain,
    mastery,
    chain
  );
  const stanceBonusRate = getDirectiveStanceBonusRate(production.routeStance, directive);
  const stanceFinisherReward = getDirectiveStanceFinisherReward(
    effectiveBaseGain,
    chain,
    stanceBonusRate
  );
  const preStanceGain = roundTo(
    effectiveBaseGain * chain.multiplier +
      planReward +
      taskReward +
      dispatchReward +
      dispatchRelayReward +
      dispatchSyncReward +
      dispatchDetourReward +
      dispatchBranchShiftReward +
      dispatchBranchStabilityReward +
      dispatchBranchFocusReward +
      dispatchBranchRotationReward +
      dispatchFocusLoopReward +
      dispatchLoopReward +
      dispatchBreakthroughReward +
      dispatchDetourBreakthroughReward +
      dispatchPrepReward +
      dispatchDetourPrepReward +
      dispatchReturnReward +
      rotationReward +
      masteryCapstoneReward +
      stanceFinisherReward,
    4
  );
  const stanceBonus = roundTo(preStanceGain * stanceBonusRate, 4);
  const gain = roundTo(preStanceGain + stanceBonus, 4);
  const energyAfterDetourInfusion = Math.max(
    0,
    current.energy - dispatchDetourInfusion.cost
  );
  const masteryReward = getNextDirectiveMastery(mastery, chain, now);
  const nextDirectives = {
    ...current.directives,
    [directive.id]: now
  };
  if (dispatchRefresh) {
    nextDirectives[dispatchRefresh.directiveId] = 0;
  }
  const nextFarRouteLastBranchDirectiveId = getNextFarRouteDispatchBranchDirectiveId(
    current,
    dispatch,
    directive.id,
    chain,
    now
  );
  const nextFarRouteBranchRotationDirectiveId =
    getNextFarRouteDispatchBranchRotationDirectiveId(
      current,
      dispatch,
      directive.id,
      chain,
      now
    );
  const nextState = {
    ...current,
    energy: energyAfterDetourInfusion + gain + dispatchSyncSupply,
    totalEnergy: current.totalEnergy + gain + dispatchDetourInfusion.progress,
    directives: nextDirectives,
    farRouteLastBranchDirectiveId: nextFarRouteLastBranchDirectiveId,
    farRouteBranchRotationDirectiveId: nextFarRouteBranchRotationDirectiveId,
    directiveChain: {
      lastDirectiveId: directive.id,
      stacks: chain.stacks,
      expiresAt: now + chainWindowSeconds * 1000
    },
    directiveMastery: masteryReward.mastery,
    lastGain: gain,
    lastPulse: directive.name
  };
  const masteryBonusText = formatDirectiveMasteryBonus(mastery);
  const planRewardText = formatDirectivePlanReward(planReward);
  const taskRewardText = formatDirectiveTaskReward(taskReward);
  const dispatchRewardText = formatFarRouteDispatchReward(dispatchReward);
  const dispatchRelayRewardText = formatFarRouteDispatchRelayReward(dispatchRelayReward);
  const dispatchSyncRewardText = formatFarRouteDispatchSyncReward(dispatchSyncReward);
  const dispatchSyncSupplyText = formatFarRouteDispatchSyncSupply(dispatchSyncSupply);
  const dispatchDetourRewardText =
    formatFarRouteDispatchDetourReward(dispatchDetourReward);
  const dispatchBranchShiftRewardText =
    formatFarRouteDispatchBranchShiftReward(dispatchBranchShiftReward);
  const dispatchBranchStabilityRewardText =
    formatFarRouteDispatchBranchStabilityReward(dispatchBranchStabilityReward);
  const dispatchBranchFocusRewardText =
    formatFarRouteDispatchBranchFocusReward(dispatchBranchFocusReward);
  const dispatchBranchRotationRewardText =
    formatFarRouteDispatchBranchRotationReward(dispatchBranchRotationReward);
  const dispatchFocusLoopRewardText =
    formatFarRouteDispatchFocusLoopReward(dispatchFocusLoopReward);
  const dispatchLoopRewardText = formatFarRouteDispatchLoopReward(dispatchLoopReward);
  const dispatchBreakthroughRewardText =
    formatFarRouteDispatchBreakthroughReward(dispatchBreakthroughReward);
  const dispatchDetourBreakthroughRewardText =
    formatFarRouteDispatchDetourBreakthroughReward(
      dispatchDetourBreakthroughReward
    );
  const dispatchDetourInfusionText =
    formatFarRouteDispatchDetourInfusion(dispatchDetourInfusion);
  const dispatchPrepRewardText = formatFarRouteDispatchPrepReward(dispatchPrepReward);
  const dispatchDetourPrepRewardText =
    formatFarRouteDispatchDetourPrepReward(dispatchDetourPrepReward);
  const dispatchReturnRewardText =
    formatFarRouteDispatchReturnReward(dispatchReturnReward);
  const dispatchRefreshText = formatFarRouteDispatchRefresh(dispatchRefresh);
  const dispatchCooldownText = formatFarRouteDispatchCooldown(dispatch, directive);
  const dispatchChainWindowText = formatFarRouteDispatchChainWindow(dispatch, directive);
  const dispatchRouteStepText = getFarRouteDispatchRouteStepText(
    dispatch,
    directive.id,
    current
  );
  const dispatchRouteStepNotice =
    formatFarRouteDispatchRouteStepNotice(dispatchRouteStepText);
  const dispatchRouteResultText = getFarRouteDispatchRouteResultText(
    dispatch,
    directive.id,
    current
  );
  const chainText = formatDirectiveChainBonus(chain);
  const rotationRewardText = formatDirectiveRotationReward(rotationReward);
  const masteryCapstoneText =
    formatDirectiveMasteryCapstoneReward(masteryCapstoneReward);
  const stanceFinisherText = formatDirectiveStanceFinisherReward(stanceFinisherReward);
  const stanceBonusText = formatDirectiveStanceBonus(stanceBonusRate);
  const masteryRewardText = formatDirectiveMasteryReward(masteryReward);

  return {
    activated: true,
    directive,
    baseGain,
    effectiveBaseGain,
    gain,
    masteryBonus,
    masteryBonusRate: mastery.bonusRate,
    masteryStacks: mastery.stacks,
    planReward,
    planBonusRate: DIRECTIVE_PLAN_BONUS_RATE,
    taskReward,
    taskRewardRate: DIRECTIVE_TASK_REWARD_RATE,
    dispatchReward,
    dispatchRewardRate: FAR_ROUTE_DISPATCH_BONUS_RATE,
    dispatchRelayReward,
    dispatchRelayRewardRate: FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE,
    dispatchRelayRewardText,
    dispatchSyncReward,
    dispatchSyncRewardRate: FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE,
    dispatchSyncRewardText,
    dispatchSyncSupply,
    dispatchSyncSupplyRate: FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE,
    dispatchSyncSupplyText,
    dispatchDetourReward,
    dispatchDetourRewardRate: FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE,
    dispatchDetourRewardText,
    dispatchBranchShiftReward,
    dispatchBranchShiftRewardRate: FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE,
    dispatchBranchShiftRewardText,
    dispatchBranchStabilityReward,
    dispatchBranchStabilityRewardRate:
      FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE,
    dispatchBranchStabilityRewardText,
    dispatchBranchFocusReward,
    dispatchBranchFocusRewardRate: FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE,
    dispatchBranchFocusRewardText,
    dispatchBranchRotationReward,
    dispatchBranchRotationRewardRate: FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE,
    dispatchBranchRotationRewardText,
    dispatchFocusLoopReward,
    dispatchFocusLoopRewardRate: FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE,
    dispatchFocusLoopRewardText,
    dispatchLoopReward,
    dispatchLoopRewardRate: FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE,
    dispatchBreakthroughReward,
    dispatchBreakthroughRewardRate: FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE,
    dispatchBreakthroughRewardText,
    dispatchDetourBreakthroughReward,
    dispatchDetourBreakthroughRewardRate:
      FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE,
    dispatchDetourBreakthroughRewardText,
    dispatchDetourInfusionCost: dispatchDetourInfusion.cost,
    dispatchDetourInfusionProgress: dispatchDetourInfusion.progress,
    dispatchDetourInfusionCostRate: FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE,
    dispatchDetourInfusionProgressMultiplier:
      FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER,
    dispatchDetourInfusionText,
    dispatchPrepReward,
    dispatchPrepRewardRate: FAR_ROUTE_DISPATCH_PREP_REWARD_RATE,
    dispatchPrepRewardText,
    dispatchDetourPrepReward,
    dispatchDetourPrepRewardRate: FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE,
    dispatchDetourPrepRewardText,
    dispatchReturnReward,
    dispatchReturnRewardRate: FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE,
    dispatchReturnRewardText,
    dispatchCooldownMultiplier: getDirectiveCooldownMultiplier(directive, dispatch),
    dispatchCooldownText,
    dispatchChainWindowSeconds: chainWindowSeconds,
    dispatchChainWindowText,
    dispatchRouteStepText,
    dispatchRouteResultText,
    dispatchRefreshDirectiveId: dispatchRefresh?.directiveId ?? null,
    dispatchRefreshDirectiveName: dispatchRefresh?.directiveName ?? "",
    dispatchRefreshText,
    masteryRewardGained: masteryReward.gained,
    masteryRewardStacks: masteryReward.mastery.stacks,
    rotationReward,
    masteryCapstoneReward,
    masteryCapstoneRate: DIRECTIVE_MASTERY_CAPSTONE_RATE,
    stanceFinisherReward,
    stanceBonus,
    stanceBonusRate,
    chainStacks: chain.stacks,
    chainMultiplier: chain.multiplier,
    masteryBonusText,
    planRewardText,
    taskRewardText,
    dispatchRewardText,
    dispatchRelayRewardText,
    dispatchSyncRewardText,
    dispatchSyncSupplyText,
    dispatchDetourRewardText,
    dispatchBranchShiftRewardText,
    dispatchBranchStabilityRewardText,
    dispatchBranchFocusRewardText,
    dispatchBranchRotationRewardText,
    dispatchLoopRewardText,
    dispatchBreakthroughRewardText,
    dispatchDetourBreakthroughRewardText,
    dispatchDetourInfusionText,
    dispatchPrepRewardText,
    dispatchDetourPrepRewardText,
    dispatchReturnRewardText,
    chainBonusText: chainText,
    rotationRewardText,
    masteryCapstoneText,
    stanceFinisherText,
    stanceBonusText,
    masteryRewardText,
    state: nextState,
    notice:
      "已执行" +
      directive.name +
      "，" +
      (masteryBonusText ? masteryBonusText + "，" : "") +
      (planRewardText ? planRewardText + "，" : "") +
      (taskRewardText ? taskRewardText + "，" : "") +
      (dispatchRewardText ? dispatchRewardText + "，" : "") +
      (dispatchRelayRewardText ? dispatchRelayRewardText + "，" : "") +
      (dispatchSyncRewardText ? dispatchSyncRewardText + "，" : "") +
      (dispatchSyncSupplyText ? dispatchSyncSupplyText + "，" : "") +
      (dispatchDetourRewardText ? dispatchDetourRewardText + "，" : "") +
      (dispatchBranchShiftRewardText ? dispatchBranchShiftRewardText + "，" : "") +
      (dispatchBranchStabilityRewardText
        ? dispatchBranchStabilityRewardText + "，"
        : "") +
      (dispatchBranchFocusRewardText ? dispatchBranchFocusRewardText + "，" : "") +
      (dispatchBranchRotationRewardText ? dispatchBranchRotationRewardText + "，" : "") +
      (dispatchFocusLoopRewardText ? dispatchFocusLoopRewardText + "，" : "") +
      (dispatchLoopRewardText ? dispatchLoopRewardText + "，" : "") +
      (dispatchBreakthroughRewardText ? dispatchBreakthroughRewardText + "，" : "") +
      (dispatchDetourBreakthroughRewardText
        ? dispatchDetourBreakthroughRewardText + "，"
        : "") +
      (dispatchDetourInfusionText ? dispatchDetourInfusionText + "，" : "") +
      (dispatchPrepRewardText ? dispatchPrepRewardText + "，" : "") +
      (dispatchDetourPrepRewardText ? dispatchDetourPrepRewardText + "，" : "") +
      (dispatchReturnRewardText ? dispatchReturnRewardText + "，" : "") +
      (dispatchRefreshText ? dispatchRefreshText + "，" : "") +
      (dispatchCooldownText ? dispatchCooldownText + "，" : "") +
      (dispatchChainWindowText ? dispatchChainWindowText + "，" : "") +
      (dispatchRouteStepNotice ? dispatchRouteStepNotice + "，" : "") +
      (dispatchRouteResultText ? dispatchRouteResultText + "，" : "") +
      (chainText ? chainText + "，" : "") +
      (rotationRewardText ? rotationRewardText + "，" : "") +
      (masteryCapstoneText ? masteryCapstoneText + "，" : "") +
      (stanceFinisherText ? stanceFinisherText + "，" : "") +
      (stanceBonusText ? stanceBonusText + "，" : "") +
      (masteryRewardText ? masteryRewardText + "，" : "") +
      "+" +
      formatNumber(gain) +
      " 能量。"
  };
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

export function getCoreRewardPreview(state, now = Date.now()) {
  const current = normalizeState(state, now);
  const combo = getComboStatus(current, now);
  const production = getEffectiveProduction(current);
  const isOverloadReady = combo.remaining === 1 && !combo.overloaded;
  const nextGain = roundTo(
    production.perClick + (isOverloadReady ? production.overloadBonus : 0),
    4
  );
  const text = isOverloadReady
    ? "下一击 +" +
      formatNumber(nextGain) +
      " · 触发过载 +" +
      formatNumber(production.overloadBonus)
    : combo.overloaded
      ? "下一击 +" + formatNumber(production.perClick) + " · 新一轮过载蓄能"
      : "下一击 +" +
        formatNumber(production.perClick) +
        " · 再 " +
        combo.remaining +
        " 次过载 +" +
        formatNumber(production.overloadBonus);

  return {
    nextGain,
    overloadBonus: production.overloadBonus,
    text,
    isOverloadReady,
    isOverloadHit: combo.overloaded
  };
}

export function getProjectStatuses(state) {
  const current = normalizeState(state);
  const segmentTotal = PROJECT_DEFS.length;

  const statuses = PROJECT_DEFS.map((project, index) => {
    const currentValue = Math.max(0, project.current(current));
    const target = Math.max(1, project.target);
    const remaining = Math.max(0, target - currentValue);
    const progress = Math.min(1, currentValue / target);
    const completed = remaining <= 0;
    const segmentIndex = index + 1;

    return {
      ...project,
      segmentIndex,
      segmentTotal,
      segmentText: buildProjectSegmentText(segmentIndex, segmentTotal),
      ...getProjectChapterInfo(project.id),
      currentValue,
      remaining,
      progress,
      completed,
      progressText: buildProjectProgressText(project, currentValue, target, remaining),
      tagText: buildProjectTagText(project)
    };
  });
  const currentIndex = statuses.findIndex((project) => !project.completed);

  return statuses.map((project, index) => {
    const isCurrent = index === currentIndex;
    const dispatchInfo = buildProjectDispatchInfo(project, current, isCurrent);

    return {
      ...project,
      isCurrent,
      statusText: project.completed ? "已完成" : isCurrent ? "当前航段" : "待推进",
      dispatchBadgeText: dispatchInfo?.badgeText ?? "",
      dispatchText: dispatchInfo?.detailText ?? "",
      dispatchTargetDirectiveId: dispatchInfo?.targetDirectiveId ?? null,
      dispatchTargetDirectiveName: dispatchInfo?.targetDirectiveName ?? "",
      dispatchRelayDirectiveId: dispatchInfo?.relayDirectiveId ?? null,
      dispatchRelayDirectiveName: dispatchInfo?.relayDirectiveName ?? "",
      dispatchDetourDirectiveId: dispatchInfo?.detourDirectiveId ?? null,
      dispatchDetourDirectiveName: dispatchInfo?.detourDirectiveName ?? "",
      dispatchSteps: dispatchInfo?.steps ?? [],
      dispatchStepText: dispatchInfo?.stepText ?? ""
    };
  });
}

export function filterProjectStatuses(projects, filterId = DEFAULT_PROJECT_FILTER_ID) {
  const filterDef = getProjectFilterDef(filterId);
  const filter = filterDef.id;
  const items = Array.isArray(projects) ? projects : [];

  if (filter === "current") {
    return items.filter((project) => project.isCurrent);
  }
  if (filter === "current-chapter") {
    const currentProject = items.find((project) => project.isCurrent);
    return currentProject
      ? items.filter((project) => project.chapterName === currentProject.chapterName)
      : [];
  }
  if (filterDef.chapterName) {
    return items.filter((project) => project.chapterName === filterDef.chapterName);
  }
  if (PROJECT_REWARD_FILTER_EFFECTS[filter]) {
    const effectKey = PROJECT_REWARD_FILTER_EFFECTS[filter];
    return items.filter((project) => Boolean(project.effect?.[effectKey]));
  }
  if (filter === "energy-track") {
    return items.filter((project) => !project.upgradeId);
  }
  if (filter === "upgrade-track") {
    return items.filter((project) => Boolean(project.upgradeId));
  }
  if (filter === "incomplete") {
    return items.filter((project) => !project.completed);
  }
  if (filter === "completed") {
    return items.filter((project) => project.completed);
  }

  return items;
}

export function getProjectListWindow(projects, limit = PROJECT_LIST_PREVIEW_LIMIT) {
  const items = Array.isArray(projects) ? projects : [];
  const safeLimit = Math.max(1, Math.floor(Number(limit) || PROJECT_LIST_PREVIEW_LIMIT));

  if (items.length <= safeLimit) {
    return {
      visibleProjects: items,
      collapsedProjects: [],
      summaryText: ""
    };
  }

  const currentIndex = items.findIndex((project) => project.isCurrent);
  let startIndex = currentIndex >= 0 ? currentIndex : 0;

  if (startIndex + safeLimit > items.length) {
    startIndex = Math.max(0, items.length - safeLimit);
  }

  const endIndex = Math.min(items.length, startIndex + safeLimit);
  const visibleProjects = items.slice(startIndex, endIndex);
  const collapsedProjects = [
    ...items.slice(0, startIndex),
    ...items.slice(endIndex)
  ];

  return {
    visibleProjects,
    collapsedProjects,
    summaryText:
      "已收起 " +
      collapsedProjects.length +
      " 段 · 当前显示 " +
      (startIndex + 1) +
      "-" +
      endIndex +
      "/" +
      items.length
  };
}

export function getProjectFilterSummary(projects, filterId = DEFAULT_PROJECT_FILTER_ID) {
  const filter = getProjectFilterDef(filterId);
  const visibleProjects = filterProjectStatuses(projects, filter.id);

  if (!visibleProjects.length) {
    return "筛选视图：" + filter.name + " 0 段 · 没有匹配航段";
  }

  const completed = visibleProjects.filter((project) => project.completed).length;
  const nextProject = visibleProjects.find((project) => !project.completed);

  if (!nextProject) {
    return (
      "筛选视图：" +
      filter.name +
      " " +
      visibleProjects.length +
      " 段 · 全部已完成" +
      formatProjectFilterCompletion(completed, visibleProjects.length) +
      formatProjectFilterStatusMix(visibleProjects) +
      formatProjectFilterRewardMix(visibleProjects) +
      formatProjectFilterTrackMix(visibleProjects) +
      formatProjectFilterChapterMix(visibleProjects) +
      formatProjectFilterClaimedRewardMix(visibleProjects) +
      formatProjectFilterPendingRewardMix(visibleProjects)
    );
  }

  return (
    "筛选视图：" +
    filter.name +
    " " +
    visibleProjects.length +
    " 段 · 已完成 " +
    completed +
    "/" +
    visibleProjects.length +
    formatProjectFilterCompletion(completed, visibleProjects.length) +
    formatProjectFilterStatusMix(visibleProjects) +
    formatProjectFilterRewardMix(visibleProjects) +
    formatProjectFilterTrackMix(visibleProjects) +
    formatProjectFilterChapterMix(visibleProjects) +
    formatProjectFilterClaimedRewardMix(visibleProjects) +
    formatProjectFilterPendingRewardMix(visibleProjects) +
    " · 下一条 " +
    formatProjectFilterProjectLabel(nextProject) +
    "（" +
    nextProject.reward +
    " · " +
    nextProject.progressText +
    "）" +
    formatProjectFilterPreview(visibleProjects) +
    formatProjectFilterEndpoint(visibleProjects)
  );
}

export function getProjectFilterBrief(projects, filterId = DEFAULT_PROJECT_FILTER_ID) {
  const filter = getProjectFilterDef(filterId);
  const visibleProjects = filterProjectStatuses(projects, filter.id);

  if (!visibleProjects.length) {
    return "筛选摘要：" + filter.name + " 0 段 · 无匹配";
  }

  const completed = visibleProjects.filter((project) => project.completed).length;
  const remaining = visibleProjects.length - completed;
  const nextProject = visibleProjects.find((project) => !project.completed);

  if (!nextProject) {
    return "筛选摘要：" + filter.name + " " + visibleProjects.length + " 段 · 全部已完成";
  }

  return (
    "筛选摘要：" +
    filter.name +
    " " +
    completed +
    "/" +
    visibleProjects.length +
    " · 下一条 " +
    formatProjectFilterBriefProjectLabel(nextProject) +
    " · 剩余 " +
    remaining +
    " 段"
  );
}

export function getProjectFilterButtonText(projects, filterId = DEFAULT_PROJECT_FILTER_ID) {
  const filter = getProjectFilterDef(filterId);
  const visibleProjects = filterProjectStatuses(projects, filter.id);

  if (
    !visibleProjects.length ||
    filter.id === "current" ||
    filter.id === "incomplete" ||
    filter.id === "completed"
  ) {
    return filter.name + " " + visibleProjects.length;
  }

  const completed = visibleProjects.filter((project) => project.completed).length;
  return filter.name + " " + completed + "/" + visibleProjects.length;
}

export function getProjectVisualMap(projects, filterId = DEFAULT_PROJECT_FILTER_ID) {
  const filter = getProjectFilterDef(filterId);
  const items = Array.isArray(projects) ? projects : [];
  const visibleProjectIds = new Set(
    filterProjectStatuses(items, filter.id).map((project) => project.id)
  );
  const completed = items.filter((project) => project.completed).length;
  const currentProject = items.find((project) => project.isCurrent) ?? null;
  const currentText = currentProject
    ? formatProjectFilterProjectLabel(currentProject)
    : "全部航段已完成";

  return {
    summaryText: "星图视觉 " + completed + "/" + items.length + " · 当前 " + currentText,
    filterText: "高亮：" + filter.name + " " + visibleProjectIds.size + " 段",
    nodes: items.map((project) => ({
      id: project.id,
      label: formatProjectFilterProjectLabel(project),
      title:
        formatProjectFilterProjectLabel(project) +
        " · " +
        project.statusText +
        " · " +
        project.reward,
      status: project.completed ? "completed" : project.isCurrent ? "current" : "pending",
      selected: visibleProjectIds.has(project.id),
      chapterName: project.chapterName
    }))
  };
}

export function getProjectChapterVisuals(projects) {
  const items = Array.isArray(projects) ? projects : [];

  return PROJECT_CHAPTER_DEFS.map((chapter) => {
    const chapterProjects = getChapterProjects(items, chapter);
    const completed = chapterProjects.filter((project) => project.completed).length;
    const total = chapterProjects.length;
    const nextProject = chapterProjects.find((project) => !project.completed) ?? null;
    const isCurrent = chapterProjects.some((project) => project.isCurrent);
    const filterId =
      PROJECT_FILTER_DEFS.find((filter) => filter.chapterName === chapter.name)?.id ??
      DEFAULT_PROJECT_FILTER_ID;
    const nextText = nextProject
      ? "下一条 " + nextProject.chapterIndex + "/" + nextProject.chapterTotal + " " + nextProject.name
      : "已完成";
    const status =
      total > 0 && completed === total
        ? "completed"
        : isCurrent
          ? "current"
          : completed > 0
            ? "active"
            : "pending";

    return {
      id: chapter.name,
      name: chapter.name,
      filterId,
      completed,
      total,
      progress: total > 0 ? completed / total : 0,
      progressText: completed + "/" + total,
      visualClass: chapter.visualClass,
      focusText: chapter.focusText,
      nextText,
      status,
      heroNodes: getProjectChapterHeroNodes(chapterProjects),
      title: chapter.name + " " + completed + "/" + total + " · " + nextText
    };
  });
}

function getProjectChapterHeroNodes(
  chapterProjects,
  limit = PROJECT_CHAPTER_HERO_NODE_LIMIT
) {
  const projects = Array.isArray(chapterProjects) ? chapterProjects : [];
  const total = projects.length;
  if (total === 0) {
    return [];
  }

  const nodeCount = Math.min(total, Math.max(1, Math.floor(Number(limit) || 1)));
  return Array.from({ length: nodeCount }, (_, index) => {
    const startIndex = Math.floor((index * total) / nodeCount);
    const endIndex = Math.max(
      startIndex,
      Math.floor(((index + 1) * total) / nodeCount) - 1
    );
    const segmentProjects = projects.slice(startIndex, endIndex + 1);
    const currentProject = segmentProjects.find((project) => project.isCurrent);
    const completedCount = segmentProjects.filter((project) => project.completed).length;
    const firstProject = segmentProjects[0];
    const lastProject = segmentProjects[segmentProjects.length - 1] ?? firstProject;
    const status = currentProject
      ? "current"
      : completedCount === segmentProjects.length
        ? "completed"
        : completedCount > 0
          ? "active"
          : "pending";
    const label =
      firstProject === lastProject
        ? firstProject.chapterIndex + "/" + firstProject.chapterTotal + " " + firstProject.name
        : firstProject.chapterIndex +
          "-" +
          lastProject.chapterIndex +
          "/" +
          firstProject.chapterTotal;

    return {
      status,
      label,
      title:
        label +
        " · " +
        (currentProject?.name ?? firstProject.name) +
        " · " +
        formatProjectChapterHeroNodeStatus(status)
    };
  });
}

function formatProjectChapterHeroNodeStatus(status) {
  if (status === "completed") {
    return "已完成";
  }
  if (status === "current") {
    return "当前";
  }
  if (status === "active") {
    return "部分完成";
  }
  return "待推进";
}

export function getProjectRewardVisuals(projects) {
  const items = Array.isArray(projects) ? projects : [];

  return PROJECT_REWARD_SUMMARY_DEFS.map(([label, effectKey, id]) => {
    const rewardProjects = items.filter((project) =>
      Boolean(project.effect?.[effectKey])
    );
    const completed = rewardProjects.filter((project) => project.completed).length;
    const total = rewardProjects.length;
    const nextProject = rewardProjects.find((project) => !project.completed) ?? null;
    const nextText = nextProject
      ? "下一条 " +
        nextProject.segmentIndex +
        "/" +
        nextProject.segmentTotal +
        " " +
        nextProject.name
      : "已完成";
    const status =
      total > 0 && completed === total
        ? "completed"
        : nextProject?.isCurrent
          ? "current"
          : completed > 0
            ? "active"
            : "pending";

    return {
      id,
      label,
      completed,
      total,
      progress: total > 0 ? completed / total : 0,
      progressText: completed + "/" + total,
      nextText,
      status,
      title: label + "奖励 " + completed + "/" + total + " · " + nextText
    };
  });
}

export function getProjectForecastVisuals(projects) {
  const items = Array.isArray(projects) ? projects : [];

  return items
    .filter((project) => !project.completed)
    .slice(0, 3)
    .map((project, index) => {
      const rewardId = getProjectRewardVisualId(project);
      const trackId = project.upgradeId ? "upgrade" : "energy";

      return {
        id: project.id,
        name: project.name,
        segmentText: project.segmentText,
        chapterText: project.chapterText,
        reward: project.reward,
        rewardId,
        trackId,
        progress: project.progress,
        progressText: project.progressText,
        status: project.isCurrent ? "current" : "pending",
        title:
          "航线预告 " +
          (index + 1) +
          "：" +
          project.segmentText +
          " · " +
          project.chapterText +
          " " +
          project.name +
          " · " +
          project.reward +
          " · " +
          project.progressText
      };
    });
}

export function getProjectCurrentVisual(projects) {
  const items = Array.isArray(projects) ? projects : [];
  const project = items.find((item) => !item.completed) ?? null;

  if (!project) {
    return null;
  }

  const rewardId = getProjectRewardVisualId(project);
  const trackId = project.upgradeId ? "upgrade" : "energy";
  const trackText = project.upgradeId ? "升级航段" : "累计航段";

  return {
    id: project.id,
    name: project.name,
    segmentText: project.segmentText,
    chapterText: project.chapterText,
    reward: project.reward,
    rewardId,
    trackId,
    trackText,
    progress: project.progress,
    progressText: project.progressText,
    status: project.isCurrent ? "current" : "pending",
    title:
      "当前航段：" +
      project.segmentText +
      " · " +
      project.chapterText +
      " " +
      project.name +
      " · " +
      trackText +
      " · " +
      project.reward +
      " · " +
      project.progressText
  };
}

export function getProjectOverview(state, now = Date.now()) {
  const current = normalizeState(state, now);
  const projects = getProjectStatuses(current);
  const completed = projects.filter((project) => project.completed).length;
  const nextProject = projects.find((project) => !project.completed) ?? null;
  const bonusText = buildProjectBonusText(getProjectBonusesFromStatuses(projects));
  const compositionText = buildProjectCompositionText(projects);
  const chapterText = buildProjectChapterText(projects, nextProject);
  const chapterTargetText = buildProjectChapterTargetText(projects);
  const chapterRewardText = buildProjectChapterRewardText(projects);
  const rewardProgressText = buildProjectRewardProgressText(projects);
  const rewardTargetText = buildProjectRewardTargetText(projects);
  const milestoneText = buildProjectMilestoneText(projects, nextProject);
  const routeFocusText = buildProjectRouteFocusText(projects, current);
  const rewardVisuals = getProjectRewardVisuals(projects);
  const forecastVisuals = getProjectForecastVisuals(projects);
  const currentVisual = getProjectCurrentVisual(projects);
  const dispatchText = buildProjectOverviewDispatchText(
    getFarRouteDispatch(current, now)
  );

  if (!nextProject) {
    return {
      completed,
      total: projects.length,
      nextProjectId: null,
      upcomingProjectIds: [],
      summaryText: "星图进度 " + completed + "/" + projects.length + " · 全部航段已完成",
      detailText: "所有星图奖励已生效，继续累计能量等待下一段航线。",
      trackText: buildProjectTrackText(projects),
      chapterText,
      chapterTargetText,
      chapterRewardText,
      rewardProgressText,
      rewardTargetText,
      milestoneText,
      routeFocusText,
      compositionText,
      bonusText,
      rewardVisuals,
      forecastVisuals,
      currentVisual,
      dispatchText,
      actionText: buildProjectActionText(null, current),
      forecastText: buildProjectForecastBriefText([]),
      forecastDetailText: buildProjectForecastDetailText([])
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
      " · 下一段 " +
      nextProject.segmentIndex +
      "/" +
      nextProject.segmentTotal +
      "：" +
      nextProject.name +
      " · 奖励 " +
      nextProject.reward,
    detailText: nextProject.progressText,
    trackText: buildProjectTrackText(projects),
    chapterText,
    chapterTargetText,
    chapterRewardText,
    rewardProgressText,
    rewardTargetText,
    milestoneText,
    routeFocusText,
    compositionText,
    bonusText,
    rewardVisuals,
    forecastVisuals,
    currentVisual,
    dispatchText,
    actionText: buildProjectActionText(nextProject, current),
    forecastText: buildProjectForecastBriefText(upcomingProjects),
    forecastDetailText: buildProjectForecastDetailText(upcomingProjects)
  };
}

export function getProjectBonuses(state) {
  return getProjectBonusesFromStatuses(getProjectStatuses(state));
}

export function getRouteStanceStatus(state) {
  const current = normalizeState(state);
  const unlocked = current.totalEnergy >= PROJECT_GOAL_UNLOCK_ENERGY;
  const activeId = getValidRouteStanceId(current.routeStance);
  const active = getRouteStanceDef(activeId);
  const projects = getProjectStatuses(current);

  return {
    unlocked,
    activeId,
    active,
    unlockText: unlocked ? "航线策略已解锁" : "累计 100K 能量后解锁航线策略",
    options: ROUTE_STANCE_DEFS.map((option) => ({
      ...option,
      masteryText: buildRouteStanceMasteryText(option, projects),
      selected: option.id === activeId,
      disabled: !unlocked
    }))
  };
}

export function getDirectiveStatus(state, now = Date.now()) {
  const current = normalizeState(state, now);
  const unlocked = current.totalEnergy >= DIRECTIVE_UNLOCK_ENERGY;
  const production = getEffectiveProduction(current);
  const unlockText = unlocked ? "航线指令已解锁" : "累计 100K 能量后解锁航线指令";
  const plan = getDirectivePlan(current, now);
  const dispatch = getFarRouteDispatch(current, now);
  const recommendedIds = new Set(plan.nextDirectiveIds ?? []);
  const mastery = getDirectiveMastery(current, now);
  const masteryBonusText = formatDirectiveMasteryBonus(mastery);
  const recommendationText = plan.recommendationText ?? "轮换推荐";
  const waitingRecommendationText = plan.waitingRecommendationText ?? "等待轮换";

  return {
    unlocked,
    unlockText,
    plan,
    task: getDirectiveTaskStatus(current, now),
    dispatch,
    options: DIRECTIVE_DEFS.map((directive) => {
      const cooldownMs = directive.cooldownSeconds * 1000;
      const effectiveCooldownMs = getDirectiveCooldownMs(directive, dispatch);
      const lastUsedAt = current.directives[directive.id] ?? 0;
      const remainingMs = unlocked
        ? lastUsedAt > 0
          ? Math.max(0, lastUsedAt + effectiveCooldownMs - now)
          : 0
        : cooldownMs;
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const cooldownProgress = unlocked
        ? remainingMs <= 0 || effectiveCooldownMs <= 0
          ? 1
          : roundTo(1 - remainingMs / effectiveCooldownMs, 4)
        : 0;
      const baseGain = roundTo(Math.max(0, directive.getGain(current, production)), 4);
      const masteryBonus = getDirectiveMasteryBonus(baseGain, mastery);
      const effectiveBaseGain = roundTo(baseGain + masteryBonus, 4);
      const chain = getDirectiveChainForUse(current, directive.id, now);
      const planReward = getDirectivePlanReward(effectiveBaseGain, plan, directive.id);
      const taskReward = getDirectiveTaskReward(effectiveBaseGain, plan, directive.id, chain);
      const dispatchReward = getFarRouteDispatchReward(
        effectiveBaseGain,
        dispatch,
        directive.id
      );
      const dispatchRelayReward = getFarRouteDispatchRelayReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchSyncReward = getFarRouteDispatchSyncReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchSyncSupply = getFarRouteDispatchSyncSupply(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchDetourReward = getFarRouteDispatchDetourReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchBranchShiftReward = getFarRouteDispatchBranchShiftReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchBranchStabilityReward = getFarRouteDispatchBranchStabilityReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchBranchFocusReward = getFarRouteDispatchBranchFocusReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchBranchRotationReward = getFarRouteDispatchBranchRotationReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchFocusLoopReward = getFarRouteDispatchFocusLoopReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchLoopReward = getFarRouteDispatchLoopReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain
      );
      const dispatchBreakthroughReward = getFarRouteDispatchBreakthroughReward(
        dispatch,
        directive.id,
        chain
      );
      const dispatchDetourBreakthroughReward =
        getFarRouteDispatchDetourBreakthroughReward(
          dispatch,
          directive.id,
          chain,
          current,
          now
        );
      const dispatchDetourInfusion = getFarRouteDispatchDetourInfusion(
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchPrepReward = getFarRouteDispatchPrepReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchDetourPrepReward = getFarRouteDispatchDetourPrepReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchReturnReward = getFarRouteDispatchReturnReward(
        effectiveBaseGain,
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const dispatchRefresh = getFarRouteDispatchRefresh(
        dispatch,
        directive.id,
        chain,
        current,
        now
      );
      const rotationReward = getDirectiveRotationReward(effectiveBaseGain, chain);
      const masteryCapstoneReward = getDirectiveMasteryCapstoneReward(
        effectiveBaseGain,
        mastery,
        chain
      );
      const stanceBonusRate = getDirectiveStanceBonusRate(production.routeStance, directive);
      const stanceFinisherReward = getDirectiveStanceFinisherReward(
        effectiveBaseGain,
        chain,
        stanceBonusRate
      );
      const preStanceGain = roundTo(
        effectiveBaseGain * chain.multiplier +
          planReward +
          taskReward +
          dispatchReward +
          dispatchRelayReward +
          dispatchSyncReward +
          dispatchDetourReward +
          dispatchBranchShiftReward +
          dispatchBranchStabilityReward +
          dispatchBranchFocusReward +
          dispatchBranchRotationReward +
          dispatchFocusLoopReward +
          dispatchLoopReward +
          dispatchBreakthroughReward +
          dispatchDetourBreakthroughReward +
          dispatchPrepReward +
          dispatchDetourPrepReward +
          dispatchReturnReward +
          rotationReward +
          masteryCapstoneReward +
          stanceFinisherReward,
        4
      );
      const stanceBonus = roundTo(preStanceGain * stanceBonusRate, 4);
      const gain = roundTo(preStanceGain + stanceBonus, 4);
      const planRewardText = formatDirectivePlanReward(planReward);
      const taskRewardText = formatDirectiveTaskReward(taskReward);
      const dispatchRewardText = formatFarRouteDispatchReward(dispatchReward);
      const dispatchRelayRewardText =
        formatFarRouteDispatchRelayReward(dispatchRelayReward);
      const dispatchSyncRewardText = formatFarRouteDispatchSyncReward(dispatchSyncReward);
      const dispatchSyncSupplyText = formatFarRouteDispatchSyncSupply(dispatchSyncSupply);
      const dispatchDetourRewardText =
        formatFarRouteDispatchDetourReward(dispatchDetourReward);
      const dispatchBranchShiftRewardText =
        formatFarRouteDispatchBranchShiftReward(dispatchBranchShiftReward);
      const dispatchBranchStabilityRewardText =
        formatFarRouteDispatchBranchStabilityReward(dispatchBranchStabilityReward);
      const dispatchBranchFocusRewardText =
        formatFarRouteDispatchBranchFocusReward(dispatchBranchFocusReward);
      const dispatchBranchRotationRewardText =
        formatFarRouteDispatchBranchRotationReward(dispatchBranchRotationReward);
      const dispatchFocusLoopRewardText =
        formatFarRouteDispatchFocusLoopReward(dispatchFocusLoopReward);
      const dispatchLoopRewardText = formatFarRouteDispatchLoopReward(dispatchLoopReward);
      const dispatchBreakthroughRewardText =
        formatFarRouteDispatchBreakthroughReward(dispatchBreakthroughReward);
      const dispatchDetourBreakthroughRewardText =
        formatFarRouteDispatchDetourBreakthroughReward(
          dispatchDetourBreakthroughReward
        );
      const dispatchDetourInfusionText =
        formatFarRouteDispatchDetourInfusion(dispatchDetourInfusion);
      const dispatchPrepRewardText = formatFarRouteDispatchPrepReward(dispatchPrepReward);
      const dispatchDetourPrepRewardText =
        formatFarRouteDispatchDetourPrepReward(dispatchDetourPrepReward);
      const dispatchReturnRewardText =
        formatFarRouteDispatchReturnReward(dispatchReturnReward);
      const dispatchRefreshText = formatFarRouteDispatchRefresh(dispatchRefresh);
      const dispatchCooldownText = formatFarRouteDispatchCooldown(dispatch, directive);
      const dispatchChainWindowText = formatFarRouteDispatchChainWindow(dispatch, directive);
      const dispatchRouteStepText = getFarRouteDispatchRouteStepText(
        dispatch,
        directive.id,
        current
      );
      const dispatchRouteResultText = getFarRouteDispatchRouteResultText(
        dispatch,
        directive.id,
        current
      );
      const chainText = formatDirectiveChainBonus(chain);
      const rotationRewardText = formatDirectiveRotationReward(rotationReward);
      const masteryCapstoneText =
        formatDirectiveMasteryCapstoneReward(masteryCapstoneReward);
      const stanceFinisherText =
        formatDirectiveStanceFinisherReward(stanceFinisherReward);
      const stanceBonusText = formatDirectiveStanceBonus(stanceBonusRate);
      const recommended = unlocked && recommendedIds.has(directive.id);
      const finisherRecommended =
        recommended &&
        chain.stacks >= DIRECTIVE_CHAIN_MAX_STACKS &&
        stanceFinisherReward > 0;
      const ready = unlocked && remainingMs <= 0;
      const optionRecommendationText = getDirectiveOptionRecommendationText({
        recommended,
        ready,
        plan,
        dispatch,
        directive,
        recommendationText,
        waitingRecommendationText
      });

      return {
        ...directive,
        baseGain,
        effectiveBaseGain,
        gain,
        masteryBonus,
        masteryBonusRate: mastery.bonusRate,
        masteryStacks: mastery.stacks,
        planReward,
        planBonusRate: DIRECTIVE_PLAN_BONUS_RATE,
        taskReward,
        taskRewardRate: DIRECTIVE_TASK_REWARD_RATE,
        dispatchReward,
        dispatchRewardRate: FAR_ROUTE_DISPATCH_BONUS_RATE,
        dispatchRelayReward,
        dispatchRelayRewardRate: FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE,
        dispatchRelayRewardText,
        dispatchSyncReward,
        dispatchSyncRewardRate: FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE,
        dispatchSyncRewardText,
        dispatchSyncSupply,
        dispatchSyncSupplyRate: FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE,
        dispatchSyncSupplyText,
        dispatchDetourReward,
        dispatchDetourRewardRate: FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE,
        dispatchDetourRewardText,
        dispatchBranchShiftReward,
        dispatchBranchShiftRewardRate: FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE,
        dispatchBranchShiftRewardText,
        dispatchBranchStabilityReward,
        dispatchBranchStabilityRewardRate:
          FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE,
        dispatchBranchStabilityRewardText,
        dispatchBranchFocusReward,
        dispatchBranchFocusRewardRate: FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE,
        dispatchBranchFocusRewardText,
        dispatchBranchRotationReward,
        dispatchBranchRotationRewardRate:
          FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE,
        dispatchBranchRotationRewardText,
        dispatchFocusLoopReward,
        dispatchFocusLoopRewardRate: FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE,
        dispatchFocusLoopRewardText,
        dispatchLoopReward,
        dispatchLoopRewardRate: FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE,
        dispatchBreakthroughReward,
        dispatchBreakthroughRewardRate: FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE,
        dispatchBreakthroughRewardText,
        dispatchDetourBreakthroughReward,
        dispatchDetourBreakthroughRewardRate:
          FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE,
        dispatchDetourBreakthroughRewardText,
        dispatchDetourInfusionCost: dispatchDetourInfusion.cost,
        dispatchDetourInfusionProgress: dispatchDetourInfusion.progress,
        dispatchDetourInfusionCostRate: FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE,
        dispatchDetourInfusionProgressMultiplier:
          FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER,
        dispatchDetourInfusionText,
        dispatchPrepReward,
        dispatchPrepRewardRate: FAR_ROUTE_DISPATCH_PREP_REWARD_RATE,
        dispatchPrepRewardText,
        dispatchDetourPrepReward,
        dispatchDetourPrepRewardRate: FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE,
        dispatchDetourPrepRewardText,
        dispatchReturnReward,
        dispatchReturnRewardRate: FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE,
        dispatchReturnRewardText,
        dispatchCooldownMultiplier: getDirectiveCooldownMultiplier(directive, dispatch),
        dispatchCooldownText,
        dispatchChainWindowSeconds: getDirectiveChainWindowSeconds(directive, dispatch),
        dispatchChainWindowText,
        dispatchRouteStepText,
        dispatchRouteResultText,
        dispatchRefreshDirectiveId: dispatchRefresh?.directiveId ?? null,
        dispatchRefreshDirectiveName: dispatchRefresh?.directiveName ?? "",
        dispatchRefreshText,
        rotationReward,
        masteryCapstoneReward,
        masteryCapstoneRate: DIRECTIVE_MASTERY_CAPSTONE_RATE,
        stanceFinisherReward,
        stanceBonus,
        stanceBonusRate,
        chainStacks: chain.stacks,
        chainMultiplier: chain.multiplier,
        planRewardText,
        taskRewardText,
        dispatchRewardText,
        dispatchRelayRewardText,
        dispatchSyncRewardText,
        dispatchSyncSupplyText,
        dispatchDetourRewardText,
        dispatchBranchShiftRewardText,
        dispatchBranchStabilityRewardText,
        dispatchBranchFocusRewardText,
        dispatchBranchRotationRewardText,
        dispatchLoopRewardText,
        dispatchBreakthroughRewardText,
        dispatchDetourBreakthroughRewardText,
        dispatchDetourInfusionText,
        dispatchPrepRewardText,
        dispatchDetourPrepRewardText,
        dispatchReturnRewardText,
        chainBonusText: chainText,
        rotationRewardText,
        masteryCapstoneText,
        stanceFinisherText,
        stanceBonusText,
        masteryBonusText,
        masteryMatched: mastery.stacks > 0,
        stanceMatched: stanceBonusRate > 0,
        previewText: unlocked
          ? "预计 +" +
            formatNumber(gain) +
            " 能量" +
            (masteryBonusText ? " · " + masteryBonusText : "") +
            (planRewardText ? " · " + planRewardText : "") +
            (taskRewardText ? " · " + taskRewardText : "") +
            (dispatchRewardText ? " · " + dispatchRewardText : "") +
            (dispatchRelayRewardText ? " · " + dispatchRelayRewardText : "") +
            (dispatchSyncRewardText ? " · " + dispatchSyncRewardText : "") +
            (dispatchSyncSupplyText ? " · " + dispatchSyncSupplyText : "") +
            (dispatchDetourRewardText ? " · " + dispatchDetourRewardText : "") +
            (dispatchBranchShiftRewardText ? " · " + dispatchBranchShiftRewardText : "") +
            (dispatchBranchStabilityRewardText
              ? " · " + dispatchBranchStabilityRewardText
              : "") +
            (dispatchBranchFocusRewardText ? " · " + dispatchBranchFocusRewardText : "") +
            (dispatchBranchRotationRewardText
              ? " · " + dispatchBranchRotationRewardText
              : "") +
            (dispatchFocusLoopRewardText ? " · " + dispatchFocusLoopRewardText : "") +
            (dispatchLoopRewardText ? " · " + dispatchLoopRewardText : "") +
            (dispatchBreakthroughRewardText
              ? " · " + dispatchBreakthroughRewardText
              : "") +
            (dispatchDetourBreakthroughRewardText
              ? " · " + dispatchDetourBreakthroughRewardText
              : "") +
            (dispatchDetourInfusionText ? " · " + dispatchDetourInfusionText : "") +
            (dispatchPrepRewardText ? " · " + dispatchPrepRewardText : "") +
            (dispatchDetourPrepRewardText
              ? " · " + dispatchDetourPrepRewardText
              : "") +
            (dispatchReturnRewardText ? " · " + dispatchReturnRewardText : "") +
            (dispatchRefreshText ? " · " + dispatchRefreshText : "") +
            (dispatchCooldownText ? " · " + dispatchCooldownText : "") +
            (dispatchChainWindowText ? " · " + dispatchChainWindowText : "") +
            (dispatchRouteStepText ? " · " + dispatchRouteStepText : "") +
            (chainText ? " · " + chainText : "") +
            (rotationRewardText ? " · " + rotationRewardText : "") +
            (masteryCapstoneText ? " · " + masteryCapstoneText : "") +
            (stanceFinisherText ? " · " + stanceFinisherText : "") +
            (stanceBonusText ? " · " + stanceBonusText : "")
          : unlockText,
        statusText: !unlocked
          ? "未解锁"
          : remainingMs > 0
            ? "冷却 " + formatDuration(remainingMs / 1000)
            : "可执行",
        remainingSeconds,
        cooldownProgress,
        cooling: unlocked && remainingMs > 0,
        ready,
        recommended,
        recommendationText: optionRecommendationText,
        finisherRecommended,
        finisherRecommendationText: finisherRecommended ? "策略终结" : "",
        disabled: !unlocked || remainingMs > 0
      };
    })
  };
}

export function getFarRouteDispatch(state, now = Date.now()) {
  const current = normalizeState(state, now);
  const loopTarget = DIRECTIVE_CHAIN_MAX_STACKS + 1;
  const rewardText =
    "调度校准 +" + Math.round(FAR_ROUTE_DISPATCH_BONUS_RATE * 100) + "%";
  const cooldownText =
    "目标指令冷却 -" +
    Math.round((1 - FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER) * 100) +
    "%";
  const chainWindowText =
    "调度接力 +" +
    formatDuration(FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS);
  const relayRewardText =
    "远航续航 +" + Math.round(FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE * 100) + "%";
  const syncRewardText =
    "远航协同 +" + Math.round(FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE * 100) + "%";
  const syncSupplyText =
    "协同补给 +" + Math.round(FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE * 100) + "%当前";
  const detourRewardText =
    "远航绕行 +" + Math.round(FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE * 100) + "%";
  const branchShiftRewardText =
    "分支改道 +" +
    Math.round(FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE * 100) +
    "%";
  const branchStabilityRewardText =
    "路线稳航 +" +
    Math.round(FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE * 100) +
    "%";
  const branchFocusRewardText =
    "航段契合 +" +
    Math.round(FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE * 100) +
    "%";
  const branchRotationRewardText =
    "轮替闭环 +" +
    Math.round(FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE * 100) +
    "%";
  const focusLoopRewardText =
    "契合闭环 +" +
    Math.round(FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE * 100) +
    "%";
  const loopRewardText =
    "远航闭环 +" + Math.round(FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE * 100) + "%";
  const breakthroughRewardText =
    "远航突破 +" +
    roundTo(FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE * 100, 3) +
    "%剩余";
  const detourBreakthroughRewardText =
    "绕行突破 +" +
    roundTo(FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE * 100, 3) +
    "%剩余";
  const detourInfusionText =
    "绕行投送 -" +
    roundTo(FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE * 100, 2) +
    "%当前 / +" +
    roundTo(FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER * 100, 0) +
    "%累计";
  const prepRewardText =
    "整备续航 +" + Math.round(FAR_ROUTE_DISPATCH_PREP_REWARD_RATE * 100) + "%";
  const detourPrepRewardText =
    "绕行整备 +" +
    Math.round(FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE * 100) +
    "%";
  const returnRewardText =
    "整备回航 +" + Math.round(FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE * 100) + "%";
  const dispatchRefreshLabel = "远航整备";

  if (current.totalEnergy < FAR_ROUTE_DISPATCH_UNLOCK_ENERGY) {
    return {
      unlocked: false,
      active: false,
      progress: 0,
      rewardRate: FAR_ROUTE_DISPATCH_BONUS_RATE,
      rewardText,
      relayRewardRate: FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE,
      relayRewardText,
      syncRewardRate: FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE,
      syncRewardText,
      syncSupplyRate: FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE,
      syncSupplyText,
      detourRewardRate: FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE,
      detourRewardText,
      branchShiftRewardRate: FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE,
      branchShiftRewardText,
      branchStabilityRewardRate: FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE,
      branchStabilityRewardText,
      branchFocusRewardRate: FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE,
      branchFocusRewardText,
      branchRotationRewardRate: FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE,
      branchRotationRewardText,
      focusLoopRewardRate: FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE,
      focusLoopRewardText,
      branchFocusKind: "",
      branchFocusText: "",
      branchFocusReasonText: "",
      branchFocusDirectiveId: null,
      branchFocusDirectiveName: "",
      loopRewardRate: FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE,
      loopRewardText,
      breakthroughRewardRate: FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE,
      breakthroughRewardText,
      detourBreakthroughRewardRate:
        FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE,
      detourBreakthroughRewardText,
      detourInfusionCostRate: FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE,
      detourInfusionProgressMultiplier:
        FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER,
      detourInfusionText,
      prepRewardRate: FAR_ROUTE_DISPATCH_PREP_REWARD_RATE,
      prepRewardText,
      detourPrepRewardRate: FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE,
      detourPrepRewardText,
      returnRewardRate: FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE,
      returnRewardText,
      breakthroughBase: 0,
      cooldownMultiplier: 1,
      cooldownText: "",
      chainWindowExtensionSeconds: FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS,
      chainWindowSeconds: DIRECTIVE_CHAIN_WINDOW_SECONDS,
      chainWindowText: "",
      targetDirectiveId: null,
      targetDirectiveName: "",
      relayDirectiveId: null,
      relayDirectiveName: "",
      refreshDirectiveId: null,
      refreshDirectiveName: "",
      refreshText: "",
      branchKind: "locked",
      branchText: "",
      branchDirectiveId: null,
      branchDirectiveName: "",
      branchRecommendationText: "",
      branchRotationText: "",
      branchRouteText: "",
      branchPlanText: "",
      branchPlanStepText: "",
      branchClosureText: "",
      branchChoices: [],
      branchChoiceSummaryText: "",
      branchChoiceText: "",
      projectId: null,
      loopProgress: 0,
      loopTarget,
      loopSteps: [],
      loopStepText: "",
      loopStatusText: "闭环进度 0/" + loopTarget + " · 20M 后解锁",
      text: "远航调度：累计 20M 能量后解锁后半段航段调度、目标指令推荐、目标冷却缩短、连携窗口延长、远航续航、远航协同、协同补给、远航绕行、绕行投送、分支改道、航段契合、路线稳航、轮替闭环、契合闭环、闭环奖励、远航突破、绕行突破、远航整备、整备续航、绕行整备与整备回航"
    };
  }

  const project = getProjectStatuses(current).find((item) => !item.completed) ?? null;
  if (!project) {
    return {
      unlocked: true,
      active: false,
      progress: 1,
      rewardRate: FAR_ROUTE_DISPATCH_BONUS_RATE,
      rewardText,
      relayRewardRate: FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE,
      relayRewardText,
      syncRewardRate: FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE,
      syncRewardText,
      syncSupplyRate: FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE,
      syncSupplyText,
      detourRewardRate: FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE,
      detourRewardText,
      branchShiftRewardRate: FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE,
      branchShiftRewardText,
      branchStabilityRewardRate: FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE,
      branchStabilityRewardText,
      branchFocusRewardRate: FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE,
      branchFocusRewardText,
      branchRotationRewardRate: FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE,
      branchRotationRewardText,
      focusLoopRewardRate: FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE,
      focusLoopRewardText,
      branchFocusKind: "",
      branchFocusText: "",
      branchFocusReasonText: "",
      branchFocusDirectiveId: null,
      branchFocusDirectiveName: "",
      loopRewardRate: FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE,
      loopRewardText,
      breakthroughRewardRate: FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE,
      breakthroughRewardText,
      detourBreakthroughRewardRate:
        FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE,
      detourBreakthroughRewardText,
      detourInfusionCostRate: FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE,
      detourInfusionProgressMultiplier:
        FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER,
      detourInfusionText,
      prepRewardRate: FAR_ROUTE_DISPATCH_PREP_REWARD_RATE,
      prepRewardText,
      detourPrepRewardRate: FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE,
      detourPrepRewardText,
      returnRewardRate: FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE,
      returnRewardText,
      breakthroughBase: 0,
      cooldownMultiplier: 1,
      cooldownText: "",
      chainWindowExtensionSeconds: FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS,
      chainWindowSeconds: DIRECTIVE_CHAIN_WINDOW_SECONDS,
      chainWindowText: "",
      targetDirectiveId: null,
      targetDirectiveName: "",
      relayDirectiveId: null,
      relayDirectiveName: "",
      refreshDirectiveId: null,
      refreshDirectiveName: "",
      refreshText: "",
      branchKind: "completed",
      branchText: "",
      branchDirectiveId: null,
      branchDirectiveName: "",
      branchRecommendationText: "",
      branchRotationText: "",
      branchRouteText: "",
      branchPlanText: "",
      branchPlanStepText: "",
      branchClosureText: "",
      branchChoices: [],
      branchChoiceSummaryText: "",
      branchChoiceText: "",
      projectId: null,
      loopProgress: loopTarget,
      loopTarget,
      loopSteps: [],
      loopStepText: "",
      loopStatusText: "闭环进度 " + loopTarget + "/" + loopTarget + " · 全部航段已完成",
      text: "远航调度：全部航段已完成，等待下一段航线"
    };
  }

  const directive = getFarRouteDispatchDirective(project, current);
  const relayDirective = getFarRouteDispatchRelayDirective(directive);
  const targetDirectiveName = directive?.name ?? "目标指令";
  const relayDirectiveName = relayDirective?.name ?? "非目标指令";
  const refreshText = relayDirective
    ? dispatchRefreshLabel + "刷新" + relayDirective.name + "冷却"
    : "";
  const loopStatus = getFarRouteDispatchLoopStatus(
    current,
    directive,
    relayDirective,
    now
  );
  const branchFocus = getFarRouteDispatchBranchFocus(
    project,
    directive,
    relayDirective
  );
  const branchStatus = getFarRouteDispatchBranchStatus(
    current,
    directive,
    relayDirective,
    now
  );
  const branchChoices = buildFarRouteDispatchBranchChoices(
    current,
    directive,
    relayDirective,
    branchStatus,
    branchFocus
  );
  const branchRecommendationText =
    buildFarRouteDispatchBranchRecommendationText(branchChoices);
  const branchRotationText = buildFarRouteDispatchBranchRotationText(branchChoices);
  const branchRouteText = buildFarRouteDispatchBranchRouteText(
    branchChoices,
    branchStatus
  );
  const branchPlanText = buildFarRouteDispatchBranchPlanText(
    directive,
    branchChoices,
    branchStatus
  );
  const branchPlanStepText = buildFarRouteDispatchBranchPlanStepText(
    current,
    directive,
    branchChoices,
    branchStatus
  );
  const branchClosureText = buildFarRouteDispatchBranchClosureText(
    current,
    branchChoices,
    branchStatus
  );
  const loopSteps = buildFarRouteDispatchLoopSteps(
    directive,
    relayDirective,
    loopStatus.progress,
    loopStatus.target,
    branchFocus
  );
  const breakthroughBase = getFarRouteDispatchBreakthroughBase(project);

  return {
    unlocked: true,
    active: true,
    progress: project.progress,
    rewardRate: FAR_ROUTE_DISPATCH_BONUS_RATE,
    rewardText,
    relayRewardRate: FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE,
    relayRewardText,
    syncRewardRate: FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE,
    syncRewardText,
    syncSupplyRate: FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE,
    syncSupplyText,
    detourRewardRate: FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE,
    detourRewardText,
    branchShiftRewardRate: FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE,
    branchShiftRewardText,
    branchStabilityRewardRate: FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE,
    branchStabilityRewardText,
    branchFocusRewardRate: FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE,
    branchFocusRewardText,
    branchRotationRewardRate: FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE,
    branchRotationRewardText,
    focusLoopRewardRate: FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE,
    focusLoopRewardText,
    branchFocusKind: branchFocus.kind,
    branchFocusText: branchFocus.text,
    branchFocusReasonText: branchFocus.reasonText,
    branchFocusDirectiveId: branchFocus.directiveId,
    branchFocusDirectiveName: branchFocus.directiveName,
    loopRewardRate: FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE,
    loopRewardText,
    breakthroughRewardRate: FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE,
    breakthroughRewardText,
    detourBreakthroughRewardRate:
      FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE,
    detourBreakthroughRewardText,
    detourInfusionCostRate: FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE,
    detourInfusionProgressMultiplier:
      FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER,
    detourInfusionText,
    prepRewardRate: FAR_ROUTE_DISPATCH_PREP_REWARD_RATE,
    prepRewardText,
    detourPrepRewardRate: FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE,
    detourPrepRewardText,
    returnRewardRate: FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE,
    returnRewardText,
    breakthroughBase,
    cooldownMultiplier: FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER,
    cooldownText,
    chainWindowExtensionSeconds: FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS,
    chainWindowSeconds:
      DIRECTIVE_CHAIN_WINDOW_SECONDS + FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS,
    chainWindowText,
    targetDirectiveId: directive?.id ?? null,
    targetDirectiveName,
    relayDirectiveId: relayDirective?.id ?? null,
    relayDirectiveName,
    refreshDirectiveId: relayDirective?.id ?? null,
    refreshDirectiveName: relayDirectiveName,
    refreshText,
    branchKind: branchStatus.kind,
    branchText: branchStatus.text,
    branchDirectiveId: branchStatus.directiveId,
    branchDirectiveName: branchStatus.directiveName,
    branchRecommendationText,
    branchRotationText,
    branchRouteText,
    branchPlanText,
    branchPlanStepText,
    branchClosureText,
    branchChoices,
    branchChoiceSummaryText: buildFarRouteDispatchBranchChoiceSummaryText(
      branchChoices
    ),
    branchChoiceText: buildFarRouteDispatchBranchChoiceText(branchChoices),
    projectId: project.id,
    projectName: project.name,
    segmentText: project.segmentText,
    progressText: project.progressText,
    loopProgress: loopStatus.progress,
    loopTarget: loopStatus.target,
    loopSteps,
    loopStepText: buildFarRouteDispatchLoopStepText(loopSteps),
    loopStatusText: appendFarRouteDispatchBranchText(loopStatus.text, branchStatus),
    text:
      "远航调度：" +
      project.segmentText +
      " " +
      project.name +
      "指定" +
      targetDirectiveName +
      " · 执行目标指令获得" +
      rewardText +
      " · " +
      cooldownText +
      " · " +
      chainWindowText +
      " · " +
      branchStatus.text +
      (branchFocus.text ? " · " + branchFocus.text : "") +
      (branchRecommendationText ? " · " + branchRecommendationText : "") +
      (branchRotationText ? " · " + branchRotationText : "") +
      (branchRouteText ? " · " + branchRouteText : "") +
      (branchPlanText ? " · " + branchPlanText : "") +
      (branchPlanStepText ? " · " + branchPlanStepText : "") +
      (branchClosureText ? " · " + branchClosureText : "") +
      " · 目标后优先" +
      relayDirectiveName +
      "触发" +
      syncRewardText +
      "并获得" +
      syncSupplyText +
      "，另一个非目标可触发" +
      detourRewardText +
      "并消耗当前能量进行" +
      detourInfusionText +
      "；若续走上一轮分支，会触发" +
      branchStabilityRewardText +
      "；若本轮选择与上一轮不同的分支，还会触发" +
      branchShiftRewardText +
      "，回到目标闭环时触发" +
      branchRotationRewardText +
      "；若用当前航段契合分支回到目标，还会触发" +
      focusLoopRewardText +
      "；若选择当前航段契合分支，还会触发" +
      branchFocusRewardText +
      "，所有非目标仍触发" +
      relayRewardText +
      " · 3/3 回到目标指令触发" +
      loopRewardText +
      "、" +
      breakthroughRewardText +
      "，绕行路线额外触发" +
      detourBreakthroughRewardText +
      " · 完成闭环后" +
      refreshText +
      "，下一步触发" +
      prepRewardText +
      "；若上一轮选择绕行，则改为触发" +
      detourPrepRewardText +
      "，再回到目标触发" +
      returnRewardText
  };
}

export function getDirectivePlan(state, now = Date.now()) {
  const current = normalizeState(state, now);
  const targetSteps = DIRECTIVE_CHAIN_MAX_STACKS + 1;
  const mastery = getDirectiveMastery(current, now);
  const masteryHint = formatDirectiveMasteryHint(mastery);
  const masteryAtCap = mastery.stacks >= DIRECTIVE_MASTERY_MAX_STACKS;
  const dispatch = getFarRouteDispatch(current, now);
  const dispatchDirective = dispatch.active
    ? getDirectiveDef(dispatch.targetDirectiveId)
    : null;
  const dispatchRelayDirective = dispatch.active
    ? getDirectiveDef(dispatch.relayDirectiveId)
    : null;

  if (current.totalEnergy < DIRECTIVE_UNLOCK_ENERGY) {
    return {
      unlocked: false,
      progress: 0,
      target: targetSteps,
      summaryText: "指令轮换：累计 100K 能量后解锁 90 秒连携目标",
      hintText: "解锁后先从非契合指令起手，第二步继续避开契合指令，把契合指令留到 3/3 策略终结；完成轮换会累积指令熟练，满层后用回响续航触发满层回响。",
      text:
        "指令轮换：累计 100K 能量后解锁 90 秒连携目标 · 解锁后先从非契合指令起手，第二步继续避开契合指令，把契合指令留到 3/3 策略终结；完成轮换会累积指令熟练，满层后用回响续航触发满层回响。"
    };
  }

  const chain = current.directiveChain;
  const active = Boolean(chain.lastDirectiveId && chain.expiresAt >= now);

  if (!active) {
    const routeStance = getRouteStanceStatus(current);
    const stanceDirective = getDirectiveDef(routeStance.active?.directiveId);
    const openerDirectives = stanceDirective
      ? DIRECTIVE_DEFS.filter((directive) => directive.id !== stanceDirective.id)
      : DIRECTIVE_DEFS;
    const readyOpeners = openerDirectives.filter((directive) =>
      isDirectiveReady(current, directive, now, dispatch)
    );
    let nextDirectivePool = readyOpeners.length ? readyOpeners : openerDirectives;
    let recommendationText = "收束起手";
    let waitingRecommendationText = "等待起手";
    let openerPhrase = "";

    if (dispatchDirective) {
      nextDirectivePool = [dispatchDirective];
      recommendationText = "调度目标";
      waitingRecommendationText = "等待调度";
      openerPhrase =
        (isDirectiveReady(current, dispatchDirective, now, dispatch)
          ? "远航调度指定"
          : "等待远航调度冷却后执行") + dispatchDirective.name;
    }

    const openerNames = formatDirectiveNameList(
      nextDirectivePool.map((directive) => directive.name)
    );
    const openerPrefix = readyOpeners.length ? "先执行" : "等待冷却后执行";
    const finisherHint = stanceDirective
      ? dispatchDirective
        ? "，当前航段调度优先于常规收束起手"
        : "，保留" + stanceDirective.name + "完成 3/3 策略终结"
      : "";
    const nextActionText = dispatchDirective ? openerPhrase : openerPrefix + openerNames;

    return {
      unlocked: true,
      progress: 0,
      target: targetSteps,
      nextDirectiveIds: nextDirectivePool.map((directive) => directive.id),
      recommendationText,
      waitingRecommendationText,
      summaryText:
        "指令轮换 0/" +
        targetSteps +
        " · " +
        (dispatchDirective ? "调度目标 " : "收束起手 ") +
        openerNames,
      hintText:
        nextActionText +
        finisherHint +
        "；匹配当前航线策略可获得策略契合 +10%；随后在 90 秒内切换不同指令；" +
        masteryHint,
      text:
        "指令轮换 0/" +
        targetSteps +
        " · " +
        nextActionText +
        finisherHint +
        " · 匹配当前航线策略可获得策略契合 +10% · 随后在 90 秒内切换不同指令 · " +
        masteryHint
    };
  }

  const lastDirective = getDirectiveDef(chain.lastDirectiveId);
  const stacks = Math.min(DIRECTIVE_CHAIN_MAX_STACKS, Math.max(0, chain.stacks));
  const progress = Math.min(targetSteps, stacks + 1);
  const nextStacks = Math.min(DIRECTIVE_CHAIN_MAX_STACKS, stacks + 1);
  const nextMultiplier = roundTo(1 + nextStacks * DIRECTIVE_CHAIN_BONUS_STEP, 4);
  const nextBonusText =
    "连携 +" + Math.round((nextMultiplier - 1) * 100) + "%";
  const differentDirectives = DIRECTIVE_DEFS.filter(
    (directive) => directive.id !== chain.lastDirectiveId
  );
  const routeStance = getRouteStanceStatus(current);
  const stanceDirective = getDirectiveDef(routeStance.active?.directiveId);
  const shouldPreserveStanceFinisher = Boolean(
    stacks === 0 &&
      stanceDirective &&
      chain.lastDirectiveId !== stanceDirective.id &&
      differentDirectives.some((directive) => directive.id !== stanceDirective.id)
  );
  const dispatchRelayCanOverride = Boolean(
    dispatchDirective &&
      chain.lastDirectiveId === dispatchDirective.id &&
      stacks === 0
  );
  const preferredDirectives = shouldPreserveStanceFinisher
    ? dispatchRelayCanOverride
      ? differentDirectives
      : differentDirectives.filter((directive) => directive.id !== stanceDirective.id)
    : differentDirectives;
  let readyDirectives = preferredDirectives.filter((directive) =>
    isDirectiveReady(current, directive, now, dispatch)
  );
  let nextDirectivePool = readyDirectives.length ? readyDirectives : preferredDirectives;
  const dispatchCanOverride = Boolean(
    dispatchDirective && dispatchDirective.id !== chain.lastDirectiveId
  );
  const dispatchReturnCanOverride = Boolean(
    dispatchDirective &&
      dispatchRelayDirective &&
      chain.lastDirectiveId === dispatchRelayDirective.id &&
      stacks >= DIRECTIVE_CHAIN_MAX_STACKS
  );
  const dispatchSyncReturnCanOverride = Boolean(
    dispatchDirective &&
      dispatchRelayDirective &&
      chain.lastDirectiveId === dispatchRelayDirective.id &&
      stacks === DIRECTIVE_CHAIN_MAX_STACKS - 1
  );
  const dispatchDetourReturnCanOverride = Boolean(
    dispatchDirective &&
      dispatchRelayDirective &&
      chain.lastDirectiveId !== dispatchDirective.id &&
      chain.lastDirectiveId !== dispatchRelayDirective.id &&
      stacks === DIRECTIVE_CHAIN_MAX_STACKS - 1
  );
  const dispatchCompletedBranchDirective = getFarRouteDispatchCompletedBranchDirective(
    current,
    dispatch,
    now
  );
  const dispatchDetourPrepCanOverride = Boolean(
    dispatchDirective &&
      dispatchRelayDirective &&
      dispatchCompletedBranchDirective &&
      dispatchCompletedBranchDirective.id !== dispatchRelayDirective.id &&
      chain.lastDirectiveId === dispatchDirective.id &&
      stacks >= DIRECTIVE_CHAIN_MAX_STACKS
  );
  const dispatchRefreshCanOverride = Boolean(
    dispatchDirective &&
      dispatchRelayDirective &&
      chain.lastDirectiveId === dispatchDirective.id &&
      stacks >= DIRECTIVE_CHAIN_MAX_STACKS &&
      !dispatchDetourPrepCanOverride
  );
  if (dispatchReturnCanOverride) {
    nextDirectivePool = [dispatchDirective];
    readyDirectives = isDirectiveReady(current, dispatchDirective, now, dispatch)
      ? [dispatchDirective]
      : [];
  } else if (dispatchSyncReturnCanOverride) {
    nextDirectivePool = [dispatchDirective];
    readyDirectives = isDirectiveReady(current, dispatchDirective, now, dispatch)
      ? [dispatchDirective]
      : [];
  } else if (dispatchDetourReturnCanOverride) {
    nextDirectivePool = [dispatchDirective];
    readyDirectives = isDirectiveReady(current, dispatchDirective, now, dispatch)
      ? [dispatchDirective]
      : [];
  } else if (dispatchCanOverride) {
    nextDirectivePool = [dispatchDirective];
    readyDirectives = isDirectiveReady(current, dispatchDirective, now, dispatch)
      ? [dispatchDirective]
      : [];
  } else if (dispatchDetourPrepCanOverride) {
    nextDirectivePool = [dispatchCompletedBranchDirective];
    readyDirectives = isDirectiveReady(
      current,
      dispatchCompletedBranchDirective,
      now,
      dispatch
    )
      ? [dispatchCompletedBranchDirective]
      : [];
  } else if (dispatchRefreshCanOverride) {
    nextDirectivePool = [dispatchRelayDirective];
    readyDirectives = isDirectiveReady(current, dispatchRelayDirective, now, dispatch)
      ? [dispatchRelayDirective]
      : [];
  }
  const nextIncludesStanceDirective = Boolean(
    stanceDirective &&
      nextDirectivePool.some((directive) => directive.id === stanceDirective.id)
  );
  const nextNames = formatDirectiveNameList(
    nextDirectivePool.map((directive) => directive.name)
  );
  const windowText = formatDuration((chain.expiresAt - now) / 1000);
  const summaryText =
    "指令轮换 " +
    progress +
    "/" +
    targetSteps +
    " · 当前 " +
    (lastDirective?.name ?? "未知指令") +
    " · 连携窗口 " +
    windowText;
  let waitingPrefix = readyDirectives.length ? "下一步切换到" : "等待冷却后切换到";
  if (dispatchReturnCanOverride) {
    waitingPrefix = readyDirectives.length
      ? "远航整备回航到"
      : "等待远航整备回航冷却后执行";
  } else if (dispatchSyncReturnCanOverride) {
    waitingPrefix = readyDirectives.length
      ? "远航协同回到"
      : "等待远航协同回航冷却后执行";
  } else if (dispatchDetourReturnCanOverride) {
    waitingPrefix = readyDirectives.length
      ? "远航绕行回到"
      : "等待远航绕行回航冷却后执行";
  } else if (dispatchCanOverride) {
    waitingPrefix = readyDirectives.length
      ? "远航调度指定"
      : "等待远航调度冷却后执行";
  } else if (dispatchDetourPrepCanOverride) {
    waitingPrefix = readyDirectives.length
      ? "远航绕行整备优先"
      : "等待远航绕行整备冷却后执行";
  } else if (dispatchRefreshCanOverride) {
    waitingPrefix = readyDirectives.length
      ? "远航整备优先"
      : "等待远航整备冷却后执行";
  } else if (dispatchRelayCanOverride) {
    waitingPrefix = readyDirectives.length
      ? "远航续航可切换到"
      : "等待远航续航冷却后切换到";
  }
  let preserveStanceHint = "";
  if (dispatchReturnCanOverride) {
    preserveStanceHint = "，触发整备回航";
  } else if (dispatchSyncReturnCanOverride) {
    preserveStanceHint = "，触发远航闭环与远航突破";
  } else if (dispatchDetourReturnCanOverride) {
    preserveStanceHint = "，触发远航闭环与绕行突破";
  } else if (dispatchRelayCanOverride) {
    preserveStanceHint = "，目标后切换非目标指令触发远航续航";
    if (dispatchRelayDirective) {
      preserveStanceHint =
        "，优先" +
        dispatchRelayDirective.name +
        "触发远航协同，另一个非目标触发远航绕行";
    }
  } else if (dispatchDetourPrepCanOverride) {
    preserveStanceHint = "，触发绕行整备";
  } else if (dispatchRefreshCanOverride) {
    preserveStanceHint = "，触发整备续航";
  } else if (shouldPreserveStanceFinisher) {
    preserveStanceHint = dispatchCanOverride
      ? "，当前航段调度优先"
      : "，继续保留" + stanceDirective.name + "做 3/3 策略终结";
  }
  const completedRotation = stacks >= DIRECTIVE_CHAIN_MAX_STACKS;
  const masteryContinuation = completedRotation && mastery.stacks > 0;
  const completedRecommendationText = masteryAtCap
    ? "回响续航"
    : masteryContinuation
      ? "熟练续航"
      : "满轮续航";
  const waitingRecommendationText = masteryAtCap ? "等待回响" : "等待续航";
  const dispatchPrepHint = dispatchRefreshCanOverride ? "触发整备续航，" : "";
  const dispatchDetourPrepHint = dispatchDetourPrepCanOverride
    ? "触发绕行整备，"
    : "";
  const dispatchReturnHint = dispatchReturnCanOverride ? "触发整备回航，" : "";
  const dispatchDetourReturnHint = dispatchDetourReturnCanOverride
    ? "触发绕行突破，"
    : "";
  const continuationLead = masteryAtCap
    ? "进入回响续航，"
    : masteryContinuation
      ? "进入熟练续航，"
      : "";
  const hintText =
    completedRotation
      ? waitingPrefix +
        nextNames +
        dispatchPrepHint +
        dispatchDetourPrepHint +
        dispatchReturnHint +
        dispatchDetourReturnHint +
        continuationLead +
        "可维持" +
        nextBonusText +
        "，并继续触发轮换目标奖励" +
        (masteryAtCap ? "与满层回响" : "") +
        (nextIncludesStanceDirective
          ? "；切到" + stanceDirective.name + "还会触发策略终结奖励"
          : "") +
        "；重复同类会重置；" +
        masteryHint
      : waitingPrefix +
        nextNames +
        preserveStanceHint +
        "，预计" +
        nextBonusText +
        (nextStacks >= DIRECTIVE_CHAIN_MAX_STACKS
          ? "，并触发轮换目标奖励" + (masteryAtCap ? "与满层回响" : "")
          : "") +
        (nextStacks >= DIRECTIVE_CHAIN_MAX_STACKS && nextIncludesStanceDirective
          ? "；收束到" + stanceDirective.name + "还会触发策略终结奖励"
          : "") +
        "；" +
        masteryHint;

  return {
    unlocked: true,
    progress,
    target: targetSteps,
    remainingSeconds: Math.ceil(Math.max(0, (chain.expiresAt - now) / 1000)),
    nextDirectiveIds: nextDirectivePool.map((directive) => directive.id),
    recommendationText: dispatchReturnCanOverride
      ? "整备回航"
      : dispatchSyncReturnCanOverride
      ? "协同回航"
      : dispatchDetourReturnCanOverride
      ? "绕行回航"
      : dispatchCanOverride
      ? "调度目标"
      : dispatchDetourPrepCanOverride
      ? "绕行整备"
      : dispatchRefreshCanOverride
      ? "整备续航"
      : dispatchRelayCanOverride
      ? "远航续航"
      : completedRotation
      ? completedRecommendationText
      : shouldPreserveStanceFinisher
        ? "收束续航"
        : undefined,
    waitingRecommendationText:
      dispatchReturnCanOverride
        ? "等待回航"
        : dispatchSyncReturnCanOverride
        ? "等待协同"
        : dispatchDetourReturnCanOverride
        ? "等待绕行"
        : dispatchCanOverride
        ? "等待调度"
        : dispatchDetourPrepCanOverride
        ? "等待绕行整备"
        : dispatchRefreshCanOverride
        ? "等待整备"
        : dispatchRelayCanOverride
        ? "等待续航"
        : completedRotation || shouldPreserveStanceFinisher
        ? waitingRecommendationText
        : undefined,
    summaryText,
    hintText,
    text: summaryText + " · " + hintText
  };
}

export function getDirectiveTaskStatus(state, now = Date.now()) {
  const current = normalizeState(state, now);
  const targetSteps = DIRECTIVE_CHAIN_MAX_STACKS + 1;
  const rewardText =
    "委托完成 +" + Math.round(DIRECTIVE_TASK_REWARD_RATE * 100) + "%";

  if (current.totalEnergy < DIRECTIVE_UNLOCK_ENERGY) {
    return {
      unlocked: false,
      completed: false,
      progress: 0,
      target: targetSteps,
      rewardRate: DIRECTIVE_TASK_REWARD_RATE,
      rewardText,
      text: "航线委托：累计 100K 能量后解锁 3 步短期任务"
    };
  }

  const plan = getDirectivePlan(current, now);
  const progress = Math.min(targetSteps, Math.max(0, plan.progress ?? 0));
  const completed = progress >= targetSteps;

  if (completed) {
    return {
      unlocked: true,
      completed: true,
      progress,
      target: targetSteps,
      rewardRate: DIRECTIVE_TASK_REWARD_RATE,
      rewardText,
      text:
        "航线委托已完成 · 已达成 3/3 推荐轮换；重置或超时后开启下一轮委托，继续轮换可维持连携与熟练"
    };
  }

  const nextDirectives = Array.isArray(plan.nextDirectiveIds)
    ? plan.nextDirectiveIds.map(getDirectiveDef).filter(Boolean)
    : [];
  const nextText = nextDirectives.length
    ? "下一步 " + formatDirectiveNameList(nextDirectives.map((directive) => directive.name))
    : "继续按推荐预案执行";

  return {
    unlocked: true,
    completed: false,
    progress,
    target: targetSteps,
    rewardRate: DIRECTIVE_TASK_REWARD_RATE,
    rewardText,
    text:
      "航线委托 " +
      progress +
      "/" +
      targetSteps +
      " · " +
      nextText +
      "，完成 3/3 推荐轮换 · 完成奖励 " +
      rewardText
  };
}

export function setRouteStance(state, routeStanceId) {
  const current = normalizeState(state);
  const nextId = getValidRouteStanceId(routeStanceId);
  const stance = getRouteStanceDef(nextId);

  if (current.totalEnergy < PROJECT_GOAL_UNLOCK_ENERGY) {
    return {
      changed: false,
      reason: "locked",
      state: current,
      stance
    };
  }

  if (current.routeStance === nextId) {
    return {
      changed: false,
      reason: "same",
      state: current,
      stance
    };
  }

  return {
    changed: true,
    state: {
      ...current,
      routeStance: nextId
    },
    stance
  };
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
        overloadMultiplier: roundTo(
          bonuses.overloadMultiplier * (effect.overloadMultiplier ?? 1),
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
      overloadMultiplier: 1,
      completed: 0,
      projectIds: []
    }
  );
}

export function getEffectiveProduction(state) {
  const current = normalizeState(state);
  const bonuses = getProjectBonuses(current);
  const routeStance = getRouteStanceStatus(current);
  const routeEffect = routeStance.unlocked
    ? routeStance.active.effect
    : {
        clickMultiplier: 1,
        secondMultiplier: 1,
        overloadMultiplier: 1
      };
  const clickGainMultiplier =
    current.multiplier *
    bonuses.totalMultiplier *
    bonuses.clickMultiplier *
    routeEffect.clickMultiplier;
  const secondGainMultiplier =
    current.multiplier *
    bonuses.totalMultiplier *
    bonuses.secondMultiplier *
    routeEffect.secondMultiplier;
  const overloadBonus =
    current.overloadBonus *
    bonuses.overloadMultiplier *
    routeEffect.overloadMultiplier *
    clickGainMultiplier;

  return {
    perClick: roundTo(current.energyPerClick * clickGainMultiplier, 4),
    perSecond: roundTo(current.energyPerSecond * secondGainMultiplier, 4),
    overloadBonus: roundTo(overloadBonus, 4),
    totalMultiplier: roundTo(current.multiplier * bonuses.totalMultiplier, 4),
    clickGainMultiplier: roundTo(clickGainMultiplier, 4),
    secondGainMultiplier: roundTo(secondGainMultiplier, 4),
    projectBonuses: bonuses,
    routeStance
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
    ["自动", bonuses.secondMultiplier],
    ["过载", bonuses.overloadMultiplier]
  ]
    .filter(([, multiplier]) => multiplier > 1)
    .map(([label, multiplier]) => label + " x" + formatMultiplier(multiplier));

  return "生效加成：" + bonusParts.join(" · ");
}

function buildProjectActionText(project, state) {
  if (!project) {
    return "行动建议：所有航段完成，继续累计能量等待下一段航线。";
  }

  const targetText = project.segmentText + " " + project.name;

  if (project.upgradeId) {
    return (
      "行动建议：" + buildUpgradeActionText(state, project.upgradeId) + "，推进" + targetText
    );
  }

  if (project.remaining <= 0) {
    return "行动建议：" + project.name + "已完成，等待下一段航线。";
  }

  const remainingText = formatProjectAmount(project, project.remaining);
  const production = getEffectiveProduction(state);

  if (production.perSecond > 0) {
    return (
      "行动建议：继续点火或放置累计，推进" +
      targetText +
      "，还差 " +
      remainingText +
      "，按当前每秒约 " +
      formatNumber(production.perSecond) +
      " 需 " +
      formatDuration(project.remaining / production.perSecond)
    );
  }

  return "行动建议：继续点火累计，推进" + targetText + "，还差 " + remainingText;
}

function buildProjectTrackText(projects) {
  const energyProject = projects.find((project) => !project.completed && !project.upgradeId);
  const upgradeProject = projects.find((project) => !project.completed && project.upgradeId);

  return (
    "目标分轨：累计航段" +
    formatProjectTrack(energyProject) +
    "；升级航段" +
    formatProjectTrack(upgradeProject)
  );
}

function buildProjectCompositionText(projects) {
  const energyCount = projects.filter((project) => !project.upgradeId).length;
  const upgradeCount = projects.length - energyCount;
  const rewardText = formatProjectRewardCountText(getProjectRewardCounts(projects));

  return (
    "航线构成：" +
    energyCount +
    " 个累计航段 · " +
    upgradeCount +
    " 个升级航段 · 奖励分布 " +
    rewardText
  );
}

function buildProjectRewardProgressText(projects) {
  const rewardCounts = projects.reduce(
    (counts, project) => {
      const effect = project.effect ?? {};
      return {
        total: countRewardProgress(counts.total, project.completed, effect.totalMultiplier),
        click: countRewardProgress(counts.click, project.completed, effect.clickMultiplier),
        second: countRewardProgress(counts.second, project.completed, effect.secondMultiplier),
        overload: countRewardProgress(
          counts.overload,
          project.completed,
          effect.overloadMultiplier
        )
      };
    },
    {
      total: { completed: 0, total: 0 },
      click: { completed: 0, total: 0 },
      second: { completed: 0, total: 0 },
      overload: { completed: 0, total: 0 }
    }
  );
  const rewardText = [
    ["总产能", rewardCounts.total],
    ["点击", rewardCounts.click],
    ["自动", rewardCounts.second],
    ["过载", rewardCounts.overload]
  ]
    .filter(([, count]) => count.total > 0)
    .map(([label, count]) => label + " " + count.completed + "/" + count.total)
    .join(" · ");

  return "奖励进度：" + rewardText;
}

function buildProjectRewardTargetText(projects) {
  const rewardTargets = PROJECT_REWARD_SUMMARY_DEFS.map(([label, effectKey]) => {
    const project = projects.find(
      (item) => !item.completed && Boolean(item.effect?.[effectKey])
    );
    const targetText = project
      ? project.name + "（" + project.reward + " · " + project.progressText + "）"
      : "已完成";

    return label + " " + targetText;
  });

  return "奖励目标：" + rewardTargets.join(" · ");
}

function buildProjectMilestoneText(projects, nextProject) {
  const routeEndpoint = projects[projects.length - 1] ?? null;

  if (!routeEndpoint) {
    return "里程碑：等待星图航线";
  }

  if (!nextProject) {
    return "里程碑：全部章节已完成 · 终局航点 " + routeEndpoint.name + "已完成";
  }

  const currentChapter = PROJECT_CHAPTER_DEFS.find((chapter) =>
    getChapterProjects(projects, chapter).some((project) => project.id === nextProject.id)
  );
  const chapterProjects = currentChapter ? getChapterProjects(projects, currentChapter) : [];
  const chapterEndpoint = chapterProjects[chapterProjects.length - 1] ?? nextProject;
  const milestoneParts = [];

  if (chapterEndpoint.id !== routeEndpoint.id) {
    milestoneParts.push("本章终点 " + formatMilestoneProject(chapterEndpoint));
  }
  milestoneParts.push("终局航点 " + formatMilestoneProject(routeEndpoint));

  return "里程碑：" + milestoneParts.join("；");
}

function buildProjectRouteFocusText(projects, state) {
  const current = normalizeState(state);

  if (current.totalEnergy < PROJECT_GOAL_UNLOCK_ENERGY) {
    return "航线焦点：累计 100K 能量后解锁策略焦点";
  }

  const stance = getRouteStanceDef(current.routeStance);
  const project = projects.find((item) => item.id === stance.masteryProjectId);

  if (!project) {
    return "航线焦点：" + stance.name + " · 等待后续专精航段";
  }

  const statusText = project.completed ? "已完成" : project.progressText;
  return (
    "航线焦点：" +
    stance.name +
    " -> " +
    project.name +
    "（" +
    project.reward +
    " · " +
    statusText +
    "）"
  );
}

function countRewardProgress(count, completed, effectValue) {
  const hasReward = Boolean(effectValue);

  return {
    completed: count.completed + Number(hasReward && completed),
    total: count.total + Number(hasReward)
  };
}

function buildProjectChapterTargetText(projects) {
  const chapterParts = PROJECT_CHAPTER_DEFS.map((chapter) => {
    const nextProject = getChapterProjects(projects, chapter).find(
      (project) => !project.completed
    );
    const targetText = nextProject
      ? nextProject.chapterIndex + "/" + nextProject.chapterTotal + " " + nextProject.name
      : "已完成";

    return chapter.name + " " + targetText;
  });

  return "章节目标：" + chapterParts.join(" · ");
}

function buildProjectChapterRewardText(projects) {
  const chapterParts = PROJECT_CHAPTER_DEFS.map((chapter) => {
    const rewardCounts = getChapterProjects(projects, chapter).reduce(
      (counts, project) => {
        const effect = project.effect ?? {};
        return {
          total: counts.total + Number(Boolean(effect.totalMultiplier)),
          click: counts.click + Number(Boolean(effect.clickMultiplier)),
          second: counts.second + Number(Boolean(effect.secondMultiplier)),
          overload: counts.overload + Number(Boolean(effect.overloadMultiplier))
        };
      },
      {
        total: 0,
        click: 0,
        second: 0,
        overload: 0
      }
    );
    const rewardText = [
      ["总产能", rewardCounts.total],
      ["点击", rewardCounts.click],
      ["自动", rewardCounts.second],
      ["过载", rewardCounts.overload]
    ]
      .filter(([, count]) => count > 0)
      .map(([label, count]) => label + " " + count)
      .join(" / ");

    return chapter.name + " " + (rewardText || "暂无奖励");
  });

  return "章节奖励：" + chapterParts.join(" · ");
}

function buildProjectChapterText(projects, nextProject) {
  const chapterParts = PROJECT_CHAPTER_DEFS.map((chapter) => {
    const chapterProjects = getChapterProjects(projects, chapter);
    const completed = chapterProjects.filter((project) => project.completed).length;

    return chapter.name + " " + completed + "/" + chapterProjects.length;
  });
  const currentChapterIndex = nextProject
    ? PROJECT_CHAPTER_DEFS.findIndex((chapter) =>
        getChapterProjects(projects, chapter).some((project) => project.id === nextProject.id)
      )
    : -1;
  const currentChapter =
    currentChapterIndex >= 0 ? PROJECT_CHAPTER_DEFS[currentChapterIndex] : null;
  const currentText =
    nextProject && currentChapter
      ? "当前 " +
        nextProject.chapterText +
        " · 航段 " +
        nextProject.segmentIndex +
        "/" +
        nextProject.segmentTotal +
        " " +
        nextProject.name +
        " · " +
        buildProjectChapterPacingText(projects, currentChapter, currentChapterIndex)
      : "全部阶段完成";

  return "阶段导航：" + chapterParts.join(" · ") + "；" + currentText;
}

function buildProjectChapterPacingText(projects, chapter, chapterIndex) {
  const chapterProjects = getChapterProjects(projects, chapter);
  const remaining = chapterProjects.filter((project) => !project.completed).length;
  const nextChapter = PROJECT_CHAPTER_DEFS[chapterIndex + 1];
  const nextChapterText = nextChapter ? " · 下一阶段 " + nextChapter.name : " · 最终阶段";

  return "本阶段还剩 " + remaining + " 段" + nextChapterText;
}

function getChapterProjects(projects, chapter) {
  const startIndex = projects.findIndex((project) => project.id === chapter.startId);
  const endIndex = projects.findIndex((project) => project.id === chapter.endId);

  if (startIndex < 0 || endIndex < startIndex) {
    return [];
  }

  return projects.slice(startIndex, endIndex + 1);
}

function getProjectChapterInfo(projectId) {
  const projectIndex = PROJECT_DEFS.findIndex((project) => project.id === projectId);
  if (projectIndex < 0) {
    return {
      chapterName: "未分组",
      chapterIndex: 0,
      chapterTotal: 0,
      chapterText: "未分组"
    };
  }

  const chapterInfo = PROJECT_CHAPTER_DEFS.map((item) => {
    const startIndex = PROJECT_DEFS.findIndex((project) => project.id === item.startId);
    const endIndex = PROJECT_DEFS.findIndex((project) => project.id === item.endId);

    return {
      ...item,
      startIndex,
      endIndex
    };
  }).find(
    (item) =>
      item.startIndex >= 0 &&
      item.endIndex >= item.startIndex &&
      projectIndex >= item.startIndex &&
      projectIndex <= item.endIndex
  );

  if (!chapterInfo) {
    return {
      chapterName: "未分组",
      chapterIndex: 0,
      chapterTotal: 0,
      chapterText: "未分组"
    };
  }

  const chapterIndex = projectIndex - chapterInfo.startIndex + 1;
  const chapterTotal = chapterInfo.endIndex - chapterInfo.startIndex + 1;

  return {
    chapterName: chapterInfo.name,
    chapterIndex,
    chapterTotal,
    chapterText: chapterInfo.name + " " + chapterIndex + "/" + chapterTotal
  };
}

function formatProjectTrack(project) {
  if (!project) {
    return " 全部完成";
  }

  return " " + project.name + "（" + project.progressText + "）";
}

function formatForecastProject(project) {
  return project.name + "（" + project.reward + "）";
}

function buildProjectForecastBriefText(projects) {
  if (projects.length === 0) {
    return "航线预告：等待下一段航线";
  }

  const nextProject = projects[0];
  return (
    "航线预告：接下来 " +
    projects.length +
    " 段 · 下一段 " +
    nextProject.segmentIndex +
    "/" +
    nextProject.segmentTotal +
    " " +
    nextProject.name
  );
}

function buildProjectForecastDetailText(projects) {
  if (projects.length === 0) {
    return "航线预告：等待下一段航线";
  }

  return "航线预告：" + projects.map(formatForecastProject).join("、");
}

function formatProjectFilterCompletion(completed, total) {
  const remaining = Math.max(0, total - completed);
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return " · 完成率 " + percent + "% · 剩余 " + remaining + " 段";
}

function formatProjectFilterStatusMix(projects) {
  const statusCounts = projects.reduce(
    (counts, project) => ({
      completed: counts.completed + Number(project.completed),
      current: counts.current + Number(!project.completed && project.isCurrent),
      pending: counts.pending + Number(!project.completed && !project.isCurrent)
    }),
    {
      completed: 0,
      current: 0,
      pending: 0
    }
  );
  const statusText = [
    ["已完成", statusCounts.completed],
    ["当前", statusCounts.current],
    ["待推进", statusCounts.pending]
  ]
    .filter(([, count]) => count > 0)
    .map(([label, count]) => label + " " + count + " 段")
    .join(" / ");

  return statusText ? " · 状态构成 " + statusText : "";
}

function formatProjectFilterPreview(projects) {
  const upcomingProjects = projects.filter((project) => !project.completed).slice(1, 3);

  if (!upcomingProjects.length) {
    return "";
  }

  return (
    "；后续 " +
    upcomingProjects
      .map((project) => formatProjectFilterProjectLabel(project))
      .join("、")
  );
}

function formatProjectFilterEndpoint(projects) {
  const upcomingProjects = projects.filter((project) => !project.completed);
  const endpoint = projects[projects.length - 1];

  if (!endpoint || endpoint.completed || upcomingProjects.length <= 3) {
    return "";
  }

  return "；终点 " + formatProjectFilterProjectLabel(endpoint);
}

function formatProjectFilterRewardMix(projects) {
  const rewardText = formatProjectRewardCountText(getProjectRewardCounts(projects));
  return rewardText ? " · 奖励构成 " + rewardText : "";
}

function formatProjectFilterPendingRewardMix(projects) {
  const rewardText = formatProjectRewardCountText(
    getProjectRewardCounts(projects.filter((project) => !project.completed))
  );
  return rewardText ? " · 待领取奖励 " + rewardText : "";
}

function formatProjectFilterClaimedRewardMix(projects) {
  const completedProjects = projects.filter((project) => project.completed);
  const pendingProjects = projects.filter((project) => !project.completed);

  if (!completedProjects.length || !pendingProjects.length) {
    return "";
  }

  const rewardText = formatProjectRewardCountText(getProjectRewardCounts(completedProjects));
  return rewardText ? " · 已领取奖励 " + rewardText : "";
}

function formatProjectFilterTrackMix(projects) {
  const trackCounts = projects.reduce(
    (counts, project) =>
      project.upgradeId
        ? { ...counts, upgrade: counts.upgrade + 1 }
        : { ...counts, energy: counts.energy + 1 },
    {
      energy: 0,
      upgrade: 0
    }
  );
  const trackText = [
    ["累计", trackCounts.energy],
    ["升级", trackCounts.upgrade]
  ]
    .filter(([, count]) => count > 0)
    .map(([label, count]) => label + " " + count + " 段")
    .join(" / ");

  return trackText ? " · 推进构成 " + trackText : "";
}

function formatProjectFilterChapterMix(projects) {
  const chapterText = PROJECT_CHAPTER_DEFS.map((chapter) => [
    chapter.name,
    projects.filter((project) => project.chapterName === chapter.name).length
  ])
    .filter(([, count]) => count > 0)
    .map(([label, count]) => label + " " + count + " 段")
    .join(" / ");

  return chapterText ? " · 章节构成 " + chapterText : "";
}

function formatProjectFilterProjectLabel(project) {
  const positionText = [project.segmentText, project.chapterText].filter(Boolean).join(" · ");
  return positionText ? positionText + " " + project.name : project.name;
}

function formatProjectFilterBriefProjectLabel(project) {
  return project.segmentText ? project.segmentText + " " + project.name : project.name;
}

function getProjectRewardCounts(projects) {
  return projects.reduce(
    (counts, project) => {
      const effect = project.effect ?? {};
      return PROJECT_REWARD_SUMMARY_DEFS.reduce(
        (nextCounts, [, effectKey, countKey]) => ({
          ...nextCounts,
          [countKey]: nextCounts[countKey] + Number(Boolean(effect[effectKey]))
        }),
        counts
      );
    },
    {
      total: 0,
      click: 0,
      second: 0,
      overload: 0
    }
  );
}

function formatProjectRewardCountText(rewardCounts) {
  return PROJECT_REWARD_SUMMARY_DEFS.map(([label, , countKey]) => [
    label,
    rewardCounts[countKey]
  ])
    .filter(([, count]) => count > 0)
    .map(([label, count]) => label + " " + count + " 段")
    .join(" / ");
}

function formatMilestoneProject(project) {
  const statusText = project.completed ? "已完成" : project.progressText;
  return (
    project.name +
    "（" +
    project.segmentText +
    " · " +
    project.reward +
    " · " +
    statusText +
    "）"
  );
}

function buildRouteStanceMasteryText(option, projects) {
  const project = projects.find((item) => item.id === option.masteryProjectId);

  if (!project) {
    return "专精：等待后续航段";
  }
  if (project.completed) {
    return "专精：" + project.name + "已完成";
  }

  return (
    "专精：" +
    project.name +
    " " +
    formatProjectAmount(project, Math.min(project.currentValue, project.target)) +
    "/" +
    formatProjectAmount(project, project.target)
  );
}

function formatMultiplier(value) {
  return roundTo(value, 2).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDuration(seconds) {
  const value = Number(seconds);

  if (!Number.isFinite(value) || value <= 0) {
    return "片刻";
  }
  if (value >= 86_400) {
    return roundTo(value / 86_400, value >= 864_000 ? 0 : 1) + " 天";
  }
  if (value >= 3_600) {
    return roundTo(value / 3_600, value >= 36_000 ? 0 : 1) + " 小时";
  }
  if (value >= 60) {
    return roundTo(value / 60, value >= 600 ? 0 : 1) + " 分钟";
  }

  return Math.ceil(value) + " 秒";
}

function buildNextProjectGoal(state) {
  if (state.totalEnergy < PROJECT_GOAL_UNLOCK_ENERGY) {
    return null;
  }

  const projectIndex = PROJECT_DEFS.findIndex((item) => item.current(state) < item.target);
  if (projectIndex < 0) {
    return null;
  }
  const project = PROJECT_DEFS[projectIndex];

  return {
    id: "project-" + project.id,
    label: "星图计划",
    value: project.name,
    segmentIndex: projectIndex + 1,
    segmentTotal: PROJECT_DEFS.length,
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
  const segmentText =
    goal.segmentIndex && goal.segmentTotal
      ? buildProjectSegmentText(goal.segmentIndex, goal.segmentTotal) + " · "
      : "";
  const rewardText = goal.reward ? " · 奖励 " + goal.reward : "";
  if (remaining <= 0) {
    return segmentText + "进度 " + targetText + " / " + targetText + " · 已完成" + rewardText;
  }
  const actionText = typeof goal.action === "function" ? goal.action(state) : null;
  const suffixText = actionText ?? "还差 " + formatGoalAmount(goal, remaining);
  return (
    segmentText +
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

function buildProjectSegmentText(segmentIndex, segmentTotal) {
  return "航段 " + segmentIndex + "/" + segmentTotal;
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

function buildProjectTagText(project) {
  const trackText = project.upgradeId ? "升级航段" : "累计航段";
  const rewardTypes = PROJECT_REWARD_SUMMARY_DEFS.filter(([, effectKey]) =>
    Boolean(project.effect?.[effectKey])
  )
    .map(([label]) => label)
    .join("/");

  return rewardTypes ? trackText + " · " + rewardTypes + "奖励" : trackText;
}

function getProjectRewardVisualId(project) {
  const rewardType = PROJECT_REWARD_SUMMARY_DEFS.find(([, effectKey]) =>
    Boolean(project?.effect?.[effectKey])
  );

  return rewardType?.[2] ?? "total";
}

function buildProjectOverviewDispatchText(dispatch) {
  if (!dispatch?.active) {
    return "";
  }

  const relayText = dispatch.relayDirectiveName
    ? " · 协同 " + dispatch.relayDirectiveName
    : "";
  const branchText = dispatch.branchText ? " · " + dispatch.branchText : "";
  const branchFocusText = dispatch.branchFocusText
    ? " · " + dispatch.branchFocusText
    : "";
  const branchRecommendationText = dispatch.branchRecommendationText
    ? " · " + dispatch.branchRecommendationText
    : "";
  const branchRotationText = dispatch.branchRotationText
    ? " · " + dispatch.branchRotationText
    : "";
  const branchRouteText = dispatch.branchRouteText
    ? " · " + dispatch.branchRouteText
    : "";
  const branchPlanText = dispatch.branchPlanText
    ? " · " + dispatch.branchPlanText
    : "";
  const branchPlanStepText = dispatch.branchPlanStepText
    ? " · " + dispatch.branchPlanStepText
    : "";
  const branchClosureText = dispatch.branchClosureText
    ? " · " + dispatch.branchClosureText
    : "";
  const currentStep = Array.isArray(dispatch.loopSteps)
    ? dispatch.loopSteps.find((step) => step.state === "current")
    : null;
  const stepText = currentStep
    ? " · 下一步 " + currentStep.label + " " + currentStep.text
    : "";

  return (
    "远航调度总览：" +
    dispatch.segmentText +
    " " +
    dispatch.projectName +
    " · 目标 " +
    dispatch.targetDirectiveName +
    relayText +
    branchText +
    branchFocusText +
    branchRecommendationText +
    branchRotationText +
    branchRouteText +
    branchPlanText +
    branchPlanStepText +
    branchClosureText +
    " · 闭环 " +
    dispatch.loopProgress +
    "/" +
    dispatch.loopTarget +
    stepText
  );
}

function buildProjectDispatchInfo(project, state, isCurrent) {
  if (
    !isCurrent ||
    project.completed ||
    state.totalEnergy < FAR_ROUTE_DISPATCH_UNLOCK_ENERGY
  ) {
    return null;
  }

  const targetDirective = getFarRouteDispatchDirective(project, state);
  const relayDirective = getFarRouteDispatchRelayDirective(targetDirective);
  const detourDirective = getFarRouteDispatchDetourDirective(
    targetDirective,
    relayDirective
  );
  const branchFocus = getFarRouteDispatchBranchFocus(
    project,
    targetDirective,
    relayDirective
  );

  if (!targetDirective) {
    return null;
  }

  const relayText = relayDirective
    ? " · 协同 " +
      relayDirective.name +
      (detourDirective ? " · 绕行 " + detourDirective.name : " · 绕行备选")
    : "";
  const branchFocusText = branchFocus.text ? " · " + branchFocus.text : "";
  const relayStepText = relayDirective
    ? "协同 " +
      relayDirective.name +
      (detourDirective ? " / 绕行 " + detourDirective.name : " / 绕行备选")
    : "非目标续航";
  const targetRewardText = getFarRouteDispatchLoopStepRewardText(1, relayDirective);
  const relayRewardText = getFarRouteDispatchLoopStepRewardText(
    2,
    relayDirective,
    branchFocus
  );
  const loopRewardText = getFarRouteDispatchLoopStepRewardText(
    3,
    relayDirective,
    branchFocus
  );

  return {
    badgeText: "调度 " + targetDirective.name,
    detailText:
      "远航调度：目标 " +
      targetDirective.name +
      relayText +
      branchFocusText +
      " · 3/3 回到目标触发闭环",
    targetDirectiveId: targetDirective.id,
    targetDirectiveName: targetDirective.name,
    relayDirectiveId: relayDirective?.id ?? null,
    relayDirectiveName: relayDirective?.name ?? "",
    detourDirectiveId: detourDirective?.id ?? null,
    detourDirectiveName: detourDirective?.name ?? "",
    steps: [
      {
        label: "目标",
        directiveName: targetDirective.name,
        text: "目标 " + targetDirective.name,
        rewardText: targetRewardText
      },
      {
        label: relayDirective ? "协同/绕行" : "续航",
        directiveName: relayDirective
          ? relayDirective.name + "/" + (detourDirective?.name ?? "绕行")
          : "非目标指令",
        text: relayStepText,
        rewardText: relayRewardText
      },
      {
        label: "闭环",
        directiveName: targetDirective.name,
        text: "回目标 " + targetDirective.name,
        rewardText: loopRewardText
      }
    ],
    stepText:
      "调度路径：目标 " +
      targetDirective.name +
      "（" +
      targetRewardText +
      "） -> " +
      relayStepText +
      "（" +
      relayRewardText +
      "） -> 回目标 " +
      targetDirective.name +
      "（" +
      loopRewardText +
      "）"
  };
}

function buildFarRouteDispatchLoopSteps(
  directive,
  relayDirective,
  progress,
  target,
  branchFocus
) {
  if (!directive) {
    return [];
  }

  const detourDirective = getFarRouteDispatchDetourDirective(
    directive,
    relayDirective
  );
  const relayStepText = relayDirective
    ? relayDirective.name + "/" + (detourDirective?.name ?? "绕行")
    : "非目标续航";
  return [
    {
      label: "目标",
      text: directive.name,
      rewardText: getFarRouteDispatchLoopStepRewardText(1, relayDirective),
      state: getFarRouteDispatchLoopStepState(1, progress, target),
      stateText: getFarRouteDispatchLoopStepStateText(1, progress, target)
    },
    {
      label: relayDirective ? "协同/绕行" : "续航",
      text: relayStepText,
      rewardText: getFarRouteDispatchLoopStepRewardText(
        2,
        relayDirective,
        branchFocus
      ),
      state: getFarRouteDispatchLoopStepState(2, progress, target),
      stateText: getFarRouteDispatchLoopStepStateText(2, progress, target)
    },
    {
      label: "回目标",
      text: directive.name,
      rewardText: getFarRouteDispatchLoopStepRewardText(3, relayDirective),
      state: getFarRouteDispatchLoopStepState(3, progress, target),
      stateText: getFarRouteDispatchLoopStepStateText(3, progress, target)
    }
  ];
}

function getFarRouteDispatchLoopStepState(step, progress, target) {
  if (progress >= target || progress >= step) {
    return "completed";
  }

  if (progress === step - 1) {
    return "current";
  }

  return "pending";
}

function getFarRouteDispatchLoopStepStateText(step, progress, target) {
  const state = getFarRouteDispatchLoopStepState(step, progress, target);
  if (state === "completed") {
    return "已完成";
  }

  if (state === "current") {
    return "下一步";
  }

  return "待推进";
}

function buildFarRouteDispatchLoopStepText(steps) {
  if (!steps.length) {
    return "";
  }

  return (
    "远航路径：" +
    steps
      .map(
        (step) =>
          step.stateText +
          " " +
          step.label +
          " " +
          step.text +
          (step.rewardText ? "（" + step.rewardText + "）" : "")
      )
      .join(" -> ")
  );
}

function appendFarRouteDispatchBranchText(text, branchStatus) {
  if (!branchStatus?.text) {
    return text;
  }

  return text + " · " + branchStatus.text;
}

function getFarRouteDispatchBranchFocus(project, directive, relayDirective) {
  if (!project || !directive || !relayDirective) {
    return {
      kind: "",
      label: "",
      text: "",
      reason: "",
      reasonText: "",
      directiveId: null,
      directiveName: ""
    };
  }

  const effect = project.effect ?? {};
  const kind =
    effect.secondMultiplier || effect.totalMultiplier ? "detour" : "sync";
  const detourDirective = getFarRouteDispatchDetourDirective(
    directive,
    relayDirective
  );
  const focusDirective = kind === "sync" ? relayDirective : detourDirective;
  if (!focusDirective) {
    return {
      kind: "",
      label: "",
      text: "",
      reason: "",
      reasonText: "",
      directiveId: null,
      directiveName: ""
    };
  }

  const label = kind === "sync" ? "协同" : "绕行";
  const reason =
    kind === "sync"
      ? "点击/过载航段保留当前资源"
      : "自动/总产能航段投送累计航段";

  return {
    kind,
    label,
    text: "航段契合：" + label + " " + focusDirective.name + " · " + reason,
    reason,
    reasonText: "推荐原因：" + reason,
    directiveId: focusDirective.id,
    directiveName: focusDirective.name
  };
}

function buildFarRouteDispatchBranchChoices(
  state,
  directive,
  relayDirective,
  branchStatus,
  branchFocus
) {
  if (!directive || !relayDirective) {
    return [];
  }

  const detourDirective = getFarRouteDispatchDetourDirective(
    directive,
    relayDirective
  );
  const previousBranchDirective = getDirectiveDef(state.farRouteLastBranchDirectiveId);
  const rotationBranchDirective = getDirectiveDef(
    state.farRouteBranchRotationDirectiveId
  );
  const previousBranchDirectiveId =
    previousBranchDirective && previousBranchDirective.id !== directive.id
      ? previousBranchDirective.id
      : null;
  const choices = [
    {
      kind: "sync",
      label: "协同",
      directive: relayDirective,
      caption: "补当前资源",
      routeResourceKind: "current",
      routeResourceText: "保留当前",
      nextText: "后续协同回航触发闭环与远航突破",
      baseRewardText:
        "远航协同 +" +
        Math.round(FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE * 100) +
        "% · 协同补给 +" +
        Math.round(FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE * 100) +
        "%当前"
    },
    detourDirective
      ? {
          kind: "detour",
          label: "绕行",
          directive: detourDirective,
          caption: "投送累计航段",
          routeResourceKind: "progress",
          routeResourceText: "投送累计",
          nextText: "后续绕行回航触发闭环与绕行突破",
          baseRewardText:
            "远航绕行 +" +
            Math.round(FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE * 100) +
            "% · 绕行投送 -" +
            roundTo(FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE * 100, 2) +
            "%当前"
        }
      : null
  ].filter(Boolean);

  return choices.map((choice) => {
    const active =
      branchStatus?.directiveId === choice.directive.id &&
      (branchStatus.kind === choice.kind ||
        branchStatus.kind === choice.kind + "-prep");
    const previous = previousBranchDirectiveId === choice.directive.id;
    const stable = previous;
    const shift =
      Boolean(previousBranchDirectiveId) &&
      previousBranchDirectiveId !== choice.directive.id;
    const rotationReady = active && rotationBranchDirective?.id === choice.directive.id;
    const focused = branchFocus?.directiveId === choice.directive.id;
    const status = active ? "active" : shift ? "shift" : previous ? "previous" : "available";
    const statusText = active
      ? "当前路线"
      : shift
        ? "可改道"
        : previous
          ? "上轮路线"
          : "可选择";
    const reasonText = focused ? branchFocus.reasonText : "";
    const objectiveText = buildFarRouteDispatchBranchObjectiveText(
      choice.label,
      active,
      shift,
      stable,
      focused,
      branchStatus
    );
    const decisionText = buildFarRouteDispatchBranchDecisionText(
      choice.label,
      active,
      shift,
      stable,
      focused,
      branchStatus
    );
    const decisionKind = buildFarRouteDispatchBranchDecisionKind(
      active,
      shift,
      stable,
      focused,
      branchStatus
    );
    const decisionBadgeText =
      buildFarRouteDispatchBranchDecisionBadgeText(decisionKind);
    const routeMarkerKind = buildFarRouteDispatchBranchRouteMarkerKind(
      active,
      shift,
      stable,
      focused
    );
    const routeMarkerText =
      buildFarRouteDispatchBranchRouteMarkerText(routeMarkerKind);
    const routeNodeStates = buildFarRouteDispatchBranchRouteNodeStates(
      active,
      branchStatus
    );
    const routeProgressPercent =
      buildFarRouteDispatchBranchRouteProgressPercent(routeNodeStates);
    const routePhase = buildFarRouteDispatchBranchRoutePhase(routeNodeStates);
    const routeStepLabels = {
      ...FAR_ROUTE_DISPATCH_BRANCH_ROUTE_STEP_LABELS
    };
    const routeRewardLabels =
      buildFarRouteDispatchBranchRouteRewardLabels(choice.kind);
    const routeRewardText =
      buildFarRouteDispatchBranchRouteRewardText(routeRewardLabels);
    const routeFlow = buildFarRouteDispatchBranchRouteFlow(choice.kind);
    const routeCost = buildFarRouteDispatchBranchRouteCost(choice.kind);
    const routeIntent = buildFarRouteDispatchBranchRouteIntent(choice.kind);
    const routeReturn = buildFarRouteDispatchBranchRouteReturn(choice.kind);
    const routeCommandLabels = buildFarRouteDispatchBranchRouteCommandLabels(
      directive.name,
      choice.directive.name
    );
    const routeCommandText =
      buildFarRouteDispatchBranchRouteCommandText(routeCommandLabels);
    const followupText = buildFarRouteDispatchBranchFollowupText(
      choice.label,
      choice.directive.name,
      directive.name,
      active,
      branchStatus,
      state
    );
    const rewardText =
      choice.baseRewardText +
      (shift
        ? " · 分支改道 +" +
          Math.round(FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE * 100) +
          "%"
        : "") +
      (stable
        ? " · 路线稳航 +" +
          Math.round(FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE * 100) +
          "%"
        : "") +
      (focused
        ? " · 航段契合 +" +
          Math.round(FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE * 100) +
          "%"
        : "") +
      (rotationReady
        ? " · 轮替闭环 +" +
          Math.round(FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE * 100) +
          "%"
        : "");
    const payoffText = buildFarRouteDispatchBranchPayoffText(
      choice.kind,
      shift,
      stable,
      focused,
      rotationReady
    );

    return {
      kind: choice.kind,
      label: choice.label,
      directiveId: choice.directive.id,
      directiveName: choice.directive.name,
      caption: choice.caption,
      routeResourceKind: choice.routeResourceKind,
      routeResourceText: choice.routeResourceText,
      routeMarkerKind,
      routeMarkerText,
      routeNodeStates,
      routeProgressPercent,
      routePhaseKind: routePhase.kind,
      routePhaseText: routePhase.text,
      routeStepLabels,
      routeRewardLabels,
      routeRewardText,
      routeFlowKind: routeFlow.kind,
      routeFlowText: routeFlow.text,
      routeCostKind: routeCost.kind,
      routeCostText: routeCost.text,
      routeIntentKind: routeIntent.kind,
      routeIntentText: routeIntent.text,
      routeReturnKind: routeReturn.kind,
      routeReturnText: routeReturn.text,
      routeCommandLabels,
      routeCommandText,
      nextText: choice.nextText,
      reasonText,
      decisionText,
      decisionKind,
      decisionBadgeText,
      objectiveText,
      followupText,
      active,
      previous,
      stable,
      shift,
      rotationReady,
      focused,
      focusText: focused ? branchFocus.text : "",
      status,
      statusText,
      payoffText,
      rewardText,
      text:
        choice.label +
        " " +
        choice.directive.name +
        " · " +
        statusText +
        " · " +
        decisionBadgeText +
        " · " +
        routePhase.text +
        " · " +
        routeRewardText +
        " · " +
        routeFlow.text +
        " · " +
        routeCost.text +
        " · " +
        routeIntent.text +
        " · " +
        routeReturn.text +
        " · " +
        routeCommandText +
        " · " +
        choice.caption +
        (reasonText ? " · " + reasonText : "") +
        " · " +
        decisionText +
        " · " +
        objectiveText +
        " · " +
        followupText +
        " · " +
        choice.nextText +
        " · " +
        payoffText +
        " · " +
        rewardText
    };
  });
}

function buildFarRouteDispatchBranchDecisionText(
  label,
  active,
  shift,
  stable,
  focused,
  branchStatus
) {
  if (active) {
    const preparing = String(branchStatus?.kind ?? "").endsWith("-prep");
    return preparing
      ? "路线判断：本轮已完成" + label + "，先处理整备"
      : "路线判断：本轮已选" + label + "，回目标确认";
  }

  if (focused && shift) {
    return "路线判断：推荐改道";
  }

  if (focused && stable) {
    return "路线判断：推荐稳航";
  }

  if (focused) {
    return "路线判断：当前航段首推";
  }

  if (shift) {
    return "路线判断：备选改道";
  }

  if (stable) {
    return "路线判断：备选稳航";
  }

  return "路线判断：备选建档";
}

function buildFarRouteDispatchBranchRouteMarkerKind(
  active,
  shift,
  stable,
  focused
) {
  if (active) {
    return "current";
  }

  if (focused && shift) {
    return "recommended-shift";
  }

  if (focused && stable) {
    return "recommended-previous";
  }

  if (focused) {
    return "recommended";
  }

  if (stable) {
    return "previous";
  }

  if (shift) {
    return "shift";
  }

  return "available";
}

function buildFarRouteDispatchBranchRouteMarkerText(routeMarkerKind) {
  switch (routeMarkerKind) {
    case "current":
      return "本轮";
    case "recommended-shift":
      return "推荐改道";
    case "recommended-previous":
      return "推荐上轮";
    case "recommended":
      return "推荐";
    case "previous":
      return "上轮";
    case "shift":
      return "改道";
    default:
      return "备选";
  }
}

function buildFarRouteDispatchBranchRouteNodeStates(active, branchStatus) {
  const kind = String(branchStatus?.kind ?? "");

  if (kind === "pending" && branchStatus?.directiveId) {
    return {
      start: "next",
      branch: "waiting",
      return: "waiting"
    };
  }

  if (kind === "pending") {
    return {
      start: "done",
      branch: "next",
      return: "waiting"
    };
  }

  if (active && (kind === "sync" || kind === "detour")) {
    return {
      start: "done",
      branch: "done",
      return: "next"
    };
  }

  if (active && (kind === "sync-prep" || kind === "detour-prep")) {
    return {
      start: "done",
      branch: "done",
      return: "done"
    };
  }

  if (kind === "sync" || kind === "detour" || kind.endsWith("-prep")) {
    return {
      start: "done",
      branch: "waiting",
      return: "waiting"
    };
  }

  return {
    start: "waiting",
    branch: "waiting",
    return: "waiting"
  };
}

function buildFarRouteDispatchBranchRouteProgressPercent(routeNodeStates) {
  if (routeNodeStates?.return === "done" || routeNodeStates?.return === "next") {
    return 100;
  }

  if (routeNodeStates?.branch === "done" || routeNodeStates?.branch === "next") {
    return 50;
  }

  return 0;
}

function buildFarRouteDispatchBranchRoutePhase(routeNodeStates) {
  if (routeNodeStates?.return === "done") {
    return {
      kind: "complete",
      text: "3/3 完成"
    };
  }

  if (routeNodeStates?.return === "next" || routeNodeStates?.branch === "done") {
    return {
      kind: "return",
      text: "2/3 回航"
    };
  }

  if (routeNodeStates?.branch === "next") {
    return {
      kind: "branch",
      text: "1/3 分支"
    };
  }

  if (routeNodeStates?.start === "next") {
    return {
      kind: "start",
      text: "0/3 起手"
    };
  }

  return {
    kind: "inactive",
    text: "未选"
  };
}

function buildFarRouteDispatchBranchRouteRewardLabels(kind) {
  return {
    ...(FAR_ROUTE_DISPATCH_BRANCH_ROUTE_REWARD_LABELS[kind] ??
      FAR_ROUTE_DISPATCH_BRANCH_ROUTE_REWARD_LABELS.sync)
  };
}

function buildFarRouteDispatchBranchRouteRewardText(routeRewardLabels) {
  const labels = [
    routeRewardLabels?.start,
    routeRewardLabels?.branch,
    routeRewardLabels?.return
  ].filter(Boolean);

  return labels.length ? "收益点：" + labels.join(" -> ") : "";
}

function buildFarRouteDispatchBranchRouteFlow(kind) {
  return {
    ...(FAR_ROUTE_DISPATCH_BRANCH_ROUTE_FLOW_LABELS[kind] ??
      FAR_ROUTE_DISPATCH_BRANCH_ROUTE_FLOW_LABELS.sync)
  };
}

function buildFarRouteDispatchBranchRouteCost(kind) {
  return {
    ...(FAR_ROUTE_DISPATCH_BRANCH_ROUTE_COST_LABELS[kind] ??
      FAR_ROUTE_DISPATCH_BRANCH_ROUTE_COST_LABELS.sync)
  };
}

function buildFarRouteDispatchBranchRouteIntent(kind) {
  return {
    ...(FAR_ROUTE_DISPATCH_BRANCH_ROUTE_INTENT_LABELS[kind] ??
      FAR_ROUTE_DISPATCH_BRANCH_ROUTE_INTENT_LABELS.sync)
  };
}

function buildFarRouteDispatchBranchRouteReturn(kind) {
  return {
    ...(FAR_ROUTE_DISPATCH_BRANCH_ROUTE_RETURN_LABELS[kind] ??
      FAR_ROUTE_DISPATCH_BRANCH_ROUTE_RETURN_LABELS.sync)
  };
}

function buildFarRouteDispatchBranchRouteCommandLabels(
  targetDirectiveName,
  branchDirectiveName
) {
  const targetName = String(targetDirectiveName ?? "");
  const branchName = String(branchDirectiveName ?? "");

  return {
    start: targetName,
    branch: branchName,
    return: targetName
  };
}

function buildFarRouteDispatchBranchRouteCommandText(routeCommandLabels) {
  const labels = [
    routeCommandLabels?.start,
    routeCommandLabels?.branch,
    routeCommandLabels?.return
  ].filter(Boolean);

  return labels.length ? "路线指令：" + labels.join(" -> ") : "";
}

function buildFarRouteDispatchBranchDecisionKind(
  active,
  shift,
  stable,
  focused,
  branchStatus
) {
  if (active) {
    return String(branchStatus?.kind ?? "").endsWith("-prep") ? "completed" : "selected";
  }

  if (focused && shift) {
    return "recommended-shift";
  }

  if (focused && stable) {
    return "recommended-stable";
  }

  if (focused) {
    return "recommended";
  }

  if (shift) {
    return "fallback-shift";
  }

  if (stable) {
    return "fallback-stable";
  }

  return "fallback";
}

function buildFarRouteDispatchBranchDecisionBadgeText(decisionKind) {
  switch (decisionKind) {
    case "recommended":
      return "首推";
    case "recommended-stable":
      return "稳航";
    case "recommended-shift":
      return "改道";
    case "fallback-stable":
      return "备选稳航";
    case "fallback-shift":
      return "备选改道";
    case "selected":
      return "已选";
    case "completed":
      return "已完成";
    default:
      return "建档";
  }
}

function buildFarRouteDispatchBranchObjectiveText(
  label,
  active,
  shift,
  stable,
  focused,
  branchStatus
) {
  if (active) {
    const preparing = String(branchStatus?.kind ?? "").endsWith("-prep");
    return preparing
      ? "路线目标：已完成" + label + "路线，整备后接回目标"
      : "路线目标：本轮走" + label + "路线，下一步回目标确认";
  }

  if (shift) {
    return (
      "路线目标：改走" +
      (focused ? "推荐" : "") +
      label +
      "，开启轮替闭环"
    );
  }

  if (stable) {
    return (
      "路线目标：续走上轮" +
      (focused ? "推荐" : "") +
      label +
      "，触发路线稳航"
    );
  }

  if (focused) {
    return "路线目标：按当前航段推荐建立" + label + "路线";
  }

  return "路线目标：建立" + label + "路线，记录为下轮对照";
}

function buildFarRouteDispatchBranchFollowupText(
  label,
  directiveName,
  targetDirectiveName,
  active,
  branchStatus,
  state
) {
  const kind = String(branchStatus?.kind ?? "");
  const branchDirectiveId = branchStatus?.directiveId ?? null;
  const chain = state?.directiveChain ?? {};

  if (active) {
    if (kind === "sync" || kind === "detour") {
      return "下一步：回目标 " + targetDirectiveName + " 完成" + label + "闭环";
    }

    if (kind === "sync-prep" || kind === "detour-prep") {
      if (branchDirectiveId && chain.lastDirectiveId === branchDirectiveId) {
        return "下一步：回目标 " + targetDirectiveName + " 触发整备回航";
      }

      return (
        "下一步：" +
        (kind === "detour-prep" ? "绕行整备 " : "整备 ") +
        directiveName +
        "，再回目标 " +
        targetDirectiveName
      );
    }
  }

  if (kind === "pending") {
    return branchStatus?.directiveName === targetDirectiveName
      ? "下一步：先执行目标 " +
          targetDirectiveName +
          "，再选" +
          label +
          " " +
          directiveName
      : "下一步：执行" +
          label +
          " " +
          directiveName +
          "，再回目标 " +
          targetDirectiveName;
  }

  if (kind.endsWith("-prep")) {
    return "下一轮：目标 " + targetDirectiveName + " 后可走" + label + " " + directiveName;
  }

  if (kind === "sync" || kind === "detour") {
    return "下一轮：回目标 " + targetDirectiveName + " 后再评估" + label + "路线";
  }

  return (
    "下一步：执行" +
    label +
    " " +
    directiveName +
    "，再回目标 " +
    targetDirectiveName
  );
}

function buildFarRouteDispatchBranchPayoffText(
  kind,
  shift,
  stable,
  focused,
  rotationReady
) {
  let instantRate =
    kind === "sync"
      ? FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE + FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE
      : FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE;

  if (shift) {
    instantRate += FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE;
  }
  if (stable) {
    instantRate += FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE;
  }
  if (focused) {
    instantRate += FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE;
  }

  const returnRewards = [
    "远航闭环 +" + Math.round(FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE * 100) + "%",
    "远航突破 +" +
      roundTo(FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE * 100, 3) +
      "%剩余"
  ];

  if (kind === "detour") {
    returnRewards.push(
      "绕行突破 +" +
        roundTo(FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE * 100, 3) +
        "%剩余"
    );
  }
  if (shift || rotationReady) {
    returnRewards.push(
      "轮替闭环 +" +
        Math.round(FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE * 100) +
        "%"
    );
  }
  if (focused) {
    returnRewards.push(
      "契合闭环 +" +
        Math.round(FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE * 100) +
        "%"
    );
  }

  return (
    "本步合计 +" +
    Math.round(instantRate * 100) +
    "%" +
    (kind === "detour" ? " · 投送累计" : "") +
    " · 回目标 " +
    returnRewards.join(" + ")
  );
}

function buildFarRouteDispatchBranchChoiceText(choices) {
  if (!choices.length) {
    return "";
  }

  return (
    "分支选择：" +
    choices
      .map(
        (choice) =>
          choice.label +
          " " +
          choice.directiveName +
          "（" +
          choice.statusText +
          " · " +
          choice.decisionBadgeText +
          " · " +
          choice.routePhaseText +
          " · " +
          choice.routeRewardText +
          " · " +
          choice.routeCostText +
          " · " +
          choice.routeIntentText +
          " · " +
          choice.routeReturnText +
          " · " +
          choice.routeCommandText +
          " · " +
          choice.caption +
          (choice.reasonText ? " · " + choice.reasonText : "") +
          " · " +
          choice.decisionText +
          " · " +
          choice.objectiveText +
          " · " +
          choice.followupText +
          " · " +
          choice.nextText +
          " · " +
          choice.payoffText +
          " · " +
          choice.rewardText +
          "）"
      )
      .join(" / ")
  );
}

function buildFarRouteDispatchBranchChoiceSummaryText(choices) {
  if (!choices.length) {
    return "";
  }

  return (
    "路线对照：" +
    choices
      .map(
        (choice) =>
          choice.label +
          " " +
          choice.decisionBadgeText +
          " · " +
          choice.routeIntentText +
          " · " +
          choice.routeCostText +
          " · " +
          choice.routeReturnText
      )
      .join(" / ")
  );
}

function buildFarRouteDispatchBranchRouteText(choices, branchStatus) {
  if (!choices.length) {
    return "";
  }

  const previousChoice = choices.find((choice) => choice.previous);
  const activeChoice = choices.find((choice) => choice.active);
  const shiftChoice = choices.find((choice) => choice.shift && !choice.active);
  const previousText = previousChoice
    ? previousChoice.label + " " + previousChoice.directiveName
    : "无";
  const currentText = activeChoice
    ? activeChoice.label + " " + activeChoice.directiveName
    : branchStatus?.kind === "pending"
      ? "待选择"
      : "待选择";
  let nextText = "";

  if (activeChoice?.rotationReady) {
    nextText = "回目标结算轮替闭环";
  } else if (activeChoice) {
    nextText = String(branchStatus?.kind ?? "").endsWith("-prep")
      ? "已记录当前路线，下一轮可改道"
      : "回目标后记录当前路线";
  } else if (shiftChoice) {
    nextText = previousChoice
      ? "可续走上轮路线触发稳航，或改走" +
        shiftChoice.label +
        " " +
        shiftChoice.directiveName
      : "建议改走" + shiftChoice.label + " " + shiftChoice.directiveName;
  } else if (previousChoice) {
    nextText = "选择另一分支触发改道";
  } else {
    nextText = "先完成任一分支闭环";
  }

  return (
    "路线履历：记录 " +
    previousText +
    " · 本轮 " +
    currentText +
    " · " +
    nextText
  );
}

function buildFarRouteDispatchBranchPlanText(directive, choices, branchStatus) {
  if (!directive || !choices.length) {
    return "";
  }

  const activeChoice = choices.find((choice) => choice.active);
  const focusedChoice = choices.find((choice) => choice.focused);
  const shiftChoice = choices.find((choice) => choice.shift && !choice.active);
  const availableChoice =
    choices.find((choice) => !choice.active && !choice.previous) ??
    choices.find((choice) => !choice.active) ??
    choices[0];
  let planLabel = "推荐";
  let planChoice = focusedChoice ?? shiftChoice ?? availableChoice;

  if (activeChoice) {
    const isPrep = String(branchStatus?.kind ?? "").endsWith("-prep");
    if (isPrep) {
      planLabel = "下一轮";
      planChoice =
        shiftChoice ??
        (focusedChoice && !focusedChoice.active ? focusedChoice : null) ??
        availableChoice ??
        activeChoice;
    } else {
      planLabel = "本轮";
      planChoice = activeChoice;
    }
  } else if (shiftChoice && !focusedChoice) {
    planLabel = "建议";
    planChoice = shiftChoice;
  }

  if (!planChoice) {
    return "";
  }

  return (
    "路线预案：" +
    planLabel +
    " 目标 " +
    directive.name +
    " -> " +
    planChoice.label +
    " " +
    planChoice.directiveName +
    " -> 回目标 " +
    directive.name
  );
}

function buildFarRouteDispatchBranchPlanStepText(
  state,
  directive,
  choices,
  branchStatus
) {
  if (!directive || !choices.length || !branchStatus?.kind) {
    return "";
  }

  const kind = branchStatus.kind;
  if (kind === "pending") {
    if (branchStatus.directiveId === directive.id) {
      return "路线步骤：第 1/3 执行目标 " + directive.name;
    }

    return "路线步骤：第 2/3 " + buildFarRouteDispatchBranchSelectionStepText(choices);
  }

  if (kind === "sync") {
    return "路线步骤：第 3/3 协同回航 " + directive.name;
  }

  if (kind === "detour") {
    return "路线步骤：第 3/3 绕行回航 " + directive.name;
  }

  if (kind === "sync-prep" || kind === "detour-prep") {
    const branchDirectiveName =
      branchStatus.directiveName ||
      choices.find((choice) => choice.active)?.directiveName ||
      "";
    const chain = state.directiveChain ?? {};
    if (branchDirectiveName && chain.lastDirectiveId === branchStatus.directiveId) {
      return "路线步骤：整备回航 " + directive.name;
    }

    const prepLabel = kind === "detour-prep" ? "绕行整备" : "整备";
    return (
      "路线步骤：" +
      prepLabel +
      (branchDirectiveName ? " " + branchDirectiveName : "") +
      "，随后回目标 " +
      directive.name
    );
  }

  return "";
}

function buildFarRouteDispatchBranchClosureText(state, choices, branchStatus) {
  const kind = String(branchStatus?.kind ?? "");
  if (!choices.length || (kind !== "sync-prep" && kind !== "detour-prep")) {
    return "";
  }

  const activeChoice =
    choices.find(
      (choice) =>
        choice.active &&
        (!branchStatus.directiveId ||
          choice.directiveId === branchStatus.directiveId)
    ) ?? choices.find((choice) => choice.active);

  if (!activeChoice) {
    return "";
  }

  const branchText = activeChoice.label + " " + activeChoice.directiveName;
  const isDetour = kind === "detour-prep";
  const chain = state?.directiveChain ?? {};

  if (branchStatus.directiveId && chain.lastDirectiveId === branchStatus.directiveId) {
    return (
      "闭环复盘：" +
      branchText +
      " 已整备 · 下一步回目标触发整备回航 +" +
      Math.round(FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE * 100) +
      "%"
    );
  }

  const rewardTexts = [
    "远航闭环 +" + Math.round(FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE * 100) + "%",
    "远航突破 +" +
      roundTo(FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE * 100, 3) +
      "%剩余"
  ];

  if (isDetour) {
    rewardTexts.push(
      "绕行突破 +" +
        roundTo(FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE * 100, 3) +
        "%剩余"
    );
  }

  if (activeChoice.focused) {
    rewardTexts.push(
      "契合闭环 +" +
        Math.round(FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE * 100) +
        "%"
    );
  }

  return (
    "闭环复盘：刚完成" +
    branchText +
    " · 已触发" +
    rewardTexts.join("、") +
    " · 下一步" +
    (isDetour ? "绕行整备 " : "整备 ") +
    activeChoice.directiveName
  );
}

function buildFarRouteDispatchBranchSelectionStepText(choices) {
  const focusedChoice = choices.find((choice) => choice.focused);
  if (focusedChoice) {
    const otherChoices = choices.filter(
      (choice) => choice.directiveId !== focusedChoice.directiveId
    );
    const otherText = otherChoices
      .map((choice) => choice.label + " " + choice.directiveName)
      .join("或");

    return (
      "选择推荐" +
      focusedChoice.label +
      " " +
      focusedChoice.directiveName +
      (otherText ? "，或" + otherText : "")
    );
  }

  return (
    "选择" +
    choices
      .map((choice) => choice.label + " " + choice.directiveName)
      .join("或")
  );
}

function getFarRouteDispatchRouteStepText(dispatch, directiveId, state) {
  if (!dispatch?.active || !directiveId) {
    return "";
  }

  const kind = String(dispatch.branchKind ?? "");
  const targetDirectiveId = dispatch.targetDirectiveId;
  const branchDirectiveId = dispatch.branchDirectiveId;
  const choices = Array.isArray(dispatch.branchChoices) ? dispatch.branchChoices : [];

  if (kind === "pending") {
    if (branchDirectiveId === targetDirectiveId) {
      return directiveId === targetDirectiveId ? "路线 1/3 目标" : "";
    }

    const choice = choices.find((item) => item.directiveId === directiveId);
    if (!choice) {
      return "";
    }

    return "路线 2/3 " + (choice.focused ? "推荐" : "") + choice.label;
  }

  if ((kind === "sync" || kind === "detour") && directiveId === targetDirectiveId) {
    return "路线 3/3 " + (kind === "sync" ? "协同回航" : "绕行回航");
  }

  if (kind === "sync-prep" || kind === "detour-prep") {
    const chain = state?.directiveChain ?? {};
    if (branchDirectiveId && chain.lastDirectiveId === branchDirectiveId) {
      return directiveId === targetDirectiveId ? "路线 整备回航" : "";
    }

    if (directiveId === branchDirectiveId) {
      return kind === "detour-prep" ? "路线 绕行整备" : "路线 整备续航";
    }
  }

  return "";
}

function formatFarRouteDispatchRouteStepNotice(routeStepText) {
  return routeStepText ? routeStepText.replace(/^路线 /, "路线执行：") : "";
}

function getFarRouteDispatchRouteResultText(dispatch, directiveId, state) {
  if (!dispatch?.active || !directiveId) {
    return "";
  }

  const kind = String(dispatch.branchKind ?? "");
  const targetDirectiveId = dispatch.targetDirectiveId;
  const targetDirectiveName = dispatch.targetDirectiveName || "目标指令";
  const branchDirectiveId = dispatch.branchDirectiveId;
  const branchDirectiveName = dispatch.branchDirectiveName || "分支指令";
  const choices = Array.isArray(dispatch.branchChoices) ? dispatch.branchChoices : [];

  if (kind === "pending") {
    if (branchDirectiveId === targetDirectiveId) {
      if (directiveId !== targetDirectiveId) {
        return "";
      }

      const nextStep = buildFarRouteDispatchBranchSelectionStepText(choices);
      return (
        "路线反馈：已完成目标 " +
        targetDirectiveName +
        (nextStep ? " · 下一步" + nextStep : "")
      );
    }

    const choice = choices.find((item) => item.directiveId === directiveId);
    if (!choice) {
      return "";
    }

    return (
      "路线反馈：已选择" +
      choice.label +
      " " +
      choice.directiveName +
      " · 下一步回目标 " +
      targetDirectiveName
    );
  }

  if ((kind === "sync" || kind === "detour") && directiveId === targetDirectiveId) {
    const label = kind === "sync" ? "协同" : "绕行";
    const prepLabel = kind === "detour" ? "绕行整备" : "整备";
    return (
      "路线反馈：已完成" +
      label +
      "回航 " +
      targetDirectiveName +
      " · 下一步" +
      prepLabel +
      " " +
      branchDirectiveName
    );
  }

  if (kind === "sync-prep" || kind === "detour-prep") {
    const prepLabel = kind === "detour-prep" ? "绕行整备" : "整备";
    const chain = state?.directiveChain ?? {};

    if (branchDirectiveId && chain.lastDirectiveId === branchDirectiveId) {
      return directiveId === targetDirectiveId
        ? "路线反馈：已完成整备回航 " +
            targetDirectiveName +
            " · 下一轮可重新选择协同或绕行"
        : "";
    }

    if (directiveId === branchDirectiveId) {
      return (
        "路线反馈：已完成" +
        prepLabel +
        " " +
        branchDirectiveName +
        " · 下一步回目标 " +
        targetDirectiveName
      );
    }
  }

  return "";
}

function buildFarRouteDispatchBranchRecommendationText(choices) {
  const focusedChoice = choices.find((choice) => choice.focused);
  if (!focusedChoice) {
    return "";
  }

  const reasons = [
    focusedChoice.statusText,
    focusedChoice.caption,
    focusedChoice.reasonText,
    focusedChoice.nextText,
    "航段契合 +" +
      Math.round(FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE * 100) +
      "%"
  ];

  if (focusedChoice.status === "shift") {
    reasons.push(
      "分支改道 +" +
        Math.round(FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE * 100) +
        "%"
    );
  }
  if (focusedChoice.stable) {
    reasons.push(
      "路线稳航 +" +
        Math.round(FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE * 100) +
        "%"
    );
  }

  return (
    "推荐分支：" +
    focusedChoice.label +
    " " +
    focusedChoice.directiveName +
    " · " +
    reasons.join(" · ")
  );
}

function buildFarRouteDispatchBranchRotationText(choices) {
  if (!choices.length) {
    return "";
  }

  const rotationChoice = choices.find((choice) => choice.rotationReady);
  if (rotationChoice) {
    return (
      "分支轮替：当前已改走" +
      rotationChoice.label +
      " " +
      rotationChoice.directiveName +
      "，回到目标闭环触发轮替闭环 +" +
      Math.round(FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE * 100) +
      "%"
    );
  }

  const shiftChoice = choices.find((choice) => choice.status === "shift");
  const previousChoice = choices.find((choice) => choice.previous);
  if (shiftChoice) {
    const stabilityText = previousChoice
      ? "续走" +
        previousChoice.label +
        " " +
        previousChoice.directiveName +
        "触发路线稳航 +" +
        Math.round(FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE * 100) +
        "%，或"
      : "";
    return (
      "分支轮替：" +
      stabilityText +
      "改走" +
      shiftChoice.label +
      " " +
      shiftChoice.directiveName +
      "触发分支改道 +" +
      Math.round(FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE * 100) +
      "%，回到目标闭环触发轮替闭环 +" +
      Math.round(FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE * 100) +
      "%"
    );
  }

  const activeChoice = choices.find((choice) => choice.status === "active");
  if (activeChoice) {
    if (activeChoice.stable) {
      return (
        "分支轮替：本轮续走" +
        activeChoice.label +
        " " +
        activeChoice.directiveName +
        "已触发路线稳航 +" +
        Math.round(FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE * 100) +
        "%，完成闭环后下一轮可改道"
      );
    }

    return (
      "分支轮替：当前已走" +
      activeChoice.label +
      " " +
      activeChoice.directiveName +
      "，完成闭环后下一轮可改道"
    );
  }

  return "分支轮替：先完成协同或绕行闭环，下一轮开启分支改道";
}

function getFarRouteDispatchBranchStatus(state, directive, relayDirective, now) {
  if (!directive) {
    return {
      kind: "none",
      text: "",
      directiveId: null,
      directiveName: ""
    };
  }

  const branchBase = {
    active: true,
    targetDirectiveId: directive.id,
    relayDirectiveId: relayDirective?.id ?? null,
    chainWindowSeconds:
      DIRECTIVE_CHAIN_WINDOW_SECONDS + FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS
  };
  const chain = state.directiveChain ?? {};
  const active = Boolean(chain.lastDirectiveId && chain.expiresAt >= now);
  const rawStacks = Number(chain.stacks);
  const stacks = Math.min(
    DIRECTIVE_CHAIN_MAX_STACKS,
    Math.max(0, Number.isFinite(rawStacks) ? Math.floor(rawStacks) : 0)
  );
  const progress = active ? Math.min(DIRECTIVE_CHAIN_MAX_STACKS + 1, stacks + 1) : 0;

  if (!relayDirective) {
    return {
      kind: "relay",
      text: "分支 续航：非目标指令",
      directiveId: null,
      directiveName: ""
    };
  }

  if (!active) {
    return {
      kind: "pending",
      text: "分支 待选择：先执行目标",
      directiveId: directive.id,
      directiveName: directive.name
    };
  }

  if (progress >= DIRECTIVE_CHAIN_MAX_STACKS + 1) {
    const completedBranchDirective = getFarRouteDispatchCompletedBranchDirective(
      state,
      branchBase,
      now
    );
    const branchDirective = completedBranchDirective ?? relayDirective;
    const kind = branchDirective.id === relayDirective.id ? "sync-prep" : "detour-prep";
    const label = kind === "sync-prep" ? "协同整备" : "绕行整备";

    return {
      kind,
      text: "分支 " + label + "：" + branchDirective.name,
      directiveId: branchDirective.id,
      directiveName: branchDirective.name
    };
  }

  if (chain.lastDirectiveId === directive.id) {
    return {
      kind: "pending",
      text: "分支 待选择：协同或绕行",
      directiveId: null,
      directiveName: ""
    };
  }

  if (chain.lastDirectiveId === relayDirective.id) {
    return {
      kind: "sync",
      text: "分支 协同：" + relayDirective.name,
      directiveId: relayDirective.id,
      directiveName: relayDirective.name
    };
  }

  const detourDirective = getDirectiveDef(chain.lastDirectiveId);
  if (detourDirective) {
    return {
      kind: "detour",
      text: "分支 绕行：" + detourDirective.name,
      directiveId: detourDirective.id,
      directiveName: detourDirective.name
    };
  }

  return {
    kind: "pending",
    text: "分支 待选择：协同或绕行",
    directiveId: null,
    directiveName: ""
  };
}

function getFarRouteDispatchLoopStepRewardText(step, relayDirective, branchFocus) {
  if (step === 1) {
    return "调度校准 +" + Math.round(FAR_ROUTE_DISPATCH_BONUS_RATE * 100) + "%";
  }

  if (step === 2) {
    if (relayDirective) {
      let rewardText =
        "远航协同 +" +
        Math.round(FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE * 100) +
        "% · 补给 +" +
        Math.round(FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE * 100) +
        "%当前 · 绕行 +" +
        Math.round(FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE * 100) +
        "% · 改道 +" +
        Math.round(FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE * 100) +
        "% · 稳航 +" +
        Math.round(FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE * 100) +
        "% · 投送 -" +
        roundTo(FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE * 100, 2) +
        "%当前";
      if (branchFocus?.kind) {
        rewardText +=
          " · 契合 +" +
          Math.round(FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE * 100) +
          "%";
      }

      return rewardText;
    }

    const rewardRate = FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE;
    const rewardName = "远航续航";

    return rewardName + " +" + Math.round(rewardRate * 100) + "%";
  }

  let rewardText =
    "远航闭环 +" +
    Math.round(FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE * 100) +
    "% · 远航突破 +" +
    roundTo(FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE * 100, 3) +
    "%剩余 · 绕行突破 +" +
    roundTo(FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE * 100, 3) +
    "%剩余 · 轮替闭环 +" +
    Math.round(FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE * 100) +
    "%";

  if (branchFocus?.kind) {
    rewardText +=
      " · 契合闭环 +" +
      Math.round(FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE * 100) +
      "%";
  }

  return rewardText;
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

function getValidRouteStanceId(routeStanceId) {
  return ROUTE_STANCE_DEFS.some((item) => item.id === routeStanceId)
    ? routeStanceId
    : DEFAULT_ROUTE_STANCE_ID;
}

function getValidProjectFilterId(filterId) {
  return PROJECT_FILTER_DEFS.some((item) => item.id === filterId)
    ? filterId
    : DEFAULT_PROJECT_FILTER_ID;
}

function getDirectiveDef(directiveId) {
  return DIRECTIVE_DEFS.find((item) => item.id === directiveId) ?? null;
}

function getDirectiveOptionRecommendationText({
  recommended,
  ready,
  plan,
  dispatch,
  directive,
  recommendationText,
  waitingRecommendationText
}) {
  if (!recommended) {
    return "";
  }

  if (
    plan?.recommendationText === "远航续航" &&
    dispatch?.active &&
    dispatch.branchFocusDirectiveId === directive.id
  ) {
    const branchLabel = dispatch.branchFocusKind === "detour" ? "绕行" : "协同";
    return ready ? "推荐" + branchLabel : "等待推荐" + branchLabel;
  }

  if (
    plan?.recommendationText === "远航续航" &&
    dispatch?.active &&
    dispatch.relayDirectiveId === directive.id
  ) {
    return ready ? "远航协同" : "等待协同";
  }

  if (
    plan?.recommendationText === "远航续航" &&
    dispatch?.active &&
    dispatch.targetDirectiveId !== directive.id &&
    dispatch.relayDirectiveId !== directive.id
  ) {
    return ready ? "远航绕行" : "等待绕行";
  }

  return ready ? recommendationText : waitingRecommendationText;
}

function getValidDirectiveId(directiveId) {
  return DIRECTIVE_DEFS.some((item) => item.id === directiveId) ? directiveId : null;
}

function getDirectiveChainForUse(state, directiveId, now) {
  const current = normalizeState(state, now);
  const chain = current.directiveChain;
  const active = chain.expiresAt >= now && chain.lastDirectiveId;
  const shouldChain = active && chain.lastDirectiveId !== directiveId;
  const stacks = shouldChain ? Math.min(DIRECTIVE_CHAIN_MAX_STACKS, chain.stacks + 1) : 0;

  return {
    stacks,
    multiplier: roundTo(1 + stacks * DIRECTIVE_CHAIN_BONUS_STEP, 4)
  };
}

function getDirectiveMastery(state, now) {
  const current = normalizeState(state, now);
  const mastery = current.directiveMastery;
  const active = mastery.expiresAt >= now && mastery.stacks > 0;
  const stacks = active ? mastery.stacks : 0;
  const bonusRate = roundTo(stacks * DIRECTIVE_MASTERY_BONUS_STEP, 4);

  return {
    stacks,
    expiresAt: active ? mastery.expiresAt : 0,
    remainingSeconds: active ? Math.ceil((mastery.expiresAt - now) / 1000) : 0,
    bonusRate,
    multiplier: roundTo(1 + bonusRate, 4)
  };
}

function getDirectiveMasteryBonus(baseGain, mastery) {
  if (mastery.bonusRate <= 0) {
    return 0;
  }

  return roundTo(baseGain * mastery.bonusRate, 4);
}

function getNextDirectiveMastery(mastery, chain, now) {
  if (chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS) {
    return {
      mastery: {
        stacks: mastery.stacks,
        expiresAt: mastery.expiresAt
      },
      gained: 0,
      completed: false
    };
  }

  const nextStacks = Math.min(DIRECTIVE_MASTERY_MAX_STACKS, mastery.stacks + 1);

  return {
    mastery: {
      stacks: nextStacks,
      expiresAt: now + DIRECTIVE_MASTERY_WINDOW_SECONDS * 1000
    },
    gained: nextStacks > mastery.stacks ? 1 : 0,
    completed: true
  };
}

function getDirectiveCooldownMultiplier(directive, dispatch) {
  if (dispatch?.active && dispatch.targetDirectiveId === directive.id) {
    return FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER;
  }

  return 1;
}

function getDirectiveCooldownMs(directive, dispatch) {
  return directive.cooldownSeconds * 1000 * getDirectiveCooldownMultiplier(directive, dispatch);
}

function getDirectiveChainWindowSeconds(directive, dispatch) {
  if (dispatch?.active && dispatch.targetDirectiveId === directive.id) {
    return DIRECTIVE_CHAIN_WINDOW_SECONDS + FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS;
  }

  return DIRECTIVE_CHAIN_WINDOW_SECONDS;
}

function isDirectiveReady(state, directive, now, dispatch = null) {
  const lastUsedAt = state.directives[directive.id] ?? 0;
  return lastUsedAt <= 0 || lastUsedAt + getDirectiveCooldownMs(directive, dispatch) <= now;
}

function formatDirectiveNameList(names) {
  if (names.length <= 1) {
    return names[0] ?? "不同指令";
  }

  return names.join("或");
}

function formatDirectiveChainBonus(chain) {
  if (!chain.stacks) {
    return "";
  }

  return "航线连携 +" + Math.round((chain.multiplier - 1) * 100) + "%";
}

function formatDirectiveMasteryBonus(mastery) {
  if (mastery.stacks <= 0) {
    return "";
  }

  return "指令熟练 +" + Math.round(mastery.bonusRate * 100) + "%";
}

function formatDirectiveMasteryReward(masteryReward) {
  if (!masteryReward.completed) {
    return "";
  }

  const stackText =
    masteryReward.mastery.stacks + "/" + DIRECTIVE_MASTERY_MAX_STACKS;

  if (masteryReward.gained > 0) {
    return "指令熟练 +1 层 (" + stackText + ")";
  }

  return "指令熟练刷新 (" + stackText + ")";
}

function formatDirectiveMasteryHint(mastery) {
  if (mastery.stacks > 0) {
    const capstoneText =
      mastery.stacks >= DIRECTIVE_MASTERY_MAX_STACKS
        ? "，完成 3/3 可触发满层回响 +" +
          Math.round(DIRECTIVE_MASTERY_CAPSTONE_RATE * 100) +
          "%"
        : "";

    return (
      "当前指令熟练 " +
      mastery.stacks +
      "/" +
      DIRECTIVE_MASTERY_MAX_STACKS +
      "，下一次指令 +" +
      Math.round(mastery.bonusRate * 100) +
      "%" +
      capstoneText +
      "，剩余 " +
      formatDuration(mastery.remainingSeconds) +
      "。"
    );
  }

  return (
    "完成 3/3 轮换会累积 " +
    formatDuration(DIRECTIVE_MASTERY_WINDOW_SECONDS) +
    "指令熟练，每层指令收益 +" +
    Math.round(DIRECTIVE_MASTERY_BONUS_STEP * 100) +
    "%，最多 " +
    DIRECTIVE_MASTERY_MAX_STACKS +
    " 层；满层后继续完成 3/3 会触发满层回响 +" +
    Math.round(DIRECTIVE_MASTERY_CAPSTONE_RATE * 100) +
    "%。"
  );
}

function getDirectiveMasteryCapstoneReward(baseGain, mastery, chain) {
  if (
    mastery.stacks < DIRECTIVE_MASTERY_MAX_STACKS ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS
  ) {
    return 0;
  }

  return roundTo(baseGain * DIRECTIVE_MASTERY_CAPSTONE_RATE, 4);
}

function formatDirectiveMasteryCapstoneReward(masteryCapstoneReward) {
  if (!masteryCapstoneReward) {
    return "";
  }

  return "满层回响 +" + formatNumber(masteryCapstoneReward);
}

function getDirectivePlanReward(baseGain, plan, directiveId) {
  const nextDirectiveIds = Array.isArray(plan?.nextDirectiveIds)
    ? plan.nextDirectiveIds
    : [];

  if (!nextDirectiveIds.includes(directiveId)) {
    return 0;
  }

  return roundTo(baseGain * DIRECTIVE_PLAN_BONUS_RATE, 4);
}

function formatDirectivePlanReward(planReward) {
  if (!planReward) {
    return "";
  }

  return "预案执行 +" + formatNumber(planReward);
}

function getDirectiveTaskReward(baseGain, plan, directiveId, chain) {
  const nextDirectiveIds = Array.isArray(plan?.nextDirectiveIds)
    ? plan.nextDirectiveIds
    : [];
  const targetSteps = DIRECTIVE_CHAIN_MAX_STACKS + 1;

  if (
    plan?.progress >= targetSteps ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS ||
    !nextDirectiveIds.includes(directiveId)
  ) {
    return 0;
  }

  return roundTo(baseGain * DIRECTIVE_TASK_REWARD_RATE, 4);
}

function formatDirectiveTaskReward(taskReward) {
  if (!taskReward) {
    return "";
  }

  return "委托完成 +" + formatNumber(taskReward);
}

function getFarRouteDispatchReward(baseGain, dispatch, directiveId) {
  if (!dispatch?.active || dispatch.targetDirectiveId !== directiveId) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_BONUS_RATE, 4);
}

function formatFarRouteDispatchReward(dispatchReward) {
  if (!dispatchReward) {
    return "";
  }

  return "调度校准 +" + formatNumber(dispatchReward);
}

function getFarRouteDispatchRelayReward(baseGain, dispatch, directiveId, chain, state, now) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId ||
    dispatch.targetDirectiveId === directiveId ||
    chain.stacks !== 1
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_RELAY_REWARD_RATE, 4);
}

function formatFarRouteDispatchRelayReward(dispatchRelayReward) {
  if (!dispatchRelayReward) {
    return "";
  }

  return "远航续航 +" + formatNumber(dispatchRelayReward);
}

function getFarRouteDispatchSyncReward(baseGain, dispatch, directiveId, chain, state, now) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId ||
    dispatch.relayDirectiveId !== directiveId ||
    chain.stacks !== 1
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_SYNC_REWARD_RATE, 4);
}

function formatFarRouteDispatchSyncReward(dispatchSyncReward) {
  if (!dispatchSyncReward) {
    return "";
  }

  return "远航协同 +" + formatNumber(dispatchSyncReward);
}

function getFarRouteDispatchSyncSupply(baseGain, dispatch, directiveId, chain, state, now) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId ||
    dispatch.relayDirectiveId !== directiveId ||
    chain.stacks !== 1
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_SYNC_SUPPLY_RATE, 4);
}

function formatFarRouteDispatchSyncSupply(dispatchSyncSupply) {
  if (!dispatchSyncSupply) {
    return "";
  }

  return "协同补给 +" + formatNumber(dispatchSyncSupply) + "当前";
}

function getFarRouteDispatchDetourReward(baseGain, dispatch, directiveId, chain, state, now) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId ||
    dispatch.targetDirectiveId === directiveId ||
    dispatch.relayDirectiveId === directiveId ||
    chain.stacks !== 1
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_DETOUR_REWARD_RATE, 4);
}

function formatFarRouteDispatchDetourReward(dispatchDetourReward) {
  if (!dispatchDetourReward) {
    return "";
  }

  return "远航绕行 +" + formatNumber(dispatchDetourReward);
}

function getFarRouteDispatchBranchShiftReward(
  baseGain,
  dispatch,
  directiveId,
  chain,
  state,
  now
) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  const previousBranchDirective = getDirectiveDef(state.farRouteLastBranchDirectiveId);
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId ||
    dispatch.targetDirectiveId === directiveId ||
    chain.stacks !== 1 ||
    !previousBranchDirective ||
    previousBranchDirective.id === dispatch.targetDirectiveId ||
    previousBranchDirective.id === directiveId
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_BRANCH_SHIFT_REWARD_RATE, 4);
}

function formatFarRouteDispatchBranchShiftReward(dispatchBranchShiftReward) {
  if (!dispatchBranchShiftReward) {
    return "";
  }

  return "分支改道 +" + formatNumber(dispatchBranchShiftReward);
}

function getFarRouteDispatchBranchStabilityReward(
  baseGain,
  dispatch,
  directiveId,
  chain,
  state,
  now
) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  const previousBranchDirective = getDirectiveDef(state.farRouteLastBranchDirectiveId);
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId ||
    dispatch.targetDirectiveId === directiveId ||
    chain.stacks !== 1 ||
    !previousBranchDirective ||
    previousBranchDirective.id === dispatch.targetDirectiveId ||
    previousBranchDirective.id !== directiveId
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_BRANCH_STABILITY_REWARD_RATE, 4);
}

function formatFarRouteDispatchBranchStabilityReward(
  dispatchBranchStabilityReward
) {
  if (!dispatchBranchStabilityReward) {
    return "";
  }

  return "路线稳航 +" + formatNumber(dispatchBranchStabilityReward);
}

function getFarRouteDispatchBranchFocusReward(
  baseGain,
  dispatch,
  directiveId,
  chain,
  state,
  now
) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId ||
    dispatch.branchFocusDirectiveId !== directiveId ||
    chain.stacks !== 1
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_BRANCH_FOCUS_REWARD_RATE, 4);
}

function formatFarRouteDispatchBranchFocusReward(dispatchBranchFocusReward) {
  if (!dispatchBranchFocusReward) {
    return "";
  }

  return "航段契合 +" + formatNumber(dispatchBranchFocusReward);
}

function getFarRouteDispatchBranchRotationReward(
  baseGain,
  dispatch,
  directiveId,
  chain,
  state,
  now
) {
  const rotationBranchDirective = getDirectiveDef(
    state.farRouteBranchRotationDirectiveId
  );
  const sourceBranchDirective = getFarRouteDispatchSourceBranchDirective(
    state,
    dispatch,
    now
  );
  if (
    !dispatch?.active ||
    dispatch.targetDirectiveId !== directiveId ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS ||
    !rotationBranchDirective ||
    !sourceBranchDirective ||
    sourceBranchDirective.id !== rotationBranchDirective.id
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_BRANCH_ROTATION_REWARD_RATE, 4);
}

function formatFarRouteDispatchBranchRotationReward(
  dispatchBranchRotationReward
) {
  if (!dispatchBranchRotationReward) {
    return "";
  }

  return "轮替闭环 +" + formatNumber(dispatchBranchRotationReward);
}

function getFarRouteDispatchFocusLoopReward(
  baseGain,
  dispatch,
  directiveId,
  chain,
  state,
  now
) {
  const sourceBranchDirective = getFarRouteDispatchSourceBranchDirective(
    state,
    dispatch,
    now
  );
  if (
    !dispatch?.active ||
    dispatch.targetDirectiveId !== directiveId ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS ||
    !dispatch.branchFocusDirectiveId ||
    !sourceBranchDirective ||
    sourceBranchDirective.id !== dispatch.branchFocusDirectiveId
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_FOCUS_LOOP_REWARD_RATE, 4);
}

function formatFarRouteDispatchFocusLoopReward(dispatchFocusLoopReward) {
  if (!dispatchFocusLoopReward) {
    return "";
  }

  return "契合闭环 +" + formatNumber(dispatchFocusLoopReward);
}

function getFarRouteDispatchLoopReward(baseGain, dispatch, directiveId, chain) {
  if (
    !dispatch?.active ||
    dispatch.targetDirectiveId !== directiveId ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_LOOP_REWARD_RATE, 4);
}

function formatFarRouteDispatchLoopReward(dispatchLoopReward) {
  if (!dispatchLoopReward) {
    return "";
  }

  return "远航闭环 +" + formatNumber(dispatchLoopReward);
}

function getFarRouteDispatchBreakthroughReward(dispatch, directiveId, chain) {
  if (
    !dispatch?.active ||
    dispatch.targetDirectiveId !== directiveId ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS ||
    !(dispatch.breakthroughBase > 0)
  ) {
    return 0;
  }

  return roundTo(
    dispatch.breakthroughBase * FAR_ROUTE_DISPATCH_BREAKTHROUGH_REMAINING_RATE,
    4
  );
}

function formatFarRouteDispatchBreakthroughReward(dispatchBreakthroughReward) {
  if (!dispatchBreakthroughReward) {
    return "";
  }

  return "远航突破 +" + formatNumber(dispatchBreakthroughReward);
}

function getFarRouteDispatchDetourBreakthroughReward(
  dispatch,
  directiveId,
  chain,
  state,
  now
) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  if (
    !dispatch?.active ||
    !active ||
    dispatch.targetDirectiveId !== directiveId ||
    sourceChain.lastDirectiveId === dispatch.targetDirectiveId ||
    sourceChain.lastDirectiveId === dispatch.relayDirectiveId ||
    sourceChain.stacks !== DIRECTIVE_CHAIN_MAX_STACKS - 1 ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS ||
    !(dispatch.breakthroughBase > 0)
  ) {
    return 0;
  }

  return roundTo(
    dispatch.breakthroughBase * FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE,
    4
  );
}

function formatFarRouteDispatchDetourBreakthroughReward(
  dispatchDetourBreakthroughReward
) {
  if (!dispatchDetourBreakthroughReward) {
    return "";
  }

  return "绕行突破 +" + formatNumber(dispatchDetourBreakthroughReward);
}

function getFarRouteDispatchDetourInfusion(dispatch, directiveId, chain, state, now) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId ||
    dispatch.targetDirectiveId === directiveId ||
    dispatch.relayDirectiveId === directiveId ||
    chain.stacks !== 1 ||
    !(dispatch.breakthroughBase > 0) ||
    !(state.energy > 0)
  ) {
    return { cost: 0, progress: 0 };
  }

  const cost = roundTo(
    Math.min(
      state.energy * FAR_ROUTE_DISPATCH_DETOUR_INFUSION_COST_RATE,
      dispatch.breakthroughBase * FAR_ROUTE_DISPATCH_DETOUR_BREAKTHROUGH_REMAINING_RATE
    ),
    4
  );
  if (cost <= 0) {
    return { cost: 0, progress: 0 };
  }

  return {
    cost,
    progress: roundTo(
      Math.min(
        dispatch.breakthroughBase,
        cost * FAR_ROUTE_DISPATCH_DETOUR_INFUSION_PROGRESS_MULTIPLIER
      ),
      4
    )
  };
}

function formatFarRouteDispatchDetourInfusion(dispatchDetourInfusion) {
  if (!dispatchDetourInfusion?.cost || !dispatchDetourInfusion?.progress) {
    return "";
  }

  return (
    "绕行投送 -" +
    formatNumber(dispatchDetourInfusion.cost) +
    "当前 / +" +
    formatNumber(dispatchDetourInfusion.progress) +
    "累计"
  );
}

function getFarRouteDispatchSourceBranchDirective(state, dispatch, now) {
  const sourceChain = state?.directiveChain ?? {};
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId === dispatch.targetDirectiveId ||
    sourceChain.stacks < DIRECTIVE_CHAIN_MAX_STACKS - 1
  ) {
    return null;
  }

  return getDirectiveDef(sourceChain.lastDirectiveId);
}

function getNextFarRouteDispatchBranchDirectiveId(state, dispatch, directiveId, chain, now) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);

  if (!dispatch?.active) {
    return getValidDirectiveId(state.farRouteLastBranchDirectiveId);
  }

  if (directiveId === dispatch.targetDirectiveId && chain.stacks === 0) {
    return getValidDirectiveId(state.farRouteLastBranchDirectiveId);
  }

  if (
    active &&
    directiveId === dispatch.targetDirectiveId &&
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId &&
    sourceChain.stacks >= DIRECTIVE_CHAIN_MAX_STACKS - 1 &&
    chain.stacks >= DIRECTIVE_CHAIN_MAX_STACKS
  ) {
    return getValidDirectiveId(sourceChain.lastDirectiveId);
  }

  if (
    active &&
    sourceChain.lastDirectiveId === dispatch.targetDirectiveId &&
    directiveId !== dispatch.targetDirectiveId &&
    chain.stacks === 1
  ) {
    return getValidDirectiveId(directiveId);
  }

  return getValidDirectiveId(state.farRouteLastBranchDirectiveId);
}

function getNextFarRouteDispatchBranchRotationDirectiveId(
  state,
  dispatch,
  directiveId,
  chain,
  now
) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  const previousBranchDirective = getDirectiveDef(state.farRouteLastBranchDirectiveId);

  if (!dispatch?.active) {
    return null;
  }

  if (directiveId === dispatch.targetDirectiveId && chain.stacks === 0) {
    return null;
  }

  if (
    active &&
    sourceChain.lastDirectiveId === dispatch.targetDirectiveId &&
    directiveId !== dispatch.targetDirectiveId &&
    chain.stacks === 1
  ) {
    if (
      previousBranchDirective &&
      previousBranchDirective.id !== dispatch.targetDirectiveId &&
      previousBranchDirective.id !== directiveId
    ) {
      return getValidDirectiveId(directiveId);
    }

    return null;
  }

  if (
    active &&
    directiveId === dispatch.targetDirectiveId &&
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId &&
    sourceChain.stacks >= DIRECTIVE_CHAIN_MAX_STACKS - 1 &&
    chain.stacks >= DIRECTIVE_CHAIN_MAX_STACKS
  ) {
    return null;
  }

  return getValidDirectiveId(state.farRouteBranchRotationDirectiveId);
}

function getFarRouteDispatchCompletedBranchDirective(state, dispatch, now) {
  const current = normalizeState(state, now);
  const chain = current.directiveChain;
  const active = Boolean(chain.lastDirectiveId && chain.expiresAt >= now);
  if (
    !dispatch?.active ||
    !dispatch.targetDirectiveId ||
    !dispatch.relayDirectiveId ||
    !active ||
    chain.lastDirectiveId !== dispatch.targetDirectiveId ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS
  ) {
    return null;
  }

  const storedBranchDirective = getDirectiveDef(current.farRouteLastBranchDirectiveId);
  if (
    storedBranchDirective &&
    storedBranchDirective.id !== dispatch.targetDirectiveId
  ) {
    return storedBranchDirective;
  }

  const targetUsedAt = current.directives[dispatch.targetDirectiveId] ?? 0;
  const branchWindowMs =
    (dispatch.chainWindowSeconds ??
      DIRECTIVE_CHAIN_WINDOW_SECONDS +
        FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS) * 1000;
  const previousDirective = DIRECTIVE_DEFS.filter(
    (directive) => directive.id !== dispatch.targetDirectiveId
  )
    .map((directive) => ({
      directive,
      usedAt: current.directives[directive.id] ?? 0
    }))
    .filter(
      (item) =>
        item.usedAt > 0 &&
        targetUsedAt > item.usedAt &&
        targetUsedAt - item.usedAt <= branchWindowMs
    )
    .sort((a, b) => b.usedAt - a.usedAt)[0]?.directive;

  return previousDirective ?? getDirectiveDef(dispatch.relayDirectiveId);
}

function getFarRouteDispatchPrepReward(baseGain, dispatch, directiveId, chain, state, now) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  const completedBranchDirective = getFarRouteDispatchCompletedBranchDirective(
    state,
    dispatch,
    now
  );
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId ||
    sourceChain.stacks < DIRECTIVE_CHAIN_MAX_STACKS ||
    completedBranchDirective?.id !== dispatch.relayDirectiveId ||
    dispatch.relayDirectiveId !== directiveId ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_PREP_REWARD_RATE, 4);
}

function formatFarRouteDispatchPrepReward(dispatchPrepReward) {
  if (!dispatchPrepReward) {
    return "";
  }

  return "整备续航 +" + formatNumber(dispatchPrepReward);
}

function getFarRouteDispatchDetourPrepReward(
  baseGain,
  dispatch,
  directiveId,
  chain,
  state,
  now
) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  const completedBranchDirective = getFarRouteDispatchCompletedBranchDirective(
    state,
    dispatch,
    now
  );
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.targetDirectiveId ||
    sourceChain.stacks < DIRECTIVE_CHAIN_MAX_STACKS ||
    !completedBranchDirective ||
    completedBranchDirective.id === dispatch.relayDirectiveId ||
    completedBranchDirective.id !== directiveId ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_DETOUR_PREP_REWARD_RATE, 4);
}

function formatFarRouteDispatchDetourPrepReward(dispatchDetourPrepReward) {
  if (!dispatchDetourPrepReward) {
    return "";
  }

  return "绕行整备 +" + formatNumber(dispatchDetourPrepReward);
}

function getFarRouteDispatchReturnReward(baseGain, dispatch, directiveId, chain, state, now) {
  const sourceChain = state.directiveChain;
  const active = Boolean(sourceChain.lastDirectiveId && sourceChain.expiresAt >= now);
  if (
    !dispatch?.active ||
    !active ||
    sourceChain.lastDirectiveId !== dispatch.relayDirectiveId ||
    sourceChain.stacks < DIRECTIVE_CHAIN_MAX_STACKS ||
    dispatch.targetDirectiveId !== directiveId ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS
  ) {
    return 0;
  }

  return roundTo(baseGain * FAR_ROUTE_DISPATCH_RETURN_REWARD_RATE, 4);
}

function formatFarRouteDispatchReturnReward(dispatchReturnReward) {
  if (!dispatchReturnReward) {
    return "";
  }

  return "整备回航 +" + formatNumber(dispatchReturnReward);
}

function getFarRouteDispatchRefresh(dispatch, directiveId, chain, state, now) {
  if (
    !dispatch?.active ||
    dispatch.targetDirectiveId !== directiveId ||
    !dispatch.relayDirectiveId ||
    chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS
  ) {
    return null;
  }

  const sourceBranchDirective = getFarRouteDispatchSourceBranchDirective(
    state,
    dispatch,
    now
  );
  const refreshDirective =
    sourceBranchDirective?.id &&
    sourceBranchDirective.id !== dispatch.targetDirectiveId &&
    sourceBranchDirective.id !== dispatch.relayDirectiveId
      ? sourceBranchDirective
      : getDirectiveDef(dispatch.relayDirectiveId);
  const directive = getDirectiveDef(refreshDirective?.id);
  if (!directive) {
    return null;
  }

  return {
    directiveId: directive.id,
    directiveName: directive.name,
    label:
      directive.id === dispatch.relayDirectiveId ? "远航整备" : "绕行整备"
  };
}

function formatFarRouteDispatchRefresh(dispatchRefresh) {
  if (!dispatchRefresh) {
    return "";
  }

  return (
    (dispatchRefresh.label ?? "远航整备") +
    " " +
    dispatchRefresh.directiveName +
    "冷却刷新"
  );
}

function formatFarRouteDispatchCooldown(dispatch, directive) {
  if (!dispatch?.active || dispatch.targetDirectiveId !== directive.id) {
    return "";
  }

  return (
    "调度冷却 -" +
    Math.round((1 - FAR_ROUTE_DISPATCH_COOLDOWN_MULTIPLIER) * 100) +
    "%"
  );
}

function formatFarRouteDispatchChainWindow(dispatch, directive) {
  if (!dispatch?.active || dispatch.targetDirectiveId !== directive.id) {
    return "";
  }

  return "调度接力 +" + formatDuration(FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS);
}

function getFarRouteDispatchLoopStatus(state, directive, relayDirective, now) {
  const target = DIRECTIVE_CHAIN_MAX_STACKS + 1;
  if (!directive) {
    return {
      progress: 0,
      target,
      text: "闭环进度 0/" + target + " · 等待目标指令"
    };
  }

  const chain = state.directiveChain;
  const active = Boolean(chain.lastDirectiveId && chain.expiresAt >= now);
  if (!active) {
    return {
      progress: 0,
      target,
      text: "闭环进度 0/" + target + " · 下一步 " + directive.name
    };
  }

  const rawStacks = Number(chain.stacks);
  const stacks = Math.min(
    DIRECTIVE_CHAIN_MAX_STACKS,
    Math.max(0, Number.isFinite(rawStacks) ? Math.floor(rawStacks) : 0)
  );
  const progress = Math.min(target, stacks + 1);
  const currentDirectiveName = getDirectiveDef(chain.lastDirectiveId)?.name ?? "未知指令";
  const nextText = getFarRouteDispatchLoopNextText(
    chain,
    directive,
    relayDirective,
    progress,
    target,
    state,
    now
  );
  const windowText = formatDuration((chain.expiresAt - now) / 1000);

  return {
    progress,
    target,
    text:
      "闭环进度 " +
      progress +
      "/" +
      target +
      " · 当前 " +
      currentDirectiveName +
      " · " +
      nextText +
      " · 剩余 " +
      windowText
  };
}

function getFarRouteDispatchLoopNextText(
  chain,
  directive,
  relayDirective,
  progress,
  target,
  state,
  now
) {
  if (progress >= target) {
    if (relayDirective && chain.lastDirectiveId === relayDirective.id) {
      return "已完成 · 回到" + directive.name + "触发整备回航";
    }

    if (relayDirective) {
      const completedBranchDirective = getFarRouteDispatchCompletedBranchDirective(
        state,
        {
          active: true,
          targetDirectiveId: directive.id,
          relayDirectiveId: relayDirective.id,
          chainWindowSeconds:
            DIRECTIVE_CHAIN_WINDOW_SECONDS +
            FAR_ROUTE_DISPATCH_CHAIN_WINDOW_EXTENSION_SECONDS
        },
        now
      );

      if (
        completedBranchDirective &&
        completedBranchDirective.id !== relayDirective.id
      ) {
        return (
          "已完成 · 绕行整备优先" +
          completedBranchDirective.name +
          "触发绕行整备"
        );
      }

      return "已完成 · 远航整备优先" + relayDirective.name + "触发整备续航";
    }

    return "已完成 · 切换非目标指令开启下一轮";
  }

  if (chain.lastDirectiveId === directive.id) {
    if (relayDirective) {
      return (
        "下一步优先" +
        relayDirective.name +
        "触发远航协同，或切另一非目标触发远航绕行"
      );
    }

    return "下一步推荐非目标指令触发远航续航";
  }

  if ((Number(chain.stacks) || 0) >= DIRECTIVE_CHAIN_MAX_STACKS - 1) {
    if (relayDirective && chain.lastDirectiveId === relayDirective.id) {
      return "下一步协同回航到" + directive.name + "触发远航闭环与远航突破";
    }

    const detourText =
      relayDirective &&
      chain.lastDirectiveId !== relayDirective.id &&
      chain.lastDirectiveId !== directive.id
        ? "与绕行突破"
        : "";
    return "下一步回到" + directive.name + "触发远航闭环" + detourText;
  }

  return "下一步执行" + directive.name + "接入闭环";
}

function getDirectiveRotationReward(baseGain, chain) {
  if (chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS) {
    return 0;
  }

  return roundTo(baseGain * DIRECTIVE_ROTATION_REWARD_RATE, 4);
}

function formatDirectiveRotationReward(rotationReward) {
  if (!rotationReward) {
    return "";
  }

  return "轮换目标 +" + formatNumber(rotationReward);
}

function getDirectiveStanceFinisherReward(baseGain, chain, stanceBonusRate) {
  if (stanceBonusRate <= 0 || chain.stacks < DIRECTIVE_CHAIN_MAX_STACKS) {
    return 0;
  }

  return roundTo(baseGain * DIRECTIVE_STANCE_FINISHER_RATE, 4);
}

function formatDirectiveStanceFinisherReward(stanceFinisherReward) {
  if (!stanceFinisherReward) {
    return "";
  }

  return "策略终结 +" + formatNumber(stanceFinisherReward);
}

function getDirectiveStanceBonusRate(routeStance, directive) {
  if (!routeStance?.unlocked || routeStance.active?.directiveId !== directive.id) {
    return 0;
  }

  return DIRECTIVE_STANCE_BONUS_RATE;
}

function formatDirectiveStanceBonus(stanceBonusRate) {
  if (stanceBonusRate <= 0) {
    return "";
  }

  return "策略契合 +" + Math.round(stanceBonusRate * 100) + "%";
}

function getProjectFilterDef(filterId) {
  const validId = getValidProjectFilterId(filterId);
  return PROJECT_FILTER_DEFS.find((item) => item.id === validId) ?? PROJECT_FILTER_DEFS[0];
}

function getFarRouteDispatchDirective(project, state) {
  const effect = project?.effect ?? {};

  if (effect.clickMultiplier) {
    return getDirectiveDef("ignition-salvo");
  }
  if (effect.secondMultiplier) {
    return getDirectiveDef("cruise-cache");
  }
  if (effect.overloadMultiplier) {
    return getDirectiveDef("resonance-pulse");
  }

  const stance = getRouteStanceDef(state.routeStance);
  return getDirectiveDef(stance.directiveId) ?? getDirectiveDef("resonance-pulse");
}

function getFarRouteDispatchRelayDirective(targetDirective) {
  const relayByTarget = {
    "ignition-salvo": "resonance-pulse",
    "resonance-pulse": "cruise-cache",
    "cruise-cache": "ignition-salvo"
  };
  const relayDirectiveId = relayByTarget[targetDirective?.id];

  return getDirectiveDef(relayDirectiveId) ?? null;
}

function getFarRouteDispatchDetourDirective(targetDirective, relayDirective) {
  return (
    DIRECTIVE_DEFS.find(
      (directive) =>
        directive.id !== targetDirective?.id && directive.id !== relayDirective?.id
    ) ?? null
  );
}

function getFarRouteDispatchBreakthroughBase(project) {
  if (!project || project.unit !== "能量") {
    return 0;
  }

  return Math.max(0, Number(project.remaining) || 0);
}

function getRouteStanceDef(routeStanceId) {
  return (
    ROUTE_STANCE_DEFS.find((item) => item.id === getValidRouteStanceId(routeStanceId)) ??
    ROUTE_STANCE_DEFS[0]
  );
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
  if (upgradeId === "resonator") {
    return "过载奖励 +" + formatNumber(production.overloadBonus);
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

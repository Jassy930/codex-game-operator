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
export const ROUTE_STANCE_DEFS = [
  {
    id: DEFAULT_ROUTE_STANCE_ID,
    name: "均衡航线",
    summary: "保持当前产能分配",
    masteryProjectId: "balanced-tuning",
    effect: {
      clickMultiplier: 1,
      secondMultiplier: 1,
      overloadMultiplier: 1
    }
  },
  {
    id: "ignition",
    name: "点火优先",
    summary: "点击产能 +14%，过载奖励 +8%",
    masteryProjectId: "ignition-drill",
    effect: {
      clickMultiplier: 1.14,
      secondMultiplier: 1,
      overloadMultiplier: 1.08
    }
  },
  {
    id: "cruise",
    name: "巡航优先",
    summary: "自动产能 +16%",
    masteryProjectId: "cruise-drill",
    effect: {
      clickMultiplier: 1,
      secondMultiplier: 1.16,
      overloadMultiplier: 1
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
    endId: "collector-grid"
  },
  {
    name: "专精校准",
    startId: "ignition-drill",
    endId: "balanced-tuning"
  },
  {
    name: "深空基建",
    startId: "farstar-relay",
    endId: "stellar-anchor"
  },
  {
    name: "远航长尾",
    startId: "void-gate-expedition",
    endId: "abyss-ark"
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
      progressText: buildProjectProgressText(project, currentValue, target, remaining)
    };
  });
  const currentIndex = statuses.findIndex((project) => !project.completed);

  return statuses.map((project, index) => ({
    ...project,
    isCurrent: index === currentIndex
  }));
}

export function filterProjectStatuses(projects, filterId = DEFAULT_PROJECT_FILTER_ID) {
  const filter = getValidProjectFilterId(filterId);
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

export function getProjectFilterSummary(projects, filterId = DEFAULT_PROJECT_FILTER_ID) {
  const filter = getProjectFilterDef(filterId);
  const visibleProjects = filterProjectStatuses(projects, filter.id);

  if (!visibleProjects.length) {
    return "筛选视图：" + filter.name + " 0 段 · 没有匹配航段";
  }

  const completed = visibleProjects.filter((project) => project.completed).length;
  const nextProject = visibleProjects.find((project) => !project.completed);

  if (!nextProject) {
    return "筛选视图：" + filter.name + " " + visibleProjects.length + " 段 · 全部已完成";
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
    " · 下一条 " +
    nextProject.segmentText +
    " " +
    nextProject.name +
    "（" +
    nextProject.reward +
    " · " +
    nextProject.progressText +
    "）"
  );
}

export function getProjectOverview(state) {
  const current = normalizeState(state);
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
      actionText: buildProjectActionText(null, current),
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
    actionText: buildProjectActionText(nextProject, current),
    forecastText:
      "航线预告：" + upcomingProjects.map(formatForecastProject).join("、")
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
  const rewardCounts = projects.reduce(
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
    .map(([label, count]) => label + " " + count + " 段")
    .join(" / ");

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
  const rewardTargets = [
    ["总产能", "totalMultiplier"],
    ["点击", "clickMultiplier"],
    ["自动", "secondMultiplier"],
    ["过载", "overloadMultiplier"]
  ].map(([label, effectKey]) => {
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

function getProjectFilterDef(filterId) {
  const validId = getValidProjectFilterId(filterId);
  return PROJECT_FILTER_DEFS.find((item) => item.id === validId) ?? PROJECT_FILTER_DEFS[0];
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

# Decision

## 2026-04-29 Product decision：虚曜谐振塔航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 33 段，但星渊回声门完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补说明性总览不会直接增加可玩的长尾目标。

本轮决策：

- 新增“虚曜谐振塔”航段，要求累计 190M 能量，奖励过载奖励 +20%。
- 星图路线从 33 段扩展到 34 段；远航长尾章节从 20 段扩展到 21 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表和静态 HTML 初始文案同步到 34 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在星渊回声门之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 10:40 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星渊回声门完成后继续指向虚曜谐振塔、34 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“虚曜谐振塔”、`voidflare-resonator`、“星图进度 0/34”、“25 个累计航段”和“过载 0/6”。
- GitHub Pages workflow 25088478958 已成功，线上地址返回 HTTP 200，发布文件包含“虚曜谐振塔”、`voidflare-resonator`、“星图进度 0/34”、“25 个累计航段”和“过载 0/6”。
- #2 已回复并保持 open，等待复测确认 190M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为虚曜谐振塔改善长尾内容丰富度。

## 2026-04-29 Product decision：星渊回声门航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把星图扩展到 32 段，但曜幕天穹完成后仍会再次暴露“全部完成，等待下一段航线”的边界；继续只补信息结构不会直接增加可玩的长尾目标。

本轮决策：

- 新增“星渊回声门”航段，要求累计 145M 能量，奖励总产能 +20%。
- 星图路线从 32 段扩展到 33 段；远航长尾章节从 19 段扩展到 20 段。
- 主目标、星图总览、里程碑、章节、奖励进度、航线构成、项目列表和静态 HTML 初始文案同步到 33 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在曜幕天穹之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 10:25 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖曜幕天穹完成后继续指向星渊回声门、33 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“星渊回声门”、`abyss-echo-gate`、“星图进度 0/33”和“24 个累计航段”。
- GitHub Pages workflow 25088064228 已成功，线上地址返回 HTTP 200，发布文件包含“星渊回声门”、`abyss-echo-gate`、“星图进度 0/33”和“24 个累计航段”。
- #2 已回复并保持 open，等待复测确认 145M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星渊回声门改善长尾内容丰富度。

## 2026-04-29 Product decision：曜幕天穹航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。前序多轮已经把 31 段星图的信息结构补到目标分轨、章节、奖励目标、里程碑和航线焦点；继续只添加说明性总览会增加信息密度，但不直接增加可玩的长尾目标。

本轮决策：

- 新增“曜幕天穹”航段，要求累计 110M 能量，奖励自动产能 +20%。
- 星图路线从 31 段扩展到 32 段；远航长尾章节从 18 段扩展到 19 段。
- 主目标、星图总览、里程碑、航线构成、章节奖励、奖励进度、项目列表和静态 HTML 初始文案同步到 32 段。
- 不新增存档字段、不调整既有奖励数值和升级价格；只在晨渊观星台之后追加一个可验证尾段。

验收标准：

- GitHub Issues 已同步：2026-04-29 10:08 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖晨渊观星台完成后继续指向曜幕天穹、32 段航线序号、章节余量、奖励分布和全部完成状态。
- 构建产物已包含“曜幕天穹”、`solar-veil-dome`、“星图进度 0/32”和“23 个累计航段”。
- GitHub Pages workflow 25087650173 已成功，线上地址返回 HTTP 200，发布文件包含“曜幕天穹”、`solar-veil-dome`、“星图进度 0/32”和“23 个累计航段”。
- #2 已回复并保持 open，等待复测确认 110M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为曜幕天穹改善长尾内容丰富度。

## 2026-04-29 Product decision：星图航线焦点

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已在星图总览新增“里程碑”，当前章节终点和终局航点已经更清楚，但玩家选择均衡、点火或巡航后，仍需要在航线策略按钮和项目列表之间自行对照对应专精航段。

本轮决策：

- 在星图总览新增“航线焦点”，按当前航线策略显示对应专精航段、奖励和当前进度。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续把已有 31 段星图和可切换航线策略连成更明确的可追目标。
- 静态 HTML 初始文案同步到航线焦点，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 09:54 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖锁定状态、当前策略专精、进行中状态和全部完成状态的航线焦点文案。
- 构建产物已包含“航线焦点”、`projectOverviewRouteFocus` 和 `routeFocusText`。
- GitHub Pages workflow 25087158534 已成功，线上地址返回 HTTP 200，发布文件包含“航线焦点”、`projectOverviewRouteFocus` 和 `routeFocusText`。
- #2 已回复并保持 open，等待复测确认航线焦点是否改善策略选择与内容目标之间的关联。

下一步：继续观察 #2 复测是否认为航线焦点改善策略选择与内容目标之间的关联。

## 2026-04-29 Product decision：星图里程碑

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已在星图总览新增“奖励目标”，四条成长线的下一条奖励已经更明确，但玩家仍缺少把“当前章节终点”和“整条路线终局航点”并排理解的短期/长期里程碑。

本轮决策：

- 在星图总览新增“里程碑”，显示当前章节终点和终局航点的航段序号、奖励和当前进度。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的路线跨度感。
- 静态 HTML 初始文案同步到里程碑，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 09:31 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖初始状态、进行中状态和全部完成状态的里程碑文案。
- 构建产物已包含“里程碑”、`projectOverviewMilestones` 和 `milestoneText`。
- GitHub Pages workflow 25086687155 已成功，线上地址返回 HTTP 200，发布文件包含“里程碑”、`projectOverviewMilestones` 和 `milestoneText`。
- #2 已回复并保持 open，等待复测确认里程碑是否改善章节目标和长期路线的内容丰富度感知。

下一步：继续观察 #2 复测是否认为里程碑改善章节目标和长期路线的内容丰富度感知。

## 2026-04-29 Product decision：星图奖励目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已在星图总览新增“奖励进度”，但玩家只能看到四条成长线的已获得数量，还需要自行扫描项目列表，才能判断下一条总产能、点击、自动或过载奖励分别来自哪个航段。

本轮决策：

- 在星图总览新增“奖励目标”，按总产能、点击、自动和过载分别显示下一条未完成奖励航段、奖励内容和当前进度。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的成长线目标可见性。
- 静态 HTML 初始文案同步到奖励目标，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 09:18 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖初始状态、进行中状态和全部完成状态的奖励目标文案。
- 构建产物已包含“奖励目标”、`projectOverviewRewardTargets` 和 `rewardTargetText`。
- GitHub Pages workflow 25086307782 已成功，线上地址返回 HTTP 200，发布文件包含“奖励目标”、`projectOverviewRewardTargets` 和 `rewardTargetText`。
- #2 已回复并保持 open，等待复测确认奖励目标是否改善四条成长线的目标识别和内容丰富度感知。

下一步：继续观察 #2 复测是否认为奖励目标改善四条成长线的目标识别和内容丰富度感知。

## 2026-04-29 Product decision：星图奖励进度

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已在星图总览按章节汇总奖励数量，但这些数量仍是静态总量，玩家无法直接看到四条奖励线已经拿到多少、还剩多少。

本轮决策：

- 在星图总览新增“奖励进度”，按总产能、点击、自动和过载显示已生效奖励数/总奖励数。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的成长线进度可见性。
- 静态 HTML 初始文案同步到奖励进度，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 09:02 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖初始状态、进行中状态和全部完成状态的奖励进度文案。
- 构建产物已包含“奖励进度”、`projectOverviewRewardProgress` 和 `rewardProgressText`。
- GitHub Pages workflow 25085902738 已成功，线上地址返回 HTTP 200，发布文件包含“奖励进度”、`projectOverviewRewardProgress` 和 `rewardProgressText`。
- #2 已回复并保持 open，等待复测确认奖励进度是否改善成长线余量和内容丰富度感知。

下一步：继续观察 #2 复测是否认为奖励进度改善成长线余量和内容丰富度感知。

## 2026-04-29 Product decision：星图章节奖励

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已在星图总览按章节列出各自下一段目标，但玩家仍需要把章节目标、航线构成和奖励分布自行合并，才能判断每个章节分别提供哪些成长方向。

本轮决策：

- 在星图总览新增“章节奖励”，按首段星图、专精校准、深空基建、远航长尾汇总各章节的总产能、点击、自动和过载奖励数量。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的章节主题和奖励主题可见性。
- 静态 HTML 初始文案同步到章节奖励，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 08:49 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖章节奖励在初始状态、进行中状态和全部完成状态的文案。
- 构建产物已包含“章节奖励”、`projectOverviewChapterRewards` 和 `chapterRewardText`。
- GitHub Pages workflow 25085541649 已成功，线上地址返回 HTTP 200，发布文件包含“章节奖励”、`chapterRewardText` 和 `projectOverviewChapterRewards`。
- #2 已回复并保持 open，等待复测确认章节奖励是否改善章节主题和奖励丰富度感知。

下一步：继续观察 #2 复测是否认为章节奖励改善章节主题和奖励丰富度感知。

## 2026-04-29 Product decision：星图章节目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把章节内位置下沉到项目列表和阶段导航当前项，但星图总览仍只突出当前章节的位置，玩家要理解其他章节“下一段是什么”仍需要扫描完整项目列表。

本轮决策：

- 在星图总览新增“章节目标”，按首段星图、专精校准、深空基建、远航长尾列出每个章节的下一段未完成目标，已完成章节显示“已完成”。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的跨章节内容预期。
- 静态 HTML 初始文案同步到章节目标，避免加载前总览信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 08:35 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖章节目标在初始状态、进行中状态和全部完成状态的文案。
- 构建产物已包含“章节目标”、`projectOverviewChapterTargets` 和 `chapterTargetText`。
- GitHub Pages workflow 25085160189 已成功，线上地址返回 HTTP 200，发布文件包含“章节目标”、`projectOverviewChapterTargets` 和 `chapterTargetText`。
- #2 已回复并保持 open，等待复测确认章节目标是否改善跨章节内容预期和内容丰富度感知。

下一步：继续观察 #2 复测是否认为章节目标改善跨章节内容预期和内容丰富度感知。

## 2026-04-29 Product decision：星图章节内位置

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已把项目列表标记到四个章节，但项目卡片只显示章节名，玩家扫描列表时仍需要回到阶段导航才能判断“这是本章节第几段”。

本轮决策：

- 为每个星图项目派生章节内位置：章节名、章节内序号、章节总数和章节位置文本。
- 星图项目列表的章节徽标改为显示“首段星图 2/4”这类章节内位置；阶段导航当前项同步显示章节内位置和全局航段号。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的章节扫描效率。

验收标准：

- GitHub Issues 已同步：2026-04-29 08:21 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖章节内序号、最终阶段余量和项目列表章节文本。
- 构建产物已包含 `chapterText` 渲染字段和“首段星图 1/4”静态初始文案。
- GitHub Pages workflow 25084767463 已成功，线上地址返回 HTTP 200，发布文件包含“首段星图 1/4”和 `chapterText`。
- #2 已回复并保持 open，等待复测确认章节内位置是否改善项目列表扫描和后续内容感知。

下一步：继续观察 #2 复测是否认为章节内位置改善项目列表扫描和后续内容感知。

## 2026-04-29 Product decision：星图项目章节标记

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。前序迭代已经在星图总览中补齐阶段导航、阶段余量、目标分轨和航线构成，但玩家在下方 31 段项目列表里逐项扫描时，仍主要看到航段号和当前航段标记，列表本体的章节归属不够直接。

本轮决策：

- 为每个星图项目派生并显示所属章节：首段星图、专精校准、深空基建、远航长尾。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；只增强已有项目列表的章节识别。
- 保持星图总览、主目标、航线策略和反馈入口行为不变。

验收标准：

- GitHub Issues 已同步：2026-04-29 08:07 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖项目章节映射。
- 构建产物已包含 `project-chapter-badge` 渲染样式和 `chapterName` 渲染字段。
- GitHub Pages workflow 25084357042 已成功，线上地址返回 HTTP 200，且发布文件包含 `project-chapter-badge` 和 `chapterName`。
- #2 已回复并保持 open，等待复测确认项目列表章节标记是否改善内容层次感和后续内容感知。

下一步：继续观察 #2 复测是否认为项目列表章节标记改善内容层次感和后续内容感知。

## 2026-04-29 Product decision：星图阶段余量

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已经在星图总览新增阶段导航，但阶段导航只说明当前处于哪个阶段，没有直接告诉玩家“这个阶段还剩几段”和“下一阶段是什么”，章节感仍可继续增强。

本轮决策：

- 在阶段导航中追加“本阶段还剩 X 段”和“下一阶段 Y / 最终阶段”。
- 不新增第 32 段，不调整奖励数值、升级价格和存档结构；继续提升已有 31 段星图的章节进度可见性。
- 静态 HTML 初始文案同步到新的阶段余量展示，避免加载前信息与运行态不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 07:53 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖当前阶段余量和最终阶段余量。
- 构建产物 dist 包含“本阶段还剩”和 `projectOverviewChapter` 渲染字段。
- GitHub Pages workflow 25083929387 已成功，线上地址返回 HTTP 200，且发布文件包含“本阶段还剩”。
- #2 已回复并保持 open，等待复测确认阶段余量是否改善内容层次感和后续内容感知。

下一步：继续观察 #2 复测是否认为阶段余量改善内容层次感和后续内容感知。

## 2026-04-29 Product decision：星图阶段导航

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已经补充航线构成和奖励分布，但总览仍把 31 段内容主要表达为目标类型和奖励类型，缺少“章节感”。继续追加第 32 段会增加路线长度，却不一定让玩家更快理解已有内容跨度。

本轮决策：

- 在星图总览中新增“阶段导航”，把 31 段星图拆成首段星图、专精校准、深空基建、远航长尾四个阶段。
- 每个阶段显示已完成数/总数，并追加当前阶段、当前航段序号和当前项目名。
- 不新增存档字段、不调整奖励数值和升级价格，不改变项目完成判定；先提升已有内容的章节感和路线层次。

验收标准：

- GitHub Issues 已同步：2026-04-29 07:40 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖星图总览阶段导航和全部完成状态。
- 构建产物 dist 包含“阶段导航”和 `projectOverviewChapter` 渲染字段。
- 发布前未发现 open bug 或测试失败。
- GitHub Pages workflow 25083504675 已成功，线上地址返回 HTTP 200，发布文件包含“阶段导航”。
- #2 已回复并保持 open，等待复测确认阶段导航是否改善内容层次感和内容丰富度感知。

下一步：继续观察 #2 复测是否认为阶段导航改善内容层次感和内容丰富度感知。

## 2026-04-29 Product decision：星图航线构成

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已经补充“目标分轨”，继续只追加新终点会让内容感知更依赖线性长度，而不是让玩家理解现有 31 段星图由哪些目标类型和奖励方向组成。

本轮决策：

- 在星图总览中新增“航线构成”，显示 22 个累计航段和 9 个升级航段。
- 同一行显示奖励分布：总产能 10 段、点击 8 段、自动 8 段、过载 5 段。
- 不新增存档字段、不调整奖励数值和升级价格，不改变项目完成判定；先提升已有内容的结构可见性。

验收标准：

- GitHub Issues 已同步：2026-04-29 07:27 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖星图总览航线构成和全部完成状态。
- 构建产物 dist 包含“航线构成”和 `projectOverviewComposition` 渲染字段。
- GitHub Pages workflow 25083078319 已成功，线上地址返回 HTTP 200，发布文件包含“航线构成”。
- #2 已回复并保持 open，等待复测确认航线构成和奖励分布是否改善内容丰富度感知。

下一步：继续观察 #2 复测是否认为航线构成和奖励分布改善内容丰富度感知。

## 2026-04-29 Product decision：星图目标分轨

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。过去多轮主要用新增长尾航段延长内容边界，但 100K 后玩家在总览里仍主要看到一个线性下一目标和一个最多 3 项预告，较难同时识别“累计能量航段”和“升级航段”两条推进线。

本轮决策：

- 在星图总览中新增“目标分轨”，同时显示下一个未完成累计航段和下一个未完成升级航段。
- 不新增存档字段、不调整既有奖励数值和升级价格，不改变项目完成判定；先提升已有 31 段星图内容的结构可见性。
- 页面初始文案同步到 31 段，避免静态 HTML 与当前项目总数不一致。

验收标准：

- GitHub Issues 已同步：2026-04-29 07:19 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖星图总览目标分轨和全部完成状态。
- 构建产物 dist 包含目标分轨文案和渲染字段。
- GitHub Pages workflow 25082651631 已成功，线上地址返回 HTTP 200，发布文件包含“目标分轨”。
- #2 已回复并保持 open，等待复测确认目标分轨是否改善内容丰富度和中后段目标识别。

下一步：继续观察 #2 复测是否认为目标分轨改善内容丰富度和中后段目标识别。

## 2026-04-29 Product decision：晨渊观星台航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 65M 的星冠回声站，但星冠回声站完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“晨渊观星台”航段，要求累计 85M 能量，奖励点击产能 +19%。
- 星图路线从 30 段扩展到 31 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个星冠回声站后续航段继续延长现有路线，并把奖励落到点击成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 06:57 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install --no-save、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖星冠回声站完成后继续指向晨渊观星台、31 段航线序号和全部完成总览。
- 构建产物 dist 包含晨渊观星台。
- GitHub Pages workflow 25082177564 已成功，线上地址返回 HTTP 200，且发布文件包含晨渊观星台。
- #2 已回复并保持 open，等待复测确认晨渊观星台是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为晨渊观星台改善长尾内容丰富度。

## 2026-04-29 Product decision：星冠回声站航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 50M 的远曦灯塔，但远曦灯塔完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“星冠回声站”航段，要求累计 65M 能量，奖励过载奖励 +19%。
- 星图路线从 29 段扩展到 30 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个远曦灯塔后续航段继续延长现有路线，并把奖励落到过载奖励成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 06:46 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖远曦灯塔完成后继续指向星冠回声站、30 段航线序号和全部完成总览。
- 构建产物 dist 已包含星冠回声站。
- GitHub Pages workflow 25081716589 已成功，线上地址返回 HTTP 200，且发布文件包含星冠回声站。
- #2 已回复并保持 open，等待复测确认星冠回声站是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为星冠回声站改善长尾内容丰富度。

## 2026-04-29 Product decision：远曦灯塔航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 38M 的离辉轨道港，但离辉轨道港完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“远曦灯塔”航段，要求累计 50M 能量，奖励总产能 +19%。
- 星图路线从 28 段扩展到 29 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个离辉轨道港后续航段继续延长现有路线，并把奖励落到总产能成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 06:32 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖离辉轨道港完成后继续指向远曦灯塔、29 段航线序号和全部完成总览。
- 构建产物 dist 已包含远曦灯塔。
- GitHub Pages workflow 25081269321 已成功，线上地址返回 HTTP 200，且发布文件包含远曦灯塔。
- #2 已回复并保持 open，等待复测确认远曦灯塔是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为远曦灯塔改善长尾内容丰富度。

## 2026-04-29 Product decision：离辉轨道港航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 30M 的脉冲航闸，但脉冲航闸完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“离辉轨道港”航段，要求累计 38M 能量，奖励自动产能 +18%。
- 星图路线从 27 段扩展到 28 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个脉冲航闸后续航段继续延长现有路线，并把奖励落到自动成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 06:17 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖脉冲航闸完成后继续指向离辉轨道港、28 段航线序号和全部完成总览。
- 构建产物 dist 已包含离辉轨道港。
- GitHub Pages workflow 25080761749 已成功，线上地址返回 HTTP 200，且发布文件包含离辉轨道港。
- #2 已回复并保持 open，等待复测确认离辉轨道港是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为离辉轨道港改善长尾内容丰富度。

## 2026-04-29 Product decision：脉冲航闸航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 24M 的引潮星环，但引潮星环完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“脉冲航闸”航段，要求累计 30M 能量，奖励点击产能 +18%。
- 星图路线从 26 段扩展到 27 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个引潮星环后续航段继续延长现有路线，并把奖励落到点击成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 06:04 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖引潮星环完成后继续指向脉冲航闸、27 段航线序号和全部完成总览。
- GitHub Pages workflow 25080325889 已成功，线上地址返回 HTTP 200，且发布文件包含脉冲航闸。
- #2 已回复并保持 open，等待复测确认脉冲航闸是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为脉冲航闸改善长尾内容丰富度。

## 2026-04-29 Product decision：引潮星环航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 20M 的磁帆穹顶，但磁帆穹顶完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“引潮星环”航段，要求累计 24M 能量，奖励过载奖励 +18%。
- 星图路线从 25 段扩展到 26 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个磁帆穹顶后续航段继续延长现有路线，并把奖励落到过载成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 05:51 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 已通过，覆盖磁帆穹顶完成后继续指向引潮星环、26 段航线序号和全部完成总览。
- GitHub Pages workflow 25079781899 已成功，线上地址返回 HTTP 200，且发布文件包含引潮星环。
- #2 已回复并保持 open，等待复测确认引潮星环是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为引潮星环改善长尾内容丰富度。

## 2026-04-29 Product decision：磁帆穹顶航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 16.5M 的日冕回廊，但日冕回廊完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“磁帆穹顶”航段，要求累计 20M 能量，奖励总产能 +18%。
- 星图路线从 24 段扩展到 25 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个日冕回廊后续航段继续延长现有路线，并把奖励落到总产能成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 05:38 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖日冕回廊完成后继续指向磁帆穹顶、25 段航线序号和全部完成总览。
- GitHub Pages workflow 25079287266 已成功，线上地址返回 HTTP 200，且发布文件包含磁帆穹顶。
- #2 已回复并保持 open，等待复测确认磁帆穹顶是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为磁帆穹顶改善长尾内容丰富度。

## 2026-04-29 Product decision：日冕回廊航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 13.5M 的极昼折跃井，但极昼折跃井完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“日冕回廊”航段，要求累计 16.5M 能量，奖励自动产能 +16%。
- 星图路线从 23 段扩展到 24 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个极昼折跃井后续航段继续延长现有路线，并把奖励落到自动成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 05:26 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖极昼折跃井完成后继续指向日冕回廊、24 段航线序号和全部完成总览。
- GitHub Pages workflow 25078802380 已成功，线上地址返回 HTTP 200，且发布文件包含日冕回廊。
- #2 已回复并保持 open，等待复测确认日冕回廊是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为日冕回廊改善长尾内容丰富度。

## 2026-04-29 Product decision：极昼折跃井航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 11M 的寂光中继环，但寂光中继环完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“极昼折跃井”航段，要求累计 13.5M 能量，奖励点击产能 +16%。
- 星图路线从 22 段扩展到 23 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个寂光中继环后续航段继续延长现有路线，并把奖励落到点击成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 05:14 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖寂光中继环完成后继续指向极昼折跃井、23 段航线序号和全部完成总览。
- GitHub Pages workflow 25078221692 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open，等待复测确认极昼折跃井是否改善长尾内容丰富度。

下一步：发布后继续观察 #2 复测是否认为极昼折跃井改善长尾内容丰富度。

## 2026-04-29 Product decision：寂光中继环航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 9M 的深穹测距阵，但深穹测距阵完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“寂光中继环”航段，要求累计 11M 能量，奖励过载奖励 +16%。
- 星图路线从 21 段扩展到 22 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个深穹测距阵后续航段继续延长现有路线，并把奖励落到过载成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 05:00 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖深穹测距阵完成后继续指向寂光中继环、22 段航线序号和全部完成总览。
- GitHub Pages workflow 25077653548 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：发布后继续观察 #2 复测是否认为寂光中继环改善长尾内容丰富度。

## 2026-04-29 Product decision：深穹测距阵航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 7.25M 的星云档案库，但星云档案库完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“深穹测距阵”航段，要求累计 9M 能量，奖励总产能 +17%。
- 星图路线从 20 段扩展到 21 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个星云档案库后续航段继续延长现有路线，并把奖励落到总产能成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 04:48 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖星云档案库完成后继续指向深穹测距阵、21 段航线序号和全部完成总览。
- GitHub Pages workflow 25077104300 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：发布后继续观察 #2 复测是否认为深穹测距阵改善长尾内容丰富度。

## 2026-04-29 Product decision：星云档案库航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 5.75M 的虚空罗盘，但虚空罗盘完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“星云档案库”航段，要求累计 7.25M 能量，奖励自动产能 +17%。
- 星图路线从 19 段扩展到 20 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个虚空罗盘后续航段继续延长现有路线，并把奖励落到自动成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 04:32 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖虚空罗盘完成后继续指向星云档案库、20 段航线序号和全部完成总览。
- GitHub Pages workflow 25076465558 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：发布后继续观察 #2 复测是否认为星云档案库改善长尾内容丰富度。

## 2026-04-29 Product decision：虚空罗盘航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 4.5M 的暗流观测站，但暗流观测站完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“虚空罗盘”航段，要求累计 5.75M 能量，奖励点击产能 +15%。
- 星图路线从 18 段扩展到 19 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个暗流观测站后续航段继续延长现有路线，并把奖励落到点击成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 04:18 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过，覆盖暗流观测站完成后继续指向虚空罗盘、19 段航线序号和全部完成总览。
- GitHub Pages workflow 25075816843 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：发布后继续观察 #2 复测是否认为虚空罗盘改善长尾内容丰富度。

## 2026-04-29 Product decision：暗流观测站航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 3.5M 的引力航标，但引力航标完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“暗流观测站”航段，要求累计 4.5M 能量，奖励过载奖励 +15%。
- 星图路线从 17 段扩展到 18 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个引力航标后续航段继续延长现有路线，并把奖励落到过载成长线。

验收标准：

- GitHub Issues 已同步：2026-04-29 04:06 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun install、bun run test、bun run build、npm install、npm test 和 npm run build 通过。
- 测试覆盖引力航标完成后继续指向暗流观测站、18 段航线序号和全部完成总览。
- GitHub Pages workflow 25075213288 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：继续观察 #2 复测是否认为暗流观测站改善长尾内容丰富度。

## 2026-04-29 Product decision：引力航标航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 2.75M 的彗尾船坞，但彗尾船坞完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“引力航标”航段，要求累计 3.5M 能量，奖励总产能 +15%。
- 星图路线从 16 段扩展到 17 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个彗尾后续航段继续延长现有路线。

验收标准：

- GitHub Issues 已同步：2026-04-29 03:53 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm test 通过，覆盖彗尾船坞完成后继续指向引力航标、17 段航线序号和全部完成总览。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25074556183 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：继续观察 #2 复测是否认为引力航标改善长尾内容丰富度。

## 2026-04-29 Product decision：彗尾船坞航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 2M 的外环信标，但外环信标完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“彗尾船坞”航段，要求累计 2.75M 能量，奖励自动产能 +18%。
- 星图路线从 15 段扩展到 16 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个外环后续航段继续延长现有路线。

验收标准：

- GitHub Issues 已同步：2026-04-29 03:46 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 已回复并仍为 open。
- npm test 通过，覆盖外环信标完成后继续指向彗尾船坞、16 段航线序号和全部完成总览。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25073990022 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open。

下一步：继续观察 #2 复测是否认为彗尾船坞改善长尾内容丰富度。

## 2026-04-29 Product decision：外环信标航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把星图路线延伸到 1.5M 的星门远征，但星门远征完成后仍会暴露“全部航段已完成，等待下一段航线”的内容边界。

本轮决策：

- 新增“外环信标”航段，要求累计 2M 能量，奖励点击产能 +14%。
- 星图路线从 14 段扩展到 15 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个星门后续航段继续延长现有路线。

验收标准：

- GitHub Issues 已同步：2026-04-29 03:26 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm test 通过，覆盖星门远征完成后继续指向外环信标、15 段航线序号和全部完成总览。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25073461380 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：继续观察 #2 复测是否认为外环信标改善长尾内容丰富度。

## 2026-04-29 Product decision：星门远征航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把航线策略和策略专精进度关联到同屏，但当玩家完成现有 13 段星图路线后仍会回到循环累计目标，后续内容边界过早暴露。

本轮决策：

- 新增“星门远征”航段，要求累计 1.5M 能量，奖励总产能 +16%。
- 星图路线从 13 段扩展到 14 段；主目标、总览、航线预告、项目列表和全部完成状态沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有奖励数值和升级价格，先用一个深空后续航段延长现有路线。

验收标准：

- GitHub Issues 已同步：2026-04-29 03:19 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 已回复并仍为 open。
- bun run test 通过，覆盖深空航段完成后继续指向星门远征、14 段航线序号和全部完成总览。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25072808220 已成功，线上地址返回 HTTP 200。
- #2 已回复并保持 open，等待复测确认 1.5M 后续航段是否改善长尾内容丰富度。

下一步：继续观察 #2 复测是否认为星门远征改善长尾内容丰富度。

## 2026-04-29 Product decision：航线专精进度展示

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮已把航线策略扩展为点火航校、巡航航校和均衡校准三段专精目标，但策略按钮本身仍只显示倍率摘要，玩家需要去项目列表里对照对应专精航段。

本轮决策：

- 航线策略定义绑定对应专精航段：均衡航线对应均衡校准，点火优先对应点火航校，巡航优先对应巡航航校。
- 航线策略按钮在 100K 解锁后显示对应专精航段进度或完成状态。
- 不新增存档字段、不调整奖励数值和升级价格，先把主动策略选择和现有可追目标连起来。

验收标准：

- GitHub Issues 已同步：2026-04-29 02:57 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- bun run test 通过，覆盖航线策略专精进度和已完成状态。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25072150110 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：发布后观察 #2 复测是否认为航线策略和策略专精目标的关联更清晰。

## 2026-04-29 Product decision：星图策略专精航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮航线策略增加了主动选择，但这些策略还缺少对应的可追目标，玩家可能只感知为倍率开关。

本轮决策：

- 新增点火航校，要求聚能透镜达到 14 级，奖励点击产能 +16%。
- 新增巡航航校，要求自动采集臂达到 14 级，奖励自动产能 +16%。
- 新增均衡校准，要求星核稳定器达到 14 级，奖励总产能 +14%。
- 星图路线从 10 段扩展到 13 段；主目标、总览、航线预告和项目列表沿用现有航段序号与奖励展示。
- 不新增存档字段、不调整既有项目奖励和升级价格，先把航线策略变成可追的中后段目标。

验收标准：

- GitHub Issues 已同步：2026-04-29 02:41 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm test 通过，覆盖新增策略专精航段、13 段航线序号、策略专精奖励叠加和全部完成总览。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25071584006 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：发布后观察 #2 复测是否认为航线策略从“倍率选择”变成了可玩的中后段目标。

## 2026-04-29 Product decision：星图航线策略

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮航段序号后没有新的复测结论。星图计划已经扩展了路线、奖励和导航，但玩家在 100K 后仍主要是沿一条固定路线推进，缺少一个可主动切换的玩法选择。

本轮决策：

- 新增星图航线策略，累计 100K 能量后解锁。
- 提供“均衡航线”“点火优先”“巡航优先”三种策略。
- 点火优先提升点击产能和过载奖励；巡航优先提升自动产能；均衡航线保持当前产能分配。
- 航线策略进入本地存档、产能计算、界面按钮和反馈快照。
- 不新增星图项目、不改既有星图奖励和升级价格，先用一组轻量可切换策略提升中后段主动选择感。

验收标准：

- GitHub Issues 已同步：2026-04-29 02:34 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm test 通过，覆盖 100K 后航线策略解锁、点火优先产能变化、旧存档未知策略兼容和反馈快照中的航线策略。
- npm install、npm test、npm run build、bun run test 和 bun run build 通过。
- GitHub Pages workflow 25070815559 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：#2 保持 open；等待玩家复测航线策略是否改善内容丰富度和主动选择感。

## 2026-04-29 Product decision：星图航段序号

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，上一轮当前航段标记后没有新的复测结论。星图项目已经有总览、奖励预告和当前航段高亮，但玩家在主目标条和项目列表中仍只能从项目数量间接感知路线规模，缺少“当前是第几段/总共几段”的直接信号。

本轮决策：

- 为星图项目状态派生 `segmentIndex`、`segmentTotal` 和 `segmentText`。
- 星图总览显示“下一段 X/10：项目名”，把下一段目标和完整航线规模放在同一行。
- 星图主目标进度前置“航段 X/10”，让当前追逐目标直接带有路线位置。
- 星图项目列表显示“航段 X/10”徽章，并继续只把第一个未完成项目标为“当前航段”。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有中后段内容的规模感和导航清晰度。

验收标准：

- GitHub Issues 已同步：2026-04-29 02:12 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm install 成功。
- npm test 通过，覆盖星图航段序号、总览下一段序号和星图主目标航段文案。
- npm run build 生成 dist。
- bun run test 和 bun run build 通过。
- GitHub Pages workflow 25070035103 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：#2 保持 open；等待玩家复测航段序号是否改善中后段内容规模感和目标定位。

## 2026-04-29 Product decision：星图当前航段标记

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open，且上一轮过载谐振成长线后没有新的复测结论。星图总览已经显示下一段和后续航线，但项目列表本身仍缺少“当前正在推进哪一段”的直接标记，玩家在多个中后段项目之间还需要自行对照总览和列表。

本轮决策：

- 为星图项目状态派生 `isCurrent`，只标记第一个未完成项目。
- 星图项目列表对当前项目显示“当前航段”徽章并高亮。
- 全部星图项目完成时不显示当前航段，避免误导。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有中后段内容的导航清晰度。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:55 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm install 成功。
- npm test 通过，覆盖星图项目只会标记第一个未完成项目为当前航段，全部完成时没有当前航段。
- npm run build 生成 dist。
- bun run test 和 bun run build 通过。
- GitHub Pages workflow 25069380519 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：#2 已回复并保持 open；等待玩家复测当前航段标记是否改善中后段目标识别。

## 2026-04-29 Product decision：过载谐振线

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。前序迭代已经扩展星图目标、奖励预告和生效加成，但中后段成长方向仍主要围绕点击产能、自动产能和总产能，早期的过载点击机制没有形成后续成长线。

本轮决策：

- 新增“星核谐振器”升级，提升每次过载触发的奖励。
- 顶部产能区新增“过载”数值，让玩家能直接看到当前过载奖励。
- 星图计划在点亮星图后新增“谐振校准”项目，要求星核谐振器达到 6 级，奖励过载奖励 +20%。
- 反馈快照补充过载奖励字段，后续反馈能带上这条新成长线的状态。
- 不调整 100K 前目标顺序、不改已有升级价格、不新增远端指标，先用一条小型可测试成长线回应内容不足反馈。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:39 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 尚无新的复测结论。
- npm test 通过，覆盖星核谐振器购买、100K 后谐振校准接管星图目标、星图总览预告和过载奖励叠加。
- npm install 成功。
- npm run build 生成 dist。
- bun run test 和 bun run build 通过。
- GitHub Pages workflow 25068686413 已成功，线上地址返回 HTTP 200。
- #2 已回复并仍为 open。

下一步：#2 已回复并保持 open；等待玩家复测过载谐振成长线是否改善内容丰富度和主动点击成长感知。

## 2026-04-29 Product decision：星图航线奖励预告

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。星图总览已经显示下一段、后续航线和已生效加成，但航线预告只列项目名，玩家仍需要去项目列表里逐项查看后续奖励。

本轮决策：

- 在星图总览的“航线预告”中，把最多 3 个未完成项目的名称和奖励一起展示。
- 全部项目完成后的等待下一段航线文案保持不变。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有后续内容的成长预期可见性。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:29 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 已回复并仍为 open。
- npm install 成功。
- npm test 通过，覆盖星图总览航线预告中的后续项目奖励文案。
- npm run build 生成 dist。
- bun run test 和 bun run build 通过。
- GitHub Pages workflow 25067860271 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测航线奖励预告是否改善内容丰富度和后续奖励感知。

## 2026-04-29 Product decision：星图加成总览

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。前序迭代已经让星图总览显示下一段目标、奖励和后续航线，但玩家完成项目后，仍需要从产能数字变化中反推“已完成内容正在带来什么长期收益”。

本轮决策：

- 在星图总览中新增“生效加成”，汇总当前已完成星图项目带来的总产能、点击产能和自动产能倍率。
- 尚未完成任何星图项目时显示等待首个星图奖励。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有内容和长期成长之间的可见关联。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:18 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 已回复并仍为 open。
- npm install 成功。
- npm test 通过，覆盖首个星图项目前、部分星图奖励生效后、全部星图项目完成后的加成总览文案。
- npm run build 生成 dist。
- GitHub Pages workflow 25067331498 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测星图加成总览是否改善内容丰富度和成长反馈感知。

## 2026-04-29 Product decision：星图航线预告

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮星图总览已经集中展示下一段目标和奖励，但玩家仍只能看到一个下一目标，难以快速感知后续还有多少连续内容。

本轮决策：

- 在星图总览中新增“航线预告”，展示最多 3 个未完成星图项目。
- 全部项目完成后，航线预告显示等待下一段航线。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有中后段内容的连续性可见度。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:05 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖星图总览的后续项目预告，以及全部项目完成后的预告状态。
- npm run build 生成 dist。
- GitHub Pages workflow 25066765644 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测星图航线预告是否改善内容丰富度和后续目标感知。

## 2026-04-29 Product decision：星图总览

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。星图计划已经延伸到 500K 后，但侧栏只逐项罗列项目，玩家缺少一个快速判断“已完成多少、下一段是什么、奖励是什么”的总览。

本轮决策：

- 在星图计划列表前新增星图总览。
- 总览显示已完成项目数/总项目数、下一段项目名称、下一段奖励和对应进度详情。
- 全部项目完成后显示全部航段已完成和奖励已生效状态。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有中后段内容的可读性。

验收标准：

- GitHub Issues 已同步：2026-04-29 00:46 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm test 通过，覆盖中后段玩家的星图总览，以及全部星图项目完成后的总览状态。
- npm install 成功。
- npm run build 生成 dist。
- GitHub Pages workflow 25066081325 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测星图总览是否改善内容丰富度和后续目标感知。

## 2026-04-29 Product decision：深空航段

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已经补强星图项目完成反馈，但远星中继完成后仍会回到循环累计目标；对中后段玩家来说，500K 后还需要看到下一段明确内容。

本轮决策：

- 在远星中继之后新增深空矿带，要求累计 750K 能量，奖励点击产能 +26%。
- 新增星环工厂，要求自动采集臂达到 16 级，奖励自动产能 +30%。
- 新增恒星锚点，要求星核稳定器达到 16 级，奖励总产能 +22%。
- 不调整 100K 前目标、反馈入口、部署基础设施和已有升级曲线，先扩展星图项目层的后续目标密度。

验收标准：

- GitHub Issues 已同步：2026-04-29 00:32 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖 500K 后继续指向深空矿带，以及深空航段完成后的项目奖励叠加。
- npm run build 生成 dist。
- GitHub Pages workflow 25065455400 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测 500K 后深空航段是否改善内容丰富度。

## 2026-04-29 Product decision：星图奖励完成反馈

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。上一轮已经扩展 250K 后长尾项目，但项目完成瞬间只提示目标切换，没有明确确认“刚获得了什么奖励”，中后段内容的完成感仍可能被弱化。

本轮决策：

- 星图项目完成并切换到下一目标时，在操作提示中追加“获得奖励：X”。
- 普通早期目标完成提示保持原文案，不额外制造奖励描述。
- 不调整升级曲线、星图项目数量、奖励数值和反馈入口，先补强已有中后段内容的完成反馈。

验收标准：

- GitHub Issues 已同步：2026-04-29 00:21 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖星桥试运行完成后提示已获得总产能奖励并切换到稳定矩阵。
- npm run build 生成 dist。
- GitHub Pages workflow 25064855163 已成功，线上地址返回 HTTP 200。

下一步：#2 已回复并保持 open；等待玩家复测星图项目完成提示是否改善中后段完成感和内容丰富度感知。

## 2026-04-29 Product decision：星图长尾目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：上一轮已让星图项目进入主目标并显示奖励，但星桥试运行之后仍会回到循环累计目标。对“内容丰富度太差”的反馈来说，首批星图项目完成后还需要继续看到 250K 之后的可追目标。

本轮决策：

- 在星桥试运行之后新增稳定矩阵和远星中继两个星图项目。
- 稳定矩阵要求星核稳定器达到 12 级，并奖励总产能 +18%。
- 远星中继要求累计 500K 能量，并奖励自动产能 +24%。
- 保持 100K 前目标、反馈入口、部署基础设施和已有升级曲线不变，先扩展星图长尾而不引入主动分支系统。

验收标准：

- GitHub Issues 已同步：2026-04-29 00:06 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖首批星图项目完成后继续指向稳定矩阵，以及远星中继完成后的自动产能奖励。
- npm run build 生成 dist。
- GitHub Pages workflow 25064242368 已成功。

下一步：#2 已回复并保持 open；等待玩家复测 250K 后长尾星图目标是否改善内容丰富度。

## 2026-04-28 Product decision：星图奖励进主目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：星图计划已经接管 100K 后主目标，但目标条只显示进度和下一步购买动作，奖励仍主要在侧栏项目列表里。对“内容丰富度太差”的反馈来说，主操作区需要直接说明完成当前计划会带来什么成长。

本轮决策：

- 星图项目进入主目标条时，把项目奖励随进度文案一起展示。
- 透镜阵列、采集阵列仍保留对应升级的可购买/能量缺口提示，并追加奖励说明。
- 100K 前目标、项目奖励数值、反馈入口和部署基础设施保持不变。

验收标准：

- GitHub Issues 已同步：2026-04-28 23:55 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖星图主目标显示奖励文案。
- npm run build 生成 dist。

下一步：#2 保持 open；等待玩家复测主目标条同时显示行动和奖励后，确认内容丰富度感知是否改善。

## 2026-04-28 Product decision：星图主目标

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：上一轮已新增 100K 后星图计划，但主目标条在中后段仍可能回到“累计 X 能量”的循环目标。对反馈“内容丰富度太差”的玩家来说，新内容应进入主操作区，而不只是在侧栏等待玩家发现。

本轮决策：

- 100K 后且基础目标完成时，当前目标优先指向下一个未完成的星图计划项目。
- 透镜阵列和采集阵列复用升级行动提示，并继续高亮对应升级卡片。
- 100K 前仍保留短周期累计能量目标，避免过早把玩家推向跨度过大的长期目标。
- 保持星图项目奖励、反馈入口、部署基础设施和数值曲线不变。

验收标准：

- GitHub Issues 已同步：2026-04-28 23:43 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm install 成功。
- npm test 通过，覆盖 100K 后星图项目接管当前目标，以及 100K 前仍保留短周期累计目标。
- npm run build 生成 dist。

下一步：#2 已回复并保持 open；等待玩家复测星图计划在主目标条出现后是否缓解内容不足感。

## 2026-04-28 Product decision：星图计划

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 出现真实体验反馈 #2，进入有反馈样本下的 Product decision。

当前最大问题：#2 评分 3/5，玩家在累计 114.5K 能量、升级 lens:11 / collector:11 / stabilizer:9 后反馈“内容丰富度太差，可玩的内容太少”。当前稳定器之后只剩循环累计目标，缺少新的中后段追逐对象。

本轮决策：

- 新增“星图计划”项目层，提供点亮星图、透镜阵列、采集阵列和星桥试运行 4 个中后段目标。
- 项目按累计能量或升级等级自动完成，完成后提供总产能、点击产能或自动产能奖励。
- 侧栏显示每个项目的进度、剩余量、完成状态和奖励，给 100K 以后玩家明确的下一步内容。
- 保持反馈入口、部署基础设施和原有升级曲线不变，先用小型可验证内容层回应真实反馈。

验收标准：

- GitHub Issues 已同步：2026-04-28 23:23 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 已补充 feedback 标签。
- npm install 成功。
- npm test 通过，覆盖星图项目进度和项目奖励后的有效产能。
- npm run build 生成 dist。

下一步：#2 已回复并保持 open；继续观察玩家复测后是否仍认为内容不足，再决定是否引入主动选择、分支升级或重置循环。

## 2026-04-28 Product decision：目标升级推荐

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：目标条已经说明下一步关键升级，但升级区没有视觉锚点，玩家仍需要在卡片列表里自行匹配目标对应的升级。

本轮决策：

- 为购买型目标暴露对应 upgradeId。
- 升级区将当前目标对应卡片高亮，并显示“目标推荐”标记。
- 保持数值曲线、目标顺序、反馈入口和部署基础设施不变。

验收标准：

- GitHub Issues 已同步：2026-04-28 23:12 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖购买型目标到升级推荐的映射。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，继续围绕 30 秒内的目标理解、升级选择和反馈入口转化做小步优化。

## 2026-04-28 Product decision：目标完成反馈

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：目标条能显示下一步和剩余量，但完成目标的那一刻只会切换到新目标，玩家缺少明确的“已完成/下一目标”反馈。

本轮决策：

- 点击、购买升级或自动产能推进目标时，在主操作区拼接显示目标完成和下一目标。
- 新增本地 `goal_complete` 事件，记录完成目标和下一目标，用于验证目标链路是否被触发。
- 保持数值曲线、升级顺序、反馈入口和部署基础设施不变。

验收标准：

- GitHub Issues 已同步：2026-04-28 23:02 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖目标完成提示拼接。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，继续围绕 30 秒内的目标完成、升级选择和反馈入口转化做小步优化。

## 2026-04-28 Product decision：操作反馈可见性

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：目标条和升级卡片已经说明下一步还差多少，但玩家完成点击或购买后仍需要从数值变化中反推本次行动收益，早期正反馈不够明确。

本轮决策：

- 点击星核后在主操作区显示本次获得的能量。
- 第八次连击触发过载时，操作提示显示本次总收益并标明“含过载”。
- 购买升级后显示已购买升级、新等级和当前产能结果。
- 保持数值曲线、升级顺序、部署和反馈基础设施不变。

验收标准：

- GitHub Issues 已同步：2026-04-28 22:51 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖点击收益提示和升级购买提示。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，继续围绕 30 秒内的行动反馈、目标理解和反馈入口转化做小步优化。

## 2026-04-28 Product decision：目标行动提示

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：目标条已显示“进度/剩余量”，但购买型目标仍以“还差 1 次升级/1 级”表达，玩家需要再去升级区匹配下一步实际需要多少能量。

本轮决策：

- 为购买型目标补充关键升级行动提示：首次升级指向聚能透镜，自动产能指向自动采集臂，稳定器目标指向星核稳定器。
- 目标条在未满足购买条件时显示“还差 X 能量购买 Y”，满足条件时显示“可购买 Y”。
- 保持数值曲线、目标顺序和反馈基础设施不变，继续优先降低早期目标理解成本。

验收标准：

- GitHub Issues 已同步：2026-04-28 22:37 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖购买型目标的能量缺口和可购买提示。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，优先继续优化 30 秒内点击、购买与目标条之间的一致性。

## 2026-04-28 Product decision：过载进度可读性

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：第八次连击会触发过载奖励，但界面只显示连击数和“稳定/过载”状态，玩家无法直接判断还差几次点击触发下一次奖励。

本轮决策：

- 将过载间隔提取为可测试常量，并返回连击数、过载进度、剩余点击数和触发状态。
- 在连击状态栏显示“过载 X/8”和“距过载 X 次”，触发时保留过载奖励反馈。
- 修正旧发布脚本中的测试绕过，确保 deploy/autopush 路径在测试失败时停止。
- 保持升级、目标、离线收益和反馈基础设施不变，继续优先补强 30 秒内核心循环的状态可见性。

验收标准：

- GitHub Issues 已同步：2026-04-28 22:25 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖连击过载进度和剩余点击数。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，优先观察早期点击节奏和反馈表单转化是否需要更清晰的微文案。

## 2026-04-28 Product decision：目标进度可读性

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 仍无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：当前目标只显示目标名称和进度条，玩家无法直接看到“已经完成多少、还差多少”，目标条的信息密度低于升级卡片。

本轮决策：

- 为当前目标返回 currentValue、remaining 和 progressText。
- 在目标条中显示“进度 X / Y · 还差 Z”，覆盖首次升级、自动采集、累计能量、稳定器和循环目标。
- 保持数值曲线、升级成本和反馈基础设施不变，避免无反馈时扩大系统复杂度。

验收标准：

- GitHub Issues 已同步：2026-04-28 22:16 CST 查询到 0 个 open issue、0 个 open feedback issue、0 个 open bug issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖当前目标进度和剩余量。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，优先继续补强 30 秒内目标链路的状态反馈。

## 2026-04-28 Product decision：升级可读性

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 暂无真实玩家反馈，继续处于无反馈样本下的 Product decision。

当前最大问题：升级按钮只显示等级和成本，玩家需要自行心算距离下一次正反馈还差多少能量，早期点击节奏不够清晰。

本轮决策：

- 为每个升级计算购买进度、剩余能量和可购买状态。
- 在升级卡片中显示“还差 X”或“可购买”，并加入非交互进度条，降低玩家判断下一步行动的成本。
- 保持数值曲线不变，不在无真实反馈时提前扩大系统复杂度。

验收标准：

- GitHub Issues 已同步：2026-04-28 22:06 CST 查询到 0 个 open issue，#1 仍为 closed。
- npm install 成功。
- npm test 通过，覆盖升级购买进度计算。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，优先补充轻量目标链路或新手阶段的状态提示。

## 2026-04-28 Product decision

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 与 manual-feedback 暂无真实玩家反馈，处于无反馈样本下的 Product decision。

当前最大问题：自动产能已经能在离线期间累计，但玩家回到页面时缺少明确回收反馈，放置玩法的“回来有收获”不够可见。

本轮决策：

- 读取存档时立即结算离线收益，沿用现有 8 小时离线收益上限。
- 当收益达到至少 1 能量且离线时间不少于 30 秒时，在主操作区显示一次离线回收提示。
- 记录本地 `offline_gain` 事件，用于验证离线收益触发；发布前仍不得把本地事件当作真实线上指标。

验收标准：

- GitHub Issues 已同步：2026-04-28 21:51 CST 查询到 0 个 open issue，#1 已关闭。
- npm install 成功。
- npm test 通过，覆盖离线收益结算摘要。
- npm run build 生成 dist。

下一步：等待真实玩家反馈；若仍无反馈，优先补充轻量目标或升级可读性，而不是引入复杂后端。

## 2026-04-28 Feedback Infra

阶段判断：仓库已有 package.json、可玩游戏、构建脚本和 Vercel 发布版本；GitHub Pages 已可配置；游戏内尚缺少真实反馈入口，处于 Feedback infra。

当前最大问题：玩家无法从游戏界面直接提交结构化反馈，`feedback_sent` 指标也没有触发入口。

本轮决策：

- 在侧栏新增游戏内反馈表单，收集类型、评分和内容。
- 提交时生成预填的 GitHub Issue 草稿，并附带当前游戏快照，避免提交密钥或引入未验证后端。
- 本地记录最近 50 条反馈草稿，并写入 `feedback_sent` 事件，作为前端行为验证；发布前不得把本地记录当作真实线上指标。
- GitHub 仓库当前为 public，已通过 REST API 用 `build_type=workflow` 启用 GitHub Pages；issue #1 已在 deploy workflow 通过后回复并关闭。

验收标准：

- npm install 成功。
- npm test 通过，覆盖反馈 Issue 链接和游戏快照。
- npm run build 生成 dist。
- 主分支 push 后 GitHub Pages workflow 可部署，本轮 run 25056371852 已通过。

下一步：开始收集真实玩家反馈，优先观察 feedback issue 的内容质量和首批阻塞点。

## 2026-04-28 Build/Deploy Infra

阶段判断：仓库已有 package.json、浏览器游戏、测试和构建脚本，但 GitHub Pages 尚未配置，处于 Build/Deploy infra。

当前最大问题：主分支 push 后不会自动生成可访问的静态发布版本。

本轮决策：新增 GitHub Pages Actions workflow，并同步更新 workflow 生成脚本。CI 必须执行安装、测试和构建，测试失败不得继续部署。

执行结果：GitHub Actions build job 通过，但私有仓库当前计划不支持 GitHub Pages，已创建 issue #1 跟踪。为避免已知失败，Pages deploy job 仅在公开仓库执行；本轮已改用 Vercel 发布 `dist/`。

当前可访问版本：https://dist-kblvoc9qq-wangf930-2746s-projects.vercel.app

验收标准：

- npm install 成功。
- npm test 通过。
- npm run build 生成 dist。
- .github/workflows/pages.yml 存在并使用 npm install、npm test、npm run build。
- Vercel 部署状态为 READY。

下一步：部署成功后补齐游戏内反馈入口。

## 2026-04-28 Bootstrap

阶段判断：仓库没有 package.json，处于 Bootstrap。

当前最大问题：项目尚未初始化，玩家无法运行游戏。

本轮决策：先完成《星核工坊》最小可运行版本，包括静态页面、核心数值逻辑、测试与构建脚本。

验收标准：

- npm install 成功。
- npm test 通过。
- npm run build 生成 dist。

下一步：配置 GitHub Pages 或 Vercel preview，并增加稳定的玩家反馈入口。

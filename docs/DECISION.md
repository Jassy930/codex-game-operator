# Decision

## 2026-04-29 Product decision：星图加成总览

阶段判断：仓库已有 package.json、可玩游戏、GitHub Pages 部署和游戏内反馈入口；GitHub Issues 当前仍有真实体验反馈 #2 open，且没有 open bug，继续进入有反馈样本下的 Product decision。

当前最大问题：#2 仍围绕“内容丰富度太差，可玩的内容太少”保持 open。前序迭代已经让星图总览显示下一段目标、奖励和后续航线，但玩家完成项目后，仍需要从产能数字变化中反推“已完成内容正在带来什么长期收益”。

本轮决策：

- 在星图总览中新增“生效加成”，汇总当前已完成星图项目带来的总产能、点击产能和自动产能倍率。
- 尚未完成任何星图项目时显示等待首个星图奖励。
- 不新增项目、不调整奖励数值、不改变升级曲线，先提升已有内容和长期成长之间的可见关联。

验收标准：

- GitHub Issues 已同步：2026-04-29 01:11 CST 查询到 1 个 open issue、1 个 open feedback issue、0 个 open bug issue；#2 仍为 open。
- npm test 通过，覆盖首个星图项目前、部分星图奖励生效后、全部星图项目完成后的加成总览文案。
- npm install 成功。
- npm run build 生成 dist。

下一步：验证后回复 #2 并保持 open；等待玩家复测星图加成总览是否改善内容丰富度和成长反馈感知。

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

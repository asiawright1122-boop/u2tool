# 分语种 FAQ 本地化方案（按需求证据驱动）

> 2026-09-13 制定。背景：20 个恢复工具已全语种解除 noindex，zh/en 双语 FAQ 已补齐，
> 但其余 8 个语种（ja/ko/es/pt/fr/de/ru/ar）存在 117 个零 FAQ 文件。
> 运行时会自动回退显示英文 FAQ（已在 ja/ar 线上实测确认），功能无缺失，
> 因此本地化的唯一动机是**提升非英语市场的 CTR 与内容质量信号**——必须按证据排期，不做无差别铺量。

## 证据矩阵（2026-09-13 快照）

### 需求证据来源
1. **Bing AI Performance**：Copilot 引用次数（3 个月窗口）
2. **Bing Search Performance**：页面曝光/点击 + 关键词曝光
3. **触发规则**：未来任何 locale/slug 进入 Bing Top 50 页面或 AI 引用 ≥100 次

### 已核实的需求信号（非 zh/en 语种）
| 语种/页面 | 信号 | 当前 FAQ |
|---|---|---|
| es/ip-validator | Copilot 引用 683 次、CTR 24.59% | **0 → 本期补齐** |
| ar/ip-lookup（未恢复但同需求族） | 引用 610 次 + 曝光 2.9K + ar 关键词「البحث عن عنوان ip」2.7K | — |
| ko/unicode-converter（未恢复） | 引用 574 次 | — |
| es/character-map | 引用 427 次 + 曝光 1.1K + 关键词「mapa de caracteres」330 | ✅ 已有 5 条 |
| fr/image-frosted-glass（未恢复） | 引用 283 次、CTR 41.13% | — |
| es/credit-card-validator | 曝光 1.1K | — |

## 执行阶段

### Phase 1（立即，1 个文件）
- `es/ip-validator`：6 条西语 FAQ（683 次引用的直接证据，西语文案可自审）

### Phase 2（观察名单，暂不执行）
- `ar/ip-validator`：ar 语种对 IP 工具有明确搜索需求（2.7K 关键词曝光），可推断迁移
- `ja/keyboard-tester`：键盘测试为全球性游戏/开发需求
- 触发条件：上述页面任一进入 Bing Top 50 或 AI 引用 ≥100 → 升级为 Phase 1

### Phase 3（触发规则驱动的常规批次）
- 每 2 周随 Bing 数据复核，任何 locale/slug 满足触发条件即在下一内容批次本地化
- 每批次 ≤5 个文件，控制质量

## 翻译与审核流程（每文件）

1. **源稿**：以 en 版 FAQ 为源（已含功能边界说明，杜绝过度声明）
2. **翻译**：直接以目标语言撰写（非逐句直译），保持与该语种现有文案的语气一致
3. **自审**：es/pt/fr/de 可模型自审；**ja/ko/ru/ar 必须标记「待人工母语审核」**
4. **校验**：`npm run validate:translation-corpus`（schema/覆盖）+ `validate:tdk-integrity`
5. **部署**：随常规批次上线，IndexNow 推送对应语种 URL

## 质量红线

- 禁止逐句机器直译（项目治理已有 generic-template 检测，劣质翻译比英文回退伤害更大）
- FAQ 回答必须对应工具真实能力（引用 content-trust 标准）
- 每语种首批上线后，在下次 Bing 数据复核中对比该页面 CTR 变化，验证本地化收益

## 当前完成度

- zh/en：20 工具 × 双语 = 36/36 页达标（2026-09-13 完成）
- 其余 8 语种：117 个零 FAQ 文件回退英文（功能完整），按上述证据规则逐步本地化

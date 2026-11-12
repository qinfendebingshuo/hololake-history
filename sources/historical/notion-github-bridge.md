# Notion 与 GitHub 早期工程桥接

早期桥接协议 v3.0 将 Notion 用作指令和记录的一端，GitHub 用作执行和回执的一端。文件中区分了五类交接。

| 类型 | 方向 | 记录内容 |
| --- | --- | --- |
| 上行日报 | GitHub → Notion | 汇总工程状态。 |
| 下行指令 | Notion → GitHub | 登记待执行事项。 |
| 执行回执 | GitHub → Notion | 记录一次执行的结果。 |
| 工单 | 系统内流转 | 为后续分析和处理留下可追踪事项。 |
| 紧急通知 | 双向 | 传递需要关注的事件。 |

工单依次经过创建、分派、下达、执行、回执、核验和关闭。跨端传输失败时，原设计通过本地保存、重试和后续补送来维持两端工作。

来源为 GitHub 旧仓快照 `b4a240519765ed9fa5b15c8745ddcb3943729541` 中的 `docs/neural-bridge-protocol-v3.md`。协议原稿标记版本 `v3.0.0`。

- [Notion 历史站](https://opalescent-soldier-906.notion.site/Notion-416fb92f383181a699f8faa49d194d43)
- [GitHub 与新加坡、京东的迁移沿革](../../docs/engineering-history.md)

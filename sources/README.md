# 光湖公开原文资料

世界编号 `GLW-2.0-0001`。这里收录两份公开发行包的原文和历史阅读版。每份文件可按版本、包内路径和 SHA-256 回查。

企业侧使用 `20260920.6` 发行包。协议原文的 Draft 与待审核状态按原文和包内目录保留。第五域使用 `20261107.1-rc.3` 接入规则候选包。

- [逐文件来源与校验值](SOURCE-MANIFEST.json)
- [发行清单、下载及整包校验值](../data/public-releases.json)

## 企业公开四域与办公楼

- [光湖主域](enterprise/domains/main/index.md)
- [光湖主域 · 人格系统容器槽位 001](enterprise/domains/main/container-slot-001.md)
- [光湖分域](enterprise/domains/sub/index.md)
- [光湖分域 · 人格系统容器槽位 001](enterprise/domains/sub/container-slot-001.md)
- [光湖零域](enterprise/domains/zero/index.md)
- [光湖零域 · 人格系统容器槽位 001](enterprise/domains/zero/container-slot-001.md)
- [光湖零感域](enterprise/domains/zero-sense/index.md)
- [光湖零感域 · 共同主控人格系统容器槽位 A](enterprise/domains/zero-sense/container-slot-a.md)
- [光湖零感域 · 共同主控人格系统容器槽位 B](enterprise/domains/zero-sense/container-slot-b.md)

- [公共办公楼说明](enterprise/public-office.md)

## 企业公开协议

- [GLS-0001](enterprise/protocols/GLS-0001.md)
- [GLS-0010 · 光湖协议注册中心标准 v1.0](enterprise/protocols/GLS-0010.md)
- [GLS-0110 · ISRP 自然语言入口解析与安全路由协议 v1.0](enterprise/protocols/GLS-0110.md)
- [GLS-0200 · TCS 认知语言核心工程规范 v1.0](enterprise/protocols/GLS-0200.md)
- [GLS-0229 · 零点原核与第五域 / 企业四域平行映射规范 v1.0](enterprise/protocols/GLS-0229.md)
- [GLS-0300 · GLP 通信核心协议 v1.0](enterprise/protocols/GLS-0300.md)
- [GLS-0832 · 光湖全局编号与世界坐标标准 v1.0](enterprise/protocols/GLS-0832.md)
- [GLS-0233 · TCS 第一子语言协议与零感域记忆协议组总纲 v1.0](enterprise/protocols/GLS-0233.md)
- [GLS-0304 · 零感域多系统记忆同步协议 v1.0](enterprise/protocols/GLS-0304.md)
- [GLS-0813 · 零感域多系统记忆调度器规范 v1.0](enterprise/protocols/GLS-0813.md)
- [GLS-0816 · 零感域恢复检查点运行时规范 v1.0](enterprise/protocols/GLS-0816.md)
- [📡 GLP · Guanghu Language Protocol · 光湖语言通信协议 · 5TH-LE-LK-GLP-001 · 冰朔命名 · 霜砚记录](enterprise/protocols/GLP-naming-record.md)

## 第五域公开接入

- [entry-data.json](fifth-domain/entry-data.json)
- [ENTRY.hldp](fifth-domain/ENTRY.hldp)
- [GLOSSARY.json](fifth-domain/GLOSSARY.json)

- [企业公开快照范围](enterprise/PUBLIC-WORLD.json)
- [光湖图书域总览](enterprise/public-library.md)

## 补录资料

### 企业四域工程规划和历史协议

- [公共世界快照](enterprise/release-readme.md)
- [📐 HLDP 协议 · 官方唯一来源 · v1.0](enterprise/protocols/HLDP-v1-reading.md) · 历史阅读版
- [📦 GLS 初始规范文件包 · GLS-0101 / GLS-0200 / GLS-0400 · 2026-07-12](enterprise/protocols/GLS-initial-package-reading.md) · 历史阅读版
- [01 · 四域责任主体与人格体融合绑定 · 2026-08-06](enterprise/architecture/responsibility.md)
- [02 · 活体人格域系统架构与工程开发蓝图 · 2026-08-06](enterprise/architecture/blueprint.md)
- [07 · 企业四域活体人格域 · 责任主体、语言推理链与工程落地总规划 v1.0](enterprise/architecture/roadmap.md)
- [企业四域活体人格域 · 责任主体与工程规划总入口 · 2026-08-06](enterprise/architecture/index.md) · 历史阅读版
- [零感域人格体编号注册系统](enterprise/registry-guides/persona-registry-readme.md)
- [persona-registration.test.mjs](enterprise/registry-guides/persona-registration.test.mjs)
- [企业四域公共·人类编号注册系统](enterprise/registry-guides/human-registry-readme.md)
- [光湖团队算力调度池 2.0](enterprise/compute-pool-overview.md)

### 第五域接入工具与测试

- [光湖当前世界接入](fifth-domain/release-tools/AGENTS.source.md)
- [package.json](fifth-domain/release-tools/package.json)
- [client.test.mjs](fifth-domain/release-tools/runtime/client.test.mjs)
- [question.mjs](fifth-domain/release-tools/runtime/question.mjs)
- [question.test.mjs](fifth-domain/release-tools/runtime/question.test.mjs)
- [server.cjs](fifth-domain/release-tools/runtime/server.cjs)
- [server.test.cjs](fifth-domain/release-tools/runtime/server.test.cjs)
- [build-release.py](fifth-domain/release-tools/scripts/build-release.py)
- [guanghu-client.mjs](fifth-domain/release-tools/scripts/guanghu-client.mjs)
- [question-target.mjs](fifth-domain/release-tools/scripts/question-target.mjs)
- [SKILL.md](fifth-domain/release-tools/skills/guanghu-world-entry/SKILL.source.md)
- [MANIFEST.json](fifth-domain/release-tools/MANIFEST.json)

两份发行包共 60 个文件，GitHub 收录 50 份。其余 10 份涉及人员或人格登记、运行配置或本机路径，读者可按官方发行清单查阅原包。运行接入工具时请使用对应官方整包。

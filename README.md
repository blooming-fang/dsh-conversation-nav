# dsh-conversation-nav

会话导航 — dsh web GUI 的浮动会话导航面板。

在会话栏右边缘有一个紧凑的竖直触发按钮，显示当前会话中用户已提问题的数量。点击后展开一个窄面板，列出每一条用户消息（每条最多两行）；点击某条记录会把会话滚动到对应消息并短暂高亮。

## 工作原理

本包是一个 **profile bundle**：`package.json` 声明了 `dsh.bundle.patch`（因此 `dsh plugin` 把它当作 profile 补丁层）和 `dsh.client.platform: web`（因此 client-modules 的 node 半边在 `/plugins/dsh-conversation-nav/client.js` 提供它的浏览器半边）。`cordis.patch.yml` 把该行挂载进 web profile 组合。

浏览器半边注册到全局的 `shell.overlay` 槽位，并声明一个会话作用域的子槽 `qnav.panel`；面板通过标准 hook `useSession` 读取会话快照，从 `chat.order` / `chat.nodes` 推导出用户消息列表，并通过把渲染行（`[data-chat-anchor-key]`）滚动到可视区域来实现跳转。

## 构建

```sh
npm install
npm run build        # 生成 lib/client.js（esbuild + __ModuleLoader__ 包装）
npm run pack         # 生成 dsh-conversation-nav-0.5.0.tgz
```

## 安装到 web profile

```sh
dsh plugin --profile web add D:\plugin\deepseek-harness\plugins\dsh-qnav\dsh-conversation-nav-0.5.0.tgz
```

然后启动/重启 `dsh web` 并打开 GUI。一旦打开包含至少一条用户消息的会话，会话栏右边缘就会出现触发按钮。

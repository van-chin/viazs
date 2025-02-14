## DynamicPanel 按钮

动态面板 布局

### 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

[完整设计指南](https://ant.design/docs/spec/buttons-cn)

:::snippet
左边
按钮有三种类型：`primary` 、`secondary` 、`outline` 。主按钮在同一个操作区域建议最多出现一次。
<BasicLeft />
:::

:::snippet
右边
按钮有三种类型：`primary` 、`secondary` 、`outline` 。主按钮在同一个操作区域建议最多出现一次。
<BasicRight />
:::

:::snippet
上边
按钮有三种类型：`primary` 、`secondary` 、`outline` 。主按钮在同一个操作区域建议最多出现一次。
<BasicTop />
:::

:::snippet
下边
按钮有三种类型：`primary` 、`secondary` 、`outline` 。主按钮在同一个操作区域建议最多出现一次。
<BasicBottom />
:::

:::snippet
嵌套
按钮有三种类型：`primary` 、`secondary` 、`outline` 。主按钮在同一个操作区域建议最多出现一次。
<BasicNest />
:::

### API

通过设置 Button 的属性来产生不同的按钮样式，推荐顺序为：`type` -> `size` -> `shape` -> `status` -> `disabled`。

#### Props

| 参数     | 描述           | 类型                                            | 默认值  |
| -------- | -------------- | ----------------------------------------------- | ------- |
| type     | 按钮的类型     | 'primary' \| 'secondary' \| 'outline'           | primary |
| shape    | 按钮的形状     | 'round' \| 'circle' \| 'square'                 | -       |
| status   | 按钮的状态     | 'primary' \| 'success' \| 'warning' \| 'danger' | -       |
| size     | 按钮的大小     | 's' \| 'm' \| 'l' \| 'xl'                       | `l`     |
| disabled | 按钮是否被禁用 | boolean                                         | false   |
| loading  | 按钮是否加载中 | boolean                                         | false   |
| long     | 按钮是否通栏   | boolean                                         | false   |

#### Slots

| 参数 | 描述 | 默认值 |
| ---- | ---- | ------ |
| icon | 图标 | -      |

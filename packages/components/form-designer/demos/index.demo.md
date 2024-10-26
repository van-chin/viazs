## FormDesigner 表单设计器

按钮用于开始一个即时操作。

### 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

[完整设计指南](https://ant.design/docs/spec/buttons-cn)

### 代码演示

:::snippet
基本使用
按钮有三种类型：`primary` 、`secondary` 、`outline` 。主按钮在同一个操作区域建议最多出现一次。
<basic />
:::

### API

通过设置 Button 的属性来产生不同的按钮样式，推荐顺序为：`type` -> `size` -> `shape` -> `status` -> `disabled`。

#### Props

| 参数      | 描述       | 类型   | 默认值 |
| --------- | ---------- | ------ | ------ |
| lists     | 数据列表   | []     |        |
| height    | 高度       | number | 200    |
| itemWidth | 数据项宽度 | number | 220    |
| itemWidth | 数据项宽度 | number | 220    |

#### Slots

| 参数 | 描述 | 默认值 |
| ---- | ---- | ------ |
| icon | 图标 | -      |

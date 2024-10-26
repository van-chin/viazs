## FormFenderer 表单渲染器

按钮用于开始一个即时操作。

### 何时使用

收集数据时



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

## HoverMask 悬停遮罩

悬停遮罩

### 何时使用

- 弹出一个下拉菜单给用户选择操作，用于代替原生的选择器，或者需要一个更优雅的多选器时。
- 当选项少时（少于 5 项），建议直接将选项平铺，使用 Radio 是更好的选择。
- 如果你在寻找一个可输可选的输入框，那你可能需要 AutoComplete。

:::snippet
按钮类型
按钮有三种类型：`primary` 、`secondary` 、`outline` 。主按钮在同一个操作区域建议最多出现一次。
<basic />
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

## Tagify 标签

按钮用于开始一个即时操作。

### 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

在 Ant Design 中我们提供了五种按钮。

- 主按钮：用于主行动点，一个操作区域只能有一个主按钮。
- 默认按钮：用于没有主次之分的一组行动点。




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

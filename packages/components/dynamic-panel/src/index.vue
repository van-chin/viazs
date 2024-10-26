<template>
	<aside
		:class="[
			prefixCls,
			`${prefixCls}--${expanded ? 'expanded' : 'collapsed'}`,
		]"
		ref="contentsElRef"
	>
		<div
			:class="[
				`${prefixCls}-handler`,
				`${prefixCls}-handler-placement-${placement}`,
			]"
			ref="handlerElRef"
		>
			<div
				:class="[
					`${prefixCls}-handler-resize h-full`,
					`${prefixCls}-handler-resize-placement-${placement}`,
					,
					`${prefixCls}-handler-resize--${
						pressed ? 'pressed' : 'normal'
					}`,
				]"
				:style="{ 'border-color': resizeBorderColor }"
				ref="resizeHandlerElRef"
				@mousedown="onMousedown"
			></div>
			<div
				:class="[
					`${prefixCls}-handler-content`,
					`${prefixCls}-handler-content-placement-${placement}`,
				]"
				@click="onToggleExpandCollapse"
			>
				<iconify-icon
					:icon="`prime:angle-${expanded ? 'left' : 'right'}`"
					class="text-xl"
				></iconify-icon>
			</div>
		</div>
		<div
			:class="[
				`${prefixCls}-contents`,
				`${prefixCls}-contents--${expanded ? 'expanded' : 'collapsed'}`,
			]"
		>
			<transition name="slide-fade">
				<div class="h-full w-full" v-show="expanded">
					<slot></slot>
				</div>
			</transition>
		</div>
	</aside>
</template>

<script lang="ts" setup>
	import type { VzDynamicPanelProps } from "@viaz/types";

	import { useStyle } from "@viaz/hooks";
	import { toRefs, ref, computed, watch, reactive } from "vue";

	const { prefixCls } = useStyle("dynamic-panel");

	const COMPONENT_NAME = "VzDynamicPanel";
	defineOptions({
		name: COMPONENT_NAME,
	});

	const asideRef = ref<HTMLElement | null>(null);

	const contentsElRef = ref<HTMLElement | null>(null);

	const handlerElRef = ref<HTMLElement | null>(null);

	const resizeHandlerElRef = ref<HTMLElement | null>(null);

	const expanded = ref(true);

	const props = withDefaults(defineProps<VzDynamicPanelProps>(), {
		placement: "left",
		resizeBorderColor: "transparent",
		width: 200,
		height: 100,
	});

	const { width, height, placement } = toRefs(props);

	const verticaled = computed(() => {
		// console.info("placement.value", placement.value);
		if (placement.value === "left" || placement.value === "right") {
			return true;
		}
		if (placement.value === "top" || placement.value === "bottom") {
			return false;
		}
	});

	const onToggleExpandCollapse = () => {
		// 获取 元素当前宽度
		// console.info("verticaled =>", verticaled.value);
		// if (expanded.value === true) {
		//   if (verticaled.value === true) {
		//     defaultWidth.value = elementWidth.value;
		//   } else {
		//     defaultWidth.value = elementHeight.value;
		//   }
		// }
		expanded.value = !expanded.value;
	};

	const pressed = ref<boolean>(false);

	const onMousedown = (mouseEvent: MouseEvent) => {
		if (expanded.value === false) {
			return;
		}

		pressed.value = true;

		const contentsEl = contentsElRef.value!;

		// 记录按下的位置
		const mouseDownX = mouseEvent.clientX;
		const mouseDownY = mouseEvent.clientY;

		console.info("鼠标按下时，光标 X 会标: mouseDownX=>", mouseDownX);

		const contentsElRect = contentsEl.getBoundingClientRect();

		const onMousemove = (e: MouseEvent) => {
			console.info("e =>", e);
			// 当前鼠标的位置减去鼠标在盒子里的位置就是要移动的距离
			let moveX = e.clientX - mouseDownX;
			let moveY = e.clientY - mouseDownY;

			if (verticaled.value) {
				let afWidth = 0;
				if (placement.value === "left") {
					afWidth = contentsElRect.width + moveX;
				}
				if (placement.value === "right") {
					afWidth = contentsElRect.width - moveX;
				}
				contentsElRef.value.style.width = afWidth + "px";
			} else {
				let afHeight = 0;
				if (placement.value === "top") {
					afHeight = contentsElRect.height - moveY;
				}
				if (placement.value === "bottom") {
					afHeight = contentsElRect.height + moveY;
				}
				contentsElRef.value.style.height = afHeight + "px";
			}
		};

		const onMouseup = (_e: MouseEvent) => {
			pressed.value = false;

			// 移除document事件
			document.removeEventListener("mousemove", onMousemove);
			document.removeEventListener("mouseup", onMouseup);
		};
		// 位document注册鼠标移动事件
		document.addEventListener("mousemove", onMousemove);
		// 鼠标抬起事件
		document.addEventListener("mouseup", onMouseup);
	};
</script>

<style>
	/*
  Enter and leave animations can use different
  durations and timing functions.
*/
	.slide-fade-enter-active {
		transition: all 0.3s ease-out;
	}

	.slide-fade-leave-active {
		transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.slide-fade-enter-from,
	.slide-fade-leave-to {
		transform: translateX(20px);
		opacity: 0;
	}
</style>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-dynamic-panel";

	.@{prefix-cls} {
		position: relative;
		border: 0px solid #e3e3e3;

		width: v-bind(width);

		height: v-bind(height);

		&--collapsed {
			// display: none;
			width: 0 !important;
		}

		&-handler {
			--at-apply: flex flex-row justify-center items-center;
			position: absolute;

			&:hover &-content {
				opacity: 1;
			}

			&-placement {
				&-left {
					--at-apply: w-16px h-full;

					inset-inline-end: -16px;
				}

				&-right {
					--at-apply: w-16px h-full;
					inset-inline-start: -16px;
				}

				&-top {
					--at-apply: h-16px w-full;
					writing-mode: vertical-lr;
					inset-inline-start: -16px;
				}

				&-bottom {
					--at-apply: h-16px w-full;
					writing-mode: vertical-lr;
					inset-inline-end: -16px;
				}
			}

			&-resize {
				border: 0 solid transparent;
				&-placement {
					&-left {
						// border-left: 2px solid #e3e3e3;

						// border-left-color: transparent;

						&:hover {
							cursor: col-resize;
							border-left: 2px solid #000 !important;
						}

						--at-apply: h-full;
						left: 0;

						border-left-width: 2px;
					}

					&-right {
						&:hover {
							cursor: col-resize;
							border-right: 2px solid #000 !important;
						}
						right: 0px;
						--at-apply: h-full;
						border-right-width: 2px;
					}

					&-top {
						&:hover {
							cursor: row-resize;
							border-bottom: 2px solid #000 !important;
						}
						--at-apply: w-full;
						border-bottom-width: 2px;
					}

					&-bottom {
						&:hover {
							cursor: row-resize;
							border-top: 2px solid #000 !important;
						}
						--at-apply: w-full;
						border-top-width: 2px;
					}
				}

				position: absolute;

				z-index: 100;
			}

			&-content {
				--at-apply: flex justify-center items-center;

				width: 16px;
				height: 40px;

				border-radius: 0 4px 4px 0;
				cursor: pointer;
				position: absolute;
				opacity: 0;
				color: #999999;
				background: #e3e3e3;
				border-color: #e3e3e3;
				border-style: solid;
				z-index: 999;
				border-left: none;

				&-placement {
					&-left {
						transform: rotate(0deg);
					}

					&-right {
						transform: rotate(180deg);
					}

					&-top {
						transform: rotate(270deg);
					}

					&-bottom {
						transform: rotate(90deg);
					}
				}
			}
		}

		&-contents {
			--at-apply: h-full;
			overflow: hidden;
			position: relative;

			user-select: none;

			&-resize-handler {
				position: absolute;
				user-select: none;
				width: 10px;
				height: 100%;

				top: 0;

				right: -5px;

				&::before {
					inset-inline-end: 50%;
					width: 2px;
					height: 100%;

					content: "";
					position: absolute;
					z-index: 50;
				}
			}

			&-resize-handler--pressed {
				&:before {
					cursor: col-resize;
					background-color: #222222;
				}
			}

			&--collapsed {
				display: none;
			}
		}
	}
</style>

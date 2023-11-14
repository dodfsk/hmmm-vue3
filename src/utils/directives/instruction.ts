// instruction.ts
import { throttle, debounce } from 'lodash-es'

// 防抖指令封装
export const useDebounceDirective = (delay: number) => {
	return {
		beforeMount(el: HTMLElement, binding: any) {
			el.addEventListener(
				binding.arg,
				debounce(() => binding.value(), delay, {
					leading: true,
					trailing: false,
				})
			)
		},
	}
}

// 节流指令封装
export const useThrottleDirective = (delay: number) => {
	return {
		beforeMount(el: HTMLElement, binding: any) {
			el.addEventListener(
				binding.arg,
				throttle(() => binding.value(), delay)
			)
		},
	}
}

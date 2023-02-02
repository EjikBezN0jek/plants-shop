import { computed } from 'vue';

/*eslint-disable */
// @ts-ignore
export function useVModelWrapper(props, emit, name = 'modelValue') {
  return computed({
    get: () => props[name],
    set: value => emit(`update:${name}`, value),
  });
}

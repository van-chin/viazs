export function useStyle(scope: string, prefix: string = "vz") {
  return {
    prefixCls: `${prefix}-${scope}`,
  };
}

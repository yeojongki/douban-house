export function resolveScopedStyles(scope) {
  return {
    className: scope.props.className, // 就是被styled-jsx添加的独特className
    styles: scope.props.children // 就是style，需要注入到组件中
  };
}

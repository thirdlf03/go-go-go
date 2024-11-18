function genFn() {
  let body = "";
  function add(str) {
    body += str + "\n";
    return add;
  }
  add.toString = () => body;
  return add;
}
export {
  genFn
};
//# sourceMappingURL=generate.mjs.map
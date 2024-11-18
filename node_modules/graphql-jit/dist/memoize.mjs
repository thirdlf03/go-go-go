import memoize from "lodash.memoize";
function uncurry2(fn) {
  return (a, b) => fn(a)(b);
}
function uncurry3(fn) {
  return (a, b, c) => fn(a)(b)(c);
}
function uncurry4(fn) {
  return (a, b, c, d) => fn(a)(b)(c)(d);
}
function memoize2(fn) {
  return uncurry2(memoize((a) => memoize((b) => fn(a, b))));
}
function memoize3(fn) {
  return uncurry3(
    memoize((a) => memoize((b) => memoize((c) => fn(a, b, c))))
  );
}
function memoize4(fn) {
  return uncurry4(
    memoize(
      (a) => memoize((b) => memoize((c) => memoize((d) => fn(a, b, c, d))))
    )
  );
}
export {
  memoize2,
  memoize3,
  memoize4
};
//# sourceMappingURL=memoize.mjs.map
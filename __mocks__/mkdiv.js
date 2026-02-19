function mkdiv(type, attr, children) {
  const el = document.createElement(type || "div");
  if (attr && typeof attr === "object") {
    for (const key in attr) {
      if (key.match(/^on(.*)/)) {
        el.addEventListener(key.match(/^on(.*)/)[1], attr[key]);
      } else {
        el.setAttribute(key, attr[key]);
      }
    }
  }
  const charray = !Array.isArray(children) ? [children || ""] : children;
  charray.forEach((c) => {
    if (typeof c === "string") {
      el.innerHTML += c;
    } else if (c instanceof Element) {
      el.append(c);
    }
  });
  return el;
}

module.exports = { mkdiv };

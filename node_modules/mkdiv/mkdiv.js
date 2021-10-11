export function mkdiv(type, attr, children) {
  if (arguments.length == 1) return mkdiv(type, {}, "");
  if (
    arguments.length == 2 &&
    (Array.isArray(attr) || typeof attr === "string")
  ) {
    return mkdiv(type, {}, arguments[1]);
  }
  if (arguments.length == 2) {
    return mkdiv(type, arguments[1], []);
  }
  const div = document.createElement(type);
  for (const key in attr) {
    if (key.match(/on(.*)/)) {
      div.addEventListener(key.match(/on(.*)/)[1], attr[key]);
    } else {
      div.setAttribute(key, attr[key]);
    }
  }
  const charray = !Array.isArray(children) ? [children] : children;
  charray.forEach((c) => {
    typeof c == "string" ? (div.innerHTML += c) : div.append(c);
  });
  div.attachTo = function (parent) {
    if (parent) parent.append(this);
    return this;
  };
  div.wrapWith = function (tag) {
    const parent = mkdiv(tag);
    parent.append(this);
    return parent;
  };
  return div;
}
export function mksvg(tag, attrs = {}, children = []) {
  var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (var k in attrs) {
    if (k == "xlink:href") {
      el.setAttributeNS("http://www.w3.org/1999/xlink", "href", attrs[k]);
    } else {
      el.setAttribute(k, attrs[k]);
    }
  }
  const charray = !Array.isArray(children) ? [children] : children;
  charray.forEach((c) => el.append(c));
  return el;
}

export function wrapDiv(div, tag, attrs = {}) {
  return mkdiv(tag, attrs, [div]);
}
export function wrapList(divs, tag = "div") {
  return mkdiv(tag, {}, divs);
}

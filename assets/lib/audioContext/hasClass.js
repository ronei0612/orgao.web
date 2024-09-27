// hasClass.js
function hasClass(el, str) {
  if (el.classList) {
    return el.classList.contains(str);
  }
  return new RegExp('(^| )' + str + '( |$)', 'gi').test(el.className);
}
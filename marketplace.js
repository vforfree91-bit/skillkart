// Legacy compatibility redirect layer
const page = document.body ? document.body.dataset.page : '';
if (page && ['projects', 'discover', 'services', 'messages', 'dashboard'].includes(page)) {
  window.location.replace(`index.html#${page}`);
} else {
  window.location.replace('index.html');
}

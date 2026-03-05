export function setupBreadcrumb() {
  const breadcrumbContainer = document.querySelector('.breadcrumb');
  if (!breadcrumbContainer) return;

  const path = window.location.pathname;
  const pageName = path.split('/').pop().replace('.html', '');

  let breadcrumbHTML = '';
  if (pageName && pageName !== 'index') {
    breadcrumbHTML = `<a href="index.html" class="comment">~</a> / <a href="${path}" class="comment">${pageName}</a>`;
  } else {
    breadcrumbHTML = `<a href="index.html" class="comment">~</a>`;
  }

  breadcrumbContainer.innerHTML = breadcrumbHTML;
}

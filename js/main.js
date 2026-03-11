/*
 * main.js
 * Runs on every page. Handles:
 *   1. Mobile sidebar toggle
 *   2. Highlighting the active nav link
 */

document.addEventListener('DOMContentLoaded', function () {
  setupMobileNav();
  highlightActiveNavLink();
});


/* ---- Mobile Navigation Toggle ---- */

function setupMobileNav() {
  var toggleBtn = document.querySelector('.mobile-nav-toggle');
  var sidebar = document.querySelector('.sidebar');

  // If the sidebar or button doesn't exist, stop here
  if (!toggleBtn || !sidebar) return;

  // Open/close the sidebar when the hamburger is clicked
  toggleBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    sidebar.classList.toggle('open');
  });

  // Close the sidebar if the user clicks outside of it (mobile only)
  document.addEventListener('click', function (event) {
    if (window.innerWidth <= 768) {
      var clickedInsideSidebar = sidebar.contains(event.target);
      var clickedToggle = toggleBtn.contains(event.target);

      if (!clickedInsideSidebar && !clickedToggle) {
        sidebar.classList.remove('open');
      }
    }
  });
}


/* ---- Active Nav Link Highlighter ---- */

function highlightActiveNavLink() {
  var currentPath = window.location.pathname;
  var navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(function (item) {
    item.classList.remove('active');

    var linkPath = item.getAttribute('href');

    // Check if the current URL matches this link
    var isMatch =
      linkPath === currentPath ||
      (currentPath.endsWith('/') && linkPath === 'index.html') ||
      (currentPath.includes(linkPath) && linkPath !== 'index.html');

    if (isMatch) {
      item.classList.add('active');
    }
  });

  // If nothing matched, default to the first link (Home)
  var hasActive = Array.from(navItems).some(function (item) {
    return item.classList.contains('active');
  });

  if (!hasActive && navItems.length > 0) {
    navItems[0].classList.add('active');
  }
}

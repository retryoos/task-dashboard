var NAV_LINKS = [
  { href: "index.html", text: "Home" },
  { href: "tasks.html", text: "Tasks" },
  { href: "about.html", text: "About" },
  { href: "contact.html", text: "Contact" },
  { href: "capabilities.html", text: "Capabilities" },
];

$(function () {
  seedData();
  injectHeader();
  injectFooter();
  highlightActiveLink();
  setUpDarkMode();
});

function injectHeader() {
  var links = "";
  NAV_LINKS.forEach(function (item) {
    links +=
      '<li class="nav-item">' +
      '<a class="nav-link" href="' + item.href + '">' + item.text + "</a>" +
      "</li>";
  });

  var navbar =
    '<nav class="navbar navbar-expand-lg site-nav sticky-top" aria-label="Main navigation">' +
      '<div class="container">' +
        '<a class="brand" href="index.html">Argus Defense Systems</a>' +
        '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" ' +
          'data-bs-target="#mainNav" aria-controls="mainNav" ' +
          'aria-expanded="false" aria-label="Toggle navigation">' +
          '<span class="navbar-toggler-icon"></span>' +
        "</button>" +
        '<div class="collapse navbar-collapse" id="mainNav">' +
          '<ul class="navbar-nav ms-auto align-items-lg-center">' + links + "</ul>" +
          '<button class="theme-toggle ms-lg-3 mt-2 mt-lg-0" id="themeToggle" type="button" aria-label="Toggle dark mode">' +
            '<i class="bi bi-circle-half" aria-hidden="true"></i>' +
          "</button>" +
        "</div>" +
      "</div>" +
    "</nav>";

  $("#site-header").html(navbar);
}

function injectFooter() {
  var year = new Date().getFullYear();

  var footer =
    '<div class="site-footer">' +
      '<div class="container">' +
        '<div class="row g-4">' +
          '<div class="col-12 col-md-5">' +
            '<a class="brand" href="index.html">Argus Defense Systems</a>' +
            '<p class="mt-3 muted">Program operations dashboard for research, ' +
              "procurement and maintenance teams.</p>" +
          "</div>" +
          '<div class="col-6 col-md-3">' +
            '<h2 class="footer-head">Pages</h2>' +
            '<ul class="list-unstyled">' +
              '<li><a href="tasks.html">Task board</a></li>' +
              '<li><a href="about.html">About</a></li>' +
              '<li><a href="capabilities.html">Capabilities</a></li>' +
            "</ul>" +
          "</div>" +
          '<div class="col-12 col-sm-6 col-md-4">' +
            '<h2 class="footer-head">Contact</h2>' +
            '<p class="mb-2"><a href="mailto:ops@argusdefense.example">ops@argusdefense.example</a></p>' +
            '<div class="social-row">' +
              '<a href="https://www.linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>' +
              '<a href="https://x.com" target="_blank" rel="noopener" aria-label="X"><i class="bi bi-twitter-x"></i></a>' +
              '<a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub"><i class="bi bi-github"></i></a>' +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">&copy; ' + year +
          " Argus Defense Systems. Built for ITC 4214.</div>" +
      "</div>" +
    "</div>";

  $("#site-footer").html(footer);
}

function highlightActiveLink() {
  var path = window.location.pathname;
  var page = path.substring(path.lastIndexOf("/") + 1);
  if (page === "") {
    page = "index.html";
  }

  $("#site-header .nav-link").each(function () {
    if ($(this).attr("href") === page) {
      $(this).addClass("active").attr("aria-current", "page");
    }
  });
}

function setUpDarkMode() {
  var root = document.documentElement;
  if (localStorage.getItem("argus-theme") === "dark") {
    root.setAttribute("data-bs-theme", "dark");
  }

  $("#themeToggle").on("click", function () {
    if (root.getAttribute("data-bs-theme") === "dark") {
      root.removeAttribute("data-bs-theme");
      localStorage.setItem("argus-theme", "light");
    } else {
      root.setAttribute("data-bs-theme", "dark");
      localStorage.setItem("argus-theme", "dark");
    }
  });
}

function seedData() {
  if (localStorage.getItem("argus-tasks") !== null) {
    return;
  }

  var hour = 60 * 60 * 1000;
  var day = 24 * hour;
  var now = Date.now();

  var tasks = [
    { id: 1, name: "Frigate radar calibration", desc: "Recalibrate the AN/SPY array before sea trials.", due: "2026-06-12", priority: "High", status: "Pending" },
    { id: 2, name: "Q2 compliance report", desc: "Submit the quarterly ITAR compliance report.", due: "2026-06-04", priority: "High", status: "Completed" },
    { id: 3, name: "Spare turbine parts order", desc: "Raise the purchase order for replacement turbine blades.", due: "2026-06-20", priority: "Medium", status: "Pending" },
    { id: 4, name: "Maintenance log cleanup", desc: "Tidy and archive the 2025 maintenance logs.", due: "2026-05-28", priority: "Low", status: "Completed" },
    { id: 5, name: "Dry-dock inspection", desc: "Book the hull inspection slot for the patrol vessel.", due: "2026-07-02", priority: "Medium", status: "Pending" },
    { id: 6, name: "Subcontractor clearance review", desc: "Verify security clearances for two new subcontractors.", due: "2026-06-18", priority: "High", status: "Pending" },
    { id: 7, name: "Update SOP templates", desc: "Refresh the standard operating procedure templates.", due: "2026-06-25", priority: "Low", status: "Completed" }
  ];

  var activity = [
    { text: 'Completed "Q2 compliance report"', time: now - 3 * hour },
    { text: 'Added "Subcontractor clearance review"', time: now - 1 * day },
    { text: 'Completed "Update SOP templates"', time: now - 2 * day },
    { text: 'Added "Dry-dock inspection"', time: now - 3 * day },
    { text: 'Added "Frigate radar calibration"', time: now - 4 * day }
  ];

  localStorage.setItem("argus-tasks", JSON.stringify(tasks));
  localStorage.setItem("argus-activity", JSON.stringify(activity));
}

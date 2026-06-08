var NAV_LINKS = [
  { href: "index.html", text: "Home" },
  { href: "tasks.html", text: "Tasks" },
  { href: "about.html", text: "About" },
  { href: "contact.html", text: "Contact" },
  { href: "capabilities.html", text: "Capabilities" },
];

$(function () {
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
          '<div class="col-md-5">' +
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
          '<div class="col-6 col-md-4">' +
            '<h2 class="footer-head">Contact</h2>' +
            '<p class="mb-2"><a href="mailto:ops@argusdefense.example">ops@argusdefense.example</a></p>' +
            '<div class="social-row">' +
              '<a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>' +
              '<a href="#" aria-label="X"><i class="bi bi-twitter-x"></i></a>' +
              '<a href="#" aria-label="GitHub"><i class="bi bi-github"></i></a>' +
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
  if (localStorage.getItem("argus-theme") === "dark") {
    $("body").addClass("dark-mode");
  }

  $("#themeToggle").on("click", function () {
    $("body").toggleClass("dark-mode");
    if ($("body").hasClass("dark-mode")) {
      localStorage.setItem("argus-theme", "dark");
    } else {
      localStorage.setItem("argus-theme", "light");
    }
  });
}

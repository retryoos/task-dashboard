// home.js - the home page, shows the latest activity feed and the current HQ weather

$(function () {
  renderActivity();
  loadWeather();

  // fill the latest activity list from the saved feed
  function renderActivity() {
    var holder = $("#activityList");
    // only the home page has this list, stop if it is not here
    if (holder.length === 0) {
      return;
    }

    // read the saved feed, fall back to empty if the data is corrupted
    var log = [];
    try {
      log = JSON.parse(localStorage.getItem("argus-activity") || "[]");
    } catch (e) {
      log = [];
    }
    if (log.length === 0) {
      $("#activityEmpty").show();
      return;
    }

    $("#activityEmpty").hide();
    holder.empty();
    // show the six most recent, escapeHtml on the text in case a task name held html
    log.slice(0, 6).forEach(function (item) {
      var when = new Date(item.time).toLocaleString();
      holder.append(
        `<li class="activity-item"><span>${escapeHtml(item.text)}</span><span class="muted mono">${when}</span></li>`
      );
    });
  }

  // fetch the current weather for HQ Athens from the open-meteo api (no key needed)
  function loadWeather() {
    var box = $("#weather");
    if (box.length === 0) {
      return;
    }
    $.ajax({
      url: "https://api.open-meteo.com/v1/forecast",
      data: { latitude: 37.98, longitude: 23.73, current_weather: true },
      success: function (res) {
        // guard against an unexpected response shape
        var w = res && res.current_weather;
        if (!w) {
          box.text("Weather unavailable right now.");
          return;
        }
        box.text("HQ Athens: " + w.temperature + "°C, wind " + w.windspeed + " km/h");
      },
      // any network or server error shows a friendly line instead of crashing
      error: function () {
        box.text("Weather unavailable right now.");
      },
    });
  }
});

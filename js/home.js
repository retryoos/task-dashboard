$(function () {
  renderActivity();
  loadWeather();

  function renderActivity() {
    var holder = $("#activityList");
    if (holder.length === 0) {
      return;
    }

    var log = JSON.parse(localStorage.getItem("argus-activity") || "[]");
    if (log.length === 0) {
      $("#activityEmpty").show();
      return;
    }

    $("#activityEmpty").hide();
    holder.empty();
    log.slice(0, 6).forEach(function (item) {
      var when = new Date(item.time).toLocaleString();
      holder.append(
        '<li class="activity-item"><span>' + item.text + "</span>" +
          '<span class="muted mono">' + when + "</span></li>"
      );
    });
  }

  function loadWeather() {
    var box = $("#weather");
    if (box.length === 0) {
      return;
    }
    $.ajax({
      url: "https://api.open-meteo.com/v1/forecast",
      data: { latitude: 37.98, longitude: 23.73, current_weather: true },
      success: function (res) {
        var w = res.current_weather;
        box.text("HQ Athens: " + w.temperature + "°C, wind " + w.windspeed + " km/h");
      },
      error: function () {
        box.text("Weather unavailable right now.");
      },
    });
  }
});

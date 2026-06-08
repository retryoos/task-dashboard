$(function () {
  renderActivity();

  function renderActivity() {
    var holder = $("#activityList");
    if (holder.length === 0) {
      return;
    }

    var log = JSON.parse(localStorage.getItem("aegis-activity") || "[]");
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
});

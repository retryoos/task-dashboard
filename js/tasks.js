$(function () {
  var tasks = [];

  $("#taskForm").on("submit", function (event) {
    event.preventDefault();

    var name = $("#taskName").val().trim();
    var desc = $("#taskDesc").val().trim();
    var due = $("#taskDue").val();
    var priority = $("#taskPriority").val();

    var nameOk = name.length >= 3;
    var dueOk = due !== "";

    $("#taskName").toggleClass("is-invalid", !nameOk);
    $("#taskDue").toggleClass("is-invalid", !dueOk);

    if (!nameOk || !dueOk) {
      return;
    }

    var task = {
      id: Date.now(),
      name: name,
      desc: desc,
      due: due,
      priority: priority,
      status: "Pending",
    };

    tasks.push(task);
    renderPreview(tasks);
    this.reset();
  });

  function renderPreview(list) {
    var holder = $("#taskPreview");
    holder.empty();

    if (list.length === 0) {
      $("#emptyNote").show();
      return;
    }
    $("#emptyNote").hide();

    list.forEach(function (t) {
      var priorityClass = "badge-" + t.priority.toLowerCase();
      var row =
        '<li class="task-line">' +
          '<span class="badge-priority ' + priorityClass + '">' + t.priority + "</span>" +
          '<span class="task-name">' + t.name + "</span>" +
          '<span class="muted mono">' + t.due + "</span>" +
        "</li>";
      holder.append(row);
    });
  }
});

$(function () {
  var tasks = loadTasks();
  renderTasks(tasks);

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
    saveTasks(tasks);
    renderTasks(tasks);
    this.reset();
  });

  function renderTasks(list) {
    var body = $("#taskTableBody");
    body.empty();

    if (list.length === 0) {
      $("#emptyNote").show();
      return;
    }
    $("#emptyNote").hide();

    list.forEach(function (t) {
      var priorityClass = "badge-" + t.priority.toLowerCase();
      var row =
        "<tr>" +
          "<td>" + t.name + "</td>" +
          '<td class="muted">' + (t.desc || "-") + "</td>" +
          '<td class="mono">' + t.due + "</td>" +
          '<td><span class="badge-priority ' + priorityClass + '">' + t.priority + "</span></td>" +
          "<td>" + t.status + "</td>" +
        "</tr>";
      body.append(row);
    });
  }

  function saveTasks(list) {
    localStorage.setItem("aegis-tasks", JSON.stringify(list));
  }

  function loadTasks() {
    var data = localStorage.getItem("aegis-tasks");
    return data ? JSON.parse(data) : [];
  }
});

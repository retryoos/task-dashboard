$(function () {
  var tasks = loadTasks();
  var editingId = null;
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

    if (editingId !== null) {
      tasks.forEach(function (t) {
        if (t.id === editingId) {
          t.name = name;
          t.desc = desc;
          t.due = due;
          t.priority = priority;
        }
      });
      editingId = null;
      $("#submitBtn").text("Add task");
    } else {
      tasks.push({
        id: Date.now(),
        name: name,
        desc: desc,
        due: due,
        priority: priority,
        status: "Pending",
      });
    }

    saveTasks(tasks);
    renderTasks(tasks);
    this.reset();
  });

  $("#taskTableBody").on("click", ".btn-delete", function () {
    var id = $(this).data("id");
    tasks = tasks.filter(function (t) {
      return t.id !== id;
    });
    saveTasks(tasks);
    renderTasks(tasks);
  });

  $("#taskTableBody").on("click", ".btn-complete", function () {
    var id = $(this).data("id");
    tasks.forEach(function (t) {
      if (t.id === id) {
        t.status = t.status === "Completed" ? "Pending" : "Completed";
      }
    });
    saveTasks(tasks);
    renderTasks(tasks);
  });

  $("#taskTableBody").on("click", ".btn-edit", function () {
    var id = $(this).data("id");
    var found = null;
    tasks.forEach(function (t) {
      if (t.id === id) {
        found = t;
      }
    });
    if (!found) {
      return;
    }
    $("#taskName").val(found.name);
    $("#taskDesc").val(found.desc);
    $("#taskDue").val(found.due);
    $("#taskPriority").val(found.priority);
    editingId = id;
    $("#submitBtn").text("Save changes");
    $("#taskName").focus();
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
      var rowClass = t.status === "Completed" ? ' class="task-done"' : "";

      var completeBtn =
        t.status === "Completed"
          ? '<button class="btn btn-sm btn-outline-secondary btn-complete" data-id="' +
            t.id +
            '" aria-label="Reopen task"><i class="bi bi-arrow-counterclockwise"></i></button>'
          : '<button class="btn btn-sm btn-outline-success btn-complete" data-id="' +
            t.id +
            '" aria-label="Mark complete"><i class="bi bi-check2"></i></button>';

      var row =
        "<tr" + rowClass + ">" +
          "<td>" + t.name + "</td>" +
          '<td class="muted">' + (t.desc || "-") + "</td>" +
          '<td class="mono">' + t.due + "</td>" +
          '<td><span class="badge-priority ' + priorityClass + '">' + t.priority + "</span></td>" +
          "<td>" + t.status + "</td>" +
          '<td class="text-nowrap">' +
            completeBtn +
            ' <button class="btn btn-sm btn-outline-secondary btn-edit" data-id="' + t.id + '" aria-label="Edit task"><i class="bi bi-pencil"></i></button>' +
            ' <button class="btn btn-sm btn-outline-danger btn-delete" data-id="' + t.id + '" aria-label="Delete task"><i class="bi bi-trash"></i></button>' +
          "</td>" +
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

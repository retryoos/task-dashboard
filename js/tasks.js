$(function () {
  var tasks = loadTasks();
  var editingId = null;
  refresh();

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
      logActivity('Edited "' + name + '"');
    } else {
      tasks.push({
        id: Date.now(),
        name: name,
        desc: desc,
        due: due,
        priority: priority,
        status: "Pending",
      });
      logActivity('Added "' + name + '"');
    }

    saveTasks(tasks);
    refresh();
    $(this).trigger("reset");
  });

  $("#taskTableBody").on("click", ".btn-delete", function () {
    var id = $(this).data("id");
    tasks.forEach(function (t) {
      if (t.id === id) {
        logActivity('Deleted "' + t.name + '"');
      }
    });
    tasks = tasks.filter(function (t) {
      return t.id !== id;
    });
    saveTasks(tasks);
    refresh();
  });

  $("#taskTableBody").on("click", ".btn-complete", function () {
    var id = $(this).data("id");
    tasks.forEach(function (t) {
      if (t.id === id) {
        t.status = t.status === "Completed" ? "Pending" : "Completed";
        logActivity(
          (t.status === "Completed" ? 'Completed "' : 'Reopened "') +
            t.name +
            '"',
        );
      }
    });
    saveTasks(tasks);
    refresh();
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

  $("#filterStatus, #filterPriority, #sortBy").on("change", refresh);

  function refresh() {
    renderRows(getVisibleTasks());
    updateSummary(tasks);
    updateChart(tasks);
  }

  function getVisibleTasks() {
    var status = $("#filterStatus").val();
    var priority = $("#filterPriority").val();
    var sortBy = $("#sortBy").val();

    var result = tasks.filter(function (t) {
      var statusOk = status === "all" || t.status === status;
      var priorityOk = priority === "all" || t.priority === priority;
      return statusOk && priorityOk;
    });

    result.sort(function (a, b) {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.due.localeCompare(b.due);
    });

    return result;
  }

  function renderRows(list) {
    var body = $("#taskTableBody");
    body.empty();

    if (list.length === 0) {
      if (tasks.length === 0) {
        $("#emptyNote").text("No tasks yet. Add your first one on the left.");
      } else {
        $("#emptyNote").text("No tasks match the current filters.");
      }
      $("#emptyNote").show();
      return;
    }
    $("#emptyNote").hide();

    list.forEach(function (t) {
      // Only trust the three known priorities so a tampered value cannot reach the markup.
      var priority =
        t.priority === "High" || t.priority === "Medium" || t.priority === "Low"
          ? t.priority
          : "Medium";
      var priorityClass = "badge-" + priority.toLowerCase();
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
        "<tr" +
        rowClass +
        ">" +
        "<td>" +
        escapeHtml(t.name) +
        "</td>" +
        '<td class="muted">' +
        escapeHtml(t.desc || "-") +
        "</td>" +
        '<td class="mono">' +
        escapeHtml(t.due) +
        "</td>" +
        '<td><span class="badge-priority ' +
        priorityClass +
        '">' +
        priority +
        "</span></td>" +
        "<td>" +
        escapeHtml(t.status) +
        "</td>" +
        '<td class="text-nowrap">' +
        completeBtn +
        ' <button class="btn btn-sm btn-outline-secondary btn-edit" data-id="' +
        t.id +
        '" aria-label="Edit task"><i class="bi bi-pencil"></i></button>' +
        ' <button class="btn btn-sm btn-outline-danger btn-delete" data-id="' +
        t.id +
        '" aria-label="Delete task"><i class="bi bi-trash"></i></button>' +
        "</td>" +
        "</tr>";
      body.append(row);
    });
  }

  function updateSummary(list) {
    var completed = list.filter(function (t) {
      return t.status === "Completed";
    }).length;
    $("#countTotal").text(list.length);
    $("#countCompleted").text(completed);
    $("#countPending").text(list.length - completed);
  }

  function updateChart(list) {
    var total = list.length;
    var completed = countBy(list, "status", "Completed");
    setBar("#barCompleted", "#barCompletedVal", completed, total);
    setBar("#barPending", "#barPendingVal", total - completed, total);
    setBar("#barHigh", "#barHighVal", countBy(list, "priority", "High"), total);
    setBar(
      "#barMedium",
      "#barMediumVal",
      countBy(list, "priority", "Medium"),
      total,
    );
    setBar("#barLow", "#barLowVal", countBy(list, "priority", "Low"), total);
  }

  function countBy(list, key, value) {
    return list.filter(function (t) {
      return t[key] === value;
    }).length;
  }

  function setBar(barId, valueId, count, total) {
    var pct = total === 0 ? 0 : Math.round((count / total) * 100);
    $(barId).css("width", pct + "%");
    $(valueId).text(count);
  }

  function saveTasks(list) {
    localStorage.setItem("argus-tasks", JSON.stringify(list));
  }

  function loadTasks() {
    var data = localStorage.getItem("argus-tasks");
    if (!data) {
      return [];
    }
    // Fall back to an empty list if the stored data is ever corrupted.
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  function logActivity(text) {
    var log = [];
    try {
      log = JSON.parse(localStorage.getItem("argus-activity") || "[]");
    } catch (e) {
      log = [];
    }
    log.unshift({ text: text, time: Date.now() });
    log = log.slice(0, 20);
    localStorage.setItem("argus-activity", JSON.stringify(log));
  }
});

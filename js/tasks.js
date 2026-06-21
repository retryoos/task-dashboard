// tasks.js - the task board, add, edit, delete, complete, filter, sort and the analytics
// tasks live as an array of objects and are saved in localStorage

$(function () {
  // load saved tasks once, keep them in memory while the page is open
  var tasks = loadTasks();
  // null means the form is adding, a number means we are editing that task id
  var editingId = null;
  refresh();

  // add a new task, or save changes when editing
  $("#taskForm").on("submit", function (event) {
    event.preventDefault();

    var name = $("#taskName").val().trim();
    var desc = $("#taskDesc").val().trim();
    var due = $("#taskDue").val();
    var priority = $("#taskPriority").val();

    // name needs at least 3 characters, due date cannot be empty
    var nameOk = name.length >= 3;
    var dueOk = due !== "";

    // show or clear the red bootstrap feedback on each field
    $("#taskName").toggleClass("is-invalid", !nameOk);
    $("#taskDue").toggleClass("is-invalid", !dueOk);

    if (!nameOk || !dueOk) {
      return;
    }

    if (editingId !== null) {
      // editing, copy the new values onto the matching task
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
      // adding, push a new task with a unique id from the clock
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

  // delete, the buttons are added later so we listen on the table body
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

  // toggle a task between pending and completed
  $("#taskTableBody").on("click", ".btn-complete", function () {
    var id = $(this).data("id");
    tasks.forEach(function (t) {
      if (t.id === id) {
        t.status = t.status === "Completed" ? "Pending" : "Completed";
        logActivity(
          (t.status === "Completed" ? 'Completed "' : 'Reopened "') + t.name + '"'
        );
      }
    });
    saveTasks(tasks);
    refresh();
  });

  // edit, copy the task back into the form and switch the button to save mode
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

  // any filter or sort change just redraws the visible list
  $("#filterStatus, #filterPriority, #sortBy").on("change", refresh);

  // redraw everything that depends on the tasks, table, counts and bars
  function refresh() {
    renderRows(getVisibleTasks());
    updateSummary(tasks);
    updateChart(tasks);
  }

  // apply the current filters then the current sort
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

  // build the table rows from the given list
  function renderRows(list) {
    var body = $("#taskTableBody");
    body.empty();

    // nothing to show, explain whether the list is empty or just filtered out
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
      // only trust the three known priorities so a tampered value cannot reach the markup
      var priority =
        t.priority === "High" || t.priority === "Medium" || t.priority === "Low"
          ? t.priority
          : "Medium";
      var priorityClass = "badge-" + priority.toLowerCase();
      var rowClass = t.status === "Completed" ? ' class="task-done"' : "";

      // the complete button changes icon and label depending on the status
      var completeBtn =
        t.status === "Completed"
          ? `<button class="btn btn-sm btn-outline-secondary btn-complete" data-id="${t.id}" aria-label="Reopen task"><i class="bi bi-arrow-counterclockwise"></i></button>`
          : `<button class="btn btn-sm btn-outline-success btn-complete" data-id="${t.id}" aria-label="Mark complete"><i class="bi bi-check2"></i></button>`;

      // escapeHtml on every user value, the rest are from fixed inputs
      var row = `
        <tr${rowClass}>
          <td>${escapeHtml(t.name)}</td>
          <td class="muted">${escapeHtml(t.desc || "-")}</td>
          <td class="mono">${escapeHtml(t.due)}</td>
          <td><span class="badge-priority ${priorityClass}">${priority}</span></td>
          <td>${escapeHtml(t.status)}</td>
          <td class="text-nowrap">
            ${completeBtn}
            <button class="btn btn-sm btn-outline-secondary btn-edit" data-id="${t.id}" aria-label="Edit task"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${t.id}" aria-label="Delete task"><i class="bi bi-trash"></i></button>
          </td>
        </tr>`;
      body.append(row);
    });
  }

  // the three numbers at the top of the page
  function updateSummary(list) {
    var completed = list.filter(function (t) {
      return t.status === "Completed";
    }).length;
    $("#countTotal").text(list.length);
    $("#countCompleted").text(completed);
    $("#countPending").text(list.length - completed);
  }

  // fill the analytics bars, one set for status and one for priority
  function updateChart(list) {
    var total = list.length;
    var completed = countBy(list, "status", "Completed");
    setBar("#barCompleted", "#barCompletedVal", completed, total);
    setBar("#barPending", "#barPendingVal", total - completed, total);
    setBar("#barHigh", "#barHighVal", countBy(list, "priority", "High"), total);
    setBar("#barMedium", "#barMediumVal", countBy(list, "priority", "Medium"), total);
    setBar("#barLow", "#barLowVal", countBy(list, "priority", "Low"), total);
  }

  // count how many tasks have a given value for a given key
  function countBy(list, key, value) {
    return list.filter(function (t) {
      return t[key] === value;
    }).length;
  }

  // set one bar width as a percentage and write its number
  function setBar(barId, valueId, count, total) {
    var pct = total === 0 ? 0 : Math.round((count / total) * 100);
    $(barId).css("width", pct + "%");
    $(valueId).text(count);
  }

  // save the whole list back to localStorage
  function saveTasks(list) {
    localStorage.setItem("argus-tasks", JSON.stringify(list));
  }

  // read the saved tasks, fall back to an empty list if the data is corrupted
  function loadTasks() {
    var data = localStorage.getItem("argus-tasks");
    if (!data) {
      return [];
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  // add a line to the activity feed, keep only the 20 most recent
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

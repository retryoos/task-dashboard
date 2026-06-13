$(function () {
  $("#contactForm").on("submit", function (event) {
    event.preventDefault();

    var name = $("#cName").val().trim();
    var email = $("#cEmail").val().trim();
    var subject = $("#cSubject").val().trim();
    var message = $("#cMessage").val().trim();

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    $("#cName").toggleClass("is-invalid", name === "");
    $("#cEmail").toggleClass("is-invalid", !emailOk);
    $("#cSubject").toggleClass("is-invalid", subject === "");
    $("#cMessage").toggleClass("is-invalid", message === "");

    if (name === "" || !emailOk || subject === "" || message === "") {
      return;
    }

    $("#sumName").text(name);
    $("#sumEmail").text(email);
    $("#sumSubject").text(subject);
    $("#sumMessage").text(message);

    var modal = new bootstrap.Modal(document.querySelector("#confirmModal"));
    modal.show();

    this.reset();
  });
});

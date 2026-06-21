// contact.js - validates the contact form and shows a confirmation popup

$(function () {
  $("#contactForm").on("submit", function (event) {
    // stop the normal submit, there is no server to send to
    event.preventDefault();

    var name = $("#cName").val().trim();
    var email = $("#cEmail").val().trim();
    var subject = $("#cSubject").val().trim();
    var message = $("#cMessage").val().trim();

    // simple email shape check, something@something.something
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // flag each empty or invalid field with the red bootstrap feedback
    $("#cName").toggleClass("is-invalid", name === "");
    $("#cEmail").toggleClass("is-invalid", !emailOk);
    $("#cSubject").toggleClass("is-invalid", subject === "");
    $("#cMessage").toggleClass("is-invalid", message === "");

    // stop here if anything is missing or the email is invalid
    if (name === "" || !emailOk || subject === "" || message === "") {
      return;
    }

    // echo what was sent into the modal, text() keeps it safe from html
    $("#sumName").text(name);
    $("#sumEmail").text(email);
    $("#sumSubject").text(subject);
    $("#sumMessage").text(message);

    // bootstrap needs the real dom node, [0] pulls it out of the jquery object
    var modal = new bootstrap.Modal($("#confirmModal")[0]);
    modal.show();

    // clear the form for the next message
    $(this).trigger("reset");
  });
});

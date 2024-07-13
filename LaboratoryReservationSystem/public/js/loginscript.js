$(document).ready(function () {
  // Register functionality
  $(".register-submit").on("click", function (event) {
    event.preventDefault(); // Prevent default form submission
    const username = $("#reg-username").val();
    const email = $("#reg-email").val();
    const password = $("#reg-password").val();
    const userType = $("#user-type").val();

    console.log("Register button clicked");
    console.log({ username, email, password, userType });

    $.ajax({
      url: "/api/register",
      method: "POST",
      data: { username, email, password, userType },
      success: function (response) {
        alert(response.message);
        console.log(response);
        window.location.href = "/login"; // Redirect to login page
      },
      error: function (xhr, status, error) {
        let errorMessage = "An error occurred";
        if (xhr.responseJSON && xhr.responseJSON.error) {
          errorMessage = xhr.responseJSON.error;
        }
        alert(errorMessage);
        console.log("Error details:", {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText,
          error: error,
        });
      },
    });
  });

  // Login functionality
  $(".login-submit").on("click", function (event) {
    event.preventDefault(); // Prevent default form submission
    const email = $("#login-email").val();
    const password = $("#login-password").val();
    const rememberMe = $("#remember-me").is(":checked");

    $.ajax({
      url: "/api/login",
      method: "POST",
      data: { email, password },
      success: function (response) {
        if (rememberMe) {
          localStorage.setItem("login-email", email);
          localStorage.setItem("login-password", password);
        } else {
          localStorage.removeItem("login-email");
          localStorage.removeItem("login-password");
        }

        const username = response.user.username;
        const usernameParts = username.split(" ");
        const processedUsername =
          usernameParts.length > 1
            ? usernameParts.slice(0, 1).concat(usernameParts.slice(2)).join(" ")
            : username;

        // Creating and appending the welcome message with processed username
        const welcomeMessage = $('<div id="welcome-message">')
          .html(`<p>Welcome, ${processedUsername}!</p>`)
          .hide()
          .appendTo("body");

        $(".wrapper.action-popup").hide();
        $("#welcome-message").fadeIn("slow");

        setTimeout(() => {
          $("#welcome-message").hide();
          window.location.href = "/reserveSlot";
        }, 2500);
      },
      error: function (xhr) {
        let errorMessage = "An error occurred";
        if (xhr.responseJSON && xhr.responseJSON.error) {
          errorMessage = xhr.responseJSON.error;
        }
        alert(errorMessage);
        console.log(xhr);
      },
    });
  });

  // Toggle between login and register forms
  $(".reg-link").on("click", function (event) {
    event.preventDefault();
    $(".wrapper").addClass("action");
  });

  $(".login-link").on("click", function (event) {
    event.preventDefault();
    $(".wrapper").removeClass("action");
  });

  $(".btnLogin-popup").on("click", function () {
    if ($(".wrapper").hasClass("action-popup")) {
      $(".wrapper").removeClass("action-popup");
      console.log("Removed action-popup");
    } else {
      $(".wrapper").addClass("action-popup");
      console.log("Added action-popup");
    }
  });
});

$(document).ready(function () {
  async function fetchUserProfile() {
    try {
      const response = await fetch("/api/userProfile");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const userData = await response.json();

      $(".user-name").text(userData.name);
      $(".user-email").text(userData.email);
      $(".user-description").text(userData.description);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  async function fetchAndDisplayBookings() {
    try {
      const response = await fetch("/api/getRoomSeatDateTime");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const bookings = await response.json();

      const tableBody = $(".lab_reservations tbody");
      tableBody.empty(); // Clear existing rows

      const currentDate = new Date();

      if (bookings.length === 0) {
        const noReservationsRow = `<tr> <td colspan="5" style="text-align: center;">You don't have any reservations</td></tr>`;
        tableBody.append(noReservationsRow);
      } else {
        bookings.forEach((booking) => {
          const bookingDate = new Date(booking.date);
          const bookingTime = booking.timeSlot.split(" - ")[1]; // Extract end time, which is 17:45
          const [hours, minutes] = bookingTime.split(":").map(Number);

          bookingDate.setHours(hours, minutes);
          const currentDate = new Date();
          const isPastBooking = bookingDate < currentDate;

          // Check if the booking is currently ongoing
          const startTime = booking.timeSlot.split(" - ")[0];
          const [startHours, startMinutes] = startTime.split(":").map(Number);
          const bookingStartDate = new Date(booking.date);
          bookingStartDate.setHours(startHours, startMinutes);

          const isOngoingBooking =
            bookingStartDate <= currentDate && bookingDate >= currentDate;

          const row = `
          <tr>
            <td>${booking.laboratoryNumber}</td>
            <td>${booking.seatNumber}</td>
            <td>${bookingDate.toISOString().split("T")[0]}</td>
            <td>${booking.timeSlot}</td>
            <td class="button-cell">
              ${
                isPastBooking
                  ? `<p class="reserveComplete">Reservation Completed!</p>`
                  : isOngoingBooking
                  ? `<p class="reserveComplete">In Progress</p>`
                  : `
                      <button class="cancel_button"
                        data-seat-number="${booking.seatNumber}"
                        data-lab-number="${booking.laboratoryNumber}"
                        data-booking-date="${
                          bookingDate.toISOString().split("T")[0]
                        }"
                        data-timeslot="${booking.timeSlot}">Cancel</button>`
              }
            </td>
          </tr>
          `;
          tableBody.append(row);
        });
      }

      // Add event listeners for edit and cancel buttons
      addButtonEventListeners();
    } catch (error) {
      console.error("Error fetching bookings:", error);
      $(".lab-reservations tbody").html(
        '<tr><td colspan="5">Error fetching bookings. Please try again later.</td></tr>'
      );
    }
  }

  function addButtonEventListeners() {
    function handleEditClick(event) {
      window.location.href = "/reserveSlot";
    }

    async function handleCancelClick(event) {
      const userConfirmed = confirm("Are you sure you want to cancel?");
      if (userConfirmed) {
        const button = event.currentTarget;

        // Retrieve data attributes from the button
        const seatNumber = button.getAttribute("data-seat-number");
        const labNumber = button.getAttribute("data-lab-number");
        const bookingDate = button.getAttribute("data-booking-date");
        const timeslot = button.getAttribute("data-timeslot");

        try {
          const queryString = `?seatNumber=${seatNumber}&labNumber=${labNumber}&bookingDate=${bookingDate}&timeslot=${timeslot}`;
          const response = await fetch("/api/cancelbooking" + queryString, {
            method: "POST",
          });

          if (response.ok) {
            // Refresh bookings list
            fetchAndDisplayBookings();
          } else {
            throw new Error("Failed to cancel booking");
          }
        } catch (error) {
          console.error("Error cancelling booking:", error);
          alert("Failed to cancel booking. Please try again later.");
        }
      }
    }

    const editButtons = document.querySelectorAll(".edit_button");
    editButtons.forEach((button) => {
      button.addEventListener("click", handleEditClick);
    });

    const cancelButtons = document.querySelectorAll(".cancel_button");
    cancelButtons.forEach((button) => {
      button.addEventListener("click", handleCancelClick);
    });
  }

  // Initial fetch and display of bookings
  fetchUserProfile();
  fetchAndDisplayBookings();
});

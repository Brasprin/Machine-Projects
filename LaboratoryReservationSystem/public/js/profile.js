$(document).ready(function () {
  async function fetchUserProfile(email) {
    try {
      const response = await fetch(`/api/userProfileOther?email=${email}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const userData = await response.json();

      // Update user information in the HTML
      $(".user-name").text(userData.name);
      $(".user-email").text(userData.email);
      $(".user-description").text(userData.description);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  async function fetchAndDisplayBookings(email) {
    try {
      const response = await fetch(
        `/api/getRoomSeatDateTimeOther?email=${email}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const bookings = await response.json();

      const tableBody = $(".lab-reservations tbody");
      tableBody.empty(); // Clear existing rows

      if (bookings.length === 0) {
        const noReservationsRow = `<tr><td colspan="5" style="text-align: center;">No reservation records.</td></tr>`;
        tableBody.append(noReservationsRow);
      } else {
        bookings.forEach((booking) => {
          const row = `
                <tr>
                  <td>${booking.laboratoryNumber}</td>
                  <td>${booking.seatNumber}</td>
                  <td>${new Date(booking.date).toISOString().split("T")[0]}</td>
                  <td>${booking.timeSlot}</td>
                </tr>`;
          tableBody.append(row);
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      $(".lab-reservations tbody").html(
        '<tr><td colspan="5">Error fetching bookings. Please try again later.</td></tr>'
      );
    }
  }

  async function fetchAndDisplayPublicProfile() {
    try {
      const response = await fetch("/api/publicProfile");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const allProfiles = await response.json();

      const tableBody = $(".public-profile tbody");
      tableBody.empty(); // Clear existing rows

      if (allProfiles.length === 0) {
        const noProfilesRow = `<tr><td colspan="2" style="text-align: center;">No Profiles Available</td></tr>`;
        tableBody.append(noProfilesRow);
      } else {
        allProfiles.forEach((profile) => {
          const row = `
        <tr>
          <td><a href="#" class="profile-link" data-email="${profile.email}">${profile.email}</a></td>
          <td>${profile.username}</td>
        </tr>`;
          tableBody.append(row);
        });
      }
    } catch (error) {
      console.error("Error fetching or displaying profiles:", error);
    }
  }

  // Add this outside of fetchAndDisplayPublicProfile, but inside the $(document).ready function
  $(".public-profile tbody").on(
    "click",
    ".profile-link",
    async function (event) {
      event.preventDefault();
      const email = $(this).data("email");
      try {
        await fetchUserProfile(email);
        await fetchAndDisplayBookings(email);
      } catch (error) {
        console.error("Error fetching profile and bookings:", error);
      }
    }
  );

  async function fetchUserProfileAndBookings(email = null) {
    try {
      if (!email) {
        const response = await fetch("api/userProfile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userData = await response.json();
        email = userData.email; // Assign fetched email to variable
      }

      // Now email is guaranteed to be valid
      await fetchUserProfile(email);
      await fetchAndDisplayBookings(email);
    } catch (error) {
      console.error("Error fetching user profile and bookings:", error);
    }
  }

  fetchUserProfileAndBookings();
  fetchAndDisplayPublicProfile();
});

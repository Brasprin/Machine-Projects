$(document).ready(function () {
  initializeCalendarAndReservations();
});

function initializeCalendarAndReservations() {
  // Calendar Variables
  const datetextElements = $(".date_text");
  const daytextElement = $(".day_text");
  const dateElements = $(".date");
  const btnElements = $(".calendar_heading .fas");
  const monthyearElements = $(".month_year");

  let labs = ["G301", "G302", "G303A", "G303B"];

  let dateMonthObject = [
    {
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
  ];

  let dateObject = new Date();
  let dayName = dateMonthObject[0].days[dateObject.getDay()];
  let month = dateObject.getMonth();
  let year = dateObject.getFullYear();
  let date = dateObject.getDate();

  datetextElements.html(`${dateMonthObject[0].months[month]} ${date}, ${year}`);

  const displayCalendar = async () => {
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    let lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    let lastDateOfLastMonth = new Date(year, month, 0).getDate();
    let days = "";

    // Fetch available dates from the database
    const availableDates = await fetchAvailableDates(year, month);

    // Previous month's last days
    for (let i = firstDayOfMonth; i > 0; i--) {
      days += `<li class="dummy">${lastDateOfLastMonth - i + 1}</li>`;
    }

    // Current month's days
    for (let i = 1; i <= lastDateOfMonth; i++) {
      let checkToday =
        i === dateObject.getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear()
          ? "active"
          : "";
      let dateAvailable = availableDates.includes(i) ? "available" : "";

      days += `<li class="${checkToday}">${i}</li>`;
    }

    // Next month's first days
    let totalDaysDisplayed = firstDayOfMonth + lastDateOfMonth;
    for (let i = totalDaysDisplayed; i < 35; i++) {
      days += `<li class="dummy">${i - totalDaysDisplayed + 1}</li>`;
    }

    dateElements.html(days);
    monthyearElements.html(`${dateMonthObject[0].months[month]} ${year}`);

    const formatDateForServer = (date) => {
      return `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
    };

    const today = new Date();
    const todayFormatted = `${
      dateMonthObject[0].months[today.getMonth()]
    }, ${today.getDate()}, ${today.getFullYear()}`;
    const defaultLab = $("#labSelect").val() || labs[0];

    // Display initial timeslot reservation
    displayTimeslotReservation(defaultLab, todayFormatted);

    // Event listeners to each day
    dateElements
      .find("li")
      .not(".dummy")
      .on("click", function () {
        dateElements.find("li").removeClass("active");
        $(this).addClass("active");

        date = parseInt($(this).text());
        dayName = dateMonthObject[0].days[new Date(year, month, date).getDay()];
        datetextElements.html(
          `${dateMonthObject[0].months[month]} ${date}, ${year}`
        );

        if (
          date === dateObject.getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear()
        ) {
          daytextElement.show();
        } else {
          daytextElement.hide();
        }

        const selectedLabNumber = selectedLab.val();
        displayTimeslotReservation(
          selectedLabNumber,
          `${dateMonthObject[0].months[month]} ${date}, ${year}`
        );
      });
  };

  displayCalendar();

  btnElements.each(function () {
    $(this).on("click", function () {
      if (this.id === "previous") {
        month -= 1;
        if (month < 0) {
          month = 11;
          year -= 1;
        }
      } else if (this.id === "next") {
        month += 1;
        if (month > 11) {
          month = 0;
          year += 1;
        }
      }

      displayCalendar();
    });
  });

  // Function to fetch available dates from the database
  async function fetchAvailableDates(year, month) {
    try {
      const response = await fetch(
        `/api/available-dates?year=${year}&month=${month + 1}`
      );
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch available dates: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.availableDates;
    } catch (error) {
      console.error("Error fetching available dates:", error);
      return [];
    }
  }

  const selectedLab = $("#selectedLab");
  let selectedTimeslot = null;
  let displayedLab = null;
  let displayedDate = null;
  let displayedTimeslot = null;

  const displayTimeslotReservation = async (labNumber, date) => {
    try {
      // Parse and format the date correctly
      const parsedDate = new Date(date);
      const formattedDate = parsedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      const response = await fetch(
        `/api/timeslots?labNumber=${labNumber}&date=${formattedDate}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const timeslots = data.timeslots;

      // Update displayed state
      displayedLab = labNumber;
      displayedDate = date;
      displayedTimeslot = timeslots[0].timeSlot;

      displayTimeslots(timeslots, labNumber, date);
    } catch (error) {
      console.error("Error fetching timeslots:", error);
      // Handle error display or logging
    }
  };

  let lastClickedTimeslot = null;

  const displayTimeslots = (timeslots, labNumber, date) => {
    const timeSlotDiv = $(".time_slot");
    timeSlotDiv.empty();

    $("<h3>")
      .html(`Laboratory Number: <span class="info">${labNumber}</span>`)
      .appendTo(timeSlotDiv);

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    $("<h3>")
      .html(`Date: <span class="info">${formattedDate}</span>`)
      .appendTo(timeSlotDiv);

    timeslots.forEach((slot) => {
      const p = $("<div>").addClass("timeslot-container");

      if (slot.slotsLeft > 0) {
        p.html(
          `${slot.timeSlot} <span id="slotsLeft">${slot.slotsLeft} slots left</span>`
        );
      } else if (slot.timeSlotStatus === "Unavailable") {
        p.html(`${slot.timeSlot} <span id="Unavailable">Unavailable</span>`);
      } else {
        p.html(`${slot.timeSlot} <span id="fullyBooked">Fully Booked</span>`);
      }

      p.on("click", function () {
        lastClickedTimeslot = slot.timeSlot;
        displaySeatNumberReservationFromAPI(
          labNumber,
          lastClickedTimeslot,
          date
        );
      });
      timeSlotDiv.append(p);
    });

    if (lastClickedTimeslot == null) {
      displaySeatNumberReservationFromAPI(
        labNumber,
        timeslots[0].timeSlot,
        date
      );
    } else {
      // Display seat number reservation for default timeslot
      displaySeatNumberReservationFromAPI(labNumber, lastClickedTimeslot, date);
    }
  };

  const displaySeatNumberReservationFromAPI = async (
    labNumber,
    timeslot,
    date
  ) => {
    const currentDate = new Date(date);
    const isSunday = currentDate.getDay() === 0;

    if (isSunday) {
      displaySundaySeatNumber();
      return;
    }

    try {
      const response = await fetch(
        `/api/seat-statuses?labNumber=${labNumber}&timeslot=${timeslot}&date=${date}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const seatStatuses = data.seatStatuses;

      displaySeatNumberReservation(timeslot, date, seatStatuses);
    } catch (error) {
      console.error("Error in displaySeatNumberReservationFromAPI:", error);
      // Handle error display or logging as needed
    }
  };

  const displaySundaySeatNumber = () => {
    const seatNumberDiv = $(".seat_number");
    seatNumberDiv.empty();
    seatNumberDiv.html(
      "<h2>Laboratory is close on this date. Please check other dates.</h2>"
    );
  };

  const displaySeatNumberReservation = (timeslot, date, seatStatuses) => {
    const seatNumberDiv = $(".seat_number");
    seatNumberDiv.empty();
    $("<h3>")
      .html(`Time Slot: <span class="info">${timeslot}</span>`)
      .appendTo(seatNumberDiv);

    $("<h3>").html(`Seat Number`).appendTo(seatNumberDiv);
    seatStatuses.forEach((seat) => {
      let status = seat.status;

      const seatContainer = $("<div>").addClass("seat-container");

      const seatInfo = $("<p>")
        .html(`${seat.seatNumber}`)
        .addClass("seat-info");
      seatContainer.append(seatInfo); // Append seatInfo to seatContainer

      const statusButton = $("<button>").html(status).addClass("status-button");

      const parseDate = (dateString) => {
        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const formattedDate = parseDate(date);
      const endTime = timeslot.split(" - ")[1];
      const reservationDateTime = new Date(`${formattedDate}T${endTime}:00`);

      const currentDateTime = new Date();
      const labNumber = selectedLab.val();
      if (reservationDateTime < currentDateTime && status !== "Booked") {
        status = "Unavailable";
        statusButton.html(status).addClass("unavailable");
      } else if (status === "Available") {
        statusButton.addClass("available");
        statusButton.on("click", function () {
          confirmBooking(timeslot, seat, labNumber, date);
        });
      } else if (status === "Booked") {
        statusButton.addClass("booked");
        const { bookerName, bookerEmail, bookingDate, requestTime } = seat.info;

        statusButton.on("click", function () {
          displayBookingInfo(
            timeslot,
            seat,
            bookerName,
            bookerEmail,
            bookingDate,
            requestTime,
            labNumber
          );
        });
      }

      seatContainer.append(statusButton); // Append statusButton to seatContainer
      seatNumberDiv.append(seatContainer); // Append seatContainer to seatNumberDiv
    });
  };

  function confirmBooking(timeslot, seat, labNumber, date) {
    const requestTime = new Date().toLocaleTimeString();
    const bookingDate = date;
    const overlay = $("#myOverlay");
    const bookingInfo = $("#bookingInfo");
    bookingInfo.html(`
        <span class="bookingLine">Laboratory: <span class="bookingInfoValue">${labNumber}</span></span><br>
        <span class="bookingLine">Seat Number: <span class="bookingInfoValue">${seat.seatNumber}</span></span><br>
        <span class="bookingLine">Time Slot: <span class="bookingInfoValue">${timeslot}</span></span><br>
        <span class="bookingLine">Request Time: <span class="bookingInfoValue">${requestTime}</span></span><br>
        <span class="bookingLine">Booking Date: <span class="bookingInfoValue">${bookingDate}</span></span><br>
        <button id="cancelButton">Cancel</button>
        <button id="confirmButton">Confirm Booking</button>
    `);

    overlay.show();

    $("#confirmButton").on("click", async function () {
      try {
        const queryString = `?timeslot=${timeslot}&seatNumber=${seat.seatNumber}&labNumber=${labNumber}&bookingDate=${bookingDate}&requestTime=${requestTime}`;
        const response = await fetch("/api/confirm-booking" + queryString, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        overlay.hide();
        const isConfirmed = true;

        // Use the bookerName from the server response
        const bookerName = result.seatStatus.info.bookerName;
        const bookerEmail = result.seatStatus.info.bookerEmail;

        displayBookingInfo(
          timeslot,
          seat,
          bookerName,
          bookerEmail,
          bookingDate,
          requestTime,
          labNumber,
          isConfirmed
        );

        await displaySeatNumberReservationFromAPI(labNumber, timeslot, date);
        await displayTimeslotReservation(labNumber, date);
      } catch (error) {
        console.error("Error confirming booking:", error);
        alert("Error confirming booking. Please try again.");
      }
    });

    $("#cancelButton").on("click", function () {
      overlay.hide();
    });
  }

  function displayBookingInfo(
    timeslot,
    slot,
    bookerName,
    bookerEmail,
    bookingDate,
    requestTime,
    labNumber,
    isConfirmed = false
  ) {
    const overlay = $("#myOverlay");
    const bookingInfo = $("#bookingInfo");

    // Construct the HTML for booking information
    bookingInfo.html(`
    <span class="bookingLine">Booker Name: 
      <a href="#" class="bookingInfoValue bookerProfileLink" data-email="${bookerEmail}">${bookerName}</a> 
    </span><br>
    <span class="bookingLine">Booker Email: <span class="bookingInfoValue">${bookerEmail}</span></span><br>
    <span class="bookingLine">Seat Number : <span class="bookingInfoValue">${
      slot.seatNumber
    }</span></span><br>
    <span class="bookingLine">Laboratory : <span class="bookingInfoValue">${labNumber}</span></span><br>
    <span class="bookingLine">Request Time : <span class="bookingInfoValue">${requestTime}</span></span><br>
    <span class="bookingLine">Booking Date : <span class="bookingInfoValue">${bookingDate}</span></span><br>
    ${
      isConfirmed
        ? '<span class="bookingLine"><span class="bookingConfirmed">Booking Confirmed!</span></span><br>'
        : ""
    }
  `);

    // Show the overlay
    overlay.show();

    // Click event handler for bookerProfileLink class
    $(".bookerProfileLink").on("click", function (event) {
      event.preventDefault();
      const email = $(this).data("email");
      redirectToProfile(email);
    });
  }

  async function redirectToProfile(email) {
    window.location.href = "/profile";
  }

  // Event listener for changes in the selected lab
  selectedLab.on("change", function () {
    displayTimeslotReservation(
      selectedLab.val(),
      `${dateMonthObject[0].months[month]} ${date}, ${year}`
    );
  });

  const overlay = $("#myOverlay");
  const span = $(".close");
  span.on("click", function () {
    overlay.hide();
  });

  $(window).on("click", function (event) {
    if (event.target === overlay[0]) {
      overlay.hide();
    }
  });
}

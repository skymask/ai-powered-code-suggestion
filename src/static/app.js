document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Clear previous options in the select dropdown
      activitySelect.innerHTML = '<option value="" disabled selected>Select an activity</option>';

      // Helper function to create participants section
      function createParticipantsSection(participants) {
        const section = document.createElement("div");
        if (participants.length > 0) {
          section.className = "participants-section";
          const strong = document.createElement("strong");
          strong.textContent = "Participants:";
          section.appendChild(strong);

          const ul = document.createElement("ul");
          participants.forEach(email => {
            const li = document.createElement("li");
            li.textContent = email;
            ul.appendChild(li);
          });
          section.appendChild(ul);
        } else {
          section.className = "participants-section no-participants";
          const em = document.createElement("em");
          em.textContent = "No participants yet.";
          section.appendChild(em);
        }
        return section;
      }

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        // Build card content using DOM methods to avoid overwriting appended nodes
        const h4 = document.createElement("h4");
        h4.textContent = name;
        activityCard.appendChild(h4);

        const descP = document.createElement("p");
        descP.textContent = details.description;
        activityCard.appendChild(descP);

        const scheduleP = document.createElement("p");
        const scheduleStrong = document.createElement("strong");
        scheduleStrong.textContent = "Schedule:";
        scheduleP.appendChild(scheduleStrong);
        scheduleP.appendChild(document.createTextNode(` ${details.schedule}`));
        activityCard.appendChild(scheduleP);

        // FIX: Remove duplicate 'availP' and 'spotsLeft' declarations
        const spotsLeft = details.spotsLeft !== undefined ? details.spotsLeft : 0;
        const availP = document.createElement("p");
        const availStrong = document.createElement("strong");
        availStrong.textContent = "Availability:";
        availP.appendChild(availStrong);
        availP.appendChild(document.createTextNode(` ${spotsLeft} spots left`));
        activityCard.appendChild(availP);

        // Use helper function for participants section
        const participantsSection = createParticipantsSection(details.participants);
        activityCard.appendChild(participantsSection);

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Setup Form handling on index.html
    const setupForm = document.getElementById("setupForm");
    if (setupForm) {
        setupForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Gather selected communication options
            const selectedComm = Array.from(document.querySelectorAll('input[name="commPref"]:checked'))
                .map(checkbox => checkbox.value);

            // Gather selected sharing preference
            const shareModeInput = document.querySelector('input[name="shareMode"]:checked');
            const shareMode = shareModeInput ? shareModeInput.value : "all";

            // Gather selected condition categories
            const selectedConditions = Array.from(document.querySelectorAll('input[name="condition"]:checked'))
                .map(checkbox => checkbox.value);

            const otherCondition = document.getElementById("otherCondition") ? document.getElementById("otherCondition").value.trim() : "";
            if (otherCondition) {
                selectedConditions.push(`Other: ${otherCondition}`);
            }

            // Create profile object
            const riderData = {
                name: document.getElementById("fullName").value,
                pronouns: document.getElementById("pronouns").value,
                age: document.getElementById("age").value,
                city: document.getElementById("city").value,
                emergencyName: document.getElementById("emergencyName").value,
                emergency: document.getElementById("emergencyContact").value,
                station: document.getElementById("station").value,
                comm: selectedComm,
                shareMode: shareMode,
                conditions: selectedConditions,
                accommodation: document.getElementById("accommodation").value
            };

            // Save to session storage and navigate
            sessionStorage.setItem("riderData", JSON.stringify(riderData));
            window.location.href = "scan.html";
        });
    }

    // 2. Accordion functionality for condition groups
    document.querySelectorAll(".condition-header").forEach(button => {
        button.addEventListener("click", () => {
            const body = button.nextElementSibling;
            const isVisible = body.style.display === "block";
            body.style.display = isVisible ? "none" : "block";
        });
    });
});

// 3. Triggered by the "Simulate Scan" button or timeout on scan.html
function completeScan() {
    const rawData = sessionStorage.getItem("riderData");

    if (!rawData) {
        alert("No rider profile set up! Please fill out the form on the home page first.");
        window.location.href = "index.html";
        return;
    }

    const rider = JSON.parse(rawData);

    // Populate personal profile fields
    document.getElementById("displayName").textContent = rider.name || "N/A";
    document.getElementById("displayPronouns").textContent = rider.pronouns || "N/A";
    document.getElementById("displayAge").textContent = rider.age || "N/A";
    document.getElementById("displayCity").textContent = rider.city || "N/A";
    document.getElementById("displayEmergencyName").textContent = rider.emergencyName || "N/A";
    document.getElementById("displayEmergency").textContent = rider.emergency || "N/A";
    document.getElementById("displayStation").textContent = rider.station || "N/A";
    document.getElementById("displayAccommodation").textContent = rider.accommodation || "None specified.";

    // Render array of accessibility categories/conditions based on share mode
    const conditionsContainer = document.getElementById("displayConditions");
    if (conditionsContainer) {
        if (rider.shareMode === "none") {
            conditionsContainer.textContent = "Rider preferred not to share specific condition names.";
        } else if (Array.isArray(rider.conditions) && rider.conditions.length > 0) {
            conditionsContainer.innerHTML = "<ul>" + rider.conditions.map(item => `<li>${item}</li>`).join("") + "</ul>";
        } else {
            conditionsContainer.textContent = "No specific conditions selected.";
        }
    }

    // Render array of communication preferences cleanly
    const commContainer = document.getElementById("displayComm");
    if (commContainer) {
        if (Array.isArray(rider.comm) && rider.comm.length > 0) {
            commContainer.innerHTML = "<ul>" + rider.comm.map(pref => `<li>${pref}</li>`).join("") + "</ul>";
        } else {
            commContainer.textContent = "No specific preferences selected.";
        }
    }

    // Toggle UI transitions
    const scanText = document.getElementById("scanText");
    const loader = document.querySelector(".loader");
    const profile = document.getElementById("profile");

    if (scanText) scanText.textContent = "Rider Profile Loaded";
    if (loader) loader.style.display = "none";
    if (profile) profile.classList.remove("hidden");
}
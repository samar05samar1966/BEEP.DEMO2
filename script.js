// Runs automatically when any page loads
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Setup Form handling on index.html
    const setupForm = document.getElementById("setupForm");
    if (setupForm) {
        setupForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Gather all selected communication options into an array
            const selectedComm = Array.from(document.querySelectorAll('input[name="commPref"]:checked'))
                .map(checkbox => checkbox.value);

            // Create profile object
            const riderData = {
                name: document.getElementById("fullName").value,
                pronouns: document.getElementById("pronouns").value,
                age: document.getElementById("age").value,
                address: document.getElementById("address").value,
                emergency: document.getElementById("emergencyContact").value,
                station: document.getElementById("station").value,
                comm: selectedComm, // Stored as an array
                accommodation: document.getElementById("accommodation").value
            };

            // Save to session storage and navigate
            sessionStorage.setItem("riderData", JSON.stringify(riderData));
            window.location.href = "scan.html";
        });
    }
});

// 2. Triggered by the "Simulate Scan" button on scan.html
function completeScan() {
    // Retrieve stored data
    const rawData = sessionStorage.getItem("riderData");

    if (!rawData) {
        alert("No rider profile set up! Please fill out the form on the home page first.");
        window.location.href = "index.html";
        return;
    }

    // Parse the stored data FIRST
    const rider = JSON.parse(rawData);

    // Populate basic fields
    document.getElementById("displayName").textContent = rider.name;
    document.getElementById("displayPronouns").textContent = rider.pronouns;
    document.getElementById("displayAge").textContent = rider.age;
    document.getElementById("displayAddress").textContent = rider.address;
    document.getElementById("displayEmergency").textContent = rider.emergency;
    document.getElementById("displayStation").textContent = rider.station;
    document.getElementById("displayAccommodation").textContent = rider.accommodation;

    // Handle array of communication preferences nicely
    const commContainer = document.getElementById("displayComm");
    if (Array.isArray(rider.comm) && rider.comm.length > 0) {
        commContainer.innerHTML = "<ul>" + rider.comm.map(pref => `<li>${pref}</li>`).join("") + "</ul>";
    } else {
        commContainer.textContent = "No specific preferences selected.";
    }

    // UI transitions
    document.getElementById("scanText").innerHTML = "✓ Rider Profile Loaded";
    document.querySelector(".loader").style.display = "none";
    document.getElementById("profile").classList.remove("hidden");
}
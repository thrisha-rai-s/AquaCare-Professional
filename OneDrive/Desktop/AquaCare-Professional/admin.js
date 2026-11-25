
import { db, auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Authorised admin UID
const ADMIN_UID = "921KrscvzlNhThPFqgmRIWxCmSG3";

// HTML elements
const loginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("loginMessage");
const loginSection = document.getElementById("adminLoginSection");
const dashboard = document.getElementById("adminDashboard");
const complaintsList = document.getElementById("complaintsList");
const logoutButton = document.getElementById("logoutButton");

const complaintSearch = document.getElementById("complaintSearch");
const statusFilter = document.getElementById("statusFilter");

// Format Firebase date and time
function formatDateTime(timestamp) {

    if (!timestamp || typeof timestamp.toDate !== "function") {
        return "Not available";
    }

    return timestamp.toDate().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

// Search and filter events
complaintSearch.addEventListener("input", loadComplaints);
statusFilter.addEventListener("change", loadComplaints);


// ADMIN LOGIN
loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    loginMessage.textContent = "Checking login details...";

    try {

        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        if (result.user.uid !== ADMIN_UID) {

            await signOut(auth);

            loginMessage.textContent =
                "You are not authorised as an admin.";
        }

    } catch (error) {

        console.error("Login error:", error);

        loginMessage.textContent =
            "Login failed. Check your email and password.";
    }
});


// CHECK ADMIN AUTHENTICATION
onAuthStateChanged(auth, async function (user) {

    if (user && user.uid === ADMIN_UID) {

        loginSection.style.display = "none";
        dashboard.style.display = "block";

        await loadComplaints();

    } else {

        loginSection.style.display = "block";
        dashboard.style.display = "none";
    }
});


// LOAD AND DISPLAY COMPLAINTS
async function loadComplaints() {

    complaintsList.textContent = "Loading complaints...";

    try {

        const snapshot = await getDocs(
            collection(db, "complaints")
        );

        // Calculate dashboard statistics
        let total = 0;
        let pending = 0;
        let inProgress = 0;
        let resolved = 0;

        snapshot.forEach(function (documentSnapshot) {

            const complaint = documentSnapshot.data();

            total++;

            if (complaint.status === "Pending") {
                pending++;
            }
            else if (complaint.status === "In Progress") {
                inProgress++;
            }
            else if (complaint.status === "Resolved") {
                resolved++;
            }
        });

        // Display statistics
        document.getElementById("totalCount").textContent = total;
        document.getElementById("pendingCount").textContent = pending;
        document.getElementById("progressCount").textContent = inProgress;
        document.getElementById("resolvedCount").textContent = resolved;

        complaintsList.replaceChildren();

        if (snapshot.empty) {

            complaintsList.textContent = "No complaints found.";
            return;
        }

        // Display each complaint
        snapshot.forEach(function (documentSnapshot) {

            const complaint = documentSnapshot.data();
            const complaintId = documentSnapshot.id;

            // Format reported and updated dates
            const reportedDateTime = formatDateTime(
                complaint.createdAt
            );

            const lastUpdated = formatDateTime(
                complaint.updatedAt || complaint.createdAt
            );

            const resolvedDate = complaint.resolvedAt
                ? formatDateTime(complaint.resolvedAt)
                : "Not resolved yet";

            // Search and status filters
            const searchTerm = complaintSearch.value
                .trim()
                .toLowerCase();

            const selectedStatus = statusFilter.value;

            const searchableText = [
                complaint.complaintId,
                complaint.fullName,
                complaint.location,
                complaint.problem
            ].join(" ").toLowerCase();

            if (
                !searchableText.includes(searchTerm) ||
                (
                    selectedStatus !== "All" &&
                    complaint.status !== selectedStatus
                )
            ) {
                return;
            }

            // Create complaint card
            const card = document.createElement("div");

            card.style.border = "1px solid #dcebef";
            card.style.padding = "18px";
            card.style.margin = "15px 0";
            card.style.borderRadius = "10px";
            card.style.backgroundColor = "#ffffff";

            // Complaint heading
            const heading = document.createElement("h3");

            heading.textContent =
                complaint.problem || "Water issue";

            card.appendChild(heading);

            // Complaint details
            const fields = [

                ["Complaint ID", complaint.complaintId || complaintId],

                ["Reported Date & Time", reportedDateTime],

                ["Name", complaint.fullName],

                ["Email", complaint.email],

                ["Phone", complaint.phone],

                ["Location", complaint.location],

                ["Water Source", complaint.waterSource],

                ["Frequency", complaint.frequency],

                ["Description", complaint.description],

                ["Last Updated", lastUpdated],

                ["Resolved On", resolvedDate]
            ];

            fields.forEach(function ([label, value]) {

                const paragraph = document.createElement("p");

                paragraph.textContent =
                    label + ": " + (value || "Not provided");

                card.appendChild(paragraph);
            });

            // Current complaint status
            const statusLabel = document.createElement("label");

            statusLabel.textContent = "Complaint Status: ";

            card.appendChild(statusLabel);

            // Status dropdown
            const statusSelect = document.createElement("select");

            ["Pending", "In Progress", "Resolved"].forEach(
                function (status) {

                    const option = document.createElement("option");

                    option.value = status;
                    option.textContent = status;

                    statusSelect.appendChild(option);
                }
            );

            statusSelect.value = complaint.status || "Pending";

            card.appendChild(statusSelect);

            // Update status button
            const saveButton = document.createElement("button");

            saveButton.type = "button";
            saveButton.textContent = "Update Status";


saveButton.addEventListener("click", async function () {

    saveButton.disabled = true;
    saveButton.textContent = "Updating...";

    try {

        const newStatus = statusSelect.value;

        // STEP 1: Update main complaint
        await updateDoc(
            doc(db, "complaints", complaintId),
            {
                status: newStatus,
                updatedAt: serverTimestamp(),
                resolvedAt: newStatus === "Resolved"
                    ? serverTimestamp()
                    : null
            }
        );

        // STEP 2: Generate tracking ID
        const trackingId =
            complaint.complaintId ||
            ("AQUA-" + complaintId.toUpperCase());

        // STEP 3: Create or update tracking record
        await setDoc(
            doc(db, "publicTracking", trackingId),
            {
                complaintId: trackingId,
                complaintDocId: complaintId,
                status: newStatus,
                createdAt: complaint.createdAt || serverTimestamp(),
                updatedAt: serverTimestamp(),
                resolvedAt: newStatus === "Resolved"
                    ? serverTimestamp()
                    : null
            },
            { merge: true }
        );

        // STEP 4: Show success
        saveButton.textContent = "Updated!";

        // STEP 5: Refresh dashboard
        await loadComplaints();

    } catch (error) {

        console.error("Status update error:", error);

        saveButton.textContent = "Update Failed";

        alert(
            "Unable to update complaint. Check Console for details."
        );

    } finally {

        saveButton.disabled = false;

    }

});

            card.appendChild(saveButton);

            complaintsList.appendChild(card);
        });

        if (!complaintsList.hasChildNodes()) {

            complaintsList.textContent =
                "No complaints match your search or filter.";
        }

    } catch (error) {

        console.error("Loading complaints error:", error);

        complaintsList.textContent =
            "Unable to load complaints. Check admin permissions.";
    }
}


// ADMIN LOGOUT
logoutButton.addEventListener("click", async function () {

    try {

        await signOut(auth);

    } catch (error) {

        console.error("Logout error:", error);
    }
});


import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const complaintInput = document.getElementById("complaintIdInput");
const trackButton = document.getElementById("trackButton");
const result = document.getElementById("trackingResult");

function formatDate(timestamp) {
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

trackButton.addEventListener("click", async () => {
    const complaintId = complaintInput.value.trim().toUpperCase();

    if (!complaintId) {
        result.textContent = "Please enter your Complaint ID.";
        return;
    }

    result.textContent = "Searching for your complaint...";
    trackButton.disabled = true;

    try {
        const trackingRef = doc(db, "publicTracking", complaintId);
        const trackingSnap = await getDoc(trackingRef);

        if (!trackingSnap.exists()) {
            result.textContent =
                "Complaint not found. Please check your Complaint ID.";
            return;
        }

        const data = trackingSnap.data();

        result.innerHTML = `
            <div class="tracking-result-card">
                <h2>Complaint Details</h2>

                <p><strong>Complaint ID:</strong> ${data.complaintId}</p>

                <p><strong>Status:</strong>
                    <span>${data.status}</span>
                </p>

                <p><strong>Reported Date & Time:</strong>
                    ${formatDate(data.createdAt)}
                </p>

                <p><strong>Last Updated:</strong>
                    ${formatDate(data.updatedAt)}
                </p>

                <p><strong>Resolved On:</strong>
                    ${data.resolvedAt
                        ? formatDate(data.resolvedAt)
                        : "Not resolved yet"}
                </p>
            </div>
        `;

    } catch (error) {
        console.error("Tracking error:", error);
        result.textContent =
            "Unable to track your complaint. Please try again later.";
    } finally {
        trackButton.disabled = false;
    }
});

complaintInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        trackButton.click();
    }
});

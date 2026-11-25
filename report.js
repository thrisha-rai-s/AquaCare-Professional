
import { db, auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    collection,
    doc,
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

console.log("AquaCare report system loaded.");

const complaintForm = document.getElementById("complaintForm");
const formMessage = document.getElementById("formMessage");

let currentUser = null;
let resolveAuthReady;

const authReady = new Promise((resolve) => {
    resolveAuthReady = resolve;
});


// Check whether a user is signed in
onAuthStateChanged(auth, function (user) {

    currentUser = user;

    if (user) {

        document.getElementById("fullName").value =
            user.displayName || "";

        document.getElementById("email").value =
            user.email || "";

        formMessage.textContent =
            "Signed in as " + user.email;

        formMessage.style.color = "#087e65";

    } else {

        formMessage.innerHTML =
            `Please <a href="index.html#account">
            log in or create an account</a> before submitting a report.`;

        formMessage.style.color = "#b45309";
    }

    resolveAuthReady();
});


if (complaintForm && formMessage) {

    complaintForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton = complaintForm.querySelector(
            "button[type='submit']"
        );

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {

            // Wait until Firebase checks the login session
            await authReady;

            if (!currentUser) {

                formMessage.innerHTML =
                    `Please <a href="index.html#account">
                    create an account or log in</a> before reporting an issue.`;

                formMessage.style.color = "#b45309";

                return;
            }

            // Collect complaint information
            const complaintData = {

                userId: currentUser.uid,

                fullName:
                    document.getElementById("fullName").value.trim(),

                email:
                    currentUser.email,

                phone:
                    document.getElementById("phone").value.trim(),

                location:
                    document.getElementById("location").value.trim(),

                waterSource:
                    document.getElementById("waterSource").value,

                problem:
                    document.getElementById("problem").value,

                frequency:
                    document.getElementById("frequency").value,

                description:
                    document.getElementById("description").value.trim(),

                status: "Pending",

                createdAt: serverTimestamp()
            };


            // Create a unique Firestore document ID
            const complaintRef = doc(
                collection(db, "complaints")
            );

            const complaintId =
                "AQUA-" + complaintRef.id.toUpperCase();

            complaintData.complaintId = complaintId;


            // Create tracking record reference
            const trackingRef = doc(
                db,
                "publicTracking",
                complaintId
            );


            // Create user profile report reference
            const userReportRef = doc(
                db,
                "users",
                currentUser.uid,
                "reports",
                complaintRef.id
            );


            // Save all three records together
            const batch = writeBatch(db);

            // Main complaint
            batch.set(complaintRef, complaintData);

            // Public complaint tracking
            batch.set(trackingRef, {

                complaintId: complaintId,
                complaintDocId: complaintRef.id,
                status: "Pending",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                resolvedAt: null

            });

            // User's private report history
            batch.set(userReportRef, {

                complaintId: complaintId,
                reportedAt: serverTimestamp()

            });


            await batch.commit();


            // Display success confirmation
            formMessage.innerHTML = `
                <strong>Report submitted successfully!</strong><br><br>
                Complaint ID: <strong>${complaintId}</strong><br>
                Reported date and time have been saved in your profile.<br><br>
                <a href="index.html#account">
                    View My Profile
                </a>
            `;

            formMessage.style.color = "#087e65";

            complaintForm.reset();

            // Restore account information after reset
            document.getElementById("fullName").value =
                currentUser.displayName || "";

            document.getElementById("email").value =
                currentUser.email || "";

        } catch (error) {

            console.error("Complaint submission error:", error);

            formMessage.textContent =
                "Unable to submit your complaint. Please try again.";

            formMessage.style.color = "#c0392b";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Submit Report";
        }
    });
}


import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const authForms = document.getElementById("authForms");
const profilePanel = document.getElementById("profilePanel");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");

const logoutButton = document.getElementById("logoutButton");
const showLoginButton =
    document.getElementById("showLoginButton");

const showSignupButton =
    document.getElementById("showSignupButton");

const accountMessage = document.getElementById("accountMessage");
const userReportsList = document.getElementById("userReportsList");

const accountNavLink = document.getElementById("accountNavLink");


// Display messages
function showMessage(message, isError = false) {
    accountMessage.textContent = message;
    accountMessage.style.color = isError ? "#c0392b" : "#087e65";
}


// Format Firebase date and time
function formatDateTime(timestamp) {

    if (!timestamp || typeof timestamp.toDate !== "function") {
        return "Date unavailable";
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


// Load reports belonging to the signed-in user
async function loadMyReports(userId) {

    userReportsList.textContent = "Loading your reports...";

    try {

        const reportsRef = collection(
            db,
            "users",
            userId,
            "reports"
        );

        const reportsQuery = query(
            reportsRef,
            orderBy("reportedAt", "desc")
        );

        const snapshot = await getDocs(reportsQuery);

        userReportsList.replaceChildren();

        if (snapshot.empty) {

            userReportsList.textContent =
                "You have not submitted any complaints yet.";

            return;
        }

        snapshot.forEach(function (reportDocument) {

            const report = reportDocument.data();

            const reportCard = document.createElement("div");
            reportCard.className = "user-report-item";

            const idHeading = document.createElement("h4");

            idHeading.textContent =
                "Complaint ID: " + report.complaintId;

            const dateParagraph = document.createElement("p");

            dateParagraph.textContent =
                "Reported Date & Time: " +
                formatDateTime(report.reportedAt);

            const trackLink = document.createElement("a");

            trackLink.href = "track.html";
            trackLink.textContent = "Track this complaint";

            reportCard.appendChild(idHeading);
            reportCard.appendChild(dateParagraph);
            reportCard.appendChild(trackLink);

            userReportsList.appendChild(reportCard);
        });

    } catch (error) {

        console.error("Report history error:", error);

        userReportsList.textContent =
            "Unable to load your report history.";
    }
}


// Display user profile
async function showUserProfile(user) {

    authForms.hidden = true;
    profilePanel.hidden = false;

    if (accountNavLink) {
        accountNavLink.textContent = "My Profile";
    }

    try {

        const profileRef = doc(db, "users", user.uid);
        const profileSnapshot = await getDoc(profileRef);

        const profile = profileSnapshot.exists()
            ? profileSnapshot.data()
            : {};

        profileName.textContent =
            profile.fullName || user.displayName || "AquaCare User";

        profileEmail.textContent =
            "Email: " + (profile.email || user.email || "");

        profilePhone.textContent =
            "Phone: " + (profile.phone || "Not provided");

        await loadMyReports(user.uid);

    } catch (error) {

        console.error("Profile loading error:", error);

        showMessage(
            "Unable to load profile. Please refresh the page.",
            true
        );
    }
}




// SHOW CREATE ACCOUNT PAGE
function showSignupView() {

    authForms.hidden = false;
    profilePanel.hidden = true;

    signupForm.hidden = false;
    loginForm.hidden = true;

    if (accountNavLink) {
        accountNavLink.textContent = "Login / Profile";
    }
}


// SHOW USER LOGIN PAGE
function showLoginView() {

    authForms.hidden = false;
    profilePanel.hidden = true;

    signupForm.hidden = true;
    loginForm.hidden = false;

    if (accountNavLink) {
        accountNavLink.textContent = "Login / Profile";
    }
}


// SWITCH TO LOGIN
showLoginButton.addEventListener("click", function (event) {

    event.preventDefault();

    showLoginView();

    accountMessage.textContent = "";

});


// SWITCH TO SIGNUP
showSignupButton.addEventListener("click", function (event) {

    event.preventDefault();

    showSignupView();

    accountMessage.textContent = "";

});

// CREATE USER ACCOUNT
signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const button = signupForm.querySelector(
        "button[type='submit']"
    );

    const fullName = document.getElementById("signupName")
        .value.trim();

    const email = document.getElementById("signupEmail")
        .value.trim();

    const phone = document.getElementById("signupPhone")
        .value.trim();

    const password = document.getElementById("signupPassword")
        .value;

    button.disabled = true;
    button.textContent = "Creating Account...";

    try {

        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(result.user, {
            displayName: fullName
        });

        // Save user profile in Firestore
        await setDoc(
            doc(db, "users", result.user.uid),
            {
                fullName: fullName,
                email: email,
                phone: phone,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp()
            }
        );

        signupForm.reset();

        showMessage("Your AquaCare account has been created successfully!");

        await showUserProfile(result.user);

    } catch (error) {

        console.error("Registration error:", error);

        let message = "Unable to create your account.";

        if (error.code === "auth/email-already-in-use") {
            message = "This email is already registered. Please log in.";
        }
        else if (error.code === "auth/weak-password") {
            message = "Please choose a stronger password.";
        }
        else if (error.code === "auth/invalid-email") {
            message = "Please enter a valid email address.";
        }

        showMessage(message, true);

    } finally {

        button.disabled = false;
        button.textContent = "Create Account";
    }
});


// USER LOGIN
loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const button = loginForm.querySelector(
        "button[type='submit']"
    );

    const email = document.getElementById("loginEmail")
        .value.trim();

    const password = document.getElementById("loginPassword")
        .value;

    button.disabled = true;
    button.textContent = "Logging In...";

    try {

        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = result.user;

        const profileRef = doc(db, "users", user.uid);
        const profileSnapshot = await getDoc(profileRef);

        const profileUpdates = {
            email: user.email,
            lastLoginAt: serverTimestamp()
        };

        // Create a profile for an older account if needed
        if (!profileSnapshot.exists()) {

            profileUpdates.fullName =
                user.displayName || "AquaCare User";

            profileUpdates.phone = "";
            profileUpdates.createdAt = serverTimestamp();
        }

        await setDoc(profileRef, profileUpdates, {
            merge: true
        });

        loginForm.reset();

        showMessage("Login successful!");

        await showUserProfile(user);

    } catch (error) {

        console.error("Login error:", error);

        let message = "Login failed. Check your email and password.";

        if (error.code === "auth/invalid-credential") {
            message = "Incorrect email or password.";
        }
        else if (error.code === "auth/user-not-found") {
            message = "No account found. Please create an account.";
        }

        showMessage(message, true);

    } finally {

        button.disabled = false;
        button.textContent = "Login";
    }
});


// LOGOUT
logoutButton.addEventListener("click", async function () {

    try {

        await signOut(auth);

        showMessage("You have logged out successfully.");

    } catch (error) {

        console.error("Logout error:", error);

        showMessage("Unable to log out.", true);
    }
});


// Restore user session after page refresh

let authInitialized = false;

onAuthStateChanged(auth, function (user) {

    if (user) {

        showUserProfile(user);

    } else {

        // First visit: show Create Account
        // After logout: show User Login

        if (authInitialized) {
            showLoginView();
        } else {
            showSignupView();
        }
    }

    authInitialized = true;
});


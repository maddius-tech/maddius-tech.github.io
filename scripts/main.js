window.addEventListener("load", () => {
    // Load header and modal in parallel
    Promise.all([
        fetch("/components/header.html").then(res => res.text()),
        fetch("/components/auth-modal.html").then(res => res.text())
    ])
    .then(([headerHtml, modalHtml]) => {
        document.getElementById("header").innerHTML = headerHtml;
        document.getElementById("auth-modal-container").innerHTML = modalHtml;

        // Now that both parts are loaded, initialize Firebase auth & modal logic together
        initFirebaseAuth();
    })
    .catch(console.error);
});


async function initFirebaseAuth() {
    // Dynamically import Firebase modules
    const [
        { initializeApp, getApps }, 
        { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword }, 
        { getDoc, setDoc, doc, getFirestore }
    ] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"),
    ]);

    const firebaseConfig = {
        apiKey: "AIzaSyCqB4rgtDbAn-JUptBX4IXcn9cawFLta_M",
        authDomain: "code-for-seeb.firebaseapp.com",
        projectId: "code-for-seeb",
        storageBucket: "code-for-seeb.appspot.com",
        messagingSenderId: "91876432665",
        appId: "1:91876432665:web:e45e5ebf6c654124608388"
    };

    // Initialize Firebase app if not already initialized
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const auth = getAuth(app);
    const db = getFirestore(app);

    // DOM elements
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginEmailInput = document.getElementById("login-email");
    const loginPasswordInput = document.getElementById("login-password");
    const signupEmailInput = document.getElementById("signup-email");
    const signupPasswordInput = document.getElementById("signup-password");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const userDisplay = document.getElementById("current-user");
    const modal = document.getElementById("auth-modal");

    // Auth state change
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                //Create user document with default data
                await setDoc(userDocRef, {
                    email: user.email,
                    progress: {},
                    createdAt: new Date().toISOString(),
                });
            }

            userDisplay.textContent = `Logged in as ${user.email}`;
            loginBtn.style.display = "none";
            logoutBtn.style.display = "inline-block";
            if (modal) modal.style.display = "none";
        } else {
            userDisplay.textContent = "Not logged in";
            loginBtn.style.display = "inline-block";
            logoutBtn.style.display = "none";
            if (modal) modal.style.display = "none";
        }
    });

    //When login form is submitted
    loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, loginEmailInput.value, loginPasswordInput.value);
            loginForm.reset();
            if (modal) modal.style.display = "none";
        } catch (error) {
            alert(error.message);
        }
    });

    //When signup form is submitted
    signupForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, signupEmailInput.value, signupPasswordInput.value);
            signupForm.reset();
            if (modal) modal.style.display = "none";
        } catch (error) {
            alert(error.message);
        }
    });

    // Logout
    logoutBtn?.addEventListener("click", () => {
        signOut(auth).catch(console.error);
    });

    // Login
    loginBtn?.addEventListener("click", () => {
        if (modal) modal.style.display = "block";
    });
};

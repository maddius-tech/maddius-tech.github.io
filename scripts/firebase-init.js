const appPromise = (async () => {
    // Dynamically import Firebase modules
    const [
        { initializeApp, getApps }, 
        { getAuth }, 
        { getFirestore }
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

    return { auth, db };
})();

export default appPromise;
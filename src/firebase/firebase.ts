// // Importing necessary Firebase components
// import { auth } from '../firebase/firebase';
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Correct import

// // Initialize Google Auth Provider
// const provider = new GoogleAuthProvider();

// // Function to handle Google Sign-In
// export const handleGoogleSignIn = async () => {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     // The signed-in user info
//     const user = result.user;
//     console.log("User Info: ", user);
//     // You can also access the IdP token
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     // Perform additional actions here, like storing user info
//   } catch (error) {
//     console.error("Error during sign-in: ", error);
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     const email = error.email; // The email of the user's account used
//     const credential = GoogleAuthProvider.credentialFromError(error); // AuthCredential
//   }
// };

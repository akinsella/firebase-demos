import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, setDoc, query, where, orderBy, serverTimestamp } from "firebase/firestore"; 

const conf = {
    apiKey: "AIzaSyA_mTcrb-8mOU5T0w9mlMs-ikeU1T0aLJE",
    authDomain: "aki-firebase-demos.firebaseapp.com",
    projectId: "aki-firebase-demos",
    storageBucket: "aki-firebase-demos.appspot.com",
    messagingSenderId: "40346689099",
    appId: "1:40346689099:web:a482e483fa2e5aee4df7ce"
  };

const app = initializeApp(conf);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
    if (user != null) {
        console.log('logger in!');
    } else {
        console.log('No user');
    }
});


document.addEventListener('DOMContentLoaded', function() {
 
    const whenSignedIn = document.getElementById("whenSignedIn");
    const whenSignedOut = document.getElementById("whenSignedOut");

    const signInBtn = document.getElementById('signInBtn');
    const signOutBtn = document.getElementById('signOutBtn');

    const userDetails = document.getElementById('userDetails');

    const provider = new GoogleAuthProvider();

    signInBtn.onclick = () => signInWithPopup(auth, provider);

    signOutBtn.onclick = () => signOut(auth);

    auth.onAuthStateChanged(user => {
    if (user) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = "";
    }
    });

    const db = getFirestore(app);

    const thingsList = document.getElementById('thingsList');

    let unsubscribe;

    auth.onAuthStateChanged(user => {
        if (user) {
            const thingsRef = collection(db, 'things');

            createThing.onclick = () => {
                setDoc(doc(thingsRef), {
                    uid: user.uid,
                    name: faker.commerce.productName(),
                    createdAt: serverTimestamp()   
                });
            }


            const q = query(thingsRef, where('uid', '==', user.uid), orderBy('createdAt'));

            unsubscribe = onSnapshot(q, (querySnapshot) => {
                thingsList.innerHTML = querySnapshot.docs.map((doc) => {
                    return `<li>${doc.data().name}</li>`;
                }).join('');
              });

        } else {
            unsubscribe && unsubscribe();
        }
    });
});

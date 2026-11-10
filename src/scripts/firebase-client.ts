import {getApp,getApps,initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {firebaseConfig} from '../config/firebase';
export const firebaseApp=getApps().length?getApp():initializeApp(firebaseConfig);
export const firebaseAuth=getAuth(firebaseApp);
export const firebaseDb=getFirestore(firebaseApp);

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyD-sBtztuwItv-qau_J4y0S-B58PbOzHkA',
  authDomain: 'rosie-paws.firebaseapp.com',
  projectId: 'rosie-paws',
  storageBucket: 'rosie-paws.firebasestorage.app',
  messagingSenderId: '915217210112',
  appId: '1:915217210112:web:adabd9267ffeff944ff1e5',
  measurementId: 'G-N2ZCE51KDB'
}

const app = initializeApp(firebaseConfig)

const storage = getStorage(app)

export { storage }

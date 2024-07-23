# Cross-Platform React Native App

## Introduction

This is a cross-platform mobile app built with React Native and Expo, using Firebase as the backend.

## Features

- Cross-platform compatibility (iOS and Android)
- Firebase authentication
- Firebase Firestore database
- Push notifications
- Split Bills
- import contacts
- Share bills with your friends

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/2060k12/BillShareCrossPlatformApp.git

cd BillShareCrossPlatformApp

npm install
```

## Usage
To start the app with Expo:
```bash
expo start
```
Scan the QR code with the Expo Go app on your device to run the app.

## Firebase Setup
Create a Firebase project in the Firebase Console.
Add your Firebase configuration to a folder named config with firebaseConfig.js as the filename:
``` javascript
// config/firebaseConfig.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID'
};

const app = initializeApp(firebaseConfig);

export default app;
```


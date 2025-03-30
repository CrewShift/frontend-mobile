# 📱 CrewShift Mobile App

Reliable. Lightweight. Built for flight crews.  
The CrewShift mobile app delivers secure, real-time schedule access — with fast updates and a smooth native experience.

![image](https://github.com/user-attachments/assets/f9292327-a8e1-4959-bc0c-f5ada06b7a14)

---

## 🚀 Tech Stack

- ⚛️ **React Native CLI** – full native app (no Expo)
- 🧭 **React Navigation** – routing and screen transitions
- 🎨 **Custom Stylesheets** – manual styling with StyleSheet API
- 🔗 **Axios** – HTTP client for backend communication
- 🔔 **Push Notifications (optional)** – real-time access alerts
- 🗂️ **AsyncStorage** – local storage for session tokens

---

## 🌐 Features

- 🔐 Secure login with rotating access codes
- 📬 Real-time token + schedule notifications
- 🖥️ Device/session log viewer (basic)
- 📱 Optimized for Android & iOS
- 🌙 Dark mode ready

---

## 🛠️ Project Structure

src/  
├── screens/  
├── components/  
├── services/  
├── utils/  
└── App.tsx

---

## How To Use It

You can just fork or clone this repository and build it with the React Native CLI.

✨ It just works. ✨

---

## 🔧 Setup

```bash
pnpm install
npx react-native run-android   # for Android
npx react-native run-ios       # for iOS
Make sure to configure .env with your backend and notification settings:

env
Copy
Edit
API_URL=https://yourbackend.com
FIREBASE_CONFIG=...
📦 Build & Deploy
Android (APK or Bundle)
bash
Copy
Edit
cd android
./gradlew assembleRelease
iOS (Xcode)
Open ios/ in Xcode and run archive for App Store submission.

🧪 Testing
Manual device testing is the primary focus for this MVP.
UI test automation may be introduced later using Detox or Jest + React Native Testing Library.

📄 License
The Mobile App is licensed under the terms of the MIT license.

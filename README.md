# ![Group 251](https://github.com/user-attachments/assets/f14c059e-b88d-447f-915f-72391549ee60)
## 📖 About Brevio

Welcome to the **Brevio**. This mobile app, built with React Native and Expo, takes advantage of powerful AI capabilities to provide insights from large documents and any related image with text. The application is adaptable and can work in any language, including handwriting and upside down text. Avoid spending hours reading a document that may not be relevant to your research. Scan in and determine in seconds if the document is for you by receiving a brief summary of the document.

## 🧠 About the Project

This project had an open brief that required the use of open-source AI. For my project, I created a scanning app that gives users a brief summary of their documents. To accomplish this, I used two AI models to help extract and summarise text from images, resulting in efficient document insights.

- **[Google Vision]:** This AI is in charge of image recognition and is capable of extracting the words from the image and displaying them in back for the user.
- **[OpenAI]:** This AI is in charge of taking the extracted words and turning them into a summary. so that the user can easily read what the document is about.

## 🛠️ Built With

- **React Native** - For cross-platform mobile development
- **Expo** - To streamline development and simplify testing
  - **Image Picker** - For selecting images from the user's library or camera
  - **File System** - To handle file operations within the app
- **Axios** - For making HTTP requests to APIs
- **Firebase** - Backend-as-a-Service for app data management and authentication
  - **Firestore** - For storing and retrieving user data in real-time
  - **Firebase Auth** - For handling user authentication and managing sessions
- **react-native-config** - For managing environment variables securely
- **react-native-vector-icons** - Provides customizable icons for React Native
- **React Navigation** - For navigation within the app
  - **Native Stack Navigator** - To manage screen transitions
- **Custom Services**
  - **Image Upload Service** - Handles image uploading to cloud storage
  - **Auth Service** - Manages user login functionality
  - **Create User Service** - Adds new users to Firestore

## 🚀 Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

Ensure you have the following installed:

- **Node.js** - [Download Here](https://nodejs.org/)
- **Expo CLI** - Install via `npm install -g expo-cli`

### Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/EmilioCarreiraOWI/DV300_Term-4_Project.git
    ```

2. **Navigate to Project Directory:**

    ```bash
    cd Brevio
    ```

3. **Install Dependencies:**

    ```bash
    npm install
    ```

4. **Run the App:**

    ```bash
    npx expo start
    ```

5. **Access on Your Device:**

   Use the Expo Go app on iOS or Android to scan the QR code and preview the app.
   
## 📷 Mockups

<img width="1500" alt="iPhone 15 Pro 9" src="https://github.com/user-attachments/assets/0580bd2b-998a-475e-80fe-2e8454bf9aa7">
<img width="1500" alt="iPhone 15 Pro 3" src="https://github.com/user-attachments/assets/4de6ed5e-956b-4562-93ed-d269d07e034f">
<img width="1500" alt="iPhone 15 Pro 2" src="https://github.com/user-attachments/assets/5b6b1089-4004-4feb-bf52-29cc706f9f8d">
<img width="1500" alt="iPhone 15 Pro 6" src="https://github.com/user-attachments/assets/030c390d-c58a-4608-b28e-b026790121b9">
<img width="1500" alt="iPhone 15 Pro 1" src="https://github.com/user-attachments/assets/5e298680-cd64-4914-84e2-2356bb8a7f59">

## 👥 Peer Review

Feedback from peers is invaluable to refining and enhancing this project. Feel free to review the code, explore the app, and share your insights. Here are some suggested areas for feedback:

- **User Experience and Experience**:
  - How easy is the app's interface for first-time users? Are there any parts of the navigation or feature discovery that feel unclear or complicated?
  - Are there any UI elements that could be improved to provide a more streamlined user experience, particularly when scanning documents?
    
- **Functionality and Reliability**:
  - How reliable is the scanning feature? Is there a problem with document clarity, edge detection, or image quality after scanning?
  - Have you experienced any bugs or crashes? If so, could you please explain the circumstances?
    
- **Performance and Speed**:
  - Does the app feel responsive while scanning, processing, and saving? Is there any noticeable lag or delay?
  - Do you think there are any areas where performance could be improved for a better experience?
    
- **Features and Enhancements**:
  - Are there any features you believe would improve the app's usability or functionality?
  - Do you believe the app meets the needs of its target audience? If not, what additional functionality do you recommend?
    
- **Overall Impression and Suggestions**:
  - What is your overall impression of the application? Does it feel polished and ready for end users?
  - Do you have any other suggestions for improving the app's functionality or user experience?

Please submit your feedback through [GitHub Issues](https://github.com/EmilioCarreiraOWI/DV300_Term-4_Project/issues) or email me directly at [221350@virtualwindow.co.za].

### [Marine Du Plessis](https://github.com/DupieM)

- **User Experience and Experience**:
  - "It was a very easy to understand as a first time user. No none of the navigation  felt unclear for me. Maybe just change the color of the buttons text to not be white you can't see it very well."
    
- **Functionality and Reliability**:
  - "The scanning feature is very reliable and very fun to use. Their was no problem for me with the scanning feature. I did experience a crash/bug, when I change the folder name from default to something else and    
then click on upload the app then closes."

- **Performance and Speed**:
  - "There was no noticeable lag with how responsive it is when scanning. No, I do not think there is any area to improve the performance."
    
- **Features and Enhancements**:
  - "Maybe the way you enter enter name seeing that someone can use the same name again and again. Yes, I believe that the app meets the target audience that it is minted to be for."
    
- **Overall Impression and Suggestions**:
  - "My overall impression of the app was very exciting for the features that was implemented. I feel their might be some polishing needed with button text colours, other than that it is ready for end users. No, I do not have anything to give for improvements of the app."
  
### [Nico Van Wyk](https://github.com/Pantonym)

- **User Experience and Experience**:
  - "The app's UI was easy to understand, even as a user with no context as to what the app does. The buttons were named well, but you could maybe add a label above/below each to explain what they do for users who struggle."
  - "When scanning documents, a hidden label might be made visible with text like "scroll down to see text" to let the user know the text has been scanned"
    
- **Functionality and Reliability**:
  - "The scanning feature was extremely reliable, however it did pick up text that is not a part of the document. To solve this, you could just add a label telling the user to place the text on a surface with no text such as a table, or to crop out all text they dont want scanned."
  - "The app crashed when I uploaded a different named entry."
    
- **Performance and Speed**:
  - "There was no noticeable lag or delay."
  - "I cannot think of an area where performance could be improved."
    
- **Features and Enhancements**:
  - "A way to edit the name of the entry you added, as someone might accidentally add multiple default-folder names."
  - "The app definitely meets the audience's needs, it was a quick and easy way to both turna  document into text and summarise it."
    
- **Overall Impression and Suggestions**:
  - "The app feels polished, and was very impressive to see. The only improvement would be to add editing functionality to the title if it isn't already added."

### [Anke Du Raan](https://github.com/AnkeatOpenWindow)

- **User Experience and Experience**:
  - "It was easy to use the app. especially with the button on the home screen, navigating you to the scan screen. I would maybe change "File" to "Your Files". Maybe the "Analyze image", "Upload data", and "rest" buttons can be hidden until the user uploads or picks a image with text or even make them appear as of they are disabled. The headings on each page kind of looks like buttons which would make people want to tap on it."
    
- **Functionality and Reliability**:
  - "Scanning feature is reliable and works perfectly."
    
- **Performance and Speed**:
  - "No lagging on my side but I did added a commit about the UI."
    
- **Features and Enhancements**:
  - "Maybe add a function where when you add a name of the document it checks if there is a file with the same name. If none then the file saves of there are the user will be notified."
    
- **Overall Impression and Suggestions**:
  - "Feature are ready for usage just refer to the comment on about the UI. Other then that well done."

## 🎓 References

### How to Implement OpenAI Turorial:
- Coursedotcom. (2023, January 10). *How to implement AI in React Native using OpenAI API*. YouTube. https://www.youtube.com/watch?v=jizE-mWtaF4

### How to Implement Google Vision Tutorial:
- TechWithTim. (2023, February 14). *AI services in React Native with Expo tutorial*. YouTube. https://www.youtube.com/watch?v=iir0ezSvRLw

## 🖇️ Contact

- **Emilio Carreira** - [LinkedIn](https://www.linkedin.com/in/emilio-carreira-b79797333/) - [Email](221350@virtualwindow.co.za)
- **Demo Walkthough Video**: [https://github.com/yourusername/your-repo-name](https://github.com/yourusername/your-repo-name)

---

Enjoy using **Brevio**! If you have any suggestions or improvements, feel free to contribute.

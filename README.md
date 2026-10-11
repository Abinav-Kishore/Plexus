Plexus — Student Dashboard Platform

Plexus is a centralized student dashboard designed to simplify academic resource management, campus announcements, and administrative workflows through a unified web and mobile experience.

Overview

Students often rely on multiple platforms to access academic information, track announcements, and stay updated on institutional activities. Plexus aims to bring these essential workflows into one accessible platform, while providing administrators with tools to manage information efficiently.

Features
Centralized Dashboard: Access academic resources, announcements, and relevant student information from one place.
Role-Based Access Control: Separate student and administrator access to protected features and workflows.
Academic Resource Management: Organize and access academic materials through a unified interface.
Announcements: Provide a centralized way to communicate important updates.
Administrative Workflows: Support authorized management of student-facing information.
Responsive Interface: Designed for convenient access across supported web and mobile devices.
Tech Stack
Frontend: React, React Native, HTML, CSS
Backend: Node.js, Express.js
Database: MongoDB
Communication: REST APIs
Authentication & Authorization: Role-based access control
Architecture

Plexus follows a client-server architecture:

The frontend provides the student and administrator interfaces.
The backend handles application logic and API requests.
The database stores application data and academic resources.
Authentication and authorization rules restrict access to protected operations.
Getting Started
Prerequisites
Node.js and npm
Git
MongoDB, if used by the configured backend
Installation

Clone the repository:

git clone https://github.com/Abinav-Kishore/Plexus.git
cd Plexus


Install dependencies:

npm install


Start the application using the command configured in package.json:

npm start


For an Expo-based application, follow the Expo CLI instructions provided by the project configuration.

Future Improvements
Add automated testing for authentication and protected routes.
Improve accessibility and mobile responsiveness.
Introduce monitoring and structured error logging.
Add pagination and search for larger collections of academic resources.
Contribution

Contributions, bug reports, and suggestions are welcome.

License

Add the appropriate license information for this project.

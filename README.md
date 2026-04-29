# Thor 6-DOF Robotic Arm Simulation 🤖

A web-based 3D interactive simulation of the open-source Thor 6-Degree-of-Freedom (6-DOF) robotic arm. Built with modern web technologies, this project provides a premium, responsive interface to explore robotic kinematics and teleoperation without needing physical hardware.

🌐 **Live Deployment**: [View Simulation Here](https://robotics-project-self.vercel.app/)

## Features ✨

- **High-Fidelity 3D Environment**: Powered by Three.js with realistic lighting, shadows, and orbit controls.
- **Accurate Kinematics**: Faithfully replicates the physical Thor arm's `yaw-roll-roll-yaw-roll-yaw` configuration. Every joint moves dynamically based on user input.
- **Interactive Teleoperation**: A modern glassmorphism UI dashboard allows you to manipulate all 6 axes in real-time.
- **Pick and Place**: Includes a fully functional gripper mechanism. You can maneuver the arm to pick up objects from the environment and drop them in new locations!
- **Premium Aesthetics**: Designed with a sleek dark mode and vibrant accents for a modern engineering tool feel.

## Tech Stack 🛠️

- **3D Rendering**: [Three.js](https://threejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Core**: Vanilla JavaScript, HTML5, and CSS3

## Running Locally 🚀

If you want to run or modify this project on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Devyansh2005/Robotics-Project.git
   cd Robotics-Project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173/` to interact with the simulation.

## About the Thor Robot

This software simulation is inspired by the **Thor Robot**, an open-source, 3D printable, 6-DOF robotic arm originally designed for educational purposes and makers.

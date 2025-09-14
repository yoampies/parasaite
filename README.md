

# ParasAIte 🦠

**ParasAIte** is an interactive web application for the visualization, analysis, and educational exploration of human intestinal parasites. It provides tools for scanning images, viewing epidemiological dashboards, and accessing detailed information about various parasites. The mobile version is being built.

## ✨ Features

- 🔬 **Image Scanner:** Upload and analyze images to detect parasites using simulated detection and confidence levels.
- 📊 **Epidemiological Dashboard:** Visualize weekly statistics, charts, and key data about parasite detection and epidemiology.
- 📚 **Parasite Library:** Explore detailed profiles of common parasites, including life cycle, morphology, and clinical relevance.
- 🧬 **3D Models:** Interactive 3D models for parasite visualization (GLB format).
- 🕒 **History & Feedback:** Track previous analyses and provide feedback on results.

## 🛠️ Technologies Used

- ⚛️ **React**: UI library for building interactive interfaces
- ⚡ **Vite**: Fast development and build tool
- 🎨 **Tailwind CSS**: Utility-first CSS framework for styling
- 📈 **D3.js**: Data visualization library for charts
- 🧩 **Three.js & @react-three/fiber/drei/postprocessing**: 3D rendering and model interaction
- 🌀 **GSAP**: Animation library for smooth transitions
- 🗺️ **React Router**: Routing and navigation
- 🧹 **ESLint**: Linting and code quality

## 📁 Project Structure

- `src/sections/` – Main pages (Home, Scanner, Library, ParasiteDetails, etc.)
- `src/components/` – Reusable UI components (charts, cards, uploader, etc.)
- `src/assets/` – Constants, images, and data
- `public/models/` – 3D parasite models (GLB)
- `public/images/` – Parasite and analysis images
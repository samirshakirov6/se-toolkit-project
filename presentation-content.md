# Presentation Slides Content

## Slide 1: Title
**Product Title:** Workout Tracker  
**Name:** Samir Shakiorv  
**University Email:** sa.shakirov@innoplois.university  
**Group:** CSE-04  

---

## Slide 2: Context
**End-User:**  
Gym-goers and home workout enthusiasts who want to track their training without friction.

**Problem Solved:**  
Most fitness apps require tedious manual form-filling and complex navigation, which discourages consistent logging and long-term progress tracking.

**Product Idea (1 sentence):**  
A minimal, fast web app that lets users instantly log workouts, visualize strength progress, and track personal records in one place.

---

## Slide 3: Implementation
**How We Built It:**  
Fullstack architecture: React + Bootstrap + Chart.js (frontend), Node.js + Express (backend), SQLite via `sql.js` (database), JWT + bcrypt for secure authentication, and RESTful API design.

**Version 1:**  
Core workout logging (exercise, weight, sets, reps), basic workout history view, local client-side data handling.

**Version 2:**  
Multi-user JWT authentication, user-specific data isolation, interactive progress charts, personal records tracking, weekly training volume analytics, production-ready deployment config (PM2 + Nginx + SSL support).

**TA Feedback Addressed:**  
- Added proper input validation & error handling for empty/duplicate exercises  
- Implemented strict user-data isolation to prevent cross-user data leakage  
- Improved UI responsiveness for mobile logging  
- Added deployment documentation and environment configuration  

---

## Slide 4: Demo
**Pre-recorded Video Demonstration (v2) with Voice-Over**  
*[Insert video or link to YouTube/Drive]*  
*(≤ 2 minutes: registration → add workout → history → progress charts → volume analytics)*

---

## Slide 5: Links
**GitHub Repository:**  
https://github.com/samirshakirov6/se-toolkit-project  

**Deployed Product (Latest Version):**  
*[http://your-vm-ip:5000 or your custom domain]*  

**QR Codes:**  
*[Generate and paste QR for GitHub]*  
*[Generate and paste QR for deployed app]*  

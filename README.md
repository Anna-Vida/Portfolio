Anna Patricia Vida — Portfolio

A modern, responsive personal portfolio website built with React + Vite.

This portfolio showcases my projects, experience, technical skills, certifications, and contact information, with interactive UI features inspired by modern developer portfolios.

Live Portfolio

Add your deployed portfolio URL here after hosting:

https://your-portfolio-url.com

Features

Responsive single-page portfolio

Modern dark / light editorial layout

Animated hero section

Selected projects showcase

About section with animated technology orbit

Work experience and education section

Animated two-row technology wall

Click-to-flip skill cards

Certifications section

Contact section

Downloadable resume

Custom cursor

Fullscreen mode

Compact view

Dark accent themes

Reset appearance option

LocalStorage support for saved appearance preferences

Mobile-friendly design

Appearance Settings

The portfolio includes an interactive settings panel.

Visitors can customize:

Full screen

Compact view

Accent theme

Custom cursor visibility

Available accent themes include:

Original

Ember

Forest

Midnight

Burgundy

Plum

The Original theme restores the default black, white, gray, and off-white design.

Appearance preferences are stored using browser localStorage, so the selected settings remain after refreshing or revisiting the website from the same browser.

Tech Stack

Frontend

React

JavaScript

Vite

CSS3

React Icons

Technologies Highlighted in the Portfolio

Mobile

React Native

Jetpack Compose

Ionic

Flutter

Dart

Android Studio

Frontend

React.js

Next.js

TypeScript

JavaScript

HTML5

Tailwind CSS

Vite

Material UI

Redux

Backend & APIs

Node.js

PHP

REST APIs

GraphQL

Python

Java

Kotlin

C/C++

Databases

Supabase

PostgreSQL

Firebase

MySQL

SQLite

Cloud & Tools

Git

GitHub

Docker

CI/CD

AWS

Cypress

Playwright

Linux

Bash

GitHub Copilot

Cursor

AI, IoT & Security

TensorFlow Lite

Edge Computing

OCR

Image Recognition

Arduino

Raspberry Pi

Wearable Technology

Featured Projects

EchoWear

A smart wearable glove designed for two-way Filipino Sign Language communication using ESP32 hardware, motion sensors, machine learning, and real-time translation.

Technologies: React Native, ESP32, TensorFlow Lite, Supabase, IoT

PocketHive

An AI-powered personal finance application for expense tracking, budgeting, bill management, and financial insights.

Technologies: Mobile Development, Firebase, AI, Authentication

Medimate

A healthcare-focused mobile application centered around accessible workflows and intelligent health-related functionality.

Technologies: Mobile Development, Healthcare, AI

Portfolio Sections

The website currently contains:

Home

Selected Work

About

Experience

Skills

Certifications

Contact

Getting Started

Requirements

Make sure you have installed:

Node.js

npm

VS Code

Check your Node.js installation:

node --version
npm --version

Installation

Clone the repository:

git clone https://github.com/Anna-Vida/YOUR-PORTFOLIO-REPOSITORY.git

Open the project folder:

cd YOUR-PORTFOLIO-REPOSITORY

Install dependencies:

npm install

Start the development server:

npm run dev

Vite will display a local development URL, usually:

http://localhost:5173

Build for Production

Create a production build:

npm run build

Preview the production build:

npm run preview

The generated production files will be placed inside:

dist/

Project Structure

Portfolio/
├── public/
│   └── Anna-Patricia-Vida-Resume.pdf
│
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js

Resume

The downloadable resume is stored inside the public directory:

public/Anna-Patricia-Vida-Resume.pdf

It is linked from the portfolio using:

/Anna-Patricia-Vida-Resume.pdf

LocalStorage

The portfolio currently stores UI preferences using the following browser storage keys:

portfolio-accent-color
portfolio-compact-view
portfolio-show-cursor

The Reset appearance button clears these saved preferences and restores the original portfolio appearance.

Deployment

This Vite portfolio can be deployed on platforms such as:

Vercel

Netlify

GitHub Pages

Cloudflare Pages

Vercel

Typical build settings:

Framework Preset: Vite
Build Command: npm run build
Output Directory: dist

Netlify

Typical build settings:

Build Command: npm run build
Publish Directory: dist

Social Links

GitHub: https://github.com/Anna-Vida

LinkedIn: https://www.linkedin.com/in/annavida12/

Author

Anna Patricia Vida

Information Technology graduate and software developer based in Quezon City, Philippines.

Focused on:

Mobile development

Full-stack systems

Artificial intelligence

IoT

Computer vision

Embedded systems

Wearable technology

Offline-first applications

License

This portfolio is intended for personal portfolio use.

You may use the code as a learning reference, but please do not copy personal information, project descriptions, branding, or portfolio content without permission.

Built with React, Vite, and a lot of tiny CSS decisions.
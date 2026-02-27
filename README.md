# RuleWise - Intelligent Event Monitoring Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://rulewise.vercel.app)
[![GitHub](https://img.shields.io/badge/repo-github-blue)](https://github.com/shreyashitole02/rulewise)

> A full-stack event monitoring system that enables real-time business rule evaluation and automated alert generation.

## 🌐 Live Demo

**Frontend:** [https://rulewise.vercel.app](https://rulewise.vercel.app)  
**Backend API:** [https://rulewise-backend.onrender.com](https://rulewise-backend.onrender.com)

> **Note:** First load may take 30-60 seconds as the free-tier backend wakes up from sleep mode.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Use Cases](#use-cases)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

RuleWise is an intelligent event monitoring platform that allows users to define custom business rules and automatically detect violations in real-time. The system evaluates incoming events against active rules and generates instant alerts when conditions are met.

### Key Highlights

- ⚡ **Real-time Processing:** Sub-100ms rule evaluation
- 🚀 **Rule Templates:** Pre-built templates for common use cases
- 📱 **Responsive Design:** Works seamlessly on all devices

---

## ✨ Features

### Rule Management
- Create custom rules with multiple operators
- Use pre-built templates for quick setup
- Enable/disable rules with toggle switches
- Search and filter rules in real-time

### Event Processing
- Submit events via intuitive form interface
- Dynamic field addition for flexible payloads
- Automatic type conversion (string/number)
- Real-time rule evaluation on submission
- Instant alert generation on violations

### Alert Dashboard
- View all triggered alerts with full context
- Display rule conditions and event payloads
- Real-time alert count

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend + Database hosting
- **GitHub** - Version control

### Development Tools
- **Git** - Version control
- **Postman** - API testing
- **pgAdmin** - Database management
- **VS Code** - Code editor

---

## 🏗️ System Architecture

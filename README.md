# E-Commerce Web Application – Three-Tier & Serverless Architectures

This repository contains the code and documentation for my master’s thesis project titled **"A Three-Tier Client-Server Architecture for An E-Commerce Web Application Utilising Serverless Technology"**. The project demonstrates a scalable, cost-effective, and flexible e-commerce platform developed first as a traditional three-tier client-server application and later migrated to a serverless cloud architecture using AWS services.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architectures](#architectures)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Contact](#contact)

## Overview

This project addresses the challenges of traditional e-commerce platforms by implementing:

- A **Three-Tier Client-Server Architecture** using the MERN stack (MongoDB Atlas, Node.js with Express.js, and React.js).
- A migration to a **Serverless Cloud Architecture** using AWS Lambda for the backend and AWS Amplify for hosting the frontend.

The aim is to create an application that automatically scales to handle high traffic, reduces operational costs by leveraging a pay-per-use model, and provides a flexible environment for both customers and merchants.

## Features

- **User Management:**

  - Customer and Merchant Sign Up / Login
  - Secure authentication using JSON Web Tokens and bcrypt for password hashing

- **Product Catalogue:**

  - View, add, edit, and delete products (merchant functionality)
  - Browse and search products (customer functionality)

- **Order Processing:**

  - Shopping basket management and order placement for customers
  - Order tracking and fulfillment for merchants

- **Serverless Migration:**
  - Backend services deployed as AWS Lambda functions
  - Frontend hosted on AWS Amplify for continuous integration and delivery

## Architectures

### Three-Tier Client-Server Architecture

- **Presentation Layer:**  
  Built with React.js providing a responsive user interface.
- **Application Layer:**  
  Node.js with Express.js handles business logic and RESTful API endpoints.
- **Database Layer:**  
  MongoDB Atlas is used to store and manage data.

### Serverless Cloud Architecture

- **Backend Migration:**  
  The business and data layers are deployed as serverless functions using AWS Lambda (packaged with an AWS Lambda Web Adapter).
- **Frontend Hosting:**  
  AWS Amplify is used to host the React.js application, enabling automatic scaling and CI/CD.
- **Infrastructure as Code:**  
  AWS CDK is used to define and deploy cloud infrastructure.

These architectural decisions are discussed in detail in the project report :contentReference[oaicite:0]{index=0}.

## Technologies Used

- **Frontend:** React.js, Redux, HTML, CSS
- **Backend:** Node.js, Express.js, AWS Lambda, AWS CDK
- **Database:** MongoDB Atlas (NoSQL)
- **Cloud Services:** AWS Amplify, AWS Lambda, AWS Secrets Manager
- **Other Tools:** JSON Web Tokens, bcrypt.js for authentication

## Prerequisites

- Node.js (v14 or above)
- npm or yarn
- AWS CLI (for deploying the serverless version)
- AWS CDK installed globally

## Contact

Metehan Sahin  
Email: [your.email@example.com](mailto:your.email@example.com)  
LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/yourprofile)  
GitHub: [https://github.com/yourusername](https://github.com/yourusername)

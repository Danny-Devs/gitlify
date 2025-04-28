# APIBuddy

<div align="center">
  <img src="public/apibuddy-logo-light.svg" alt="APIBuddy Logo" width="200"/>
  <p>A powerful API testing and management platform</p>
</div>

## 🚀 Overview

APIBuddy is an all-in-one platform for API testing, management, and monitoring. It enables developers to efficiently create, test, and manage API requests with a user-friendly interface. Whether you're integrating third-party services, building your own APIs, or just need to test endpoints, APIBuddy simplifies your workflow.

### ✨ Key Features

- **API Request Testing**: Test API endpoints with support for all HTTP methods
- **Request Templates**: Save and reuse common API requests
- **Multiple Authentication Methods**: Support for Bearer tokens, Basic auth, and API keys
- **API Key Management**: Create and manage API keys with usage tracking
- **Request History**: Automatically log your API requests for future reference
- **Dark/Light Mode**: Flexible UI that adapts to your preference
- **Secure by Design**: Built with Row Level Security to keep your data private

## 📋 Table of Contents

- [APIBuddy](#apibuddy)
  - [🚀 Overview](#-overview)
    - [✨ Key Features](#-key-features)
  - [📋 Table of Contents](#-table-of-contents)
  - [🔧 Installation](#-installation)
  - [🌍 Environment Setup](#-environment-setup)
  - [💻 Usage](#-usage)
    - [API Tester](#api-tester)
    - [API Key Management](#api-key-management)
    - [Request Templates](#request-templates)
  - [🔒 Security](#-security)
  - [🛠️ Technology Stack](#️-technology-stack)
  - [📄 License](#-license)

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/apibuddy.git
cd apibuddy

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🌍 Environment Setup

Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 💻 Usage

### API Tester

The API Tester provides a user-friendly interface to make API requests:

1. Select an HTTP method (GET, POST, PUT, DELETE, etc.)
2. Enter the request URL
3. Add authentication if required (Bearer token, Basic auth, or API key)
4. Add headers and request body as needed
5. Click "Send Request" to execute
6. View the response with formatted JSON and headers

You can also save frequently used requests as templates for future use.

### API Key Management

Create and manage API keys for your applications:

1. Navigate to the API Keys dashboard
2. Click "New Key" to create a new API key
3. Specify a name and type (development or production)
4. Optionally set monthly usage limits
5. Use the created API keys in your applications
6. Monitor usage statistics for each key

### Request Templates

Save time by creating templates for common API requests:

1. Configure a request in the API Tester
2. Click "Save Current" in the Templates sidebar
3. Give your template a descriptive name
4. Access and run your saved templates anytime from the sidebar

## 🔒 Security

APIBuddy implements Supabase Row Level Security (RLS) to ensure:

- Users can only access their own data
- API keys are properly isolated between users
- Request history is private to each user
- All sensitive data is protected by proper access policies

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **API**: RESTful architecture
- **Authentication**: Supabase Auth

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>
    <strong>Available in light and dark modes</strong><br/>
    <img src="public/apibuddy-logo-light.svg" alt="Light Mode Logo" width="40"/>
    <img src="public/apibuddy-logo-dark.svg" alt="Dark Mode Logo" width="40"/>
  </p>
  <p>Built with ❤️ by Danny Devs</p>
</div>

# APIBuddy API Tester

A powerful API testing tool built into APIBuddy that allows you to test API endpoints with various authentication methods, save request templates, and track request history.

## Features

- **API Request Builder**: Configure API requests with different HTTP methods, headers, and body content
- **Authentication Support**: Test APIs with various authentication methods:
  - Bearer token authentication
  - Basic authentication
  - API key authentication (header or query parameter)
- **Request Templates**: Save and reuse API requests for faster testing
- **Response Visualization**: View API responses with formatted JSON, HTML, and text content
- **Performance Tracking**: Monitor response times and sizes
- **History Tracking**: Keep a history of API requests and responses for debugging and analysis

## Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account for database storage

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Setup

1. Create a new Supabase project
2. In the Supabase SQL editor, run the SQL script located at `app/lib/supabaseSchema.sql` to set up the required tables and functions

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Usage

1. Navigate to `/api-tester` in your browser
2. Configure your API request:
   - Select an HTTP method (GET, POST, PUT, etc.)
   - Enter the API URL
   - Add authentication details if required
   - Configure headers and request body
3. Click "Send" to execute the request
4. View the response in the Response panel
5. Save the request as a template for future use

## Adding API Keys

1. Navigate to the API Keys section
2. Click "Create New API Key"
3. Give your key a name and configure any limits
4. Use the API key ID when making requests to track usage

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

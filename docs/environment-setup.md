# Environment Variables Setup Guide

This guide explains how to set up the required environment variables for the CodeGrok application.

## Core Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/gistofgit?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-strong-random-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
**GITHUB_CLIENT_SECRET**="your-github-client-secret"
```

## Setting Up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the application details:
   - **Application name**: CodeGrok
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. Register the application
5. Copy the Client ID to `GITHUB_CLIENT_ID` in your `.env` file
6. Generate a new client secret and copy it to `GITHUB_CLIENT_SECRET`

## Generating NEXTAUTH_SECRET

For security, generate a strong random string for `NEXTAUTH_SECRET`. You can use the following command:

```bash
openssl rand -base64 32
```

Copy the output to the `NEXTAUTH_SECRET` variable in your `.env` file.

## Database Configuration

The `DATABASE_URL` should point to your PostgreSQL database. Modify it according to your setup:

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

- Replace `USERNAME` and `PASSWORD` with your database credentials
- Replace `HOST` and `PORT` with your database server details (default: localhost:5432)
- Replace `DATABASE` with your database name (default: gistofgit)

## Development vs Production

For production environments, ensure:

- Use HTTPS URLs for `NEXTAUTH_URL`
- Use a properly secured database connection
- Set strong, unique secrets for all credentials

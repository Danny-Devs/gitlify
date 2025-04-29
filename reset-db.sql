-- Drop existing NextAuth tables if they exist
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "verification_tokens" CASCADE;

-- Other application tables
DROP TABLE IF EXISTS "api_keys" CASCADE;
DROP TABLE IF EXISTS "repositories" CASCADE;
DROP TABLE IF EXISTS "analyses" CASCADE;
DROP TABLE IF EXISTS "analysis_results" CASCADE;
DROP TABLE IF EXISTS "file_analyses" CASCADE;
DROP TABLE IF EXISTS "templates" CASCADE;
DROP TABLE IF EXISTS "llm_configurations" CASCADE;

-- This will let Prisma recreate all tables from scratch 
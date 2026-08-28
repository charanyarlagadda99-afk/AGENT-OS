-- Migration 005: Security Fixes for Supabase Linter Warnings

-- 1. Fix RLS Policy Always True on organizations (org_insert)
-- Replace unrestricted WITH CHECK (true) with validation requiring non-empty organization name & slug
DROP POLICY IF EXISTS "org_insert" ON organizations;
CREATE POLICY "org_insert" ON organizations 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    length(trim(name)) > 0 AND 
    length(trim(slug)) > 0 AND
    (SELECT auth.uid()) IS NOT NULL
  );

-- 2. Fix Executable SECURITY DEFINER Functions (is_org_member & get_org_role)
-- Revoke direct PostgREST RPC EXECUTE permissions from anon and PUBLIC roles
-- This prevents unauthenticated or anonymous API callers from directly invoking these functions via /rest/v1/rpc/*
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_org_role(uuid) FROM PUBLIC, anon;

-- Grant execution to authenticated role (required for RLS policy evaluation in Postgres queries)
-- and service_role for backend administrative tasks
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_org_role(uuid) TO authenticated, service_role;

-- Set search_path explicitly on security definer functions to prevent search_path hijacking
ALTER FUNCTION public.is_org_member(uuid) SET search_path = public;
ALTER FUNCTION public.get_org_role(uuid) SET search_path = public;

-- Migration 005: Security Fixes for Supabase Linter Warnings

-- 1. Fix RLS Policy Always True on organizations (org_insert)
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
-- Revoke direct PostgREST RPC EXECUTE permissions from PUBLIC, anon, and authenticated roles.
-- This prevents any client from invoking these helper functions directly via /rest/v1/rpc/* HTTP endpoints,
-- while allowing PostgreSQL RLS policy evaluations to call them internally.
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_org_role(uuid) FROM PUBLIC, anon, authenticated;

-- Grant execution only to service_role for elevated backend admin execution
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_org_role(uuid) TO service_role;

-- Set search_path explicitly on security definer functions
ALTER FUNCTION public.is_org_member(uuid) SET search_path = public;
ALTER FUNCTION public.get_org_role(uuid) SET search_path = public;

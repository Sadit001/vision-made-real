DROP POLICY IF EXISTS "Public resolves valid letter address" ON public.profiles;
REVOKE SELECT ON public.profiles FROM anon;
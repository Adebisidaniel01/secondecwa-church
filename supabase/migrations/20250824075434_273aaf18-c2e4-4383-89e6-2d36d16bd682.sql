-- Ensure pgcrypto is available to compute SHA-256
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update admin password to SHA-256 hash of 'ECWA_123' to match edge function logic
UPDATE admin_settings
SET password_hash = encode(digest('ECWA_123', 'sha256'), 'hex');
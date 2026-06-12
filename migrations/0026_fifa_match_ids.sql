-- Link internal matches to FIFA Match Centre ids (Mexico vs South Africa opener)
UPDATE matches SET fifa_match_id = '400021443', updated_at = datetime('now')
WHERE id = 'm-w26-ga-1v2';

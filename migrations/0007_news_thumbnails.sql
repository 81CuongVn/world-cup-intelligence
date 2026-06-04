ALTER TABLE source_documents ADD COLUMN thumbnail_url TEXT;
ALTER TABLE source_documents ADD COLUMN hot_score REAL DEFAULT 0;

UPDATE source_documents
SET hot_score = COALESCE(reliability_score, 0.5)
WHERE hot_score IS NULL OR hot_score = 0;

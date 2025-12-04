USE pizza321;

ALTER TABLE pizzas
ADD COLUMN is_special BOOLEAN DEFAULT FALSE;

UPDATE pizzas
SET is_special = TRUE
WHERE id = 1;
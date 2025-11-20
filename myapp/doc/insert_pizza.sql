USE pizza321;

-- table ingrédients de base
INSERT INTO ingredients (name) VALUES
('Mozzarella'),
('Sauce Tomate'),
('Merguez'),
('Salami piquant'),
('Poivrons'),
('Oignons rouges'),
('Jambon cuit'),
('Champignons frais'),
('Artichauts');

-- type de pizzas
INSERT INTO pizzas (name, price) VALUES
('La Diavola', 19.00),
('Margherita', 12.00),
('4 Saisons', 17.00);

-- composition du pizza
-- La Diavola (ID 1) : Mozzarella (ID 1), Merguez (ID 3), Salami piquant (ID 4), Poivrons (ID 5), Oignons rouges (ID 6)
INSERT INTO composition (incredients_id, pizzas_id) VALUES
(1, 1), (3, 1), (4, 1), (5, 1), (6, 1);

-- Margherita (ID 2) : Mozzarella (ID 1), Sauce Tomate (ID 2)
INSERT INTO composition (incredients_id, pizzas_id) VALUES
(1, 2), (2, 2);

-- 4 Saisons (ID 3) : Mozzarella (ID 1), Jambon (ID 7), Champignons (ID 8), Poivrons (ID 5), Artichauts (ID 9)
INSERT INTO composition (incredients_id, pizzas_id) VALUES
(1, 3), (7, 3), (8, 3), (5, 3), (9, 3);

-- promotion avec le pizza et sa descripstion
INSERT INTO promotion (id, pizzas_id, descripstion) VALUES
(101, 1, 'Quantité limitée à 10 par soir'),
(102, 2, 'Le mercredi, la Margherita est à 10.-'),
(103, 3, 'Le samedi et dimanche, 4 Saison est à 14.-');
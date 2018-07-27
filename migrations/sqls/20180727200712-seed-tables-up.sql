INSERT INTO customers (name, phone, email) VALUES 
('Paulina', 6043624496,
 'paulinate@o2.pl'
);


INSERT INTO categories (name, img_url) VALUES
('Appetizers', 
'https://www.rd.com/wp-content/uploads/2014/06/10-bite-sized-appetizers-mini-pancakes-fsl.jpg'
);

INSERT INTO menu_items (name, description, price , img_url, category_id) VALUES 
('Antojitos', 
' These antojitos are loaded with cream cheese and peppers and are baked to perfection.', 
1050,
'https://www.jocooks.com/wp-content/uploads/2012/08/antojitos-1-1.jpg',
1
);

INSERT INTO orders (price_declared) VALUES
(1050);

INSERT INTO menu_items_orders (menu_item_id, order_id)  VALUES
(1, 1);

INSERT INTO reservations (placement_time, group_size, status, order_id, customer_id) VALUES
('2018-07-07 12:00:00', 2, 'waiting', 1,1);
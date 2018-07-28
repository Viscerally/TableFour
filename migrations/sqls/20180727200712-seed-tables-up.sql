INSERT INTO customers (name, phone, email) VALUES 
('Paulina', 6043624496,
 'paulinate@o2.pl'
);




INSERT INTO categories (name, img_url) VALUES
('Appetizers',
'https://www.rd.com/wp-content/uploads/2014/06/10-bite-sized-appetizers-mini-pancakes-fsl.jpg'
);

INSERT INTO categories (name, img_url) VALUES
('Main Dishes',
'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2013/11/25/0/FNK_pan-seared-salmon-with-kale-apple-salad_s4x3.jpg.rend.hgtvcom.616.462.suffix/1387918756116.jpeg'
);

INSERT INTO categories (name, img_url) VALUES
('Desserts',
'https://www.seriouseats.com/2018/01/20180116-cranachan-vicky-wasik-1-3-1500x1125.jpg'
);

INSERT INTO categories (name, img_url) VALUES
('Drinks',
'https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/01/15/15/kfc-gravy-cocktails-gravy-so-good-you-can-drink-it.jpg'
);




INSERT INTO menu_items (name, description, price , img_url, category_id) VALUES
('Antojitos',
' These antojitos are loaded with cream cheese and peppers and are baked to perfection.',
1050,
'https://www.jocooks.com/wp-content/uploads/2012/08/antojitos-1-1.jpg',
1
);



INSERT INTO menu_items (name, description, price , img_url, category_id) VALUES
('Steamed Salmon Fillet',
'Stuffed with crab meat, baby shrimp and smoked salmon; served with a roasted red pepper sauce.',
1800,
'https://assets.blog.foodnetwork.ca/imageserve/wp-content/uploads/sites/6/2016/11/Poached-Salmon/x.jpg',
2
);



INSERT INTO menu_items (name, description, price , img_url, category_id) VALUES
('Belgian Chocolate Terrine',
'The rich taste of Belgian chocolate with a touch of Cointreau, served with creme anglaise and raspberry coulis.',
1300,
'http://www.christysgourmetgifts.com/sites/cggdev/img/products/323458Terrine_enlarge.JPG',
3
);



INSERT INTO menu_items (name, description, price , img_url, category_id) VALUES
('House Wine',
'Choice of red and white BC wines.Tasting notes include a medium body, raspberries, plums, black cherries, licorice, orange, coffee, toffee, chocolate, fruit cake. ',
9000,
'https://images.thestar.com/ec4k2HSAMNNNEoRc9fs7V9tfoaw=/1086x725/smart/filters:cb(1506168295992)/https://www.thestar.com/content/dam/thestar/life/2017/09/22/to-tip-or-not-to-tip-should-we-calculate-gratuity-on-wine-at-a-restaurant/wine2.jpg',
4
);



INSERT INTO orders (price_declared) VALUES
(1050);



INSERT INTO menu_items_orders (menu_item_id, order_id)  VALUES
(1, 1);



INSERT INTO reservations (placement_time, group_size, status, order_id, customer_id) VALUES
('2018-07-07 18:00:00', 2, 'ordered', 1,1);




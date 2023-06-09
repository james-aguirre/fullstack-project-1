set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";


 CREATE TABLE "products" (
	"productName" TEXT NOT NULL,
	"price" real NOT NULL,
	"category" TEXT NOT NULL,
	"imageUrl" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"productId" serial NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("productId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "customers" (
	"customerId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	"createdAt" TIMESTAMP,
	CONSTRAINT "customers_pk" PRIMARY KEY ("customerId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "shoppingCart" (
	"customerId" int NOT NULL,
	"cartId" serial NOT NULL,
	CONSTRAINT "shoppingCart_pk" PRIMARY KEY ("cartId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "orders" (
	"orderId" serial NOT NULL,
	"cartId" int NOT NULL,
	CONSTRAINT "orders_pk" PRIMARY KEY ("orderId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "shoppingCartItems" (
	"quantity" int NOT NULL,
	"productId" int NOT NULL,
	"cartId" int NOT NULL,
	CONSTRAINT "shoppingCartItems_pk" PRIMARY KEY ("productId","cartId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "orderItems" (
	"productName" TEXT NOT NULL,
	"price" real NOT NULL,
	"description" real NOT NULL,
	"categoryName" real NOT NULL,
	"orderId" int NOT NULL
) WITH (
  OIDS=FALSE
);





ALTER TABLE "shoppingCart" ADD CONSTRAINT "shoppingCart_fk0" FOREIGN KEY ("customerId") REFERENCES "customers"("customerId");

ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("cartId") REFERENCES "shoppingCart"("cartId");


ALTER TABLE "shoppingCartItems" ADD CONSTRAINT "shoppingCartItems_fk0" FOREIGN KEY ("productId") REFERENCES "products"("productId");
ALTER TABLE "shoppingCartItems" ADD CONSTRAINT "shoppingCartItems_fk1" FOREIGN KEY ("cartId") REFERENCES "shoppingCart"("cartId");

ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_fk0" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId");

-- CreateTable
CREATE TABLE "Favorite" (
    "user_id" INTEGER NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("user_id", "restaurant_id"),
    CONSTRAINT "Favorite_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "OperatingHour" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurant_id" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    CONSTRAINT "OperatingHour_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "neighborhood" TEXT,
    "photograph" TEXT,
    "address" TEXT,
    "lat" REAL,
    "lng" REAL,
    "image" TEXT,
    "cuisine_type" TEXT
);

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurant_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comments" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Review_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_users_1" ON "User"("email");
Pragma writable_schema=0;

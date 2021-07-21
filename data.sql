DROP DATABASE IF EXISTS aycdb;

CREATE DATABASE aycdb;

\c aycdb;

DROP TABLE IF EXISTS team;

CREATE TABLE "team" (
  "id" SERIAL PRIMARY KEY,
  "full_name" varchar,
  "bio" varchar,
  "img" varchar
);

DROP TABLE IF EXISTS videos;

CREATE TABLE "videos" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "description" varchar,
  "link" varchar,
  "category" varchar
);

DROP TABLE IF EXISTS customers;

CREATE TABLE "customers" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "email" varchar NOT NULL,
  "phone" varchar,
  "company" varchar
);

DROP TABLE IF EXISTS admins;

CREATE TABLE "admins" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar,
  "password" varchar
);


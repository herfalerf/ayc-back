DROP DATABASE IF EXISTS aycdb;

CREATE DATABASE aycdb;

\c aycdb;

DROP TABLE IF EXISTS team;

CREATE TABLE "team" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "bio" varchar,
  "img" varchar
);


DROP TABLE IF EXISTS videos;

CREATE TABLE "videos" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "description" varchar,
  "link" varchar
);

DROP TABLE IF EXISTS tags;

CREATE TABLE "tags" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
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

DROP TABLE IF EXISTS videos_tags;

CREATE TABLE "videos_tags" (
  video_id int REFERENCES videos ON DELETE CASCADE,
  tag_id int REFERENCES tags ON DELETE CASCADE,
  PRIMARY KEY (video_id, tag_id)
);

-- \i data-seed.sql

DROP DATABASE IF EXISTS ayc_test;

CREATE DATABASE ayc_test;

\c ayc_test

DROP TABLE IF EXISTS team;

CREATE TABLE "team" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "bio" varchar,
  "img" varchar
);


DROP TABLE IF EXISTS videos;

CREATE TABLE "videos" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "description" varchar,
  "link" varchar
);

DROP TABLE IF EXISTS tags;

CREATE TABLE "tags" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
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

DROP TABLE IF EXISTS videos_tags;

CREATE TABLE "videos_tags" (
  video_id int REFERENCES videos ON DELETE CASCADE,
  tag_id int REFERENCES tags ON DELETE CASCADE,
  PRIMARY KEY (video_id, tag_id)
);
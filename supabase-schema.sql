-- =========================================================================
-- menu100 — Supabase PostgreSQL Database Schema
-- Run this SQL in your Supabase SQL Editor to initialize all tables!
-- =========================================================================

-- 1. Table: foods (รายการอาหารและการจัดอันดับ)
CREATE TABLE IF NOT EXISTS foods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  category TEXT NOT NULL,
  origin TEXT,
  country_code TEXT DEFAULT 'TH',
  image TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  regular_votes BIGINT DEFAULT 0,
  royal_votes BIGINT DEFAULT 0,
  rank INT DEFAULT 99,
  previous_rank INT,
  is_global_top20 BOOLEAN DEFAULT false,
  calories INT,
  flavor_profile TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Table: restaurants (ร้านอาหารและ SME ทั่วไทย 77 จังหวัด)
CREATE TABLE IF NOT EXISTS restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  province_id TEXT NOT NULL,
  province_name TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT NOT NULL,
  verified_stars INT DEFAULT 3 CHECK (verified_stars BETWEEN 1 AND 5),
  menu100_score INT DEFAULT 90,
  is_sme BOOLEAN DEFAULT true,
  is_street_food BOOLEAN DEFAULT false,
  league_tier TEXT DEFAULT 'provincial',
  image TEXT NOT NULL,
  cuisine TEXT,
  price_range TEXT DEFAULT '฿฿',
  highlight_dishes TEXT[],
  open_hours TEXT,
  phone TEXT,
  review_count INT DEFAULT 0,
  description TEXT,
  rank_in_province INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Table: merch (สินค้าที่ระลึก & สต็อก)
CREATE TABLE IF NOT EXISTS merch (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  royal_discount_percent INT DEFAULT 15,
  image TEXT NOT NULL,
  description TEXT,
  sizes TEXT[],
  colors TEXT[],
  in_stock BOOLEAN DEFAULT true,
  stock_count INT DEFAULT 50,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Table: user_accounts (ข้อมูลผู้ใช้งาน ชื่อและรหัสผ่าน)
CREATE TABLE IF NOT EXISTS user_accounts (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar TEXT,
  is_royal BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user',
  vote_count INT DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Table: orders (รายการสั่งซื้อสินค้าและรายได้)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_username TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  is_royal_discount_applied BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Initial seed data comment:
-- The application automatically synchronizes default data with Supabase upon connection.

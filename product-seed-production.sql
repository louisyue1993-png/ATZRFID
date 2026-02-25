-- Production product seed script (adds 8 products, removes test rows)
-- Run in Supabase SQL Editor

BEGIN;

INSERT INTO products (name, category, price, image, description)
VALUES
  ('UHF RFID Label M4QT', 'uhf-tags', '0.12', '/products/uhf-label-m4qt.jpg', 'Cost-effective UHF label tag for carton and pallet tracking.'),
  ('UHF Anti-Metal ABS Tag', 'uhf-tags', '0.85', '/products/uhf-abs-anti-metal.jpg', 'Rugged anti-metal UHF tag for industrial assets and metal surfaces.'),
  ('Laundry RFID Tag PPS', 'uhf-tags', '0.55', '/products/laundry-rfid-pps.jpg', 'Heat-resistant washable tag for textile and uniform lifecycle tracking.'),
  ('NFC NTAG213 Sticker', 'hf-nfc-tags', '0.15', '/products/nfc-ntag213-sticker.jpg', '13.56MHz NFC sticker for mobile interaction and smart packaging.'),
  ('HF RFID ISO Card 1K', 'rfid-cards', '0.18', '/products/hf-iso-1k-card.jpg', 'Standard ISO card for access control and attendance scenarios.'),
  ('125kHz Proximity Card EM4200', 'rfid-cards', '0.25', '/products/em4200-proximity-card.jpg', 'Longer-range LF card for legacy door entry systems.'),
  ('NFC Business Card NTAG216', 'rfid-cards', '0.22', '/products/nfc-business-card-ntag216.jpg', 'Tap-to-share digital business card for marketing and networking.'),
  ('UHF PCB On-Metal Tag', 'uhf-tags', '1.20', '/products/uhf-pcb-onmetal.jpg', 'High-performance PCB tag for IT and high-value asset tracking.');

-- Remove test rows
DELETE FROM products
WHERE name = 'Test RFID Tag'
  AND image = '/products/test.jpg';

COMMIT;

-- Verification
SELECT COUNT(*) AS total_products FROM products;
SELECT id, name, category, price, image, created_at
FROM products
ORDER BY created_at DESC
LIMIT 10;

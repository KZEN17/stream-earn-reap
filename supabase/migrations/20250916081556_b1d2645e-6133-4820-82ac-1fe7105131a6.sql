-- Add some sample campaigns for testing
INSERT INTO public.campaigns (creator_id, title, description, campaign_image_url, prize_pool, payout_per_1000_views, max_payout_per_clip, start_date, end_date, status) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  'Epic Gaming Moments',
  'Create clips of the most epic gaming moments! Perfect for showcasing incredible plays, funny fails, and memorable reactions.',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
  500.00,
  1.50,
  75.00,
  now(),
  now() + interval '30 days',
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Viral Dance Challenge',
  'Show off your best dance moves! Create engaging clips that get people moving and grooving.',
  'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=300&fit=crop',
  750.00,
  1.30,
  100.00,
  now(),
  now() + interval '14 days',
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Tech Review Shorts',
  'Quick tech reviews and unboxings! Perfect for showcasing the latest gadgets and tech products.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
  1000.00,
  2.00,
  150.00,
  now(),
  now() + interval '21 days',
  'active'
);
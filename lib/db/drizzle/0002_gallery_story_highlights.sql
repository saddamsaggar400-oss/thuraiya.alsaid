-- Populate the seven story circles using bundled gallery photos.
-- Existing uploaded stories retain their slots.
INSERT INTO turki_media_files (id, object_path, story_slot, name, content_type, size)
VALUES
('gallery-story-1', '/images/account-posts/post-1.jpg', 1, 'post-1.jpg', 'image/jpeg', 69921),
('gallery-story-2', '/images/account-posts/post-3.jpg', 2, 'post-3.jpg', 'image/jpeg', 160525),
('gallery-story-3', '/images/account-posts/post-6.jpg', 3, 'post-6.jpg', 'image/jpeg', 153471),
('gallery-story-4', '/images/account-posts/post-10.jpg', 4, 'post-10.jpg', 'image/jpeg', 239090),
('gallery-story-5', '/images/account-posts/post-11.jpg', 5, 'post-11.jpg', 'image/jpeg', 71408),
('gallery-story-6', '/images/account-posts/post-16.jpg', 6, 'post-16.jpg', 'image/jpeg', 144578),
('gallery-story-7', '/images/account-posts/post-19.jpg', 7, 'post-19.jpg', 'image/jpeg', 110539)
ON CONFLICT DO NOTHING;

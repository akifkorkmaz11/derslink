-- Önce mevcut durumu kontrol et
SELECT 
    id,
    name,
    email,
    enrolled_program,
    created_at
FROM users 
ORDER BY created_at DESC;

-- YKS kullanıcılarını kontrol et
SELECT 
    id,
    name,
    email,
    enrolled_program,
    created_at
FROM users 
WHERE enrolled_program = 'YKS'
ORDER BY created_at DESC;

-- Program alanı boş olan kullanıcıları göster
SELECT 
    id,
    name,
    email,
    enrolled_program,
    created_at
FROM users 
WHERE enrolled_program IS NULL 
   OR enrolled_program = ''
ORDER BY created_at DESC;

-- Tüm kullanıcıların program dağılımını göster
SELECT 
    enrolled_program,
    COUNT(*) as user_count
FROM users 
GROUP BY enrolled_program
ORDER BY user_count DESC;

-- Eğer YKS kullanıcıları yoksa, bazı kullanıcıları YKS olarak işaretle (test için)
-- UPDATE users 
-- SET enrolled_program = 'YKS'
-- WHERE enrolled_program IS NULL 
--    OR enrolled_program = ''
-- LIMIT 5;

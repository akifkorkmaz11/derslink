-- YKS kullanıcılarını kontrol et
SELECT 
    id,
    name,
    email,
    enrolled_program,
    selected_program,
    created_at
FROM users 
WHERE enrolled_program = 'YKS' 
   OR selected_program = 'YKS'
ORDER BY created_at DESC;

-- Tüm kullanıcıların program dağılımını göster
SELECT 
    enrolled_program,
    COUNT(*) as user_count
FROM users 
GROUP BY enrolled_program
ORDER BY user_count DESC;

-- Program alanı boş olan kullanıcıları göster
SELECT 
    id,
    name,
    email,
    enrolled_program,
    selected_program,
    created_at
FROM users 
WHERE enrolled_program IS NULL 
   OR enrolled_program = ''
ORDER BY created_at DESC;

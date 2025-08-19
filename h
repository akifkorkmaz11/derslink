warning: in the working copy of 'public/js/supabase-config.js', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/public/js/supabase-config.js b/public/js/supabase-config.js[m
[1mindex c9c2715..4472536 100644[m
[1m--- a/public/js/supabase-config.js[m
[1m+++ b/public/js/supabase-config.js[m
[36m@@ -1,4 +1,4 @@[m
[31m-// Supabase Configuration - Final Version[m
[32m+[m[32m// Supabase Configuration - Final Version - CACHE TEMIZLEME: 2024-01-20[m
 console.log('🔧 Supabase config dosyası yükleniyor...');[m
 [m
 // Supabase credentials[m
[36m@@ -257,11 +257,10 @@[m [mconst UserService = {[m
                 yksField: typeof yksField[m
             });[m
             [m
[31m-            // Önce uygun sınıfı bul[m
[32m+[m[32m            // Önce uygun sınıfı bul - Kapasite kontrolünü kaldırdık[m
             let query = supabase[m
                 .from('classes')[m
                 .select('*')[m
[31m-                .lt('current_enrollment', 'max_capacity')[m
                 .eq('status', 'active');[m
             [m
             // Schedule type'ı düzelt (YKS için farklı format)[m
[36m@@ -295,7 +294,7 @@[m [mconst UserService = {[m
                 correctedYksField: mainProgram === 'YKS' && yksField ? (yksField === 'sayisal' ? 'Sayısal' : yksField === 'sozel' ? 'Sözel' : 'Eşit Ağırlık') : null[m
             });[m
             [m
[31m-            query = query.order('current_enrollment', { ascending: true }).limit(1);[m
[32m+[m[32m            query = query.order('class_name', { ascending: true }).limit(1);[m
             [m
             console.log('🔍 Sınıf arama sorgusu hazırlandı');[m
             const { data: availableClasses, error: classError } = await query;[m

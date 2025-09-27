#!/data/data/com.termux/files/usr/bin/bash
# سكربت رفع الملفات إلى GitHub من Termux
# يقرأ رابط المستودع من repo_url.txt

# تحويل السكربت نفسه وصيغة repo_url.txt إلى Unix format لتجنب مشاكل \r
pkg install -y dos2unix git
dos2unix "$0"
dos2unix "/storage/emulated/0/Download/trim/repo_url.txt"

# الانتقال إلى مجلد السكربت
cd "$(dirname "$0")" || exit 1

# قراءة رابط المستودع من الملف
if [ ! -f "/storage/emulated/0/Download/trim/repo_url.txt" ]; then
  echo "خطأ: ملف repo_url.txt غير موجود!"
  exit 1
fi
REPO_URL=$(cat /storage/emulated/0/Download/trim/repo_url.txt)

# التأكد من أن المجلد آمن
git config --global --add safe.directory "$(pwd)"

# تهيئة المستودع إذا لم يكن موجود
if [ ! -d ".git" ]; then
  git init
fi

# إضافة كل الملفات
git add .

# إنشاء كوميت أول إذا لم يكن هناك كوميتات
if ! git log >/dev/null 2>&1; then
  git commit -m "Initial commit"
else
  git commit -m "Update files" || echo "لا توجد تغييرات جديدة"
fi

# إضافة المستودع البعيد أو تحديثه
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# التأكد من الفرع الرئيسي
git branch -M main

# جلب التحديثات وحل التعارضات بطريقة آمنة
git fetch origin main
git merge --allow-unrelated-histories origin/main -m "Merge remote changes" || echo "تم دمج التغييرات البعيدة"

# رفع الملفات إلى GitHub
git push -u origin main
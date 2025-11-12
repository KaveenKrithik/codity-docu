# 🧪 Testing Your Supabase Integration

## Quick Start Test

Your development server is running at: **http://localhost:3000**

Follow these steps to test the integration:

---

## ✅ Step 1: Test Supabase Connection

1. Open your browser and navigate to:
   ```
   http://localhost:3000/api/test-supabase
   ```

2. **Expected Response:**
   ```json
   {
     "success": true,
     "message": "Supabase connection successful"
   }
   ```

3. **Check Server Logs** in your terminal for detailed test results:
   - ✅ Database Connection
   - ✅ Storage Bucket "docs" 
   - ✅ DOCUMENTATION Folder

---

## 📝 Step 2: Test Admin Panel

1. Navigate to the Admin Dashboard:
   ```
   http://localhost:3000/admin
   ```

2. You should see:
   - ✨ Admin Dashboard header
   - 🔍 Search bar
   - ➕ "Add New File" button
   - Empty state (no files yet)

---

## 📤 Step 3: Upload Your First Document

### Option A: Upload a .md file with images

1. Click **"Add New File"** button
2. Click **"Upload Markdown File"** and select your `.md` file
3. The title and content will auto-populate
4. Click **"Upload Images"** to add any related images
5. Click **"Add File"**

### Option B: Write content directly

1. Click **"Add New File"** button
2. Enter a **Title** (e.g., "Getting Started")
3. Write your content in the **Content (MDX)** textarea:
   ```markdown
   # Getting Started
   
   Welcome to our documentation!
   
   ## Features
   - Easy to use
   - Fast performance
   - Beautiful UI
   ```
4. Click **"Add File"**

---

## 🔍 Step 4: Verify Upload in Supabase

After uploading, check your Supabase Dashboard:

### Check Database:
1. Go to **Database → Table Editor → docs**
2. You should see your new record with:
   - `title`
   - `slug` (auto-generated from title)
   - `file_path` (e.g., `DOCUMENTATION/getting-started/index.mdx`)
   - `created_at` and `updated_at` timestamps

### Check Storage:
1. Go to **Storage → docs bucket → DOCUMENTATION**
2. You should see a folder with your slug name
3. Inside: `index.mdx` and (if uploaded) `images/` folder

---

## 🎯 Expected Folder Structure in Storage

```
docs (bucket)
└── DOCUMENTATION/
    ├── getting-started/
    │   ├── index.mdx
    │   └── images/
    │       ├── screenshot1.png
    │       └── diagram.jpg
    └── another-doc/
        ├── index.mdx
        └── images/
            └── photo.png
```

---

## 🐛 Troubleshooting

### ❌ Test API returns `success: false`

Check terminal logs for specific errors:

1. **"Missing Supabase environment variables"**
   - Verify `.env.local` has all 3 variables
   - Restart dev server: `Ctrl+C` then `npm run dev`

2. **"relation 'docs' does not exist"**
   - Run the SQL from `supabase-schema.sql` in Supabase SQL Editor
   - Make sure the table was created successfully

3. **"Bucket not found"**
   - Create "docs" bucket in Supabase Storage
   - Make it public or set up proper RLS policies

### ❌ Upload fails with error

1. **"Failed to upload MDX file"**
   - Check Storage policies allow service role to insert
   - Verify bucket name is exactly "docs"

2. **"A document with slug 'xxx' already exists"**
   - Change the title to generate a different slug
   - Or delete the existing document first

3. **Network error or timeout**
   - Check your internet connection
   - Verify Supabase project URL is correct
   - Check Supabase project isn't paused

---

## 📊 Testing Checklist

- [ ] Server running at http://localhost:3000
- [ ] Test API returns success: http://localhost:3000/api/test-supabase
- [ ] Admin page loads: http://localhost:3000/admin
- [ ] Can upload a document (with or without images)
- [ ] Document appears in Supabase Database table
- [ ] Files appear in Supabase Storage bucket
- [ ] Can preview document in admin panel
- [ ] Can delete document
- [ ] Deletion removes files from storage

---

## 🎉 Success Indicators

✅ Test API shows all green checkmarks in terminal  
✅ Admin dashboard displays uploaded documents  
✅ Files visible in Supabase Storage  
✅ Database records match uploaded docs  
✅ Preview modal shows formatted MDX content  

---

## 📞 Need Help?

If you encounter issues:

1. Check the browser console (F12 → Console tab)
2. Check the terminal where `npm run dev` is running
3. Check Supabase Dashboard → Logs → API
4. Review the error messages carefully

Common fixes:
- Restart the dev server
- Clear browser cache
- Verify all environment variables
- Check Supabase project isn't paused
- Ensure database table and storage bucket exist

---

**Ready to test?** Start with Step 1! 🚀

# Supabase Setup & Verification Guide

## 📋 Prerequisites Checklist

Before proceeding, ensure you have:
- [ ] A Supabase account
- [ ] A Supabase project created
- [ ] Your Supabase project URL
- [ ] Your Supabase anon key
- [ ] Your Supabase service role key

---

## 🗄️ Step 1: Create the Database Table

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy and paste the SQL from `supabase-schema.sql` (lines 1-55)
5. Click **RUN** to execute

### ✅ Verify Table Creation

Run this query in the SQL Editor:
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'docs'
ORDER BY ordinal_position;
```

**Expected Output:**
| column_name | data_type | is_nullable | column_default |
|-------------|-----------|-------------|----------------|
| id | uuid | NO | uuid_generate_v4() |
| title | text | NO | NULL |
| slug | text | NO | NULL |
| file_path | text | NO | NULL |
| created_at | timestamp with time zone | YES | now() |
| updated_at | timestamp with time zone | YES | now() |

---

## 📦 Step 2: Create the Storage Bucket

1. In Supabase Dashboard, navigate to **Storage** (left sidebar)
2. Click **"New bucket"**
3. Enter bucket details:
   - **Name:** `docs`
   - **Public bucket:** Toggle OFF (keep it private) or ON (if you want public access)
4. Click **"Create bucket"**

### ✅ Verify Bucket Creation

You should see the `docs` bucket listed in your Storage section.

**Folder Structure (will be created automatically by the app):**
```
docs/
  └── [slug-name]/
      ├── index.mdx
      └── images/
          ├── image1.png
          └── image2.png
```

---

## 🔐 Step 3: Configure Environment Variables

1. Open `.env.local` in your project
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 📍 Where to Find These Values:

1. Go to **Project Settings** (gear icon in sidebar)
2. Click on **API** section
3. You'll find:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → Use for `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

---

## 🔒 Step 4: Set Up Storage Policies (Optional but Recommended)

If you made your bucket **private**, you need to set up Row Level Security (RLS) policies:

1. Go to **Storage** → Click on `docs` bucket
2. Click **Policies** tab
3. Create the following policies or run the SQL from `supabase-schema.sql` (lines 57-86)

### Recommended Policies:

**For Public Access (if you want docs to be publicly readable):**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'docs');
```

**For Admin Operations (using service role):**
The service role key bypasses RLS, so your API routes will work automatically.

---

## 🧪 Step 5: Test the Setup

### Test 1: Check Database Connection
Run this in SQL Editor:
```sql
SELECT * FROM docs;
```
Should return empty result (no rows yet) - this is correct!

### Test 2: Insert Test Data
```sql
INSERT INTO docs (title, slug, file_path)
VALUES ('Test Doc', 'test-doc', 'docs/test-doc/index.mdx')
RETURNING *;
```

### Test 3: Verify Insert
```sql
SELECT * FROM docs;
```
You should see your test record.

### Test 4: Clean Up Test Data
```sql
DELETE FROM docs WHERE slug = 'test-doc';
```

---

## 🚀 Step 6: Run Your Application

1. Make sure all environment variables are set in `.env.local`
2. Start your development server:
   ```bash
   npm run dev
   ```
3. Navigate to `http://localhost:3000/admin`
4. Try uploading a markdown file with images

---

## 🔍 Verification Checklist

- [ ] Database table `docs` created with all columns
- [ ] Indexes created on `slug` and `created_at`
- [ ] Trigger created for auto-updating `updated_at`
- [ ] Storage bucket `docs` created
- [ ] Environment variables configured in `.env.local`
- [ ] Storage policies set up (if using private bucket)
- [ ] Test insert/select/delete queries work
- [ ] Application runs without errors

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- Check that `.env.local` exists and has correct values
- Restart your dev server after updating `.env.local`

### Error: "Failed to upload MDX file"
- Verify the `docs` bucket exists in Storage
- Check that your service role key is correct
- Ensure storage policies allow service role to insert

### Error: "Failed to create database entry"
- Verify the `docs` table exists
- Check for unique constraint violations on `slug`
- Review SQL Editor for any table creation errors

### Files not appearing in admin dashboard
- Check browser console for errors
- Verify API routes are returning data
- Check Supabase logs in Dashboard → Logs

---

## 📚 Next Steps

Once verified, you can:
1. Upload your first document via the admin panel
2. View it in the docs page at `/docs/[your-slug]`
3. Edit and delete documents as needed
4. Add images alongside your markdown files

---

## 🔗 Useful Supabase Dashboard Links

- **Tables:** Database → Tables → `docs`
- **Storage:** Storage → `docs` bucket
- **API Logs:** Logs → API
- **SQL Editor:** SQL Editor (for running queries)
- **Settings:** Settings → API (for keys)

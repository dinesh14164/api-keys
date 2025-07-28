# Supabase Setup Guide

This guide will help you connect your API Key Management dashboard to a Supabase database.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter a project name (e.g., "api-key-manager")
6. Enter a database password (save this!)
7. Choose a region close to your users
8. Click "Create new project"

## 2. Get Your Project Credentials

Once your project is created:

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (something like `https://your-project-id.supabase.co`)
   - **Project API Key** (anon/public key)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase credentials.

## 4. Create the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL

This will create:
- The `api_keys` table with all necessary columns
- Indexes for better performance
- Row Level Security (RLS) policies
- An auto-updating `updated_at` timestamp

## 5. Test the Connection

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/dashboards`
3. Try creating a new API key
4. Check your Supabase dashboard under **Table Editor** > **api_keys** to see if the data was inserted

## 6. Database Schema Details

The `api_keys` table includes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `user_id` | TEXT | User identifier (defaults to 'default-user') |
| `name` | TEXT | Human-readable name for the API key |
| `key_value` | TEXT | The actual API key (unique) |
| `type` | TEXT | Either 'dev' or 'prod' |
| `usage_limit` | INTEGER | Monthly usage limit |
| `usage_count` | INTEGER | Current usage count |
| `created_at` | TIMESTAMP | When the key was created |
| `updated_at` | TIMESTAMP | When the key was last modified |
| `last_used_at` | TIMESTAMP | When the key was last used |

## 7. Security Features

- **Row Level Security (RLS)**: Users can only access their own API keys
- **Input validation**: Type checking for key types
- **Unique constraints**: API keys must be unique
- **Indexes**: Optimized for common queries

## 8. Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Make sure `.env.local` is in your project root
- Restart your development server after changing environment variables

### Permission Errors
- Check that RLS policies are set up correctly
- Verify the `current_user_id()` function returns the expected user ID

### Database Errors
- Check the browser console for detailed error messages
- Verify the schema was created successfully in Supabase

## 9. Next Steps

Once everything is working:

1. **Add Authentication**: Integrate Supabase Auth to support multiple users
2. **API Key Validation**: Create API endpoints to validate keys
3. **Usage Tracking**: Implement actual usage tracking for your API
4. **Rate Limiting**: Add rate limiting based on key types
5. **Analytics**: Track API key usage patterns

## 10. Production Considerations

- Use environment variables for production deployment
- Set up proper user authentication
- Configure database backups
- Monitor usage and performance
- Implement proper error handling and logging 
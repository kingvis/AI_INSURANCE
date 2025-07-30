# 🚀 Supabase Integration Setup

This guide will help you set up Supabase integration in your Next.js framework.

## 📋 Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Your project's Supabase URL and API keys

## 🔧 Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ins.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sbp_333b5307091901d7461863964bcb43c8df051ea2
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Note:** Replace the values with your actual Supabase project credentials.

## 🗄️ Database Schema

The framework includes example schema for the following tables:

### 1. Profiles Table
```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Set up Storage
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');
```

### 2. Posts Table
```sql
-- Create posts table
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text,
  author_id uuid references profiles(id) on delete cascade,
  published boolean default false
);

-- Set up Row Level Security (RLS)
alter table posts enable row level security;

create policy "Posts are viewable by everyone." on posts
  for select using (published = true);

create policy "Users can insert their own posts." on posts
  for insert with check (auth.uid() = author_id);

create policy "Users can update their own posts." on posts
  for update using (auth.uid() = author_id);

create policy "Users can delete their own posts." on posts
  for delete using (auth.uid() = author_id);
```

## 🔐 Authentication Setup

### OAuth Providers

To enable GitHub OAuth (as shown in the demo):

1. Go to your Supabase dashboard
2. Navigate to Authentication → Providers
3. Enable GitHub provider
4. Add your GitHub OAuth app credentials

### Email Authentication

Email authentication is enabled by default. Users can:
- Sign up with email/password
- Sign in with email/password
- Reset password via email

## 🛠️ Available Components

### Authentication Components

1. **AuthButton** - OAuth and sign out functionality
2. **EmailAuth** - Email-based authentication form
3. **useSupabase** - Custom hook for Supabase client access

### Database Components

1. **SupabaseDemo** - Complete CRUD demo with posts
2. **Database types** - TypeScript definitions for your schema

## 🔄 Real-time Features

The Supabase client is configured for real-time subscriptions. You can listen to database changes:

```tsx
import { useSupabase } from "@/hooks/useSupabase";

function MyComponent() {
  const { supabase } = useSupabase();

  useEffect(() => {
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          console.log('Change received!', payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])
}
```

## 📱 File Storage

Supabase Storage is configured for file uploads:

```tsx
const { supabase } = useSupabase();

// Upload file
const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`public/${file.name}`, file)
  
  if (error) throw error
  return data
}

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('public/avatar.png')
```

## 🚀 Advanced Features

### Server-Side Authentication

Use the server-side client for API routes and Server Components:

```tsx
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Fetch data for authenticated user
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
  
  return Response.json(data)
}
```

### Protected Routes

The middleware is already configured to handle authentication. To protect routes:

```tsx
// Uncomment the protected routes logic in middleware.ts
if (!user && request.nextUrl.pathname.startsWith('/protected')) {
  return NextResponse.redirect(new URL('/auth/signin', request.url))
}
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your domain is added to Supabase Auth settings
2. **RLS Policies**: Make sure Row Level Security policies are correctly configured
3. **Environment Variables**: Double-check your `.env.local` file is properly formatted

### Debugging

Enable debug mode in development:

```tsx
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key, {
  auth: {
    debug: process.env.NODE_ENV === 'development'
  }
})
```

## 📚 Further Reading

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) 
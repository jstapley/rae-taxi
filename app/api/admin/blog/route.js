import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET — list all posts
export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, image_url, published, created_at, topic')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — save a new post
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, image_url, topic, key_points, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug and content are required' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ title, slug, excerpt, content, image_url, topic, key_points, published: published || false })
      .select('id')
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — update (publish/unpublish or edit)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    updates.updated_at = new Date().toISOString();

    const supabase = createServerClient();
    const { error } = await supabase.from('blog_posts').update(updates).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove a post
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const supabase = createServerClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

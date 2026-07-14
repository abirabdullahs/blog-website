import { NextRequest, NextResponse } from 'next/server';
import { createBlog, getBlogBySlug, getBlogs, updateBlog } from '@/lib/db/blog-service';

function validateBlogPayload(payload: Record<string, any>) {
  if (!payload?.title || typeof payload.title !== 'string' || !payload.title.trim()) {
    return 'Title is required';
  }

  if (!payload?.slug || typeof payload.slug !== 'string' || !payload.slug.trim()) {
    return 'Slug is required';
  }

  if (!payload?.content || typeof payload.content !== 'string' || !payload.content.trim()) {
    return 'Content is required';
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');

    if (slug) {
      const blog = await getBlogBySlug(slug);

      if (!blog) {
        return NextResponse.json(
          { success: false, error: 'Blog not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, blog });
    }

    const blogs = await getBlogs();
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const validationError = validateBlogPayload(body as Record<string, any>);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }

    const blogId = await createBlog(body as Record<string, any>);
    return NextResponse.json({ success: true, blogId }, { status: 201 });
  } catch (error) {
    console.error('Failed to create blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog id is required' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    await updateBlog(id, body as Record<string, any>);
    return NextResponse.json({ success: true, message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Failed to update blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

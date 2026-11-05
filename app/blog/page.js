import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Antigua Travel Blog — Local Tips & Island Guides',
  description: "Discover Antigua through Raymond's eyes. Travel tips, insider guides to beaches, restaurants, Shirley Heights, Nelson's Dockyard & more.",
  alternates: { canonical: 'https://www.privateluxurytransportationantigua.com/blog' },
};

async function getPosts() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, image_url, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div className="bg-[#1B3A5C] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-3">Raymond&apos;s Blog</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Local tips, island guides, and insider knowledge from Antigua&apos;s private luxury transportation expert.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-14">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">✍️</div>
            <p className="text-lg">No posts yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48 bg-gray-100">
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B3A5C] to-[#2d5986]">
                      <span className="text-5xl">🌴</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs text-gray-400 mb-2">
                    {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h2 className="text-lg font-bold text-[#1B3A5C] mb-2 group-hover:text-[#F59E0B] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="mt-4 text-[#F59E0B] text-sm font-semibold">Read more →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

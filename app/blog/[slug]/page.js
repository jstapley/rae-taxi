import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getPost(slug) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://www.privateluxurytransportationantigua.com/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      authors: ['Raymond Peters'],
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image_url || undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: 'Raymond Peters',
      url: 'https://www.privateluxurytransportationantigua.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Everyone Loves Raymond — Taxi & Rentals',
      url: 'https://www.privateluxurytransportationantigua.com',
      logo: { '@type': 'ImageObject', url: 'https://www.privateluxurytransportationantigua.com/vehicles/rav4.png' },
    },
    mainEntityOfPage: `https://www.privateluxurytransportationantigua.com/blog/${params.slug}`,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Hero image */}
      {post.image_url && (
        <div className="relative h-72 md:h-96 w-full bg-gray-200">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A5C]/70 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/blog" className="hover:text-[#F59E0B] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{post.title}</span>
        </div>

        {/* Meta */}
        <div className="text-xs text-gray-400 mb-3">
          {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        {/* Content */}
        <article
          className="prose prose-lg max-w-none prose-headings:text-[#1B3A5C] prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-p:mb-5 prose-p:leading-relaxed prose-headings:mt-8 prose-headings:mb-3 prose-h2:font-bold prose-h2:text-xl prose-strong:text-[#1B3A5C]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-12 bg-[#1B3A5C] text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to explore Antigua?</h3>
          <p className="text-blue-200 mb-5">
            Book Raymond&apos;s private luxury transportation service — prompt, professional, always with a smile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/taxi"
              className="bg-[#F59E0B] hover:bg-yellow-500 text-[#1B3A5C] font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Book a Taxi
            </Link>
            <Link
              href="/vehicles"
              className="border-2 border-white text-white hover:bg-white hover:text-[#1B3A5C] font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Rent a Vehicle
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/blog" className="text-[#F59E0B] hover:underline text-sm font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}

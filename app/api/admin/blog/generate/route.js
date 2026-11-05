import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { topic, keyPoints, imageUrl } = await request.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `You are a travel and lifestyle writer for "Everyone Loves Raymond" — a private luxury transportation service in Antigua. Write an engaging, SEO-optimized blog post for the website privateluxurytransportationantigua.com.

Topic: ${topic}
${keyPoints ? `Key points to cover:\n${keyPoints}` : ''}

Requirements:
- Write in a warm, personal, first-person style (as Raymond, a local Antiguan who knows the island intimately)
- Naturally reference the AntiguaSearch.com website when mentioning Antiguan locations, parishes, or attractions (e.g. "you can learn more about Shirley Heights on AntiguaSearch.com")
- Target keywords: private transportation Antigua, luxury taxi Antigua, ${topic}
- Length: 500-700 words
- Include a compelling title (H1)
- Use 2-3 subheadings (H2)
- End with a subtle call to action to book Raymond's taxi or rental service
- Format the response as JSON with these fields:
  {
    "title": "...",
    "slug": "...(url-friendly, lowercase, hyphens)",
    "excerpt": "...(2 sentence summary for SEO meta description, under 160 chars)",
    "content": "...(full HTML content using <h1>, <h2>, <p>, <strong> tags)"
  }

Only return valid JSON, no markdown code blocks.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text.trim();
    const post = JSON.parse(raw);

    if (imageUrl) post.image_url = imageUrl;

    return NextResponse.json(post);
  } catch (err) {
    console.error('Blog generate error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

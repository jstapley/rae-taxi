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
- Target keywords: private transportation Antigua, luxury taxi Antigua, ${topic}
- Length: 500-700 words
- Include a compelling title (H1)
- Use 2-3 subheadings (H2)
- Every paragraph must be wrapped in <p> tags with meaningful content
- Include AT LEAST 3 hyperlinks naturally within the article body using proper <a> tags:
  1. At least 1 internal link to this site — use these exact URLs:
     - Book a taxi: <a href="/taxi">book a private taxi</a>
     - Rent a car: <a href="/vehicles">rent a vehicle</a>
     - Contact: <a href="/contact">get in touch</a>
  2. At least 2 external links to AntiguaSearch.com for relevant Antiguan locations/attractions, e.g.:
     - <a href="https://antiguasearch.com" target="_blank" rel="noopener noreferrer">AntiguaSearch.com</a>
     - Link to specific parish or attraction pages like: https://antiguasearch.com (use the homepage since specific pages may vary)
  3. Optionally link to relevant external authority sites (tourism boards, Wikipedia for landmarks, etc.)
- All <a> tags must have descriptive anchor text (never "click here")
- Format the response as JSON with these fields:
  {
    "title": "...",
    "slug": "...(url-friendly, lowercase, hyphens only)",
    "excerpt": "...(2 sentence summary for SEO meta description, under 160 chars)",
    "content": "...(full HTML using <h1>, <h2>, <p>, <strong>, <a> tags — no extra whitespace or newlines inside the JSON string)"
  }

Only return valid JSON. No markdown code blocks. No trailing commas.`;

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

import { Anthropic } from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import matter from 'gray-matter';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const TOPICS_PATH = path.join(__dirname, 'topics.json');
const PUBLISHED_PATH = path.join(__dirname, 'published.json');
const BLOGS_DIR = path.join(__dirname, '..', 'content', 'blogs');

async function generateBlog(topic: string) {
  console.log(`Generating blog for: ${topic}`);
  
  const systemPrompt = `You are an expert India education writer writing for apnacounsellor.in. 
Write a 1200-word SEO-optimized blog post in MDX format.
Structure:
- One H1 (matching the topic)
- Four H2s, each with two H3s
- A 5-question FAQ section at the end
- Naturally include 3 internal links to: /counseling/mht-cet-counseling, /counseling/josaa-counseling, /counseling/neet-ug-counseling
- End with a CTA paragraph mentioning Apna Counsellor free guidance service at /contact.
Tone: Informative, professional, and encouraging.
Return ONLY the MDX content starting with frontmatter.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      { role: 'user', content: `Write a blog post about: ${topic}` }
    ],
  });

  // Extract content (handling type safety)
  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  return content;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not found in .env');
    return;
  }

  if (!fs.existsSync(BLOGS_DIR)) fs.mkdirSync(BLOGS_DIR, { recursive: true });

  const topics = JSON.parse(fs.readFileSync(TOPICS_PATH, 'utf-8'));
  const published = JSON.parse(fs.readFileSync(PUBLISHED_PATH, 'utf-8'));

  const unpublished = topics.filter((t: string) => !published.includes(t));
  const toGenerate = unpublished.slice(0, 10);

  for (const topic of toGenerate) {
    try {
      const mdx = await generateBlog(topic);
      const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const filePath = path.join(BLOGS_DIR, `${slug}.mdx`);
      
      // If the AI didn't provide frontmatter, add basic one
      if (!mdx.startsWith('---')) {
        const frontmatter = {
          title: topic,
          description: `Learn everything about ${topic} on Apna Counsellor. Comprehensive guide for 2025.`,
          keywords: topic.split(' '),
          date: new Date().toISOString(),
          author: 'Apna Counsellor Team',
          tags: ['Counseling', 'Admission', 'India'],
          category: 'Education',
          readingTime: '8 min',
        };
        fs.writeFileSync(filePath, matter.stringify(mdx, frontmatter));
      } else {
        fs.writeFileSync(filePath, mdx);
      }

      published.push(topic);
      fs.writeFileSync(PUBLISHED_PATH, JSON.stringify(published, null, 2));
      console.log(`Successfully saved: ${slug}`);
    } catch (error) {
      console.error(`Failed to generate blog for ${topic}:`, error);
    }
  }
}

main();

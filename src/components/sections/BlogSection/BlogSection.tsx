import { BlogPost } from '@/types/blog';
import { BlogCard } from '@/components/organisms';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Ultimate Guide to Cannabis Terpenes",
    excerpt:
      "Discover how terpenes influence aroma, flavor, and effects. Learn to identify profiles that match your preferences.",
    image: '/images/blog/post-1.jpg',
    category: 'EDUCATION',
    href: '#',
  },
  {
    id: 2,
    title: 'Top Strains for Relaxation & Sleep',
    excerpt:
      'From classic indicas to CBD-rich hybrids, explore the best strains for unwinding after a long day.',
    image: '/images/blog/post-2.jpg',
    category: 'STRAIN GUIDE',
    href: '#',
  },
  {
    id: 3,
    title: 'Edibles 101: Dosing & Effects',
    excerpt:
      'Master the art of cannabis edibles with our comprehensive guide to proper dosing, timing, and choosing the right products.',
    image: '/images/blog/post-3.jpg',
    category: 'GUIDE',
    href: '#',
  },
];

export function BlogSection() {
  return (
    <section className='bg-tertiary container'>
      <div className='flex items-center justify-between mb-12'>
        <h2 className='heading-lg text-tertiary'>
          CANNABIS KNOWLEDGE HUB
        </h2>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3'>
        {blogPosts.map((post, index) => (
          <BlogCard
            key={post.id}
            index={index}
            post={post}
          />
        ))}
      </div>
    </section>
  );
}

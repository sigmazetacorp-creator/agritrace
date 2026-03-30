export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  category: string
  image?: string
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'agritrace-launch',
    title: 'Introducing AgriTrace: Blockchain-Backed Farm Traceability',
    excerpt: 'We\'re excited to announce the launch of AgriTrace, our blockchain-enabled farm traceability system that connects farmers to global buyers with complete transparency.',
    content: `AgriTrace represents a major milestone in our mission to bring Nigerian farmers to global markets. By leveraging blockchain technology and USSD accessibility, we're making farm-to-fork traceability available to farmers with any phone.

Key features of AgriTrace:
- **USSD Registration**: Farmers register using basic feature phones
- **Harvest Logging**: Simple SMS-based harvest documentation
- **Blockchain Records**: Every harvest is hashed on Polygon testnet
- **Buyer Verification**: QR code scanning confirms authenticity
- **Supply Chain Tracking**: Real-time shipment monitoring

AgriTrace empowers farmers by creating permanent, verifiable records of their produce quality, enabling premium pricing and direct access to export markets.`,
    date: '2026-03-25',
    author: 'QLF Team',
    category: 'Technology',
  },
  {
    id: '2',
    slug: 'nigerian-farming-iot',
    title: 'How IoT Technology is Revolutionizing Nigerian Agriculture',
    excerpt: 'Discover how Internet of Things devices are transforming farming practices across Nigeria, improving yields and reducing resource waste.',
    content: `Nigerian agriculture stands at an inflection point. With over 30 million smallholder farmers and growing demand for certified, traceable commodities, the adoption of IoT technology is no longer optional—it's essential.

At QLF, we\'ve deployed over 500 IoT-enabled farms across Nigeria and East Africa. These installations include:
- Smart irrigation systems with soil moisture sensors
- Weather stations for precise agronomic decisions
- Automated harvest documentation devices
- Real-time nutrient and pest monitoring

The results? Farmers report 30-40% increases in yield while reducing water usage by up to 50%. More importantly, verified farm data opens doors to premium export markets that previously weren't accessible to smallholder operations.`,
    date: '2026-03-18',
    author: 'Dr. Chioma Okafor',
    category: 'Agriculture',
  },
  {
    id: '3',
    slug: 'export-market-opportunity',
    title: 'Nigeria\'s Agricultural Export Opportunity: What Farmers Need to Know',
    excerpt: 'Explore the growing demand for Nigerian commodities in global markets and how farmers can position themselves for premium pricing.',
    content: `Nigeria exports over 2 million tonnes of agricultural products annually, yet smallholder farmers capture less than 5% of export value. The gap isn't production capacity—it's trust and documentation.

International buyers pay significant premiums for:
- **Certified Organic**: 15-25% higher pricing
- **Traceable Supply**: 10-15% premium
- **Consistent Quality**: Direct relationships with cooperatives

QLF removes barriers by providing the infrastructure smallholder farmers need:
- Farm certification through blockchain records
- Aggregation and quality standardization
- Export logistics and market connections
- Real-time visibility into shipments

For a farmer producing sesame or ginger, this means transforming from selling to local middlemen at 40% of export value to participating directly in premium global markets.`,
    date: '2026-03-10',
    author: 'Adekunle Adeyemi',
    category: 'Markets',
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

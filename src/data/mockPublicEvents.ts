export interface PublicEvent {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  venue?: string;
  address?: string;
  directions?: string;
  type: "virtual" | "physical" | "hybrid";
  category: "business" | "technology" | "entertainment" | "education" | "health";
  price: number;
  featured?: boolean;
  image?: string;
  provider: string;
  providerImage?: string;
  providerDescription?: string;
  providerEmail?: string;
  providerPhone?: string;
  providerWebsite?: string;
  providerSocial?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  customers: number;
  capacity?: number;
  registrationEndDate?: string;
  ticketTypes?: Array<{
    type: string;
    price: number;
    description?: string;
  }>;
  schedule?: Array<{
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }>;
  speakers?: Array<{
    name: string;
    title: string;
    bio?: string;
    image?: string;
  }>;
}

export const mockPublicEvents: PublicEvent[] = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description: "Join us for the biggest tech conference of the year featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.",
    longDescription:
      "Tech Conference 2024 brings together the brightest minds in technology for an immersive two-day experience. Discover the latest innovations, gain insights from thought leaders, and connect with peers who are shaping the future of tech.\n\nThis year's conference will focus on artificial intelligence, blockchain technology, cybersecurity, and digital transformation. Whether you're a developer, executive, entrepreneur, or tech enthusiast, you'll find valuable content tailored to your interests.\n\nDay 1 will feature keynote presentations from industry pioneers, followed by breakout sessions on specialized topics. Day 2 offers hands-on workshops, panel discussions, and ample networking opportunities.",
    date: "2024-04-15",
    time: "09:00:00",
    endTime: "17:00:00",
    location: "San Francisco Convention Center",
    venue: "Main Exhibition Hall",
    address: "747 Howard St, San Francisco, CA 94103",
    directions: "https://maps.google.com/?q=San+Francisco+Convention+Center",
    type: "physical",
    category: "technology",
    price: 299,
    featured: true,
    image: "https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    provider: "TechCorp Events",
    providerImage: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
    providerDescription: "TechCorp Events specializes in organizing high-quality technology conferences and workshops around the world.",
    providerEmail: "info@techcorpevents.com",
    providerPhone: "+1 (555) 123-4567",
    providerWebsite: "https://www.techcorpevents.com",
    providerSocial: {
      facebook: "https://facebook.com/techcorpevents",
      twitter: "https://twitter.com/techcorpevents",
      instagram: "https://instagram.com/techcorpevents",
      linkedin: "https://linkedin.com/company/techcorpevents",
    },
    customers: 450,
    capacity: 800,
    registrationEndDate: "2024-04-14",
    ticketTypes: [
      {
        type: "Early Bird",
        price: 199,
        description: "Limited availability, 30% off regular price",
      },
      {
        type: "Standard",
        price: 299,
        description: "Full conference access",
      },
      {
        type: "VIP",
        price: 499,
        description: "Includes exclusive networking event and premium seating",
      },
    ],
    schedule: [
      {
        time: "09:00 AM",
        title: "Registration & Breakfast",
        description: "Pick up your badge and enjoy a continental breakfast",
      },
      {
        time: "10:00 AM",
        title: "Opening Keynote",
        description: "The Future of AI in Business",
        speaker: "Sarah Johnson, CEO of AI Innovations",
      },
      {
        time: "11:30 AM",
        title: "Panel Discussion",
        description: "Blockchain Revolution: Beyond Cryptocurrency",
        speaker: "Panel of Industry Experts",
      },
      {
        time: "01:00 PM",
        title: "Lunch Break",
        description: "Networking lunch provided for all customers",
      },
      {
        time: "02:00 PM",
        title: "Workshop Sessions",
        description: "Multiple tracks available",
      },
      {
        time: "04:30 PM",
        title: "Closing Remarks",
        description: "Summary and preview of day 2",
      },
    ],
    speakers: [
      {
        name: "Sarah Johnson",
        title: "CEO, AI Innovations",
        bio: "Sarah is a pioneer in artificial intelligence with over 15 years of experience in the field.",
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
      },
      {
        name: "Michael Chen",
        title: "CTO, Blockchain Solutions",
        bio: "Michael has led the development of several groundbreaking blockchain platforms.",
        image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
      },
      {
        name: "Emma Rodriguez",
        title: "Director of Cybersecurity, TechDefend",
        bio: "Emma is an expert in cybersecurity strategy and implementation for enterprise organizations.",
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
      },
    ],
  },
  {
    id: "2",
    title: "Virtual Marketing Summit",
    description: "Learn the latest digital marketing strategies from industry experts in this comprehensive online summit.",
    longDescription:
      "The Virtual Marketing Summit brings together marketing professionals from around the world to share insights, strategies, and best practices in the ever-evolving digital landscape.\n\nThis online event features live presentations, interactive workshops, and virtual networking opportunities, all accessible from the comfort of your home or office. No travel required!\n\nTopics covered include content marketing, SEO, social media strategy, email marketing, conversion optimization, analytics, and emerging trends in digital marketing. Whether you're a seasoned marketing professional or just starting your career, this summit offers valuable knowledge to help you stay ahead of the curve.",
    date: "2024-04-20",
    time: "10:00:00",
    endTime: "16:00:00",
    location: "Online",
    type: "virtual",
    category: "business",
    price: 149,
    featured: false,
    image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    provider: "Digital Marketing Association",
    providerDescription: "The Digital Marketing Association is dedicated to advancing the marketing profession through education, networking, and resources.",
    providerEmail: "info@digitalmarketingassoc.org",
    providerWebsite: "https://www.digitalmarketingassoc.org",
    providerSocial: {
      twitter: "https://twitter.com/digimktassoc",
      linkedin: "https://linkedin.com/company/digitalmarketingassociation",
    },
    customers: 320,
    registrationEndDate: "2024-04-19",
    ticketTypes: [
      {
        type: "Basic Access",
        price: 149,
        description: "Access to all sessions and recordings",
      },
      {
        type: "Premium Access",
        price: 249,
        description: "Basic access plus exclusive Q&A sessions and downloadable resources",
      },
    ],
    speakers: [
      {
        name: "David Wilson",
        title: "Head of Content Strategy, ContentPro",
        bio: "David has helped hundreds of companies develop effective content marketing strategies.",
      },
      {
        name: "Lisa Anderson",
        title: "Social Media Director, SocialBoost",
        bio: "Lisa specializes in creating viral social media campaigns for major brands.",
      },
    ],
  },
  {
    id: "3",
    title: "Health & Wellness Expo",
    description: "Discover the latest trends in health, fitness, nutrition, and mental wellbeing at this comprehensive wellness expo.",
    date: "2024-05-05",
    time: "10:00:00",
    endTime: "18:00:00",
    location: "Chicago Convention Center",
    venue: "North Hall",
    address: "301 E North Water St, Chicago, IL 60611",
    type: "physical",
    category: "health",
    price: 25,
    featured: true,
    image: "https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    provider: "Wellness Collective",
    providerEmail: "contact@wellnesscollective.org",
    providerPhone: "+1 (555) 987-6543",
    customers: 650,
    capacity: 1000,
    ticketTypes: [
      {
        type: "General Admission",
        price: 25,
        description: "Access to all expo areas and general sessions",
      },
      {
        type: "VIP Pass",
        price: 75,
        description: "General admission plus exclusive workshops and goodie bag",
      },
    ],
  },
  {
    id: "4",
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to a panel of investors and industry experts for a chance to win funding.",
    date: "2024-04-28",
    time: "13:00:00",
    endTime: "17:00:00",
    location: "New York Innovation Hub",
    address: "350 5th Ave, New York, NY 10118",
    type: "hybrid",
    category: "business",
    price: 0,
    featured: false,
    image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    provider: "Venture Capital Partners",
    providerWebsite: "https://www.vcpartners.com",
    customers: 200,
    capacity: 250,
  },
  {
    id: "5",
    title: "Web Development Bootcamp",
    description: "Intensive one-day workshop covering modern web development frameworks and best practices.",
    date: "2024-05-12",
    time: "09:00:00",
    endTime: "17:00:00",
    location: "Online",
    type: "virtual",
    category: "education",
    price: 199,
    featured: false,
    image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    provider: "Code Academy",
    providerEmail: "workshops@codeacademy.com",
    customers: 75,
    capacity: 100,
  },
  {
    id: "6",
    title: "Music Festival 2024",
    description: "Three days of live performances from top artists across multiple genres, food vendors, and art installations.",
    date: "2024-06-15",
    time: "12:00:00",
    endTime: "23:00:00",
    location: "Riverside Park",
    address: "2420 Riverside Ave, Austin, TX 78741",
    type: "physical",
    category: "entertainment",
    price: 150,
    featured: true,
    image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    provider: "SoundWave Productions",
    providerWebsite: "https://www.soundwaveproductions.com",
    providerSocial: {
      instagram: "https://instagram.com/soundwaveprod",
      twitter: "https://twitter.com/soundwaveprod",
    },
    customers: 5000,
    capacity: 7500,
    ticketTypes: [
      {
        type: "Single Day Pass",
        price: 75,
        description: "Access for one day of your choice",
      },
      {
        type: "Full Festival Pass",
        price: 150,
        description: "Access to all three days",
      },
      {
        type: "VIP Experience",
        price: 350,
        description: "Full access plus VIP lounge, premium viewing areas, and exclusive perks",
      },
    ],
  },
  {
    id: "7",
    title: "AI in Healthcare Symposium",
    description: "Exploring the transformative potential of artificial intelligence in healthcare delivery, diagnostics, and patient care.",
    date: "2024-05-18",
    time: "09:30:00",
    endTime: "16:30:00",
    location: "Boston Medical Center",
    address: "750 Albany St, Boston, MA 02119",
    type: "physical",
    category: "technology",
    price: 275,
    featured: false,
    image: "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    provider: "Healthcare Innovation Network",
    providerEmail: "events@healthcareinnovation.org",
    customers: 180,
    capacity: 200,
  },
  {
    id: "8",
    title: "Financial Planning Workshop",
    description: "Learn practical strategies for personal finance, retirement planning, and investment from certified financial planners.",
    date: "2024-04-22",
    time: "18:00:00",
    endTime: "20:00:00",
    location: "Online",
    type: "virtual",
    category: "education",
    price: 0,
    featured: false,
    image: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    provider: "Financial Literacy Foundation",
    providerWebsite: "https://www.finlitfoundation.org",
    customers: 250,
    capacity: 500,
  },
  {
    id: "9",
    title: "Sustainable Fashion Show",
    description: "Showcasing eco-friendly and ethically produced fashion collections from emerging and established designers.",
    date: "2024-05-30",
    time: "19:00:00",
    endTime: "22:00:00",
    location: "The Green Gallery",
    address: "123 Eco Blvd, Portland, OR 97205",
    type: "physical",
    category: "entertainment",
    price: 45,
    featured: false,
    image: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    provider: "EcoStyle Collective",
    providerSocial: {
      instagram: "https://instagram.com/ecostylecollective",
    },
    customers: 120,
    capacity: 150,
  },
  {
    id: "10",
    title: "Mental Health Awareness Conference",
    description: "Breaking stigmas and promoting understanding of mental health issues through education, personal stories, and expert insights.",
    date: "2024-05-10",
    time: "10:00:00",
    endTime: "16:00:00",
    location: "Community Wellness Center",
    address: "500 Healing Way, Denver, CO 80202",
    type: "hybrid",
    category: "health",
    price: 15,
    featured: false,
    image: "https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    provider: "Mental Health Alliance",
    providerEmail: "contact@mentalhealthalliance.org",
    providerPhone: "+1 (555) 234-5678",
    customers: 300,
    capacity: 400,
  },
];

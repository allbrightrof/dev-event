export interface EventItem {
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
  image: string;
  description?: string;
}

export const events: EventItem[] = [
  {
    title: "React Rally 2026",
    slug: "react-rally-2026",
    location: "Salt Lake City, UT",
    date: "July 15-17, 2026",
    time: "09:00 AM - 05:30 PM",
    image: "/images/event1.png",
    description: "A community-led React conference with workshops and keynotes from React core team members."
  },
  {
    title: "Google I/O 2026",
    slug: "google-io-2026",
    location: "Mountain View, CA",
    date: "May 19-21, 2026",
    time: "10:00 AM - 06:00 PM PDT",
    image: "/images/event2.png",
    description: "The biggest Google developer event for Android, Firebase, and Web platform updates."
  },
  {
    title: "AWS re:Invent 2026",
    slug: "aws-reinvent-2026",
    location: "Las Vegas, NV",
    date: "November 26-30, 2026",
    time: "08:00 AM - 07:00 PM",
    image: "/images/event3.png",
    description: "Cloud infrastructure, serverless, and AI/ML conference with training and certifications."
  },
  {
    title: "GitHub Universe 2026",
    slug: "github-universe-2026",
    location: "San Francisco, CA",
    date: "September 10-12, 2026",
    time: "09:00 AM - 05:00 PM",
    image: "/images/event4.png",
    description: "A global gathering for developers to learn about GitHub, security, and open source."
  },
  {
    title: "HackFS 2026",
    slug: "hackfs-2026",
    location: "Online",
    date: "August 22-24, 2026",
    time: "24 hours",
    image: "/images/event5.png",
    description: "Filecoin and Web3 hackathon for builders and open-source contributors."
  },
  {
    title: "NodeConf EU 2026",
    slug: "nodeconf-eu-2026",
    location: "Dublin, Ireland",
    date: "October 7-9, 2026",
    time: "10:00 AM - 06:00 PM GMT",
    image: "/images/event6.png",
    description: "The premier Node.js community conference in Europe with talks, workshops, and networking."
  }
];

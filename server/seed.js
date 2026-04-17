// seed.js — Run once to populate DB with initial data
import './src/config/loadEnv.js';

import mongoose from 'mongoose';
import WorkProject from './src/mvc/models/WorkProject.js';
import PlaygroundItem from './src/mvc/models/PlaygroundItem.js';
import SiteSettings from './src/mvc/models/SiteSettings.js';

const workProjects = [
  {
    title: "Brand Identity for Creative Studio",
    subtitle: "Visual Identity & Art Direction",
    year: "2024",
    tag: "BRANDING",
    image: "creative studio branding design",
    description: "A comprehensive brand identity system for a boutique creative studio. The project involved developing a unique visual language that reflects the studio's innovative approach and creative excellence.",
    role: "Art Director & Brand Designer",
    client: "Creative Studio",
    services: ["Brand Strategy", "Visual Identity", "Art Direction", "Brand Guidelines"],
    gallery: ["brand identity design mockup", "logo design variations", "brand collateral design", "business card design mockup"]
  },
  {
    title: "Digital Campaign for Tech Launch",
    subtitle: "Campaign Design & Strategy",
    year: "2024",
    tag: "CAMPAIGN",
    image: "digital marketing campaign design",
    description: "Led the creative direction for a multi-platform digital campaign launching an innovative tech product.",
    role: "Creative Director",
    client: "Tech Startup",
    services: ["Campaign Strategy", "Digital Design", "Social Media", "Motion Graphics"],
    gallery: ["digital campaign mockup", "social media design templates", "landing page design", "mobile app interface"]
  },
  {
    title: "Editorial Design for Fashion Magazine",
    subtitle: "Layout Design & Typography",
    year: "2023",
    tag: "EDITORIAL",
    image: "fashion magazine layout design",
    description: "Art direction and layout design for a premium fashion magazine's special edition.",
    role: "Art Director",
    client: "Fashion Magazine",
    services: ["Editorial Design", "Typography", "Art Direction", "Photo Art Direction"],
    gallery: ["magazine spread design", "editorial layout design", "fashion photography direction", "typography design layout"]
  },
  {
    title: "Packaging Design for Premium Coffee Brand",
    subtitle: "Product Design & Branding",
    year: "2023",
    tag: "PACKAGING",
    image: "coffee packaging design premium",
    description: "Developed an elegant packaging system for a premium coffee brand.",
    role: "Brand & Packaging Designer",
    client: "Premium Coffee Co.",
    services: ["Packaging Design", "Illustration", "Brand Identity", "Print Production"],
    gallery: ["coffee packaging mockup", "product packaging design", "packaging box design", "label design mockup"]
  },
  {
    title: "Interactive Web Experience for Art Gallery",
    subtitle: "UX/UI Design & Development",
    year: "2023",
    tag: "DIGITAL",
    image: "art gallery website design",
    description: "Designed and directed the development of an immersive web experience for a contemporary art gallery.",
    role: "UX/UI Director",
    client: "Contemporary Art Gallery",
    services: ["Web Design", "UI/UX", "Art Direction", "Interactive Design"],
    gallery: ["website design mockup", "web interface design", "mobile responsive design", "interactive web design"]
  },
  {
    title: "Motion Graphics for Music Festival",
    subtitle: "Animation & Visual Effects",
    year: "2022",
    tag: "MOTION",
    image: "music festival motion graphics",
    description: "Created dynamic motion graphics and visual effects for a major music festival's promotional campaign.",
    role: "Motion Designer",
    client: "Music Festival",
    services: ["Motion Graphics", "Animation", "Visual Effects", "Video Editing"],
    gallery: ["motion graphics design", "animated poster design", "video editing project", "visual effects design"]
  }
];

const playgroundItems = [
  { title: "Abstract Poster Series", type: "GRAPHIC DESIGN", image: "abstract geometric poster design", description: "An experimental poster series exploring abstract forms, bold typography, and vibrant color palettes.", tools: ["Adobe Illustrator", "Photoshop"], year: "2024" },
  { title: "3D Product Renders", type: "3D DESIGN", image: "3d product rendering design", description: "Collection of photorealistic 3D product renders exploring materials, lighting, and composition.", tools: ["Blender", "Cinema 4D"], year: "2024" },
  { title: "Typography Experiments", type: "TYPE DESIGN", image: "experimental typography design", description: "Experimental typography studies exploring letterforms, compositions, and creative applications.", tools: ["Adobe Illustrator", "Glyphs"], year: "2024" },
  { title: "Brand Concept Studies", type: "BRANDING", image: "brand identity concept design", description: "Conceptual brand identity explorations for fictional clients.", tools: ["Illustrator", "Figma"], year: "2023" },
  { title: "Digital Illustrations", type: "ILLUSTRATION", image: "digital illustration artwork", description: "A series of digital illustrations combining various styles and techniques.", tools: ["Procreate", "Photoshop"], year: "2023" },
  { title: "UI Concept Designs", type: "UI DESIGN", image: "mobile app ui design concept", description: "Interface design concepts for various application types.", tools: ["Figma", "Sketch"], year: "2023" },
  { title: "Photo Manipulations", type: "DIGITAL ART", image: "surreal photo manipulation art", description: "Surreal photo manipulation artworks that blend photography with digital painting.", tools: ["Photoshop", "Lightroom"], year: "2023" },
  { title: "Pattern & Texture", type: "SURFACE DESIGN", image: "geometric pattern design", description: "Pattern and texture designs for various applications including textiles, packaging, and digital backgrounds.", tools: ["Illustrator", "Photoshop"], year: "2022" }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await WorkProject.deleteMany({});
    await PlaygroundItem.deleteMany({});
    await SiteSettings.deleteMany({});

    // Insert seed data
    await WorkProject.insertMany(workProjects);
    console.log(`✓ Seeded ${workProjects.length} work projects`);

    await PlaygroundItem.insertMany(playgroundItems);
    console.log(`✓ Seeded ${playgroundItems.length} playground items`);

    await SiteSettings.create({
      key: 'main',
      heroImage: '/pTliQDNkL6D6AXQESYbLMpkK8U.jpg',
      heroImageType: 'local'
    });
    console.log('✓ Seeded site settings');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();

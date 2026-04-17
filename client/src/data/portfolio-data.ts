export interface WorkProject {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  description: string;
  role: string;
  client: string;
  services: string[];
  gallery: string[];
}

export interface PlaygroundItem {
  id: string;
  title: string;
  type: string;
  image: string;
  description: string;
  tools: string[];
  year: string;
}

export const workProjects: WorkProject[] = [
  {
    id: "brand-identity-studio",
    year: "2024",
    title: "Brand Identity for Creative Studio",
    subtitle: "Visual Identity & Art Direction",
    tag: "BRANDING",
    image: "creative studio branding design",
    description: "A comprehensive brand identity system for a boutique creative studio. The project involved developing a unique visual language that reflects the studio's innovative approach and creative excellence. The identity system includes logo design, typography, color palette, and brand applications across various touchpoints.",
    role: "Art Director & Brand Designer",
    client: "Creative Studio",
    services: ["Brand Strategy", "Visual Identity", "Art Direction", "Brand Guidelines"],
    gallery: [
      "brand identity design mockup",
      "logo design variations",
      "brand collateral design",
      "business card design mockup"
    ]
  },
  {
    id: "digital-campaign",
    year: "2024",
    title: "Digital Campaign for Tech Launch",
    subtitle: "Campaign Design & Strategy",
    tag: "CAMPAIGN",
    image: "digital marketing campaign design",
    description: "Led the creative direction for a multi-platform digital campaign launching an innovative tech product. The campaign included social media assets, landing page design, email marketing templates, and interactive experiences that drove significant engagement and conversions.",
    role: "Creative Director",
    client: "Tech Startup",
    services: ["Campaign Strategy", "Digital Design", "Social Media", "Motion Graphics"],
    gallery: [
      "digital campaign mockup",
      "social media design templates",
      "landing page design",
      "mobile app interface"
    ]
  },
  {
    id: "editorial-magazine",
    year: "2023",
    title: "Editorial Design for Fashion Magazine",
    subtitle: "Layout Design & Typography",
    tag: "EDITORIAL",
    image: "fashion magazine layout design",
    description: "Art direction and layout design for a premium fashion magazine's special edition. Created sophisticated editorial layouts that balance stunning photography with elegant typography, resulting in a visually compelling narrative that celebrates contemporary fashion.",
    role: "Art Director",
    client: "Fashion Magazine",
    services: ["Editorial Design", "Typography", "Art Direction", "Photo Art Direction"],
    gallery: [
      "magazine spread design",
      "editorial layout design",
      "fashion photography direction",
      "typography design layout"
    ]
  },
  {
    id: "packaging-design",
    year: "2023",
    title: "Packaging Design for Premium Coffee Brand",
    subtitle: "Product Design & Branding",
    tag: "PACKAGING",
    image: "coffee packaging design premium",
    description: "Developed an elegant packaging system for a premium coffee brand that reflects the brand's commitment to quality and sustainability. The design features custom illustrations, eco-friendly materials, and a distinctive shelf presence that appeals to discerning consumers.",
    role: "Brand & Packaging Designer",
    client: "Premium Coffee Co.",
    services: ["Packaging Design", "Illustration", "Brand Identity", "Print Production"],
    gallery: [
      "coffee packaging mockup",
      "product packaging design",
      "packaging box design",
      "label design mockup"
    ]
  },
  {
    id: "web-experience",
    year: "2023",
    title: "Interactive Web Experience for Art Gallery",
    subtitle: "UX/UI Design & Development",
    tag: "DIGITAL",
    image: "art gallery website design",
    description: "Designed and directed the development of an immersive web experience for a contemporary art gallery. The site features dynamic layouts, smooth animations, and an intuitive navigation system that showcases artworks in an engaging digital environment.",
    role: "UX/UI Director",
    client: "Contemporary Art Gallery",
    services: ["Web Design", "UI/UX", "Art Direction", "Interactive Design"],
    gallery: [
      "website design mockup",
      "web interface design",
      "mobile responsive design",
      "interactive web design"
    ]
  },
  {
    id: "motion-graphics",
    year: "2022",
    title: "Motion Graphics for Music Festival",
    subtitle: "Animation & Visual Effects",
    tag: "MOTION",
    image: "music festival motion graphics",
    description: "Created dynamic motion graphics and visual effects for a major music festival's promotional campaign. The work included animated title sequences, social media content, and large-scale projection mapping that created an unforgettable visual experience.",
    role: "Motion Designer",
    client: "Music Festival",
    services: ["Motion Graphics", "Animation", "Visual Effects", "Video Editing"],
    gallery: [
      "motion graphics design",
      "animated poster design",
      "video editing project",
      "visual effects design"
    ]
  }
];

export const playgroundItems: PlaygroundItem[] = [
  {
    id: "abstract-posters",
    title: "Abstract Poster Series",
    type: "GRAPHIC DESIGN",
    image: "abstract geometric poster design",
    description: "An experimental poster series exploring abstract forms, bold typography, and vibrant color palettes. This personal project allowed me to push creative boundaries and experiment with various design techniques.",
    tools: ["Adobe Illustrator", "Photoshop"],
    year: "2024"
  },
  {
    id: "3d-renders",
    title: "3D Product Renders",
    type: "3D DESIGN",
    image: "3d product rendering design",
    description: "Collection of photorealistic 3D product renders exploring materials, lighting, and composition. These renders demonstrate technical skill in 3D software while maintaining strong aesthetic sensibility.",
    tools: ["Blender", "Cinema 4D"],
    year: "2024"
  },
  {
    id: "typography-experiments",
    title: "Typography Experiments",
    type: "TYPE DESIGN",
    image: "experimental typography design",
    description: "Experimental typography studies exploring letterforms, compositions, and creative applications. Each piece investigates different aspects of type design from traditional to contemporary approaches.",
    tools: ["Adobe Illustrator", "Glyphs"],
    year: "2024"
  },
  {
    id: "brand-concepts",
    title: "Brand Concept Studies",
    type: "BRANDING",
    image: "brand identity concept design",
    description: "Conceptual brand identity explorations for fictional clients. These studies showcase different design approaches and help refine my creative process and visual thinking.",
    tools: ["Illustrator", "Figma"],
    year: "2023"
  },
  {
    id: "illustration-series",
    title: "Digital Illustrations",
    type: "ILLUSTRATION",
    image: "digital illustration artwork",
    description: "A series of digital illustrations combining various styles and techniques. From minimalist line art to complex detailed compositions, these pieces explore different visual narratives.",
    tools: ["Procreate", "Photoshop"],
    year: "2023"
  },
  {
    id: "ui-concepts",
    title: "UI Concept Designs",
    type: "UI DESIGN",
    image: "mobile app ui design concept",
    description: "Interface design concepts for various application types. These explorations focus on user experience, visual hierarchy, and modern design patterns.",
    tools: ["Figma", "Sketch"],
    year: "2023"
  },
  {
    id: "photo-manipulations",
    title: "Photo Manipulations",
    type: "DIGITAL ART",
    image: "surreal photo manipulation art",
    description: "Surreal photo manipulation artworks that blend photography with digital painting. These pieces create dreamlike scenarios and explore the boundaries between reality and imagination.",
    tools: ["Photoshop", "Lightroom"],
    year: "2023"
  },
  {
    id: "pattern-designs",
    title: "Pattern & Texture",
    type: "SURFACE DESIGN",
    image: "geometric pattern design",
    description: "Pattern and texture designs for various applications including textiles, packaging, and digital backgrounds. Each pattern explores different rhythms, colors, and compositional strategies.",
    tools: ["Illustrator", "Photoshop"],
    year: "2022"
  }
];

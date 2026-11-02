/* SkillKart — Master Application Script & State Controller */

// Utility DOM helpers
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// --- STATE MANAGEMENT ---
const STORAGE_KEYS = {
  SAVED: 'skillkart_saved_projects',
  APPLICATIONS: 'skillkart_applications',
  BOOKINGS: 'skillkart_bookings',
  PAYMENTS: 'skillkart_payments',
  CUSTOM_PROJECTS: 'skillkart_custom_projects'
};

function getStorage(key, fallback = []) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}
function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
}

// Toast notification helper
function showToast(message) {
  let toast = $('#globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// --- DATA STORES ---
const initialProfiles = [
  { id: 0, category: 'dev', name: 'Aarav Patel', college: 'IIT Gandhinagar · B.Tech CSE', role: 'Frontend developer', skills: ['React', 'TypeScript', 'Figma', 'Next.js'], level: 'Intermediate', rate: 'From ₹1,800', rating: 4.9, reviews: 18, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80', bio: 'Computer science undergrad building fast, accessible web interfaces and design systems.', languages: 'English, Hindi, Gujarati', responseTime: 'Within 2 hours' },
  { id: 1, category: 'design', name: 'Meher Shah', college: 'NID Ahmedabad · Visual Communication', role: 'Brand identity designer', skills: ['Branding', 'Illustrator', 'Packaging', 'Typography'], level: 'Advanced', rate: 'From ₹2,500', rating: 4.9, reviews: 24, availability: 'Available this week', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', bio: 'Visual designer exploring thoughtful brand narratives, typography and packaging design for conscious startups.', languages: 'English, Hindi, Gujarati', responseTime: 'Within 1 hour' },
  { id: 2, category: 'data', name: 'Rohan Iyer', college: 'DA-IICT · B.Tech ICT', role: 'Data analyst', skills: ['Python', 'SQL', 'Power BI', 'Pandas'], level: 'Intermediate', rate: 'From ₹1,500', rating: 4.7, reviews: 12, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', bio: 'Translating complex startup operational data into clean, actionable dashboards and automated reporting.', languages: 'English, Hindi, Tamil', responseTime: 'Within 3 hours' },
  { id: 3, category: 'media', name: 'Ishita Shah', college: 'NID Ahmedabad · Photography & Design', role: 'Product photographer', skills: ['Product shoots', 'Lightroom', 'Reels', 'Art Direction'], level: 'Advanced', rate: 'From ₹2,000', rating: 4.8, reviews: 31, availability: 'Available next week', photo: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=500&q=80', bio: 'Capturing tactile textures and product aesthetics for sustainable fashion, food brands and lifestyle craft.', languages: 'English, Hindi, Gujarati', responseTime: 'Within 2 hours' },
  { id: 4, category: 'marketing', name: 'Zoya Khan', college: 'St. Xavier’s · BBA', role: 'Social media manager', skills: ['Content strategy', 'Canva', 'Analytics', 'Copywriting'], level: 'Beginner', rate: 'From ₹799', rating: 4.6, reviews: 9, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80', bio: 'Helping campus clubs and local lifestyle brands find their authentic voice on Instagram and LinkedIn.', languages: 'English, Hindi, Urdu', responseTime: 'Within 1 hour' },
  { id: 5, category: 'dev', name: 'Dev Malhotra', college: 'PDEU · B.Tech ICT', role: 'Flutter developer', skills: ['Flutter', 'Firebase', 'UI Integration', 'Dart'], level: 'Intermediate', rate: 'From ₹2,200', rating: 4.8, reviews: 15, availability: 'Available this week', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80', bio: 'Cross-platform mobile developer focused on smooth micro-interactions, clean state management and clean architecture.', languages: 'English, Hindi, Punjabi', responseTime: 'Within 2 hours' },
  { id: 6, category: 'cad', name: 'Kavya Nair', college: 'CEPT University · Architecture', role: 'CAD & 3D visualizer', skills: ['AutoCAD', 'SketchUp', 'Layouts', 'Rhino'], level: 'Intermediate', rate: 'From ₹1,700', rating: 4.7, reviews: 11, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80', bio: 'Architecture student crafting precision 2D floor plans, elevation drawings and realistic 3D spatial renders.', languages: 'English, Hindi, Malayalam', responseTime: 'Within 4 hours' },
  { id: 7, category: 'dev', name: 'Arjun Sethi', college: 'Nirma University · MCA', role: 'Backend developer', skills: ['Node.js', 'Java', 'MongoDB', 'Docker'], level: 'Advanced', rate: 'From ₹2,600', rating: 4.9, reviews: 22, availability: 'Available next week', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80', bio: 'Backend engineer specializing in resilient REST APIs, auth flows, webhook listeners and cloud databases.', languages: 'English, Hindi', responseTime: 'Within 2 hours' },
  { id: 8, category: 'writer', name: 'Naina Roy', college: 'MICA · Strategic Communications', role: 'Copywriter & strategist', skills: ['Brand voice', 'SEO writing', 'Landing page copy', 'Editorial'], level: 'Intermediate', rate: 'From ₹999', rating: 4.8, reviews: 19, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80', bio: 'Crafting sharp headlines, narrative essays and high-converting marketing copy that makes readers feel understood.', languages: 'English, Hindi, Bengali', responseTime: 'Within 1 hour' },
  { id: 9, category: 'dev', name: 'Yash Trivedi', college: 'Gujarat University · BCA', role: 'Android developer', skills: ['Kotlin', 'Java', 'Firebase', 'Material 3'], level: 'Beginner', rate: 'From ₹1,400', rating: 4.5, reviews: 7, availability: 'Available this week', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80', bio: 'Building neat native Android experiences adhering to modern Jetpack libraries and material design guidelines.', languages: 'English, Hindi, Gujarati', responseTime: 'Within 3 hours' },
  { id: 10, category: 'fashion', name: 'Tanvi Rao', college: 'NIFT Gandhinagar · Fashion Communication', role: 'Visual stylist & illustrator', skills: ['Fashion illustration', 'Moodboards', 'Styling', 'Procreate'], level: 'Intermediate', rate: 'From ₹1,600', rating: 4.7, reviews: 13, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80', bio: 'Creative director for editorial fashion shoots, textile concept decks and custom digital portraits.', languages: 'English, Hindi, Telugu', responseTime: 'Within 2 hours' },
  { id: 11, category: 'media', name: 'Simran Kaur', college: 'NID Ahmedabad · Animation Film', role: 'Motion designer', skills: ['After Effects', '2D Animation', 'Lottie', 'Storyboarding'], level: 'Advanced', rate: 'From ₹2,400', rating: 4.9, reviews: 27, availability: 'Available next week', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80', bio: 'Animating expressive micro-interactions for web products and viral explanatory motion clips for brands.', languages: 'English, Hindi, Punjabi', responseTime: 'Within 2 hours' },
  { id: 12, category: 'data', name: 'Aditya Verma', college: 'IIT Bombay · AI & Data Science', role: 'AI & Machine Learning contributor', skills: ['Python', 'TensorFlow', 'Data cleaning', 'Scikit-Learn'], level: 'Advanced', rate: 'From ₹2,800', rating: 4.8, reviews: 16, availability: 'Available next week', photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=500&q=80', bio: 'Building applied machine learning prototypes, data extraction scripts, and predictive modeling for startups.', languages: 'English, Hindi', responseTime: 'Within 2 hours' },
  { id: 13, category: 'writer', name: 'Pooja Desai', college: 'MSU Baroda · English Literature', role: 'Content writer & proofreader', skills: ['Blog writing', 'Editorial', 'Translation', 'Articles'], level: 'Intermediate', rate: 'From ₹850', rating: 4.6, reviews: 14, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80', bio: 'Writing well-researched essays, long-form articles, and bilingual translations between English and Gujarati.', languages: 'English, Hindi, Gujarati', responseTime: 'Within 1 hour' },
  { id: 14, category: 'dev', name: 'Neil Dsouza', college: 'Ahmedabad University · Computer Systems', role: 'Cybersecurity & Linux learner', skills: ['Security audits', 'Linux shell', 'Penetration testing', 'Bash'], level: 'Beginner', rate: 'From ₹1,200', rating: 4.5, reviews: 6, availability: 'Available this week', photo: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80', bio: 'Assisting small businesses with vulnerability scanning, basic penetration testing, and server configuration.', languages: 'English, Hindi', responseTime: 'Within 3 hours' },
  { id: 15, category: 'cad', name: 'Kabir Joshi', college: 'PDEU · Mechanical Engineering', role: 'Industrial product designer', skills: ['SolidWorks', 'CAD modeling', 'Rendering', 'KeyShot'], level: 'Intermediate', rate: 'From ₹1,900', rating: 4.7, reviews: 10, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80', bio: 'Transforming napkin sketches into detailed CAD models, technical BOMs, and photorealistic hardware renders.', languages: 'English, Hindi, Gujarati', responseTime: 'Within 2 hours' },
  { id: 16, category: 'marketing', name: 'Aditi Menon', college: 'MICA · Strategic Marketing', role: 'Market researcher & analyst', skills: ['Competitive research', 'Survey design', 'Excel models', 'Trend decks'], level: 'Intermediate', rate: 'From ₹1,100', rating: 4.8, reviews: 21, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80', bio: 'Conducting in-depth market landscape surveys, competitor benchmarking, and pricing sensitivity studies.', languages: 'English, Hindi, Malayalam', responseTime: 'Within 2 hours' },
  { id: 17, category: 'dev', name: 'Ritwik Bose', college: 'Nirma University · Computer Engineering', role: 'WordPress & CMS developer', skills: ['WordPress', 'WooCommerce', 'PHP', 'SEO Setup'], level: 'Intermediate', rate: 'From ₹1,600', rating: 4.7, reviews: 14, availability: 'Available this week', photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=500&q=80', bio: 'Setting up lightweight, SEO-friendly custom WordPress themes, blog migrations, and WooCommerce stores.', languages: 'English, Hindi, Bengali', responseTime: 'Within 2 hours' },
  { id: 18, category: 'media', name: 'Jiya Kapoor', college: 'Gujarat University · Performing Arts', role: 'Voice-over artist & narrator', skills: ['Voice-over', 'Hindi narration', 'English voice', 'Commercials'], level: 'Beginner', rate: 'From ₹700', rating: 4.6, reviews: 8, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&q=80', bio: 'Delivering warm, articulate voice-overs in Hindi and English for explainer videos, ads, and podcast intros.', languages: 'English, Hindi', responseTime: 'Within 1 hour' },
  { id: 19, category: 'data', name: 'Manav Gupta', college: 'DA-IICT · MSc Data Science', role: 'Database & SQL specialist', skills: ['PostgreSQL', 'Database schema', 'Query optimization', 'ERD'], level: 'Advanced', rate: 'From ₹2,300', rating: 4.8, reviews: 17, availability: 'Available next week', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80', bio: 'Designing scalable SQL database schemas, indexing strategies, and automated ETL pipelines.', languages: 'English, Hindi', responseTime: 'Within 2 hours' },
  { id: 20, category: 'cad', name: 'Rhea Paul', college: 'CEPT University · Interior Design', role: 'Interior 3D visualizer', skills: ['SketchUp', 'V-Ray', 'Spatial layouts', 'Material selection'], level: 'Intermediate', rate: 'From ₹1,800', rating: 4.7, reviews: 12, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=80', bio: 'Visualizing residential and retail interior concepts with realistic lighting, textures, and accurate furniture plans.', languages: 'English, Hindi', responseTime: 'Within 3 hours' },
  { id: 21, category: 'assistant', name: 'Om Bhatt', college: 'Nirma University · BBA', role: 'Virtual assistant & ops coordinator', skills: ['Google Sheets', 'Calendar scheduling', 'Web research', 'Data entry'], level: 'Beginner', rate: 'From ₹650', rating: 4.5, reviews: 5, availability: 'Available this week', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', bio: 'Providing meticulous executive support, lead list compilation, CRM data entry, and schedule organization.', languages: 'English, Hindi, Gujarati', responseTime: 'Within 1 hour' },
  { id: 22, category: 'design', name: 'Ira Singh', college: 'NID Ahmedabad · Product Design', role: 'UI/UX researcher & prototyper', skills: ['User research', 'Figma prototypes', 'Usability testing', 'Wireframes'], level: 'Advanced', rate: 'From ₹2,200', rating: 4.9, reviews: 26, availability: 'Available now', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80', bio: 'Conducting generative user interviews and synthesizing insights into high-fidelity clickable Figma prototypes.', languages: 'English, Hindi', responseTime: 'Within 2 hours' },
  { id: 23, category: 'media', name: 'Vivan Shah', college: 'St. Xavier’s College · Audio Production', role: 'Podcast & audio editor', skills: ['Podcast clean-up', 'Adobe Audition', 'Audio mixing', 'Sound effects'], level: 'Intermediate', rate: 'From ₹1,300', rating: 4.7, reviews: 10, availability: 'Available next week', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80', bio: 'Removing background hiss, balancing vocal levels, and adding dynamic sonic branding to episodic podcasts.', languages: 'English, Hindi, Gujarati', responseTime: 'Within 2 hours' }
];

const initialProjects = [
  {
    id: 'p-1',
    title: 'Instagram carousel & visual branding for sustainable fashion label',
    client: 'Marigold Studio',
    clientInitial: 'M',
    clientLogo: 'coral',
    location: 'Ahmedabad',
    category: 'design',
    budget: '₹ 2,000–3,000',
    budgetValue: 2500,
    deadline: '4 days left',
    daysValue: 4,
    level: 'Beginner',
    tags: ['Canva', 'Branding', 'Social media', 'Typography'],
    description: 'We are launching our spring organic cotton collection. Need 5 cohesive carousel templates and story graphics that tell the story of local artisan weaving.',
    deliverables: ['5 multi-slide Instagram carousels', 'Figma/Canva source files with brand fonts', '3 story template variations'],
    applicationsCount: 8
  },
  {
    id: 'p-2',
    title: 'Reels video editor for high-growth culinary creator',
    client: 'The Sunday Table',
    clientInitial: 'S',
    clientLogo: 'gold',
    location: 'Remote',
    category: 'video',
    budget: '₹ 1,500',
    budgetValue: 1500,
    deadline: '2 days left',
    daysValue: 2,
    level: 'Intermediate',
    tags: ['Premiere Pro', 'Short form', 'Sound design', 'CapCut'],
    description: 'Looking for a student video editor who understands food pacing, crisp sound design, and clean typography to cut 3 Instagram Reels from raw cooking footage.',
    deliverables: ['3 polished 30-45s Reels with captions', 'Color grade matching warm kitchen tone', 'Exported in 9:16 vertical 4K'],
    applicationsCount: 14
  },
  {
    id: 'p-3',
    title: 'Modern landing page for early-stage wellness startup',
    client: 'Niyama Wellness',
    clientInitial: 'N',
    clientLogo: 'purple',
    location: 'Remote',
    category: 'dev',
    budget: '₹ 6,000–8,000',
    budgetValue: 7000,
    deadline: '6 days left',
    daysValue: 6,
    level: 'Intermediate',
    tags: ['HTML/CSS', 'JavaScript', 'Responsive', 'Figma'],
    description: 'We have complete Figma screens for our hero launch site. Need a student developer to turn it into clean, fast semantic code with subtle reveal animations.',
    deliverables: ['Responsive HTML5/CSS3 landing page', 'Mobile drawer menu & working contact form', 'Performance score > 90 on mobile'],
    applicationsCount: 11
  },
  {
    id: 'p-4',
    title: 'E-commerce product catalogue & lookbook design',
    client: 'Harit Naturals',
    clientInitial: 'H',
    clientLogo: 'mint',
    location: 'Remote',
    category: 'design',
    budget: '₹ 2,500',
    budgetValue: 2500,
    deadline: '5 days left',
    daysValue: 5,
    level: 'Beginner',
    tags: ['Illustrator', 'InDesign', 'Catalogue', 'Print ready'],
    description: 'Digital PDF and print-ready wholesale catalogue for 18 natural skincare SKUs, featuring clean grid layouts and ingredient highlights.',
    deliverables: ['12-page lookbook in PDF', 'Print-ready CMYK with bleeds', 'Editable packaged InDesign/Canva file'],
    applicationsCount: 6
  },
  {
    id: 'p-5',
    title: 'Sales & customer feedback data analytics dashboard',
    client: 'Kesar Foods',
    clientInitial: 'K',
    clientLogo: 'blue',
    location: 'Ahmedabad',
    category: 'data',
    budget: '₹ 3,500',
    budgetValue: 3500,
    deadline: '7 days left',
    daysValue: 7,
    level: 'Intermediate',
    tags: ['Excel', 'Power BI', 'SQL', 'Data cleaning'],
    description: 'We have 6 months of retail billing CSVs. Need a student analyst to clean the dataset and create an automated weekly summary dashboard.',
    deliverables: ['Cleaned consolidated Excel/CSV database', 'Interactive Power BI/Sheets dashboard', '1-page insights summary report'],
    applicationsCount: 9
  },
  {
    id: 'p-6',
    title: 'Brand launch story campaign & copywriting for urban café',
    client: 'Kahwa Corner',
    clientInitial: 'C',
    clientLogo: 'gold',
    location: 'Ahmedabad',
    category: 'marketing',
    budget: '₹ 3,000–4,500',
    budgetValue: 3750,
    deadline: '5 days left',
    daysValue: 5,
    level: 'Intermediate',
    tags: ['Content strategy', 'Copywriting', 'Campaign', 'Instagram'],
    description: 'Writing engaging copy and local Ahmedabad campus outreach hooks for our new artisan tea & reading café near CEPT university.',
    deliverables: ['14 Instagram post captions & hashtags', 'Launch invitation press release copy', 'Menu tagline and chalkboard quotes'],
    applicationsCount: 7
  },
  {
    id: 'p-7',
    title: 'Pitch deck presentation design for seed funding round',
    client: 'Finseed Labs',
    clientInitial: 'F',
    clientLogo: 'purple',
    location: 'Remote',
    category: 'design',
    budget: '₹ 4,000–5,000',
    budgetValue: 4500,
    deadline: '3 days left',
    daysValue: 3,
    level: 'Advanced',
    tags: ['Pitch deck', 'Figma', 'Keynote', 'Financial charts'],
    description: 'Transform an existing 12-slide Google Slides draft into a venture-grade pitch deck with clean typography, iconography and chart visualizations.',
    deliverables: ['14-slide polished pitch deck (Figma & PDF)', 'Custom icon set and timeline graphic', 'Editable slide template for future updates'],
    applicationsCount: 16
  },
  {
    id: 'p-8',
    title: 'Technical blog series on modern cloud architecture',
    client: 'StackSync Tech',
    clientInitial: 'T',
    clientLogo: 'coral',
    location: 'Remote',
    category: 'writing',
    budget: '₹ 3,000',
    budgetValue: 3000,
    deadline: '8 days left',
    daysValue: 8,
    level: 'Intermediate',
    tags: ['Technical writing', 'Docker', 'DevOps', 'SEO'],
    description: 'Need a computer engineering student to research and write two 1,200-word educational articles breaking down microservices and Docker containers.',
    deliverables: ['2 comprehensive Markdown articles with code snippets', 'SEO metadata and royalty-free diagram recommendations', 'One revision included'],
    applicationsCount: 5
  },
  {
    id: 'p-9',
    title: 'Mobile app UI/UX wireframes for student study groups',
    client: 'CivicLoop',
    clientInitial: 'C',
    clientLogo: 'mint',
    location: 'Remote',
    category: 'design',
    budget: '₹ 5,000–7,000',
    budgetValue: 6000,
    deadline: '9 days left',
    daysValue: 9,
    level: 'Advanced',
    tags: ['Figma', 'Mobile UI', 'Prototyping', 'User flows'],
    description: 'Design mobile flows for onboarding, group creation, schedule polls, and shared document feed for a college collaborative learning app.',
    deliverables: ['Complete Figma file with auto-layout components', 'Interactive clickable prototype', 'Design system color & typography guide'],
    applicationsCount: 13
  }
];

const conversationsData = [
  {
    id: 0,
    name: 'Meher Shah',
    role: 'Brand identity designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    unread: 1,
    online: true,
    messages: [
      { text: 'Hi Meher, I really loved the brand direction in your sustainable fashion portfolio samples.', sender: 'me', time: '10:14 AM' },
      { text: 'Thank you! I would love to learn more about the scope and timeline for your upcoming project.', sender: 'them', time: '10:18 AM' },
      { text: 'Could you share your preferred formats and whether you already have established typography guidelines?', sender: 'them', time: '10:22 AM' }
    ]
  },
  {
    id: 1,
    name: 'Aarav Patel',
    role: 'Frontend developer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    unread: 0,
    online: true,
    messages: [
      { text: 'Hey Aarav, checking in on the responsive navbar integration.', sender: 'me', time: 'Yesterday' },
      { text: 'I have tested it across mobile and desktop breakpoints. The smooth drawer is working cleanly!', sender: 'them', time: 'Yesterday' }
    ]
  },
  {
    id: 2,
    name: 'Ishita Shah',
    role: 'Product photographer',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=120&q=80',
    unread: 0,
    online: false,
    messages: [
      { text: 'Hi Ishita! Are you available next Tuesday for a 2-hour café product shoot near Navrangpura?', sender: 'me', time: 'Oct 28' },
      { text: 'Yes, Tuesday afternoon works nicely. I can bring my reflector setup and 50mm prime.', sender: 'them', time: 'Oct 28' }
    ]
  }
];

// --- MASTER CONTROLLER CLASS ---
class SkillKartApp {
  constructor() {
    this.currentView = 'home';
    this.projects = [...getStorage(STORAGE_KEYS.CUSTOM_PROJECTS, []), ...initialProjects];
    this.profiles = [...initialProfiles];
    this.savedIds = new Set(getStorage(STORAGE_KEYS.SAVED, ['p-1']));
    this.applications = getStorage(STORAGE_KEYS.APPLICATIONS, [
      {
        projectId: 'p-1',
        projectTitle: 'Instagram carousel & visual branding for sustainable fashion label',
        client: 'Marigold Studio',
        budget: '₹ 2,000–3,000',
        date: '2026-11-01',
        status: 'Under Review'
      }
    ]);
    this.bookings = getStorage(STORAGE_KEYS.BOOKINGS, [
      {
        student: 'Meher Shah',
        service: 'Brand Identity Starter Package',
        budget: '₹ 2,500',
        deadline: '7 days',
        status: 'Pending'
      }
    ]);
    this.payments = getStorage(STORAGE_KEYS.PAYMENTS, []);
    this.activeConvo = 0;
    this.storyIndex = 0;

    this.stories = [
      {
        quote: 'My first SkillKart project was a menu shoot for a café near campus. It gave me the confidence to call myself a photographer, not just someone who takes photos.',
        person: 'Ishita Shah',
        role: 'Photography student, NID Ahmedabad',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=85'
      },
      {
        quote: 'A local startup trusted me to code their launch site. It was a small brief, but having a live production link in my portfolio helped me land two freelance contracts before graduation.',
        person: 'Aarav Patel',
        role: 'Computer Science student, IIT Gandhinagar',
        image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=85'
      }
    ];

    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindGlobalModals();
    this.bindStories();
    this.bindScrollEffects();
    this.setupViewRouter();

    // Render components
    this.renderHomeFeaturedProjects();
    this.renderProjectsView();
    this.renderDiscoverView();
    this.renderServicesView();
    this.renderMessagesView();
    this.renderDashboardView();

    this.updateBadges();
  }

  // --- ROUTING ENGINE ---
  setupViewRouter() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
  }

  handleHashChange() {
    let hash = window.location.hash.replace('#', '').trim();
    if (!hash || hash === 'top') hash = 'home';

    // Handle deep link filters like #projects?category=design
    let route = hash;
    let query = '';
    if (hash.includes('?')) {
      [route, query] = hash.split('?');
    }

    if (route === 'how') {
      this.switchView('home');
      const el = $('#how');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const validRoutes = ['home', 'projects', 'discover', 'services', 'messages', 'dashboard'];
    if (validRoutes.includes(route)) {
      this.switchView(route, query);
    } else {
      this.switchView('home');
    }
  }

  switchView(viewName, query = '') {
    this.currentView = viewName;

    // Toggle active class on view sections
    $$('.view-section').forEach(section => {
      section.classList.toggle('active', section.id === `view-${viewName}`);
    });

    // Update active states on desktop & mobile navigation links
    $$('.nav-links a, .nav-actions .text-btn, .mobile-drawer a').forEach(link => {
      const linkHash = link.getAttribute('href') ? link.getAttribute('href').replace('#', '').split('?')[0] : '';
      const isActive = linkHash === viewName || (viewName === 'home' && linkHash === 'index.html');
      link.classList.toggle('active', isActive);
    });

    // Close mobile drawer on route change
    this.closeMobileMenu();

    // Scroll top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle query parameters if provided
    if (query) {
      const params = new URLSearchParams(query);
      if (viewName === 'projects' && params.has('category')) {
        const cat = params.get('category');
        const pill = $(`#view-projects .pill-btn[data-cat="${cat}"]`);
        if (pill) pill.click();
      }
      if (viewName === 'discover' && params.has('category')) {
        const cat = params.get('category');
        const select = $('#studentCategory');
        if (select) {
          select.value = cat;
          select.dispatchEvent(new Event('change'));
        }
      }
    }

    // Refresh view data when viewed
    if (viewName === 'dashboard') {
      this.renderDashboardView();
    }
    if (viewName === 'messages') {
      this.updateMessengerChat();
    }
  }

  // --- BADGES & COUNTERS ---
  updateBadges() {
    // Unread count
    const totalUnread = conversationsData.reduce((acc, c) => acc + (c.unread || 0), 0);
    const unreadBadge = $('#navUnreadCount');
    if (unreadBadge) {
      unreadBadge.textContent = totalUnread;
      unreadBadge.style.display = totalUnread > 0 ? 'inline-block' : 'none';
    }

    // Project count badge
    const prjCountBadge = $('#navProjectsCount');
    if (prjCountBadge) {
      prjCountBadge.textContent = this.projects.length;
    }
  }

  // --- NAVIGATION & DRAWER ---
  bindNavigation() {
    // Mobile menu toggle
    const menuBtn = $('#mobileMenuBtn');
    const overlay = $('#mobileNavOverlay');
    const drawer = $('#mobileDrawer');

    if (menuBtn && overlay && drawer) {
      menuBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.contains('open');
        if (isOpen) {
          this.closeMobileMenu();
        } else {
          menuBtn.classList.add('open');
          overlay.classList.add('open');
          drawer.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });

      overlay.addEventListener('click', () => this.closeMobileMenu());
    }

    // Modal triggers in nav
    $$('.open-modal').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.openWelcomeModal();
      });
    });

    $$('.open-post-project').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.closeMobileMenu();
        this.openPostProjectModal();
      });
    });
  }

  closeMobileMenu() {
    const menuBtn = $('#mobileMenuBtn');
    const overlay = $('#mobileNavOverlay');
    const drawer = $('#mobileDrawer');
    if (menuBtn) menuBtn.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (drawer) drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- GLOBAL MODALS ---
  bindGlobalModals() {
    // Escape key closes open modals
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        $$('.modal-overlay.open').forEach(m => m.classList.remove('open'));
        document.body.style.overflow = '';
      }
    });

    // Close buttons on all modals
    document.addEventListener('click', e => {
      if (e.target.matches('.modal-overlay') || e.target.closest('[data-close-modal]')) {
        const modal = e.target.closest('.modal-overlay') || e.target;
        if (modal && modal.classList.contains('modal-overlay')) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });

    // Welcome / Onboarding modal options
    const welcomeModal = $('#welcomeModal');
    if (welcomeModal) {
      $$('.modal-choices button', welcomeModal).forEach(choice => {
        choice.addEventListener('click', () => {
          $('.modal-choices', welcomeModal).style.display = 'none';
          $('#welcomeForm', welcomeModal).style.display = 'block';
          const emailInput = $('#welcomeForm input', welcomeModal);
          if (emailInput) emailInput.focus();
        });
      });

      const welcomeForm = $('#welcomeForm');
      if (welcomeForm) {
        welcomeForm.addEventListener('submit', e => {
          e.preventDefault();
          welcomeModal.classList.remove('open');
          document.body.style.overflow = '';
          showToast('Welcome to SkillKart! You are on the priority beta invite list.');
          welcomeForm.reset();
        });
      }
    }

    // Post Project Modal Form
    const postForm = $('#postProjectForm');
    if (postForm) {
      postForm.addEventListener('submit', e => {
        e.preventDefault();
        const title = $('#newPrjTitle').value.trim();
        const client = $('#newPrjClient').value.trim() || 'My Business';
        const category = $('#newPrjCategory').value;
        const budget = $('#newPrjBudget').value.trim();
        const deadline = $('#newPrjDeadline').value.trim() || '7 days left';
        const location = $('#newPrjLocation').value;
        const level = $('#newPrjLevel').value;
        const tags = $('#newPrjTags').value.split(',').map(s => s.trim()).filter(Boolean);
        const description = $('#newPrjDesc').value.trim();

        const newPrj = {
          id: 'custom-' + Date.now(),
          title,
          client,
          clientInitial: client.charAt(0).toUpperCase(),
          clientLogo: 'purple',
          location,
          category,
          budget: `₹ ${budget}`,
          budgetValue: parseInt(budget.replace(/\D/g, '')) || 3000,
          deadline,
          daysValue: 7,
          level,
          tags: tags.length ? tags : ['Creative', 'Student friendly'],
          description,
          deliverables: ['Agreed deliverables upon kickoff', 'Figma / Code / Raw media delivery'],
          applicationsCount: 0
        };

        const existingCustom = getStorage(STORAGE_KEYS.CUSTOM_PROJECTS, []);
        existingCustom.unshift(newPrj);
        setStorage(STORAGE_KEYS.CUSTOM_PROJECTS, existingCustom);

        this.projects.unshift(newPrj);
        this.renderProjectsView();
        this.renderHomeFeaturedProjects();
        this.updateBadges();

        $('#postProjectModal').classList.remove('open');
        document.body.style.overflow = '';
        postForm.reset();
        showToast('Your project was published to the marketplace!');
        window.location.hash = '#projects';
      });
    }

    // Application Modal Form
    const appForm = $('#applyProjectForm');
    if (appForm) {
      appForm.addEventListener('submit', e => {
        e.preventDefault();
        const projectId = $('#applyProjectId').value;
        const name = $('#applicantName').value.trim();
        const email = $('#applicantEmail').value.trim();
        const rate = $('#applicantRate').value.trim();
        const note = $('#applicantNote').value.trim();

        const prj = this.projects.find(p => p.id === projectId);
        if (prj) {
          prj.applicationsCount = (prj.applicationsCount || 0) + 1;

          const newApp = {
            projectId: prj.id,
            projectTitle: prj.title,
            client: prj.client,
            budget: rate || prj.budget,
            applicantName: name,
            applicantEmail: email,
            coverNote: note,
            date: new Date().toISOString().split('T')[0],
            status: 'Applied · Under Review'
          };

          this.applications.unshift(newApp);
          setStorage(STORAGE_KEYS.APPLICATIONS, this.applications);
        }

        $('#applyProjectModal').classList.remove('open');
        document.body.style.overflow = '';
        appForm.reset();
        showToast('Application sent! You can track it in your Dashboard.');
        this.renderDashboardView();
      });
    }
  }

  openWelcomeModal() {
    const modal = $('#welcomeModal');
    if (modal) {
      $('.modal-choices', modal).style.display = 'grid';
      $('#welcomeForm', modal).style.display = 'none';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  openPostProjectModal() {
    const modal = $('#postProjectModal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      const input = $('#newPrjTitle');
      if (input) input.focus();
    }
  }

  openApplyModal(projectId) {
    const prj = this.projects.find(p => p.id === projectId);
    if (!prj) return;

    $('#applyProjectId').value = prj.id;
    $('#applyPrjTitleHeading').textContent = prj.title;
    $('#applyPrjClientMeta').textContent = `${prj.client} · ${prj.location} · Budget: ${prj.budget}`;
    $('#applicantRate').value = prj.budget;

    const modal = $('#applyProjectModal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  openProjectDetailsModal(projectId) {
    const prj = this.projects.find(p => p.id === projectId);
    if (!prj) return;

    $('#detailPrjCategory').textContent = prj.category;
    $('#detailPrjCategory').className = `pill ${prj.category}`;
    $('#detailPrjTitle').textContent = prj.title;
    $('#detailPrjClient').textContent = prj.client;
    $('#detailPrjLocation').textContent = `${prj.location} · ${prj.deadline} · ${prj.level} level`;
    $('#detailPrjBudget').textContent = prj.budget;
    $('#detailPrjDesc').textContent = prj.description;

    const deliverablesList = $('#detailPrjDeliverables');
    deliverablesList.innerHTML = prj.deliverables.map(d => `<li>${d}</li>`).join('');

    const tagsList = $('#detailPrjTags');
    tagsList.innerHTML = prj.tags.map(t => `<span>${t}</span>`).join('');

    const applyBtn = $('#detailPrjApplyBtn');
    applyBtn.onclick = () => {
      $('#projectDetailsModal').classList.remove('open');
      this.openApplyModal(prj.id);
    };

    const modal = $('#projectDetailsModal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // --- HOME PAGE INTERACTIONS ---
  renderHomeFeaturedProjects() {
    const container = $('#homeFeaturedProjectsGrid');
    if (!container) return;

    const featured = this.projects.slice(0, 3);
    container.innerHTML = featured.map(p => this.createProjectCardHTML(p)).join('');

    this.bindProjectCardEvents(container);

    // Category filter tabs on Home
    $$('#homeProjectFilters .filter').forEach(btn => {
      btn.onclick = () => {
        $$('#homeProjectFilters .filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        const cards = $$('.project-card', container);
        cards.forEach(card => {
          const type = card.dataset.type;
          card.style.display = filter === 'all' || type === filter ? 'flex' : 'none';
        });
      };
    });
  }

  bindStories() {
    const prevBtn = $('#prevStory');
    const nextBtn = $('#nextStory');
    if (!prevBtn || !nextBtn) return;

    const renderStory = index => {
      const story = this.stories[index];
      $('#storyQuote').textContent = story.quote;
      $('#storyPerson').innerHTML = `<b>${story.person}</b><span>${story.role}</span>`;
      $('#storyPhoto').style.backgroundImage = `url('${story.image}')`;
    };

    prevBtn.addEventListener('click', () => {
      this.storyIndex = (this.storyIndex - 1 + this.stories.length) % this.stories.length;
      renderStory(this.storyIndex);
    });
    nextBtn.addEventListener('click', () => {
      this.storyIndex = (this.storyIndex + 1) % this.stories.length;
      renderStory(this.storyIndex);
    });
  }

  bindScrollEffects() {
    const navWrap = $('.nav-wrap');
    window.addEventListener('scroll', () => {
      if (navWrap) {
        navWrap.classList.toggle('scrolled', window.scrollY > 15);
      }
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    $$('.reveal').forEach(el => observer.observe(el));
  }

  // --- 2. FIND PROJECTS MARKETPLACE ---
  renderProjectsView() {
    const searchInput = $('#projectSearchInput');
    const clearBtn = $('#projectSearchClear');
    const categoryPills = $$('#projectCategoryPills .pill-btn');
    const levelSelect = $('#projectLevelSelect');
    const locationSelect = $('#projectLocationSelect');
    const sortSelect = $('#projectSortSelect');
    const resetBtn = $('#resetProjectFilters');
    const grid = $('#projectsDirectoryGrid');
    const countLabel = $('#projectsCountLabel');

    if (!grid) return;

    let selectedCategory = 'all';

    const filterAndRender = () => {
      const query = searchInput.value.trim().toLowerCase();
      const level = levelSelect.value;
      const loc = locationSelect.value;
      const sort = sortSelect.value;

      // Show / hide clear button
      clearBtn.classList.toggle('visible', query.length > 0);

      let filtered = this.projects.filter(p => {
        const matchesQuery =
          !query ||
          p.title.toLowerCase().includes(query) ||
          p.client.toLowerCase().includes(query) ||
          p.tags.some(t => t.toLowerCase().includes(query)) ||
          p.description.toLowerCase().includes(query);

        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesLevel = !level || p.level.toLowerCase() === level.toLowerCase();
        const matchesLoc = !loc || p.location.toLowerCase().includes(loc.toLowerCase());

        return matchesQuery && matchesCat && matchesLevel && matchesLoc;
      });

      // Sorting
      if (sort === 'budget-high') {
        filtered.sort((a, b) => b.budgetValue - a.budgetValue);
      } else if (sort === 'budget-low') {
        filtered.sort((a, b) => a.budgetValue - b.budgetValue);
      } else if (sort === 'deadline') {
        filtered.sort((a, b) => a.daysValue - b.daysValue);
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <h3>No matching projects found</h3>
            <p>Try refining your search keyword or clearing the filters.</p>
            <button class="primary-btn" id="emptyStateResetBtn">Reset all filters</button>
          </div>
        `;
        const rBtn = $('#emptyStateResetBtn');
        if (rBtn) rBtn.onclick = () => resetAll();
      } else {
        grid.innerHTML = filtered.map(p => this.createProjectCardHTML(p)).join('');
        this.bindProjectCardEvents(grid);
      }

      if (countLabel) {
        countLabel.innerHTML = `Showing <strong>${filtered.length}</strong> project${filtered.length !== 1 ? 's' : ''}`;
      }
    };

    const resetAll = () => {
      searchInput.value = '';
      levelSelect.value = '';
      locationSelect.value = '';
      sortSelect.value = 'recommended';
      selectedCategory = 'all';
      categoryPills.forEach(p => p.classList.toggle('active', p.dataset.cat === 'all'));
      filterAndRender();
    };

    // Event listeners
    searchInput.oninput = () => filterAndRender();
    clearBtn.onclick = () => {
      searchInput.value = '';
      searchInput.focus();
      filterAndRender();
    };

    categoryPills.forEach(pill => {
      pill.onclick = () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedCategory = pill.dataset.cat;
        filterAndRender();
      };
    });

    levelSelect.onchange = filterAndRender;
    locationSelect.onchange = filterAndRender;
    sortSelect.onchange = filterAndRender;
    resetBtn.onclick = resetAll;

    filterAndRender();
  }

  createProjectCardHTML(p) {
    const isSaved = this.savedIds.has(p.id);
    return `
      <article class="project-card" data-id="${p.id}" data-type="${p.category}">
        <div class="project-top">
          <span class="pill ${p.category}">${p.category}</span>
          <button class="save ${isSaved ? 'saved' : ''}" data-save-id="${p.id}" aria-label="Save project">${isSaved ? '♥' : '♡'}</button>
        </div>
        <h3>${p.title}</h3>
        <div class="client">
          <div class="mini-logo ${p.clientLogo}">${p.clientInitial}</div>
          <span>${p.client}<small>${p.location} · ${p.level} level</small></span>
        </div>
        <div class="project-meta">
          <span><b>${p.budget}</b> Fixed budget</span>
          <span>${p.deadline}</span>
        </div>
        <div class="tags">
          ${p.tags.slice(0, 3).map(t => `<span>${t}</span>`).join('')}
        </div>
        <div class="project-card-actions">
          <button class="view-details-btn" data-view-id="${p.id}">View details</button>
          <button class="apply-now-btn" data-apply-id="${p.id}">Apply now →</button>
        </div>
      </article>
    `;
  }

  bindProjectCardEvents(container) {
    $$('.save', container).forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const id = btn.dataset.saveId;
        if (this.savedIds.has(id)) {
          this.savedIds.delete(id);
          btn.classList.remove('saved');
          btn.textContent = '♡';
          showToast('Project removed from saved list.');
        } else {
          this.savedIds.add(id);
          btn.classList.add('saved');
          btn.textContent = '♥';
          showToast('Project saved to your Dashboard.');
        }
        setStorage(STORAGE_KEYS.SAVED, [...this.savedIds]);
      };
    });

    $$('.view-details-btn', container).forEach(btn => {
      btn.onclick = () => this.openProjectDetailsModal(btn.dataset.viewId);
    });

    $$('.apply-now-btn', container).forEach(btn => {
      btn.onclick = () => this.openApplyModal(btn.dataset.applyId);
    });
  }

  // --- 3. DISCOVER STUDENTS DIRECTORY ---
  renderDiscoverView() {
    const searchInput = $('#studentSearchInput');
    const clearBtn = $('#studentSearchClear');
    const categorySelect = $('#studentCategory');
    const categoryPills = $$('#studentCategoryPills .pill-btn');
    const levelSelect = $('#studentLevel');
    const availSelect = $('#studentAvailability');
    const ratingSelect = $('#studentRating');
    const resetBtn = $('#clearStudentFilters');
    const grid = $('#studentsGrid');
    const countLabel = $('#studentsCountLabel');
    const viewGridBtn = $('#viewModeGrid');
    const viewListBtn = $('#viewModeList');

    if (!grid) return;

    let isListView = false;

    const filterAndRender = () => {
      const q = searchInput.value.trim().toLowerCase();
      const cat = categorySelect.value.toLowerCase();
      const level = levelSelect.value;
      const avail = availSelect.value;
      const minRating = parseFloat(ratingSelect.value) || 0;

      clearBtn.classList.toggle('visible', q.length > 0);

      const filtered = this.profiles.filter(p => {
        const textToSearch = `${p.name} ${p.college} ${p.role} ${p.skills.join(' ')} ${p.bio}`.toLowerCase();
        const matchesQuery = !q || textToSearch.includes(q);
        const matchesCat =
          !cat ||
          (p.category && p.category.toLowerCase() === cat) ||
          p.role.toLowerCase().includes(cat) ||
          p.skills.some(s => s.toLowerCase().includes(cat));
        const matchesLevel = !level || p.level.toLowerCase() === level.toLowerCase();
        const matchesAvail = !avail || p.availability.toLowerCase().includes(avail.toLowerCase());
        const matchesRating = !minRating || p.rating >= minRating;

        return matchesQuery && matchesCat && matchesLevel && matchesAvail && matchesRating;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <h3>No student profiles match those criteria</h3>
            <p>Try adjusting your search filters or clear all filters to see emerging talent.</p>
            <button class="primary-btn" id="studentEmptyResetBtn">Reset filters</button>
          </div>
        `;
        const rBtn = $('#studentEmptyResetBtn');
        if (rBtn) rBtn.onclick = () => resetAll();
      } else {
        grid.className = isListView ? 'student-grid list-view' : 'student-grid';
        grid.innerHTML = filtered.map(p => this.createStudentCardHTML(p)).join('');
        this.bindStudentCardEvents(grid);
      }

      if (countLabel) {
        countLabel.innerHTML = `Showing <strong>${filtered.length}</strong> student creator${filtered.length !== 1 ? 's' : ''}`;
      }
    };

    const syncPillsWithSelect = selectedCat => {
      categoryPills.forEach(p => {
        const pCat = p.dataset.cat;
        const isActive = (selectedCat === '' && pCat === 'all') || pCat === selectedCat;
        p.classList.toggle('active', isActive);
      });
    };

    const resetAll = () => {
      searchInput.value = '';
      categorySelect.value = '';
      levelSelect.value = '';
      availSelect.value = '';
      ratingSelect.value = '';
      syncPillsWithSelect('');
      filterAndRender();
    };

    searchInput.oninput = filterAndRender;
    clearBtn.onclick = () => {
      searchInput.value = '';
      searchInput.focus();
      filterAndRender();
    };

    categorySelect.onchange = () => {
      syncPillsWithSelect(categorySelect.value);
      filterAndRender();
    };

    categoryPills.forEach(pill => {
      pill.onclick = () => {
        const targetCat = pill.dataset.cat === 'all' ? '' : pill.dataset.cat;
        categorySelect.value = targetCat;
        syncPillsWithSelect(targetCat);
        filterAndRender();
      };
    });

    levelSelect.onchange = filterAndRender;
    availSelect.onchange = filterAndRender;
    ratingSelect.onchange = filterAndRender;
    resetBtn.onclick = resetAll;

    viewGridBtn.onclick = () => {
      isListView = false;
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      grid.classList.remove('list-view');
    };
    viewListBtn.onclick = () => {
      isListView = true;
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      grid.classList.add('list-view');
    };

    filterAndRender();
  }

  createStudentCardHTML(p) {
    return `
      <article class="student-card">
        <div class="student-photo">
          <img src="${p.photo}" alt="${p.name}" loading="lazy">
          <span class="demo-badge">STUDENT CREATOR</span>
          <i class="online-dot" title="Active now"></i>
        </div>
        <div class="student-body">
          <h3 class="student-name">${p.name}</h3>
          <p class="student-course">${p.college}</p>
          <span class="student-role-badge">${p.role}</span>
          <p class="student-bio">${p.bio}</p>
          <div class="student-skills">
            ${p.skills.slice(0, 3).map(s => `<span>${s}</span>`).join('')}
          </div>
          <div class="student-meta">
            <span class="student-rating">★ ${p.rating} <small>(${p.reviews} reviews)</small></span>
            <span class="student-rate">${p.rate}</span>
          </div>
          <div class="student-actions">
            <button class="student-profile-btn" data-profile-id="${p.id}">View profile</button>
            <button class="student-book-btn" data-book-id="${p.id}">Book student</button>
          </div>
        </div>
      </article>
    `;
  }

  bindStudentCardEvents(container) {
    $$('.student-profile-btn', container).forEach(btn => {
      btn.onclick = () => this.openStudentProfileModal(+btn.dataset.profileId);
    });
    $$('.student-book-btn', container).forEach(btn => {
      btn.onclick = () => this.openBookingWizard(+btn.dataset.bookId);
    });
  }

  openStudentProfileModal(studentId) {
    const p = this.profiles.find(s => s.id === studentId);
    if (!p) return;

    $('#profileModalImg').src = p.photo;
    $('#profileModalImg').alt = p.name;
    $('#profileModalName').textContent = p.name;
    $('#profileModalRole').textContent = `${p.role} · ${p.level}`;
    $('#profileModalBio').textContent = `${p.bio} Currently enrolled in ${p.college}.`;
    $('#profileModalMeta').textContent = `${p.college} · Responds ${p.responseTime}`;

    // Skill meters
    const skillList = $('#profileModalSkills');
    skillList.innerHTML = p.skills
      .map((s, idx) => {
        const pct = 90 - idx * 10;
        return `
        <div class="skill-row">
          <span>${s}</span>
          <div class="skill-meter"><i style="width: ${pct}%"></i></div>
          <small>${pct > 75 ? 'Advanced' : 'Strong'}</small>
        </div>
      `;
      })
      .join('');

    // Sidebar metadata
    $('#profileModalAvail').textContent = p.availability;
    $('#profileModalLang').textContent = p.languages;
    $('#profileModalReviews').textContent = `${p.rating} / 5 from ${p.reviews} campus projects`;
    $('#profileModalEducation').textContent = p.college;

    // Actions
    $('#profileModalBookBtn').onclick = () => {
      $('#studentProfileModal').classList.remove('open');
      this.openBookingWizard(p.id);
    };

    $('#profileModalChatBtn').onclick = () => {
      $('#studentProfileModal').classList.remove('open');
      document.body.style.overflow = '';
      window.location.hash = '#messages';
      showToast(`Switched to conversation with ${p.name}`);
    };

    $('#profileModalCallBtn').onclick = () => {
      this.openCallSchedulingModal(p.name);
    };

    const modal = $('#studentProfileModal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // --- 4. BOOKING WIZARD ---
  openBookingWizard(studentId) {
    const p = this.profiles.find(s => s.id === studentId);
    if (!p) return;

    let step = 1;
    const bookingState = {
      student: p.name,
      service: p.role + ' brief',
      budget: p.rate,
      deadline: '7 days',
      commMethod: 'In-app messages'
    };

    const modal = $('#bookingWizardModal');
    $('#bookingStudentNameTitle').textContent = `Work with ${p.name}`;

    const renderStep = () => {
      $('#bookingStepLabel').textContent = `Step ${step} of 4`;
      $('#bookingProgressBar').style.width = `${step * 25}%`;

      const body = $('#bookingStepBody');
      const backBtn = $('#bookingBackBtn');
      const nextBtn = $('#bookingNextBtn');

      backBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
      nextBtn.textContent = step === 4 ? 'Send Booking Request →' : 'Continue →';

      if (step === 1) {
        body.innerHTML = `
          <div class="flow-form-group">
            <label>Select service type</label>
            <select id="bookingServiceSelect">
              <option value="${p.role} package">${p.role} package</option>
              <option value="Consultation & Advisory">1-on-1 Consultation & Advisory</option>
              <option value="Custom sprint project">Custom sprint project</option>
            </select>
          </div>
          <div class="flow-form-group">
            <label>Describe your project brief</label>
            <textarea id="bookingBriefDesc" placeholder="Share goals, references, scope, and target deliverables..."></textarea>
          </div>
        `;
      } else if (step === 2) {
        body.innerHTML = `
          <div class="flow-form-group">
            <label>Choose estimated budget</label>
            <div class="choice-cards-grid" id="budgetChoices">
              <button class="choice-box selected" type="button" data-val="${p.rate}">${p.rate}</button>
              <button class="choice-box" type="button" data-val="₹3,000–5,000">₹3,000–5,000</button>
              <button class="choice-box" type="button" data-val="₹5,000–8,000">₹5,000–8,000</button>
              <button class="choice-box" type="button" data-val="Let's negotiate">Let's negotiate</button>
            </div>
          </div>
          <div class="flow-form-group">
            <label>Target deadline</label>
            <input type="date" id="bookingTargetDate" min="2026-11-02">
          </div>
        `;
        $$('#budgetChoices .choice-box').forEach(box => {
          box.onclick = () => {
            $$('#budgetChoices .choice-box').forEach(b => b.classList.remove('selected'));
            box.classList.add('selected');
            bookingState.budget = box.dataset.val;
          };
        });
      } else if (step === 3) {
        body.innerHTML = `
          <div class="flow-form-group">
            <label>Preferred communication method</label>
            <div class="choice-cards-grid" id="commChoices">
              <button class="choice-box selected" type="button" data-val="In-app messages">In-app messages</button>
              <button class="choice-box" type="button" data-val="Video call schedule">Schedule video call</button>
              <button class="choice-box" type="button" data-val="Voice call schedule">Schedule voice call</button>
              <button class="choice-box" type="button" data-val="Email updates">Email updates</button>
            </div>
          </div>
          <div class="info-notice">
            <b>Scheduling Demo:</b> Calls and video meetings create calendar placeholder invites in this marketplace prototype.
          </div>
        `;
        $$('#commChoices .choice-box').forEach(box => {
          box.onclick = () => {
            $$('#commChoices .choice-box').forEach(b => b.classList.remove('selected'));
            box.classList.add('selected');
            bookingState.commMethod = box.dataset.val;
          };
        });
      } else if (step === 4) {
        body.innerHTML = `
          <div style="background: #f7f6f1; padding: 20px; border-radius: var(--radius-sm); font-size: 13px; line-height: 1.8;">
            <b>Booking Request Summary</b><br>
            Student: <strong>${p.name}</strong><br>
            Service: <strong>${bookingState.service}</strong><br>
            Budget: <strong>${bookingState.budget}</strong><br>
            Deadline: <strong>${bookingState.deadline}</strong><br>
            Communication: <strong>${bookingState.commMethod}</strong><br><br>
            Initial Status: <span class="status-pill pending">Pending Student Acceptance</span>
          </div>
          <div class="info-notice" style="margin-top: 15px;">
            <b>No Upfront Payment Required:</b> Payments are unlocked only once the student reviews and confirms your brief.
          </div>
        `;
      }
    };

    $('#bookingBackBtn').onclick = () => {
      if (step > 1) {
        step--;
        renderStep();
      }
    };

    $('#bookingNextBtn').onclick = () => {
      if (step === 1) {
        const s = $('#bookingServiceSelect');
        if (s) bookingState.service = s.value;
      }
      if (step === 2) {
        const d = $('#bookingTargetDate');
        if (d && d.value) bookingState.deadline = d.value;
      }

      if (step < 4) {
        step++;
        renderStep();
      } else {
        // Submit booking
        this.bookings.unshift({
          student: p.name,
          service: bookingState.service,
          budget: bookingState.budget,
          deadline: bookingState.deadline,
          commMethod: bookingState.commMethod,
          status: 'Pending'
        });
        setStorage(STORAGE_KEYS.BOOKINGS, this.bookings);

        modal.classList.remove('open');
        document.body.style.overflow = '';
        showToast(`Booking request sent to ${p.name}!`);
        this.renderDashboardView();
        window.location.hash = '#dashboard';
      }
    };

    renderStep();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // --- 5. SERVICES CATALOG ---
  renderServicesView() {
    const services = [
      {
        id: 'dev',
        num: '01',
        title: 'Website & App Development',
        desc: 'Launch-ready landing pages, responsive React applications, Flutter mobile prototypes and custom WordPress sites.',
        types: 'Landing pages · React & Next.js · Flutter · WordPress · Data dashboards',
        cat: 'dev'
      },
      {
        id: 'design',
        num: '02',
        title: 'Visual Identity & Brand Design',
        desc: 'Thoughtful typography, distinctive logo suites, brand books, packaging and pitch deck design from top design colleges.',
        types: 'Brand guidelines · Packaging · UI/UX in Figma · Vector illustration',
        cat: 'design'
      },
      {
        id: 'video',
        num: '03',
        title: 'Video Editing & Content Media',
        desc: 'Dynamic pacing for Instagram Reels, YouTube editing, product photography and podcast audio mastering.',
        types: 'Vertical Reels · YouTube longform · Color grading · Podcast clean-up',
        cat: 'video'
      },
      {
        id: 'marketing',
        num: '04',
        title: 'Digital Marketing & Growth',
        desc: 'Campus ambassador strategies, Instagram growth blueprints, viral content calendars and SEO content optimization.',
        types: 'Social strategy · SEO audits · Influencer outreach · Content writing',
        cat: 'marketing'
      },
      {
        id: 'writing',
        num: '05',
        title: 'Copywriting & Content Strategy',
        desc: 'High-converting website copy, technical journalism, email newsletters and editorial storytelling.',
        types: 'Website headlines · Technical blogs · Newsletters · Ghostwriting',
        cat: 'writing'
      },
      {
        id: 'data',
        num: '06',
        title: 'Data & Technical Specialties',
        desc: 'Consolidated spreadsheet automation, Power BI sales dashboards, CAD architectural drawings and ML data pipelines.',
        types: 'Power BI · Python automation · AutoCAD · Financial models',
        cat: 'data'
      }
    ];

    const grid = $('#servicesDirectoryGrid');
    if (!grid) return;

    grid.innerHTML = services
      .map(
        s => `
      <article class="service-dir-card">
        <span class="service-num">${s.num}</span>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <div class="service-types-list">
          <b>Key Deliverables</b>
          <span>${s.types}</span>
        </div>
        <div class="service-dir-actions">
          <a class="explore-btn" href="#discover?category=${s.cat}">Find students →</a>
          <a class="browse-btn" href="#projects?category=${s.cat}">Browse briefs</a>
        </div>
      </article>
    `
      )
      .join('');
  }

  // --- 6. MESSENGER ---
  renderMessagesView() {
    const convoList = $('#messengerConvoList');
    if (!convoList) return;

    convoList.innerHTML = conversationsData
      .map(
        (c, idx) => `
      <div class="convo-item ${idx === this.activeConvo ? 'active' : ''}" data-convo-idx="${idx}">
        <img class="convo-avatar" src="${c.avatar}" alt="${c.name}">
        <div class="convo-meta">
          <b>${c.name}</b>
          <small>${c.messages[c.messages.length - 1]?.text || 'No messages'}</small>
        </div>
        ${c.unread ? `<span class="convo-unread">${c.unread}</span>` : ''}
      </div>
    `
      )
      .join('');

    $$('.convo-item', convoList).forEach(item => {
      item.onclick = () => {
        this.activeConvo = +item.dataset.convoIdx;
        conversationsData[this.activeConvo].unread = 0;
        this.updateBadges();
        this.renderMessagesView();
        this.updateMessengerChat();
      };
    });

    // Send message form
    const msgForm = $('#chatMessageForm');
    if (msgForm) {
      msgForm.onsubmit = e => {
        e.preventDefault();
        const input = $('#chatInputBox');
        const text = input.value.trim();
        if (!text) return;

        const convo = conversationsData[this.activeConvo];
        convo.messages.push({
          text,
          sender: 'me',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        input.value = '';
        this.updateMessengerChat();

        // Simulated auto-reply
        setTimeout(() => {
          convo.messages.push({
            text: 'Thank you! I have reviewed this and will share the milestone update shortly.',
            sender: 'them',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          this.updateMessengerChat();
          showToast(`New reply from ${convo.name}`);
        }, 850);
      };
    }

    // Call buttons
    const voiceBtn = $('#chatVoiceCallBtn');
    const videoBtn = $('#chatVideoCallBtn');
    if (voiceBtn) voiceBtn.onclick = () => this.openCallSchedulingModal(conversationsData[this.activeConvo].name);
    if (videoBtn) videoBtn.onclick = () => this.openCallSchedulingModal(conversationsData[this.activeConvo].name);

    this.updateMessengerChat();
  }

  updateMessengerChat() {
    const convo = conversationsData[this.activeConvo];
    if (!convo) return;

    $('#chatCurrentUserName').textContent = convo.name;
    $('#chatCurrentUserRole').textContent = convo.role;

    const stream = $('#chatMessageStream');
    if (!stream) return;

    stream.innerHTML = convo.messages
      .map(
        m => `
      <div class="msg-bubble ${m.sender}">
        ${m.text}
        <span class="msg-time">${m.time}</span>
      </div>
    `
      )
      .join('');

    if (this.activeConvo === 0) {
      stream.innerHTML += `
        <div class="chat-proposal-card">
          <b>Project Proposal · Brand Identity Starter</b>
          <p>Deliverables: 3 logo concept directions, typography pairing sheet, and brand color palette.</p>
          <button class="primary-btn" id="reviewChatProposalBtn" style="padding: 8px 14px; font-size: 11px;">Review & Confirm</button>
        </div>
      `;
      const btn = $('#reviewChatProposalBtn');
      if (btn) btn.onclick = () => this.openBookingWizard(1);
    }

    stream.scrollTop = stream.scrollHeight;
  }

  openCallSchedulingModal(recipientName) {
    showToast(`Call scheduling invite prepared for ${recipientName}!`);
  }

  // --- 7. DASHBOARD ---
  renderDashboardView() {
    // Stats counters
    const bCount = $('#dashBookingsCount');
    const aCount = $('#dashAppsCount');
    const sCount = $('#dashSavedCount');
    const pCount = $('#dashPaymentsCount');

    if (bCount) bCount.textContent = this.bookings.length;
    if (aCount) aCount.textContent = this.applications.length;
    if (sCount) sCount.textContent = this.savedIds.size;
    if (pCount) pCount.textContent = this.payments.length;

    // Bookings list
    const bookingsList = $('#dashBookingsList');
    if (bookingsList) {
      if (this.bookings.length === 0) {
        bookingsList.innerHTML = '<p style="color: var(--muted); font-size: 12px;">No active bookings yet.</p>';
      } else {
        bookingsList.innerHTML = this.bookings
          .map(
            (b, idx) => `
          <div class="dash-item-row">
            <div>
              <strong>${b.student}</strong> — ${b.service}
              <small style="display:block; color: var(--muted); margin-top: 2px;">Budget: ${b.budget} · Deadline: ${b.deadline}</small>
              ${
                b.status === 'Pending'
                  ? `<button class="ghost-btn" style="padding: 4px 10px; font-size: 10px; margin-top: 6px;" data-accept-idx="${idx}">Simulate student acceptance</button>`
                  : `<button class="primary-btn" style="padding: 4px 10px; font-size: 10px; margin-top: 6px;" data-pay-idx="${idx}">Open demo checkout</button>`
              }
            </div>
            <span class="status-pill ${b.status.toLowerCase()}">${b.status}</span>
          </div>
        `
          )
          .join('');

        $$('[data-accept-idx]', bookingsList).forEach(btn => {
          btn.onclick = () => {
            const idx = +btn.dataset.acceptIdx;
            this.bookings[idx].status = 'Accepted';
            setStorage(STORAGE_KEYS.BOOKINGS, this.bookings);
            showToast('Student accepted your booking request! Payment unlocked.');
            this.renderDashboardView();
          };
        });

        $$('[data-pay-idx]', bookingsList).forEach(btn => {
          btn.onclick = () => {
            const idx = +btn.dataset.payIdx;
            this.openPaymentModal(this.bookings[idx]);
          };
        });
      }
    }

    // Applications list
    const appsList = $('#dashAppsList');
    if (appsList) {
      if (this.applications.length === 0) {
        appsList.innerHTML = '<p style="color: var(--muted); font-size: 12px;">No project applications submitted yet.</p>';
      } else {
        appsList.innerHTML = this.applications
          .map(
            a => `
          <div class="dash-item-row">
            <div>
              <strong>${a.projectTitle}</strong>
              <small style="display:block; color: var(--muted); margin-top: 2px;">Client: ${a.client} · Bid: ${a.budget}</small>
            </div>
            <span class="status-pill pending">${a.status || 'Applied'}</span>
          </div>
        `
          )
          .join('');
      }
    }

    // Saved projects list
    const savedList = $('#dashSavedList');
    if (savedList) {
      const savedProjects = this.projects.filter(p => this.savedIds.has(p.id));
      if (savedProjects.length === 0) {
        savedList.innerHTML = '<p style="color: var(--muted); font-size: 12px;">No saved projects. Click ♡ on any project card to bookmark.</p>';
      } else {
        savedList.innerHTML = savedProjects
          .map(
            p => `
          <div class="dash-item-row">
            <div>
              <strong>${p.title}</strong>
              <small style="display:block; color: var(--muted); margin-top: 2px;">${p.client} · ${p.budget}</small>
            </div>
            <button class="ghost-btn" style="padding: 4px 10px; font-size: 10px;" data-dash-apply="${p.id}">Apply now</button>
          </div>
        `
          )
          .join('');

        $$('[data-dash-apply]', savedList).forEach(btn => {
          btn.onclick = () => this.openApplyModal(btn.dataset.dashApply);
        });
      }
    }
  }

  // --- DEMO PAYMENT CHECKOUT ---
  openPaymentModal(booking) {
    const modal = $('#paymentModal');
    $('#paymentStudentName').textContent = booking.student;
    $('#paymentServiceName').textContent = booking.service;
    $('#paymentAmount').textContent = booking.budget;
    $('#paymentTotalAmount').textContent = booking.budget;

    $('#confirmDemoPaymentBtn').onclick = () => {
      const btn = $('#confirmDemoPaymentBtn');
      btn.textContent = 'Processing demo transaction...';
      btn.disabled = true;

      setTimeout(() => {
        const ref = 'SKD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        this.payments.push({
          ref,
          student: booking.student,
          service: booking.service,
          amount: booking.budget,
          date: new Date().toLocaleDateString(),
          status: 'Confirmed'
        });
        setStorage(STORAGE_KEYS.PAYMENTS, this.payments);

        modal.classList.remove('open');
        document.body.style.overflow = '';
        btn.textContent = 'Confirm Demo Payment';
        btn.disabled = false;

        showToast(`Demo receipt ${ref} generated. No real money was charged.`);
        this.renderDashboardView();
      }, 900);
    };

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

// Instantiate application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.skillkart = new SkillKartApp();
});

import heroIllustration from "./images/hero-illustration.png";
import aboutIllustration from "./images/about-illustration.png";
import doctorIllustration from "./images/doctor-illustration.png";
import logo from "./images/logo.png";
import {
  Shield,
  Brain,
  Users,
  BarChart3,
  BookOpen,
  Lightbulb,
  Eye,
  Target,
  Puzzle,
  Stethoscope,
  ClipboardList,
  Mail,
  Phone,
  MapPin,
  Youtube,
  Twitter,
  Facebook,
  Lock,
  FileCheck,
  UserCheck,
  Server,
  Heart,
  Globe,
} from "lucide-react";

export const images = {
  heroIllustration,
  aboutIllustration,
  doctorIllustration,
  logo,
};

export const contactInfo = [
  { icon: Mail, label: "support@neuronest.com" },
  { icon: Phone, label: "+1 (555) 123-4567" },
  { icon: MapPin, label: "San Francisco, CA" },
];

export const socialIcons = [
  { icon: Youtube, url: "https://www.youtube.com/yourchannel" },
  { icon: Twitter, url: "https://twitter.com/yourprofile" },
  { icon: Facebook, url: "https://facebook.com/yourpage" },
];
export const steps = [
  {
    icon: ClipboardList,
    title: "Create Profile",
    desc: "Add your child's information to get started",
  },
  {
    icon: Brain,
    title: "Take Assessment",
    desc: "Interactive, child-friendly screening activities",
  },
  {
    icon: BarChart3,
    title: "Get Results",
    desc: "AI-powered analysis with clear visual reports",
  },
  {
    icon: Stethoscope,
    title: "Expert Review",
    desc: "Professional evaluation and personalized guidance",
  },
];

export const features = [
  {
    icon: Brain,
    title: "AI-Powered Screening",
    desc: "Advanced algorithms identify patterns associated with learning disorders.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "All data is encrypted and HIPAA-compliant.",
  },
  {
    icon: Users,
    title: "Expert Network",
    desc: "Connect with certified specialists in learning disorders.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    desc: "Monitor development over time with visual dashboards.",
  },
];

export const disorders = [
  {
    icon: BookOpen,
    title: "Dyslexia",
    desc: "Difficulty with reading, spelling, and decoding words despite normal intelligence.",
  },
  {
    icon: Brain,
    title: "ADHD",
    desc: "Challenges with attention, hyperactivity, and impulse control that affect learning.",
  },
  {
    icon: Eye,
    title: "Dysgraphia",
    desc: "Difficulty with writing, including poor handwriting and trouble organizing thoughts on paper.",
  },
  {
    icon: Target,
    title: "Dyscalculia",
    desc: "Difficulty understanding numbers, learning math facts, and performing calculations.",
  },
  {
    icon: Lightbulb,
    title: "Processing Disorders",
    desc: "Challenges in how the brain processes visual or auditory information.",
  },
  {
    icon: Puzzle,
    title: "Autism Spectrum Disorder",
    desc: "Developmental condition affecting social interaction, communication, and learning patterns.",
  },
];

export const faqs = [
  {
    q: "Is this a medical diagnosis?",
    a: "No. neuronest provides an AI-powered screening, not a diagnosis. Results should be reviewed with a qualified professional.",
  },
  {
    q: "What age range is the assessment for?",
    a: "Our assessments are designed for children ages 4–14, with age-appropriate questions for each stage.",
  },
  {
    q: "How long does the assessment take?",
    a: "Most children complete the assessment in 5–10 minutes. There's no time pressure.",
  },
  {
    q: "Is my child's data secure?",
    a: "Yes. All data is encrypted, stored securely, and never shared with third parties without your consent.",
  },
  {
    q: "Can I share results with my child's doctor?",
    a: "Absolutely. You can generate a shareable report or connect directly with professionals through our platform.",
  },
];

export const articles = [
  {
    category: "Guide",
    title: "Signs Your Child May Have a Learning Disorder",
    desc: "Learn the early signs that may indicate a learning disorder and when to seek help.",
    time: "8 min read",
  },
  {
    category: "Article",
    title: "Understanding Dyslexia: A Parent's Guide",
    desc: "Everything parents need to know about dyslexia, from identification to support strategies.",
    time: "12 min read",
  },
  {
    category: "Tips",
    title: "Supporting ADHD Children at Home",
    desc: "Practical strategies for creating a supportive learning environment at home.",
    time: "6 min read",
  },
  {
    category: "Guide",
    title: "Working with Your Child's School",
    desc: "How to advocate for your child and work with educators to create an effective learning plan.",
    time: "10 min read",
  },
  {
    category: "Article",
    title: "The Role of Early Intervention",
    desc: "Why catching learning disorders early makes a significant difference in outcomes.",
    time: "7 min read",
  },
  {
    category: "Tips",
    title: "Building Confidence in Struggling Learners",
    desc: "Strategies to help children feel capable and motivated despite learning challenges.",
    time: "5 min read",
  },
];

export const results = [
  { area: "Reading Comprehension", score: 72, status: "attention" },
  { area: "Letter Recognition", score: 85, status: "good" },
  { area: "Attention Span", score: 65, status: "attention" },
  { area: "Number Skills", score: 90, status: "good" },
  { area: "Writing Skills", score: 78, status: "good" },
  { area: "Following Instructions", score: 60, status: "attention" },
];

export const recommendations = [
  "Consider a professional evaluation for reading and attention patterns.",
  "Practice multi-step instructions with visual aids at home.",
  "Reading aloud for 15 minutes daily can strengthen comprehension.",
  "Consult with your child's teacher about classroom accommodations.",
];

export const notes = [
  {
    doctor: "Dr. Sarah Smith",
    date: "Mar 12, 2026",
    title: "Initial Review",
    content:
      "Emma shows strong potential. The reading comprehension patterns suggest mild phonological processing challenges. I recommend a formal evaluation and starting a structured reading program.",
    type: "Review",
  },
  {
    doctor: "Dr. Sarah Smith",
    date: "Mar 14, 2026",
    title: "Recommended Support",
    content:
      "Based on the screening results, I suggest: 1) Orton-Gillingham reading approach, 2) Weekly occupational therapy for handwriting, 3) Follow-up assessment in 3 months.",
    type: "Recommendation",
  },
];

export const children = [
  {
    name: "Emma",
    age: 7,
    status: "completed",
    lastAssessment: "Mar 10, 2026",
    score: 82,
  },
  {
    name: "Lucas",
    age: 5,
    status: "pending",
    lastAssessment: "—",
    score: null,
  },
];

export const notifications = [
  { text: "Dr. Smith reviewed Emma's assessment results", time: "2 hours ago" },
  { text: "New resource: Supporting early readers", time: "1 day ago" },
  { text: "Lucas's assessment is ready to begin", time: "2 days ago" },
];

export const assessments = [
  {
    date: "Mar 10, 2026",
    type: "Full Screening",
    status: "completed",
    score: 82,
  },
  {
    date: "Jan 15, 2026",
    type: "Reading Assessment",
    status: "completed",
    score: 75,
  },
  {
    date: "Nov 20, 2025",
    type: "Initial Screening",
    status: "completed",
    score: 68,
  },
];

export const questions = [
  {
    id: 1,
    text: "Does he have health probems ?",
    options: ["No", "Yes"],
  },
  {
    id: 2,
    text: "Does he have social family problems?:",
    options: ["No", "Yes"],
  },
  {
    id: 3,
    text: "Is there a variation between his real qualifications and its results?",
    options: ["Yeah", "No"],
  },
  {
    id: 4,
    text: "Does he have any difficulties?",
    options: ["In particular article", "In all materials"],
  },
  {
    id: 5,
    text: "Does your child avoid activities that require reading to complete?",
    options: ["Repeatedly / always", "Sometimes", "Rarely / never"],
  },
  {
    id: 6,
    text: "Is he fast/slow while reading?",
    options: ["Average", "Slow", "Fast"],
  },
  {
    id: 7,
    text: "When reading aloud, does your child repeat words, change their order, or mix up similar letters (b/d, p/q, m/w, p/b, f/v, k/g/j) without notice?",
    options: ["Rarely / never", "Repeatedly / always", "Sometimes"],
  },
  {
    id: 8,
    text: "Does he have trouble reading unknown words?",
    options: ["Sometimes", "Rarely / never", "Repeatedly / always"],
  },
  {
    id: 9,
    text: "Does he face difficulty understanding what he read?",
    options: ["Rarely / never", "Sometimes", "Repeatedly / always"],
  },
  {
    id: 10,
    text: "Does he reverse numbers? (e.g., 81 -> 18)",
    options: ["Rarely / never", "Sometimes", "Repeatedly / always"],
  },
  {
    id: 11,
    text: "Does he have trouble writing numbers clearly and distinctly from letters?",
    options: ["Rarely / never", "Sometimes", "Repeatedly / always"],
  },
  {
    id: 12,
    text: "Does he make misspellings in his homework?",
    options: ["Rarely / never", "Repeatedly / always", "Sometimes"],
  },
  {
    id: 13,
    text: "Is he having trouble writing on the line and inside the margins?",
    options: ["Repeatedly / always", "Sometimes", "Rarely / never"],
  },
  {
    id: 14,
    text: "Does he have a problem copying?",
    options: ["Repeatedly / always", "Rarely / never", "Sometimes"],
  },
  {
    id: 15,
    text: "Does he confuse symbols and/or mathematical operations?",
    options: ["Sometimes", "Rarely / never", "Repeatedly / always"],
  },
  {
    id: 16,
    text: "Does he have trouble comparing the relative size of integers and/or fractions?",
    options: ["Repeatedly / always", "Sometimes", "Rarely / never"],
  },
  {
    id: 17,
    text: "Does he have difficulties with concepts related to time and/or money?",
    options: ["Sometimes", "Repeatedly / always", "Rarely / never"],
  },
  {
    id: 18,
    text: "Is it difficult to understand the statement of calculations and solve it?",
    options: ["Sometimes", "Rarely / never", "Repeatedly / always"],
  },
  {
    id: 19,
    text: "Is he having difficulties in calculating? (Facing problems in performing arithmetic operations such as addition and subtraction ...)",
    options: ["Repeatedly / always", "Sometimes", "Rarely / never"],
  },
  {
    id: 20,
    text: "Is he having trouble maintaining attention for more than 15 minutes?",
    options: ["Repeatedly / always", "Sometimes", "Rarely / never"],
  },
  {
    id: 21,
    text: "Does it take a long time to complete simple tasks?",
    options: ["Rarely / never", "Repeatedly / always", "Sometimes"],
  },
  {
    id: 22,
    text: "Does he have a hard time bearing boredom or strenuous tasks?",
    options: ["Repeatedly / always", "Rarely / never", "Sometimes"],
  },
];

export const reports = [
  {
    child: "Emma Johnson",
    date: "Mar 10, 2026",
    type: "Full Screening",
    status: "completed",
  },
  {
    child: "Oliver Chen",
    date: "Mar 8, 2026",
    type: "Reading Assessment",
    status: "completed",
  },
  {
    child: "Sophia Martinez",
    date: "Mar 5, 2026",
    type: "Initial Screening",
    status: "draft",
  },
];

export const aiSteps = [
  "Child-friendly activities assess reading, attention, math, and writing skills through engaging mini-games.",
  "Our AI model analyzes response patterns, timing, and accuracy against established developmental benchmarks.",
  "Results are presented as clear visual reports, highlighting strengths and areas for further evaluation.",
  "A qualified professional reviews flagged assessments and provides personalized recommendations.",
];

export const principles = [
  {
    icon: Lock,
    title: "Data Encryption",
    desc: "All personal and assessment data is encrypted at rest (AES-256) and in transit (TLS 1.3). Your information is never exposed.",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "We clearly explain what data we collect, why we collect it, and how it's used. No hidden tracking, no surprises.",
  },
  {
    icon: UserCheck,
    title: "Parental Consent",
    desc: "All child data requires explicit parental consent. Parents retain full control and can delete data at any time.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    desc: "Our servers are hosted in SOC 2 Type II certified data centers with continuous monitoring and regular security audits.",
  },
  {
    icon: FileCheck,
    title: "HIPAA & COPPA Compliant",
    desc: "We adhere to HIPAA for health-related data and COPPA for children's online privacy, meeting the highest regulatory standards.",
  },
  {
    icon: Heart,
    title: "Ethical AI",
    desc: "Our AI models are regularly audited for bias. We ensure fair, equitable screening across all demographics and backgrounds.",
  },
];

export const commitments = [
  "We never sell your data to third parties.",
  "Assessment results are only shared with people you authorize.",
  "AI models are trained on de-identified, diverse datasets.",
  "You can request full data export or deletion at any time.",
  "We conduct annual third-party security audits.",
  "Our team includes child psychology and ethics advisors.",
];

export const stats = [
  { value: "12,000+", label: "Children Assessed", icon: Users },
  { value: "94%", label: "Parent Satisfaction", icon: Heart },
  { value: "3,500+", label: "Early Detections", icon: Brain },
  { value: "28", label: "Countries Reached", icon: Globe },
];

export const milestones = [
  {
    year: "2022",
    title: "Platform Launch",
    desc: "LearnBright launched with AI-powered dyslexia screening for parents.",
  },
  {
    year: "2023",
    title: "Doctor Network",
    desc: "Partnered with 200+ certified learning disorder specialists worldwide.",
  },
  {
    year: "2024",
    title: "ADHD & Dyscalculia",
    desc: "Expanded screening to cover ADHD, dyscalculia, and auditory processing.",
  },
  {
    year: "2025",
    title: "10K Milestone",
    desc: "Surpassed 10,000 children screened with a 94% satisfaction rate.",
  },
];

export const stories = [
  {
    name: "Emma's Story",
    age: "Age 7",
    text: "Emma's parents noticed she struggled with reading. After a LearnBright assessment, she was identified with dyslexia early enough to get tailored support. Today, she reads at grade level.",
    outcome: "Reading at grade level",
  },
  {
    name: "Lucas's Story",
    age: "Age 9",
    text: "Lucas was misunderstood as 'lazy' at school. LearnBright's screening flagged ADHD markers, leading to a proper evaluation and the right classroom strategies.",
    outcome: "Thriving in school",
  },
  {
    name: "Ava's Story",
    age: "Age 6",
    text: "Ava's teacher recommended a screening. LearnBright identified dyscalculia early, and her parents connected with a specialist who helped her build confidence in math.",
    outcome: "Confident in math",
  },
];

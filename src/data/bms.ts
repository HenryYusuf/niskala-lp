import bmsData from './bmsData.json';

export type Lang = 'id' | 'en';

export const brand = bmsData.brand;
export const stats = bmsData.stats;
export const testimonials = bmsData.testimonials;
export const portfolioRaw = bmsData.portfolio;
export const dict = bmsData.dict as Record<string, { id: string; en: string }>;

const EN_ROUTE_MAP: Record<string, string> = {
  '/': '/en',
  '/layanan': '/en/services',
  '/portofolio': '/en/portfolio',
  '/tentang-kami': '/en/about-us',
  '/harga': '/en/pricing',
  '/blog': '/en/blog',
  '/case-studies': '/en/case-studies',
  '/kontak': '/en/contact',
};

const ID_ROUTE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(EN_ROUTE_MAP).map(([idPath, enPath]) => [enPath, idPath])
);

export const EN_SERVICE_SLUG_MAP: Record<string, string> = {
  'software-development': 'software-development',
  'custom-software-solutions': 'custom-software-solutions',
  'enterprise-web-applications': 'enterprise-web-applications',
  'e-commerce-solutions': 'e-commerce-solutions',
  'ai-automation': 'ai-automation',
  'it-consulting-strategy': 'it-consulting-strategy',
  'website-development': 'website-development',
  'seo-digital-marketing': 'seo-digital-marketing',
  'maintenance-support': 'maintenance-support',
  'procurement-management-system': 'procurement-management-system',
  'erp-online': 'erp-online',
  'workflow-management-system': 'workflow-management-system',
  'recruitment-management-system': 'recruitment-management-system',
  'jasa-pembuatan-erp-system': 'erp-system',
  'custom-software-ai': 'custom-software-ai',
  'operational-control-partner': 'operational-control-partner',
};

export function t(key: string, lang: Lang = 'id', vars?: Record<string, string>): string {
  const entry = dict[key];
  let val = entry ? entry[lang] || entry.id : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      val = val.replaceAll(`{${k}}`, v);
    }
  }
  return val;
}

export function localizedPath(idPath: string, lang: Lang = 'id'): string {
  if (lang === 'id') return idPath;
  if (EN_ROUTE_MAP[idPath]) return EN_ROUTE_MAP[idPath];
  if (idPath.startsWith('/layanan/')) {
    const slug = idPath.replace('/layanan/', '');
    const enSlug = EN_SERVICE_SLUG_MAP[slug] || slug;
    return `/en/services/${enSlug}`;
  }
  if (idPath.startsWith('/blog/')) {
    return `/en${idPath}`;
  }
  return `/en${idPath === '/' ? '' : idPath}`;
}

export function switchLangPath(currentPath: string, targetLang: Lang): string {
  const clean = currentPath.replace(/\/+$/, '') || '/';
  if (targetLang === 'en') {
    if (clean.startsWith('/en')) return clean;
    return localizedPath(clean, 'en');
  } else {
    if (!clean.startsWith('/en')) return clean;
    if (ID_ROUTE_MAP[clean]) return ID_ROUTE_MAP[clean];
    if (clean.startsWith('/en/services/')) {
      const enSlug = clean.replace('/en/services/', '');
      const idSlug =
        Object.entries(EN_SERVICE_SLUG_MAP).find(([, v]) => v === enSlug)?.[0] || enSlug;
      return `/layanan/${idSlug}`;
    }
    return clean.replace(/^\/en/, '') || '/';
  }
}

export interface ServiceItem {
  slug: string;
  icon: string;
  title: string;
  navLabel?: string;
  short: string;
  description: string;
  benefits: string[];
  signs: string[];
  whyBms: string[];
  testimonials?: { quote: string; author: string; role: string }[];
  process: { step: string; desc: string; duration?: string; deliverable?: string }[];
  useCases: { title: string; desc: string; industry?: string }[];
  techStack: string[];
  faqs: { q: string; a: string }[];
}

export function getServices(lang: Lang = 'id'): ServiceItem[] {
  const servicesId = bmsData.servicesId as ServiceItem[];
  const enMap = bmsData.servicesEnMap as Record<string, Partial<ServiceItem>>;
  if (lang === 'id') return servicesId;
  return servicesId.map((svc) => {
    const en = enMap[svc.slug];
    if (!en) return svc;
    return {
      ...svc,
      title: en.title ?? svc.title,
      navLabel: en.navLabel ?? svc.navLabel,
      short: en.short ?? svc.short,
      description: en.description ?? svc.description,
      benefits: en.benefits ?? svc.benefits,
      signs: en.signs ?? svc.signs,
      whyBms: en.whyBms ?? svc.whyBms,
      testimonials: en.testimonials ?? svc.testimonials,
      process: en.process ?? svc.process,
      useCases: en.useCases ?? svc.useCases,
      faqs: en.faqs ?? svc.faqs,
    };
  });
}

export const megaMenuCategories = {
  software: [
    'software-development',
    'custom-software-solutions',
    'enterprise-web-applications',
    'e-commerce-solutions',
    'website-development',
  ],
  ops: [
    'ai-automation',
    'it-consulting-strategy',
    'seo-digital-marketing',
    'maintenance-support',
  ],
  systems: [
    'erp-online',
    'procurement-management-system',
    'workflow-management-system',
    'recruitment-management-system',
  ],
  bespokeErp: {
    slug: 'jasa-pembuatan-erp-system',
    icon: 'Layers',
    title: { id: 'ERP System', en: 'ERP System' },
    short: {
      id: 'ERP custom yang menyatukan seluruh operasional bisnis Anda dalam satu sistem.',
      en: 'Custom ERP that brings all your business operations together in one system.',
    },
  },
  featured: [
    {
      idHref: '/layanan/custom-software-ai',
      icon: 'Sparkles',
      titleKey: 'nav.featured.csai.title',
      taglineKey: 'nav.featured.csai.tagline',
      gradient: 'linear-gradient(135deg, rgb(57, 43, 250) 0%, rgb(17, 179, 244) 100%)',
    },
    {
      idHref: '/layanan/operational-control-partner',
      icon: 'ShieldCheck',
      titleKey: 'nav.featured.ocp.title',
      taglineKey: 'nav.featured.ocp.tagline',
      gradient: 'linear-gradient(135deg, rgb(26, 16, 68) 0%, rgb(209, 108, 240) 100%)',
    },
  ],
};

export function getPortfolio(lang: Lang = 'id') {
  return portfolioRaw.map((item) => ({
    ...item,
    title: lang === 'en' && item.title_en ? item.title_en : item.title,
    category: lang === 'en' && item.category_en ? item.category_en : item.category,
    description: lang === 'en' && item.description_en ? item.description_en : item.description,
    challenge: lang === 'en' && item.challenge_en ? item.challenge_en : item.challenge,
    solution: lang === 'en' && item.solution_en ? item.solution_en : item.solution,
    results:
      lang === 'en' && item.results_en && item.results_en.length > 0
        ? item.results_en
        : item.results,
  }));
}

export function getWhatsAppHref(
  pathname: string = '/',
  lang: Lang = 'id',
  options?: { serviceTitle?: string; portfolioTitle?: string; refCode?: string }
): string {
  const ref = options?.refCode || 'BMSWEB';
  let msg = '';
  if (options?.serviceTitle) {
    msg =
      lang === 'en'
        ? `Hello ${brand.name}, I'm interested in your *${options.serviceTitle}* service and would like to know more about scope and cost.`
        : `Halo ${brand.name}, saya tertarik dengan layanan *${options.serviceTitle}* dan ingin tahu lebih lanjut soal scope serta estimasi biayanya.`;
  } else if (options?.portfolioTitle) {
    msg =
      lang === 'en'
        ? `Hello ${brand.name}, I saw the *${options.portfolioTitle}* project in your portfolio and would like to discuss building something similar.`
        : `Halo ${brand.name}, saya melihat project *${options.portfolioTitle}* di portofolio Anda dan ingin diskusi untuk membuat sesuatu yang serupa.`;
  } else {
    const messages: Record<string, { id: string; en: string }> = {
      '/': {
        id: `Halo ${brand.name}, saya baru mengunjungi website Anda dan tertarik untuk konsultasi mengenai kebutuhan digital bisnis saya.`,
        en: `Hello ${brand.name}, I just visited your website and would like to discuss the digital needs of my business.`,
      },
      '/layanan': {
        id: `Halo ${brand.name}, saya sedang melihat-lihat halaman layanan Anda dan ingin konsultasi solusi mana yang paling cocok untuk bisnis saya.`,
        en: `Hello ${brand.name}, I'm browsing your services page and would like to discuss which solution fits my business best.`,
      },
      '/portofolio': {
        id: `Halo ${brand.name}, saya tertarik dengan portofolio Anda dan ingin diskusi kemungkinan mengerjakan project bersama.`,
        en: `Hello ${brand.name}, I'm interested in your portfolio and would like to talk about working together on a project.`,
      },
      '/tentang-kami': {
        id: `Halo ${brand.name}, saya baru membaca halaman Tentang Kami dan ingin mengenal tim Anda lebih jauh sebelum memulai project.`,
        en: `Hello ${brand.name}, I just read your About page and would like to get to know your team before starting a project.`,
      },
      '/harga': {
        id: `Halo ${brand.name}, saya baru saja mencoba kalkulator harga di website Anda dan ingin diskusi paket yang sesuai untuk project saya.`,
        en: `Hello ${brand.name}, I just tried your pricing calculator and would like to discuss the right package for my project.`,
      },
      '/blog': {
        id: `Halo ${brand.name}, saya sedang membaca blog Anda dan tertarik untuk diskusi lebih lanjut soal topik yang dibahas.`,
        en: `Hello ${brand.name}, I'm reading your blog and would like to discuss the topic further.`,
      },
      '/kontak': {
        id: `Halo ${brand.name}, saya membuka halaman kontak dan ingin langsung terhubung dengan tim Anda.`,
        en: `Hello ${brand.name}, I opened your contact page and would like to connect directly with your team.`,
      },
    };
    const baseKey = ID_ROUTE_MAP[pathname] || pathname;
    msg = messages[baseKey]?.[lang] || messages['/'][lang];
  }
  const fullText = `${msg}\n\n[ref: ${ref}]`;
  return `https://api.whatsapp.com/send?phone=${brand.whatsappNumber}&text=${encodeURIComponent(fullText)}`;
}

export const homeInsights = [
  {
    anchor: 'Sistem CRM untuk Loyalitas Pelanggan',
    href: '/blog/sistem-crm-untuk-meningkatkan-loyalitas-pelanggan',
    description:
      'Strategi data, personalisasi, dan otomatisasi CRM untuk mempertahankan pelanggan.',
  },
  {
    anchor: 'Dashboard Bisnis Real-Time',
    href: '/blog/dashboard-bisnis-real-time-untuk-monitoring-performa',
    description:
      'Pantau performa bisnis dan percepat keputusan berbasis data secara real-time.',
  },
  {
    anchor: 'Software House Surabaya',
    href: '/blog/software-house-surabaya-solusi-pengembangan-software-untuk-bisnis-modern',
    description:
      'Solusi website, ERP, CRM, dan aplikasi custom untuk bisnis modern di Surabaya.',
  },
  {
    anchor: 'Enterprise Software Development',
    href: '/blog/enterprise-software-development-for-scalable-business',
    description:
      'Enterprise software untuk skalabilitas: ERP, CRM, dan workflow automation terintegrasi.',
  },
];

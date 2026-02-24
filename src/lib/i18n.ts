export const supportedLocales = ['en', 'zh', 'es', 'fr', 'de', 'ja'] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = 'en';

type LocaleTexts = {
  nav: {
    home: string;
    products: string;
    about: string;
    blog: string;
    contact: string;
    allProducts: string;
    quickLinks: string;
    contactUs: string;
    privacy: string;
    terms: string;
    shipping: string;
  };
  seo: {
    siteTitle: string;
    siteDescription: string;
    ogTitle: string;
    ogDescription: string;
  };
};

const localeTexts: Record<Locale, LocaleTexts> = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
      allProducts: 'All Products',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      shipping: 'Shipping Policy',
    },
    seo: {
      siteTitle: 'ATZ RFID | RFID Cards, Tags & Wristbands Manufacturer',
      siteDescription:
        'Leading RFID manufacturer for RFID cards, RFID tags, NFC tags, RFID wristbands, RFID labels and custom RFID solutions with global wholesale delivery.',
      ogTitle: 'ATZ RFID | Your Trusted RFID Products Manufacturer',
      ogDescription:
        'Premium RFID cards, tags, wristbands and NFC labels for access control, asset tracking and inventory management.',
    },
  },
  zh: {
    nav: {
      home: '首页',
      products: '产品',
      about: '关于我们',
      blog: '博客',
      contact: '联系我们',
      allProducts: '全部产品',
      quickLinks: '快速链接',
      contactUs: '联系我们',
      privacy: '隐私政策',
      terms: '服务条款',
      shipping: '运输政策',
    },
    seo: {
      siteTitle: 'ATZ RFID | RFID卡片、标签与腕带制造商',
      siteDescription:
        '专业RFID厂家，提供RFID卡、RFID标签、NFC标签、RFID腕带、RFID不干胶与定制化RFID解决方案。',
      ogTitle: 'ATZ RFID | 值得信赖的RFID产品制造商',
      ogDescription: '高品质RFID卡、标签、腕带与NFC产品，支持门禁、仓储、资产与零售场景。',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      products: 'Productos',
      about: 'Nosotros',
      blog: 'Blog',
      contact: 'Contacto',
      allProducts: 'Todos los productos',
      quickLinks: 'Enlaces rápidos',
      contactUs: 'Contáctanos',
      privacy: 'Privacidad',
      terms: 'Términos',
      shipping: 'Envío',
    },
    seo: {
      siteTitle: 'ATZ RFID | Fabricante de tarjetas y etiquetas RFID',
      siteDescription:
        'Fabricante de RFID para tarjetas RFID, etiquetas RFID, etiquetas NFC y pulseras RFID con soluciones a medida.',
      ogTitle: 'ATZ RFID | Fabricante de productos RFID',
      ogDescription: 'Productos RFID premium para control de acceso, trazabilidad e inventario.',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      products: 'Produits',
      about: 'À propos',
      blog: 'Blog',
      contact: 'Contact',
      allProducts: 'Tous les produits',
      quickLinks: 'Liens rapides',
      contactUs: 'Contactez-nous',
      privacy: 'Confidentialité',
      terms: 'Conditions',
      shipping: 'Livraison',
    },
    seo: {
      siteTitle: 'ATZ RFID | Fabricant de cartes et tags RFID',
      siteDescription:
        'Fabricant RFID pour cartes RFID, tags RFID, tags NFC et bracelets RFID avec solutions personnalisées.',
      ogTitle: 'ATZ RFID | Fabricant de produits RFID',
      ogDescription: 'Produits RFID premium pour contrôle d’accès, traçabilité et gestion des stocks.',
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      products: 'Produkte',
      about: 'Über uns',
      blog: 'Blog',
      contact: 'Kontakt',
      allProducts: 'Alle Produkte',
      quickLinks: 'Schnellzugriff',
      contactUs: 'Kontakt',
      privacy: 'Datenschutz',
      terms: 'AGB',
      shipping: 'Versand',
    },
    seo: {
      siteTitle: 'ATZ RFID | Hersteller für RFID-Karten und Tags',
      siteDescription:
        'RFID-Hersteller für RFID-Karten, RFID-Tags, NFC-Tags und RFID-Armbänder mit individuellen Lösungen.',
      ogTitle: 'ATZ RFID | RFID Produkt Hersteller',
      ogDescription: 'Premium RFID Produkte für Zutritt, Tracking und Lagerverwaltung.',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      products: '製品',
      about: '会社情報',
      blog: 'ブログ',
      contact: 'お問い合わせ',
      allProducts: 'すべての製品',
      quickLinks: 'クイックリンク',
      contactUs: 'お問い合わせ',
      privacy: 'プライバシー',
      terms: '利用規約',
      shipping: '配送',
    },
    seo: {
      siteTitle: 'ATZ RFID | RFIDカード・タグ製造メーカー',
      siteDescription:
        'RFIDカード、RFIDタグ、NFCタグ、RFIDリストバンドを提供するRFIDメーカー。',
      ogTitle: 'ATZ RFID | RFID製品メーカー',
      ogDescription: '入退室管理、在庫管理、トラッキング向けの高品質RFID製品。',
    },
  },
};

export const productKeywords = [
  'RFID cards manufacturer',
  'RFID tags supplier',
  'NFC tags wholesale',
  'UHF RFID tags',
  'HF RFID labels',
  'RFID wristbands',
  'RFID keyfobs',
  'RFID inlay',
  'custom RFID cards',
  'RFID access control',
  'RFID inventory tracking',
  'asset tracking RFID',
  'industrial RFID solutions',
  'ISO 18000-6C tags',
  'MIFARE cards',
  'NXP RFID chips',
  'Impinj RFID tags',
  'Alien RFID tags',
  'RFID factory China',
  'bulk RFID products',
];

export function isSupportedLocale(locale: string): locale is Locale {
  return (supportedLocales as readonly string[]).includes(locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split('/').filter(Boolean)[0];
  if (!segment) return null;
  return isSupportedLocale(segment) ? segment : null;
}

export function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname;
  const stripped = pathname.slice(locale.length + 1);
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

export function withLocalePath(path: string, locale: Locale): string {
  const [rawPathname, rawQuery] = path.split('?');
  const pathname = rawPathname.startsWith('/') ? rawPathname : `/${rawPathname}`;
  const normalizedPath = stripLocaleFromPathname(pathname);
  const base = normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
  return rawQuery ? `${base}?${rawQuery}` : base;
}

export function getRequestLocale(localeHeader: string | null | undefined): Locale {
  if (localeHeader && isSupportedLocale(localeHeader)) {
    return localeHeader;
  }
  return defaultLocale;
}

export function getLocaleTexts(locale: Locale): LocaleTexts {
  return localeTexts[locale] ?? localeTexts[defaultLocale];
}

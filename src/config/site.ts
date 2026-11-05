export const siteConfig = {
  name: 'Torba',
  description: 'Marketplace for buying and selling goods',
  defaultLocale: 'uk',
  locales: ['uk', 'en'] as const,
  links: {
    figma:
      'https://www.figma.com/design/imQzlvJcm0EMhvUqr3kQFZ/Marketplace--torba?node-id=0-1&m=dev&t=qPg6j28l1Yd7lLL2-1',
    github: 'https://github.com/pavlokvolonter-ctrl/torba-marketplace',
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    email: 'mailto:hello@torba.ua',
  },
} as const;

export type AppLocale = (typeof siteConfig.locales)[number];

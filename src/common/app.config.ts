import { TypeOf } from 'io-ts';

type Uri = typeof Brand.URIs[keyof typeof Brand.URIs];
type Meta = typeof Brand.Meta[keyof typeof Brand.Meta];
type Title = typeof Brand.Title[keyof typeof Brand.Title];
type Description = typeof Brand.Meta.Description;
type SiteName = typeof Brand.Meta.SiteName;
type ThemeColor = typeof Brand.Meta.ThemeColor;
type TwitterSite = typeof Brand.Meta.TwitterSite;

export const Brand = {
  Title: {
    Base: 'big-AGI' as Title,
    Common: (process.env.NODE_ENV === 'development' ? '[DEV] ' : '') + 'big-AGI' as Title,
  },
  Meta: {
    Description: 'Launch big-AGI to unlock the full potential of AI, with precise control over your data and models. Voice interface, AI personas, advanced features, and fun UX.' as Description,
    SiteName: 'big-AGI | Precision AI for You' as SiteName,
    ThemeColor: '#32383E' as ThemeColor,
    TwitterSite: '@enricoros' as TwitterSite,
  },
  URIs: {
    Home: 'https://big-agi.com' as Uri,
    // App: 'https://get.big-agi.com',
    CardImage: 'https://big-agi.com/icons/card-dark-1200.png' as Uri,
    OpenRepo: 'https://github.com/enricoros/big-agi' as Uri,
    OpenProject: 'https://github.com/users/enricoros/projects/4' as Uri,
    SupportInvite: 'https://discord.gg/MkH4qj2Jp9' as Uri,
    // Twitter: 'https://www.twitter.com/enricoros',
    PrivacyPolicy: 'https://big-agi.com/privacy' as Uri,
  },
} as const;

type Brand = typeof Brand;
type BrandURIs = TypeOf<typeof Brand>['URIs'];
type BrandMeta = TypeOf<typeof Brand>['Meta'];
type BrandTitle = TypeOf<typeof Brand>['Title'];

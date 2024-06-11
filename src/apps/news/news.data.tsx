import React from 'react';
import {
  StaticImageData,
  Box,
  Chip,
  SvgIconProps,
  Typography,
  Link as MuiLink,
} from '@mui/joy';
import { brandColors } from '~/common/styles/theme';
import { ExternalLink } from '~/common/components/ExternalLink';
import { platformAwareKeystrokes } from '~/common/components/KeyStroke';
import { Link } from '~/common/components/Link';
import { clientUtmSource } from '~/common/util/pwaUtils';

// ... (import other required components)

interface NewsItem {
  versionCode: string;
  versionName?: string;
  versionMoji?: string;
  versionDate?: Date;
  versionCoverImage?: StaticImageData;
  text?: React.ReactNode;
  items?: {
    text: React.ReactNode;
    dev?: boolean;
    issue?: number;
    icon?: React.FC<SvgIconProps>;
    noBullet?: boolean;
  }[];
}

const B = (props: {
  href?: string;
  issue?: number;
  code?: string;
  wow?: boolean;
  children: React.ReactNode;
}) => {
  const href =
    props.issue ? `${Brand.URIs.OpenRepo}/issues/${props.issue}`
      : props.code ? `${Brand.URIs.OpenRepo}/blob/main/${props.code}`
        : props.href;
  const boldText = (
    <Typography component='span' color={!!href ? 'primary' : 'neutral'} sx={{ fontWeight: 'lg' }}>
      {props.children}
    </Typography>
  );

  if (!href) {
    return boldText;
  }

  return (
    <ExternalLink href={href + clientUtmSource()} highlight={props.wow}>
      <MuiLink underline='none' color='inherit' component='span' sx={{ mr: 0.5 }}>
        {boldText}
      </MuiLink>
    </ExternalLink>
  );
};

export const NewsItems: NewsItem[] = [
  // ... (same NewsItems content)
];

export default function ReleaseNotes() {
  return (
    <Box>
      {NewsItems.map((item, index) => (
        <Box key={index} mb={3}>
          {item.versionName && (
            <Typography
              component='h2'
              level='h3'
              mb='xsmall'
              fontWeight='xl'
              color='neutral'
              sx={{ textTransform: 'capitalize' }}
            >
              {item.versionName} {item.versionMoji && <Box component='span' sx={{ color: brandColors.primary[500] }}>{item.versionMoji}</Box>}
            </Typography>
          )}
          {item.versionDate && (
            <Typography level='body2' fontWeight='md' color='neutral'>
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(item.versionDate)}
            </Typography>
          )}
          {item.versionCoverImage && (
            <Box
              component='img'
              src={item.versionCoverImage}
              alt={`${item.versionName} release cover`}
              loading='lazy'
              width='100%'
              height='auto'
              mb='xsmall'
              borderRadius='sm'
              sx={{ objectFit: 'cover' }}
            />
          )}
          {item.items?.map((subItem, subIndex) => (
            <Box key={subIndex} display='flex' gap='xsmall' mb='xsmall' lineHeight='1.6'>
              {!subItem.noBullet && <Box component='span' sx={{ color: 'neutral.500', mr: 'xsmall' }}>•</Box>}
              {subItem.icon && <subItem.icon fontSize='inherit' />}
              {subItem.text}
              {subItem.issue && (
                <ExternalLink href={`${Brand.URIs.OpenRepo}/issues/${subItem.issue}` + clientUtmSource()} highlight>
                  <Chip size='sm' variant='soft' color='neutral'>
                    Issue #{subItem.issue}
                  </Chip>
                </ExternalLink>
              )}
              {subItem.dev && (
                <Chip size='sm' variant='soft' color='primary'>
                  Developers
                </Chip>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

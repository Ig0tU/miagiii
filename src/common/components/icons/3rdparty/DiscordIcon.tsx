import * as React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/joy';

type DiscordIconProps = Omit<SvgIconProps, 'viewBox' | 'width' | 'height'>;

const DiscordIcon: React.FC<DiscordIconProps> = (props) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      width={24}
      height={24}
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      css={{
        // Add any custom styles here
      }}
      {...props}
    >
      <path
        key="discord-icon-path"
        stroke="none"
        d="M0 0h24v24H0z"
        fill="none"
      />
      <path
        d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.94 0 -2.257 -1.596 -2.777 -2.969l-.02 .005c.838 -.131 1.69 -.323 2.572 -.574a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c1.057 1.488 2.555 2.38 4.717 2.685a1 1 0 0 0 .938 -.435l.063 -.107l.652 -1.288l.16 -.019c.877 -.09 1.718 -.09 2.595 0l.158 .019l.65 -1.287a1 1 0 0 1 .754 -.54l.123 -.01zm-5.983 6a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z"
        strokeWidth={0}
        fill="currentColor"
      />
    </SvgIcon>
  );
};

DiscordIcon.defaultProps = {
  // Set default props here
};

export default DiscordIcon;

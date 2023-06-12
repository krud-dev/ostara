import { SvgIcon, SvgIconProps } from '@mui/material';

export default function MacOsIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 256 256" {...props}>
      <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
          <stop stopColor="#58B0E3" offset="0%" />
          <stop stopColor="#F44E28" offset="100%" />
        </linearGradient>
      </defs>
      <g>
        <circle fill="#FFFFFF" cx="128" cy="128" r="128" />
        <path
          d="M186.831132,49.2103774 L179.056603,49.2103774 L128.232075,122.662264 L127.767925,122.662264 L77.059434,49.2103774 L69.1688679,49.2103774 L123.938679,128.232075 L69.4009434,206.789622 L77.1754717,206.789622 L127.651886,133.569811 L128.116038,133.569811 L178.592453,206.789622 L186.483018,206.789622 L131.945283,128.232075 L186.831132,49.2103774 L186.831132,49.2103774 Z"
          fill="url(#linearGradient-1)"
        />
      </g>
    </SvgIcon>
  );
}

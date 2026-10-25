import type { SVGProps } from "react";

// Exact vector paths from the Figma file (Material icons used by the design).
const ARROW_PATH = "M16 16L14.59 14.59L9 20.17V0H7V20.17L1.42 14.58L0 16L8 24L16 16Z";

export const ArrowDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 24" width={16} height={24} fill="currentColor" aria-hidden {...props}>
    <path d={ARROW_PATH} />
  </svg>
);

export const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 16" width={24} height={16} fill="currentColor" aria-hidden {...props}>
    <path d={ARROW_PATH} transform="matrix(0 -1 1 0 0 16)" />
  </svg>
);

export const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden {...props}>
    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
  </svg>
);

export const TwitterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden {...props}>
    <path d="M22.46 6.01c-.77.35-1.6.58-2.47.68a4.3 4.3 0 0 0 1.89-2.38c-.83.5-1.75.85-2.73 1.05a4.28 4.28 0 0 0-7.29 3.9 12.14 12.14 0 0 1-8.85-4.48 4.28 4.28 0 0 0 1.33 5.73 4.27 4.27 0 0 1-1.94-.54v.05a4.29 4.29 0 0 0 3.44 4.2 4.3 4.3 0 0 1-1.93.08 4.29 4.29 0 0 0 4 2.98 8.6 8.6 0 0 1-6.35 1.78A12.13 12.13 0 0 0 8.12 21c7.89 0 12.21-6.54 12.21-12.21l-.01-.56a8.7 8.7 0 0 0 2.14-2.22Z" />
  </svg>
);

export const AccountIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78A7.88 7.88 0 0 1 12 20c-1.86 0-3.57-.64-4.93-1.72Zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33A7.95 7.95 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83ZM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6Zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11Z"
    />
  </svg>
);

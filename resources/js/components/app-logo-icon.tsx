import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="currentColor" />
            <text
                x="20"
                y="27"
                textAnchor="middle"
                fontSize="18"
                fontWeight="600"
                fill="#0C447C"
                fontFamily="sans-serif"
            >
                U
            </text>
        </svg>
    );
}

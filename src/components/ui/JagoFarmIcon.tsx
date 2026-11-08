import { useId, type SVGProps } from "react";

export type JagoFarmIconProps = SVGProps<SVGSVGElement> & {
    size?: number | string;
};

export default function JagoFarmIcon({
    className = "w-5 h-5 text-green-800",
    size,
    ...props
}: JagoFarmIconProps) {
    const rawId = useId();
    // Bersihkan karakter titik dua dari React useId agar valid sebagai ID SVG selector
    const maskId = `jf-mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            className={`shrink-0 select-none ${className}`}
            aria-label="JagoFarm Logo"
            {...props}
        >
            {/* Garis Batas Samping Kiri & Kanan */}
            <line
                x1="12"
                y1="30"
                x2="12"
                y2="82"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            <line
                x1="88"
                y1="30"
                x2="88"
                y2="82"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
            />

            {/* Gelombang Air (Wave Divider) */}
            <path
                d="M19 55.5 C27 52.5 36 53.5 43 56.5 C46 57.8 48 58.5 50 58.5 C52 58.5 54 57.8 57 56.5 C64 53.5 73 52.5 81 55"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Batang Tanaman (Stem) */}
            <path
                d="M50 57.5 L50 38"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            <path
                d="M50 43 Q46 41 43 38"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M50 43 Q54 41 57 38"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />

            {/* Tiga Daun Tanaman (Foliage dengan aksen tulang tengah) */}
            <g fill="currentColor" opacity="0.9">
                {/* Daun Tengah (Tegak) */}
                <g transform="translate(50, 37)">
                    <path d="M-0.6 0 C-6 -8 -6 -18 -0.6 -27 L-0.6 0 Z" />
                    <path d="M0.6 0 C6 -8 6 -18 0.6 -27 L0.6 0 Z" />
                </g>

                {/* Daun Kiri (Miring ~38 derajat) */}
                <g transform="translate(45, 38) rotate(-38)">
                    <path d="M-0.6 0 C-5.5 -7 -5.5 -16 -0.6 -24 L-0.6 0 Z" />
                    <path d="M0.6 0 C5.5 -7 5.5 -16 0.6 -24 L0.6 0 Z" />
                </g>

                {/* Daun Kanan (Miring 38 derajat) */}
                <g transform="translate(55, 38) rotate(38)">
                    <path d="M-0.6 0 C-5.5 -7 -5.5 -16 -0.6 -24 L-0.6 0 Z" />
                    <path d="M0.6 0 C5.5 -7 5.5 -16 0.6 -24 L0.6 0 Z" />
                </g>
            </g>

            {/* Masking untuk Mata dan Insang Ikan (True Negative Space Cutout) */}
            <defs>
                <mask id={maskId}>
                    <rect width="100" height="100" fill="white" />
                    <circle cx="70" cy="69.5" r="1.6" fill="black" />
                    <path
                        d="M64.5 66.5 C62.5 69 62.5 72 64.5 74.5"
                        stroke="black"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        fill="none"
                    />
                </mask>
            </defs>

            {/* Siluet Ikan (Menghadap Kanan) */}
            <path
                mask={`url(#${maskId})`}
                fill="currentColor"
                d="M76 71
                   C73 66.5 65 64 55 64
                   L53.5 61 C52.5 59.5 50.5 59.5 49 61 L47 64.5
                   C39 66 31 69.5 26 71.5
                   L19 64 C18.3 63.5 17.2 64.2 17.6 65.2 L20.5 71.5 L17.6 77.8 C17.2 78.8 18.3 79.5 19 79 L26 72.5
                   C32 75 38 76.8 44 77.2
                   L45.5 80.5 C46.2 81.3 47.5 81 47.8 80 L48.2 77.2
                   C57 77 69 76 76 71 Z"
            />
        </svg>
    );
}

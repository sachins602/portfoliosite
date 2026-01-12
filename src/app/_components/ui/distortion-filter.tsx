"use client";

/**
 * Reusable SVG filter for liquid distortion effect.
 * Uses fractal noise and displacement mapping.
 */
export function DistortionFilter({ id }: { id: string }) {
	return (
		<svg aria-hidden="true" className="absolute h-0 w-0">
			<title>Distortion Filter</title>
			<defs>
				<filter height="140%" id={id} width="140%" x="-20%" y="-20%">
					<feTurbulence baseFrequency="0.01" data-turbulence numOctaves="2" result="noise" type="fractalNoise" />
					<feDisplacementMap
						data-displacement
						in="SourceGraphic"
						in2="noise"
						scale="0"
						xChannelSelector="R"
						yChannelSelector="G"
					/>
				</filter>
			</defs>
		</svg>
	);
}

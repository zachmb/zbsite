<script lang="ts">
	type IconPackStyles = {
		brands: never;
		chisel: 'regular';
		classic: 'solid' | 'regular' | 'light' | 'thin';
		duotone: 'solid' | 'regular' | 'light' | 'thin';
		etch: 'solid';
		jelly: 'regular';
		'jelly-duo': 'regular';
		'jelly-fill': 'regular';
		notdog: 'solid';
		'notdog-duo': 'solid';
		sharp: 'solid' | 'regular' | 'light' | 'thin';
		'sharp-duotone': 'solid' | 'regular' | 'light' | 'thin';
		slab: 'regular';
		'slab-press': 'regular';
		thumbprint: 'light';
		utility: 'semibold';
		'utility-duo': 'semibold';
		'utility-fill': 'semibold';
		whiteboard: 'semibold';
	};

	type IconPack = keyof IconPackStyles;

	type Props = {
		[P in IconPack]: IconPackStyles[P] extends never
			? { pack: P; style?: never; name: string }
			: { pack: P; style: IconPackStyles[P]; name: string };
	}[IconPack];

	let { pack, style, name }: Props = $props();

	name = name.trim();
	if (name.startsWith('fa-')) name = name.slice(3);
</script>

<i class={`fa-${pack} ${style ? `fa-${style}` : ''} fa-${name}`}></i>

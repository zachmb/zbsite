<script lang="ts">
	type Props = {
		pack:
			| 'brands'
			| 'chisel'
			| 'classic'
			| 'duotone'
			| 'etch'
			| 'jelly'
			| 'notdog'
			| 'sharp'
			| 'sharp-duotone'
			| 'slab'
			| 'thumbprint'
			| 'utility'
			| 'whiteboard';
		style: 'solid' | 'regular' | 'light' | 'thin' | 'semibold';
		name: string;
	};
	let { pack, style, name }: Props = $props();
	if (name.startsWith('fa-')) name = name.slice(3);
</script>

<i class={`fa-${pack} fa-${style} fa-${name}`}></i>

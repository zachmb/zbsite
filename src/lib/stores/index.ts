import { writable } from 'svelte/store';
import rememberable from '$utils/rememberable';

export const showEasterEgg = writable(false);

export const theme = rememberable<'light' | 'dark' | 'auto'>('theme', 'auto');

import { browser } from '$app/environment';

class Sound {
	private audio: HTMLAudioElement | null = null;

	constructor(
		public readonly src: string,
		private readonly volume: number = 1
	) {
		if (browser) {
			this.audio = new Audio(this.src);
			this.audio.volume = this.volume.clamp(0, 1);

			this.audio.addEventListener('pause', () => (this.audio!.currentTime = 0));
		}
	}

	load() {
		if (this.audio) {
			this.audio.preload = 'auto';
			this.audio.load();
		}
	}

	play() {
		if (this.audio) {
			this.audio.pause();
			this.audio.play();
		}
	}
}

export const fahhhhh = new Sound('/sounds/fahhhhh.mp3');

import { browser } from '$app/environment';

class Sound {
	private _audio: HTMLAudioElement | null = null;

	constructor(
		public readonly src: string,
		private volume: number = 1
	) {
		if (browser) {
			this._audio = new Audio(this.src);
			this._audio.volume = this.volume.clamp(0, 1);

			this._audio.addEventListener('pause', () => (this._audio!.currentTime = 0));
		}
	}

	load() {
		if (this._audio) {
			this._audio.preload = 'auto';
			this._audio.load();
		}
	}

	play() {
		if (this._audio) this._audio.play();
	}
}

export const fahhhhh = new Sound('/sounds/fahhhhh.mp3');

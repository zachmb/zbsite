import { browser } from '$app/environment';

class Sound {
	private _audio: HTMLAudioElement | null = null;

	constructor(public readonly src: string) {
		if (browser) this._audio = new Audio(this.src);
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

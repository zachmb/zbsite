import { browser } from '$app/environment';
import type { PossiblyNull } from '@madkarma/ts-utils/types';

class Sound {
	public readonly audio: PossiblyNull<HTMLAudioElement> = null;

	constructor(
		public readonly src: string,
		private readonly volume: number = 100
	) {
		if (browser) {
			this.audio = new Audio(this.src);
			this.audio.volume = this.volume.clamp(0, 100) / 100;

			this.audio.addEventListener('pause', () => (this.audio!.currentTime = 0));
		}
	}

	load() {
		if (!this.audio) return;
		this.audio.preload = 'auto';
		this.audio.load();
	}

	play(onEnded?: () => void) {
		if (!this.audio) return;

		this.audio.pause();
		this.audio.play();

		if (!onEnded) return;

		const onEndedWrapper = () => {
			this.audio!.removeEventListener('ended', onEndedWrapper);
			onEnded();
		};

		this.audio.addEventListener('ended', onEndedWrapper);
	}
}

const sounds = {
	fahhhhh: new Sound('/sounds/fahhhhh.mp3'),
	thinkFast: new Sound('/sounds/think-fast.opus', 45)
} as const;

export const loadAllSounds = () => Promise.all(Object.values(sounds).map((sound) => sound.load()));

export default sounds;

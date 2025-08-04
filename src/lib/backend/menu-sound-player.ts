import * as Tone from "tone";

const menuSoundPlayer: Tone.Player = new Tone.Player({
    url: "/ClickSoundEffect.wav",
    autostart: false,
    volume: 10
}).toDestination();

export default menuSoundPlayer;

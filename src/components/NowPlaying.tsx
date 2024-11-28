import AudioPlayer, { ActiveUI } from "react-modern-audio-player";
import { playList } from "../playlist";

const activeUI: ActiveUI = {
  playButton: true,
  volume: true,
  volumeSlider: true,
  trackTime: true,
  trackInfo: true,
  artwork: true,
  progress: "bar",
};

export default function NowPlaying() {
  return <AudioPlayer playList={playList} activeUI={activeUI} />;
}

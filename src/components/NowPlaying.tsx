import AudioPlayer, { ActiveUI } from "react-modern-audio-player";
import { PlayistProp } from "../types";

const activeUI: ActiveUI = {
  playButton: true,
  volume: true,
  volumeSlider: true,
  trackTime: true,
  trackInfo: true,
  artwork: true,
  progress: "bar",
};

export default function NowPlaying(props: PlayistProp) {
  return (
    <div className="audio-player">
      <AudioPlayer
        playList={props.playlist}
        activeUI={activeUI}
        placement={{ player: "bottom" }}
      />
    </div>
  );
}


import ReactPlayer from 'react-player';

function VideoPlayer() {
  return (
    <ReactPlayer
      url="https://firebasestorage.googleapis.com/v0/b/eduverse-68bf6.appspot.com/o/SampleVideo_1280x720_5mb.mp4?alt=media&token=76470060-33a7-4d0c-bfa8-1f599226488b"
      className="w-[200px] h-[200px]"
      controls
    />
  );
}

export default VideoPlayer;
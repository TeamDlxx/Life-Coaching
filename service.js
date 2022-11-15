import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener('remote-seek', async ({position}) => {
    console.log('seek to ' + position);
    await TrackPlayer.seekTo(position);
  });

  TrackPlayer.addEventListener('remote-play', async () => {
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-stop', async () => {
    await TrackPlayer.destroy();
  });

  TrackPlayer.addEventListener('remote-jump-forward', async interval => {
    console.log('innterval forwards: ' + interval);
    await TrackPlayer.seekTo((await TrackPlayer.getPosition()) + 10);
  });

  TrackPlayer.addEventListener('remote-jump-backward', async interval => {
    console.log('innterval backward: ' + interval);
    await TrackPlayer.seekTo((await TrackPlayer.getPosition()) - 10);
  });
};

// import TrackPlayer from 'react-native-track-player';

// module.exports = async function() {
//   TrackPlayer.addEventListener('remote-play', async () => {
//     await TrackPlayer.play();
//   });

//   TrackPlayer.addEventListener('remote-pause', async () => {
//     await TrackPlayer.pause();
//   });

//   TrackPlayer.addEventListener('remote-next', async () => {
//     await TrackPlayer.skipToNext();
//   });

//   TrackPlayer.addEventListener('remote-previous', async () => {
//     await TrackPlayer.skipToPrevious();
//   });

//   TrackPlayer.addEventListener('remote-stop', async () => {
//     await TrackPlayer.destroy();
//   });

// };

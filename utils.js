export const isVideoLink = (url) => {
    const youtubeRegex = /(youtube\.com|youtu\.be)/;
    const vimeoRegex = /vimeo\.com/;
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  };
  
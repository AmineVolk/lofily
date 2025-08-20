const VideoPlayer = ({
  url,
  ...other
}: {
  url: string;
  id?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  controls?: boolean;
  playsInline?: boolean;
}) => {
  return (
    <video {...other} id={other.id + url} key={url}>
      <source src={url} type='video/mp4' />
    </video>
  );
};
export { VideoPlayer };

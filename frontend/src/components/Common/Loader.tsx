import { TailSpin } from 'react-loader-spinner';

const ButtonLoader = () => {
  return (
    <TailSpin
      height={15}
      width={30}
      color='white'
      wrapperStyle={{ marginLeft: '5px' }}
    />
  );
};

export { ButtonLoader };

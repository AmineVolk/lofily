const GradientButton = ({
  children,
  onClick,
  type = 'button',
}: {
  onClick?: () => void;
  children: JSX.Element;
  type?: 'button' | 'submit' | 'reset' | undefined;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className='rounded-md bg-gradient-to-br from-secondary-gradient-from to-secondary-gradient-to p-2 px-4 font-bold text-white'
    >
      {children}
    </button>
  );
};

export { GradientButton };

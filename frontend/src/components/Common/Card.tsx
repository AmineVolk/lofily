type Props = {
  className?: string;
  children: JSX.Element;
  shadowSize?: string;
  onClick?: any;
  onDoubleClick?: () => void;
};
const Card = ({
  children,
  className,
  onClick,
  shadowSize = 'lg',
  ...other
}: Props) => {
  return (
    <div
      onClick={onClick}
      {...other}
      className={`shadow-${shadowSize} rounded-md bg-primary-light p-4 ${className} `}
    >
      {children}
    </div>
  );
};
export { Card };

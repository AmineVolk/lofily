import clsx from 'clsx';

type Props = {
  className?: string;
  children: JSX.Element;
};
const Card = ({ children, className, ...other }: Props) => {
  return (
    <div
      {...other}
      className={clsx([`rounded-2xl bg-white p-4 shadow-md`, className])}
    >
      {children}
    </div>
  );
};
export { Card };

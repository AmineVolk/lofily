type Props = {
  margin?: number;
  type?: string;
};
type HorizontalDividerProps = {
  margin: number;
};

const VerticalDivider = () => <div className='bg-grey-light w-px'></div>;

const HorizontalDivider = ({ margin }: HorizontalDividerProps) => (
  <div className={`h-px bg-gray-100 my-${margin}`} />
);

const Divider = ({ margin = 4, type = 'horizontal' }: Props) => {
  if (type === 'horizontal') return <HorizontalDivider margin={margin} />;
  return <VerticalDivider />;
};
export { Divider };

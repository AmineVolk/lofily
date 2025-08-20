import { FormProvider, useForm } from 'react-hook-form';

type Props = {
  children: JSX.Element;
  values: object;
  onSubmit: () => void;
};
const FormWrapper = ({ children, values, onSubmit }: Props) => {
  const formMethodes = useForm({ values });

  return (
    <FormProvider {...formMethodes}>
      <form
        onSubmit={formMethodes.handleSubmit(() => onSubmit())}
        className='flex h-full flex-1'
      >
        {children}
      </form>
    </FormProvider>
  );
};
export { FormWrapper };

# Next.js + Tailwind CSS + TypeScript Starter and Boilerplate

## Handle form

1. The parent component should be wrapperd by [FormWrapper](src/components/FormWrapper.tsx)

```jsx
<FormWrapper onSubmit={handleUpdate} values={user}>
  {children}
</FormWrapper>
```

2. Use the [this](frontend/src/components/Input.tsx) custom input

The id is mondatory beacause it's used to register the inupt on the FormProvider.
The required is the message to display if the is not filled.

```jsx
<Input
  id='fullname'
  label={t('profile.fullname')}
  value={user.fullname}
  required='Please enter your fullname.'
  onChange={onChange('fullname')}
/>
```

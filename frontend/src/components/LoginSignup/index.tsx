import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useReduxActions } from '@/hooks/useReduxState';

import { MenuItemsIndex } from '@/services/redux-state/Store';
import { DynamicComponentType } from '@/type';

import { ForgotPassword } from './ForgotPasswordContent';
import { LoginContent } from './LoginContent';
import { ResetPasswordContent } from './ResetPasswordContent';
import { SignupContent } from './SignupContent';
import { Dialog } from '../Common/Dialog';

const LoginDialog = () => {
  const [currentContentItem, setCurrentContentItem] = useState<number>(0);
  const router = useRouter();

  const { update } = useReduxActions();

  const getCurrentContent: DynamicComponentType = {
    0: () => (
      <LoginContent
        setClickedSignup={() => setCurrentContentItem(1)}
        setClickedForgot={() => setCurrentContentItem(2)}
      />
    ),
    1: () => <SignupContent onClickLogin={() => setCurrentContentItem(0)} />,
    2: () => <ForgotPassword />,
    3: () => (
      <ResetPasswordContent onClickLogin={() => setCurrentContentItem(0)} />
    ),
  };

  React.useEffect(() => {
    if (router.query.reset_token) setCurrentContentItem(3);
  }, [router.query.reset_token]);

  const dynamicContent = getCurrentContent[currentContentItem]();

  return (
    <Dialog
      withValidationButton={false}
      handleClose={() => update(['currentMenuIndex'], MenuItemsIndex.NONE)}
    >
      {dynamicContent}
    </Dialog>
  );
};
export { LoginDialog };

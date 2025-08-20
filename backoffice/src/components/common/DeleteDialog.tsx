import { Dialog } from '../common/Dialog';

const DeleteDialog = ({
  title,
  onClose,
  onValidate,
}: {
  title: string;
  onValidate: () => void;
  onClose: () => void;
}) => {
  return (
    <Dialog
      withContent={false}
      onValidate={onValidate}
      title={title}
      onClose={onClose}
    >
      <></>
    </Dialog>
  );
};
export { DeleteDialog };

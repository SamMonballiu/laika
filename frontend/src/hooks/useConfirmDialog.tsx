import { Dialog } from "../components/Dialog";

interface Args {
    message: string;
    isOpen: boolean;
    onConfirm: () => void;
    onClose?: () => void;
    onCancel?: () => void;
}

export const useConfirmDialog = (args: Args) => {
    const dialog = <Dialog
    isOpen={args.isOpen}
    onClose={() => {
        args.onCancel?.();
    }}
    buttons={[
      {label: "Yes", onClick: args.onConfirm},
      {label: "No", onClick: () => {
        args.onCancel?.();
      }},
    ]}
  >
    <p>{args.message}</p>
  </Dialog>

  return { dialog: args.isOpen ? dialog : null }
}
import { Dialog, Button } from '../ui'

type Props = {
  title: string
  description?: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmDialog({ title, description, onConfirm, onCancel }: Props) {
  return (
    <Dialog onClose={onCancel}>
      <div className="w-full max-w-md p-6 bg-[#1e1e1e] text-white border border-[#333] rounded-xl">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        {description && (
          <p className="text-sm text-gray-300 mb-6">{description}</p>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={onConfirm}>Confirmer</Button>
        </div>
      </div>
    </Dialog>
  )
}
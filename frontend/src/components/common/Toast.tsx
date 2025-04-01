type Props = {
    message: string
    type?: 'success' | 'error'
  }
  
  export default function Toast({ message, type = 'success' }: Props) {
    return (
      <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm z-50 transition shadow-lg
        ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
        {message}
      </div>
    )
  }
  
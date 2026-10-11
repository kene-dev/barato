import { X } from 'lucide-react'

const modalWidths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }

// These layout-only props follow the app's existing untyped component pattern.
// eslint-disable-next-line react/prop-types
const Modal = ({ handleModal, children, formSize = 'md' }) => (
  <div onMouseDown={() => handleModal(false)} className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1d1612]/70 p-3 backdrop-blur-[2px] sm:p-6">
    <div role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()} className={`relative w-full ${modalWidths[formSize] ?? modalWidths.md} max-h-[90vh] overflow-y-auto border border-[#e2d5c8] bg-[#faf7f2] p-5 shadow-[8px_8px_0_#30251f] sm:p-8`}>
      <button type="button" onClick={() => handleModal(false)} aria-label="Close dialog" className="absolute top-4 right-4 grid size-9 place-items-center border border-[#d6c6b7] text-[#30251f] hover:bg-[#eee3d8] focus-visible:outline-2 focus-visible:outline-[#a33075]"><X size={18} /></button>
      {children}
    </div>
  </div>
)

export default Modal

import React from 'react'
import ReactModal from 'react-modal'

// these styles will apply to all modals created using this component
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  content: {
    position: 'relative',
    top: '40%',
    transform: 'translateY(-60%)',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    outline: 'none'
  }
}

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
ReactModal.setAppElement('#root')

function Modal ({ isOpen, title, onClose, children, ...props }) {
  return (
      <ReactModal
          isOpen={isOpen}
          style={customStyles}
          className='sans-serif lh-copy f6 bn br3 w-80 mw7 h-75 h-auto-ns center pa4 pt3 pr3 mh4 mv5 bg-white shadow-4 charcoal'
          contentLabel="Modal"
          shouldCloseOnOverlayClick={true}
          {...props}
      >
          <div className="tr">
          <button
            onClick={onClose}
            className='bn bg-transparent pointer ma0 pa0'
          >
            <svg width="18" className='fill-gray' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 97.88 97.88"><path d="M98.94,85l-14,14L50,64,15,98.94l-14-14L36,50,1.06,15l14-14L50,36,85,1.06l14,14L64,50Z" transform="translate(-1.06 -1.06)"/></svg>
          </button>
          </div>
          { title ? <h2 className='f3 fw4 mt0 montserrat lh-title pr4'>{title}</h2> : null }
          <div className='pr3'>
            { children }
          </div>
      </ReactModal>
  )
}

export default Modal

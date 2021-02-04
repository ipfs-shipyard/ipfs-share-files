import React from 'react'
import ReactModal from 'react-modal'

// these styles will apply to all modals created using this component
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
ReactModal.setAppElement('#root')

function Modal ({ isOpen, title, onClose, children, ...props }) {
  return (
      <ReactModal
          isOpen={isOpen}
          style={customStyles}
          contentLabel="Modal"
          {...props}
      >
          { title ? <h2>{title}</h2> : null }
          { children }
          <button // could be changed to an X if we prefer
            onClick={onClose}
          >
          Close
          </button>
      </ReactModal>
  )
}

export default Modal
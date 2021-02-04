import React from 'react'
import ReactModal from 'react-modal'

// these styles will apply to all modals created using this component
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  }
}

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
ReactModal.setAppElement('#root')

function Modal ({ isOpen, title, onClose, children, ...props }) {
  return (
      <ReactModal
          isOpen={isOpen}
          style={customStyles}
          className='sans-serif f6 bn br3 w-80 mw7 center pa4 ma4 bg-white charcoal'
          contentLabel="Modal"
          {...props}
      >
          <button // could be changed to an X if we prefer
            onClick={onClose}
          >
          Close
          </button>
          { title ? <h2 className='f3 fw4 mt0 montserrat'>{title}</h2> : null }
          { children }
      </ReactModal>
  )
}

export default Modal

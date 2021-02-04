import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'

import './Dropdown.css'

const Dropdown = ({ className, options, Icon, t, onChange, selectedOption }) => {
  const [isOpen, setOpen] = useState(false)

  const handleIconClick = (ev) => {
    ev.stopPropagation()

    setOpen(!isOpen)
    document.addEventListener('click', () => setOpen(false))
  }

  const selectedOptionIndex = options.findIndex(({ value }) => selectedOption === value)

  return <div className={classNames('relative dib', className)}>
      <button className="pointer unstyled-button" onClick={handleIconClick}>
        { Icon && <Icon width="50" className="fill-white" aria-label={t('dropdown.clickLabel')} /> }
      </button>
      {isOpen && (
      <div className="absolute right-0 pa2 bg-white" role="menu" style={{ top: '100%' }}>
        { options.map((option, index) =>
            <button className="unstyled-button pointer w-100 db pa2 f4 tl flex items-center" key={option.name} role="menuitem" onClick={() => onChange?.(option.value)}>
                <div className={classNames('dropdown-item-indicator mr3', selectedOptionIndex === index && 'active')}/>
                {option.name}
            </button>
        )}
      </div>
      )}
    </div>
}

Dropdown.propTypes = {
  Icon: PropTypes.element
}

Dropdown.defaultProps = {
  options: []
}

export default withTranslation('translations')(Dropdown)

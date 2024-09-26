import classNames from 'classnames'
import React, { useCallback, useEffect, useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import './Dropdown.css'

export interface DropdownProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
  options: Array<{ name: string, value: string }>
  Icon(props: any): React.JSX.Element
  onChange?(value: string): void
  selectedOption?: string
}

const Dropdown = ({ className, options, Icon, onChange, selectedOption }: DropdownProps): React.JSX.Element => {
  const { t } = useTranslation()
  const [isOpen, setOpen] = useState(false)

  const toggleLanguageSelection = useCallback((ev: MouseEvent<HTMLButtonElement, Event> | Event): void => {
    ev.stopPropagation()

    setOpen(!isOpen)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      // remove event listener when dropdown is closed
      document.removeEventListener('click', toggleLanguageSelection)
    } else {
      // add event listener when dropdown is open
      document.addEventListener('click', toggleLanguageSelection)
    }
    return () => {
      // remove event listener when component unmounts
      document.removeEventListener('click', toggleLanguageSelection)
    }
  }, [isOpen])

  const selectedOptionIndex = options.findIndex(({ value }) => selectedOption === value)

  return <div className={classNames('relative dib', className)}>
      <button className="pointer unstyled-button" onClick={toggleLanguageSelection}>
        <Icon width="26" className="fill-white" aria-label={t('dropdown.clickLabel')} />
      </button>
      {isOpen && (
      <div className="absolute left-0 mb1 pa2 bg-white" role="menu" style={{ bottom: '100%' }}>
        { options.map((option, index) =>
            <button className="unstyled-button pointer w-100 db pa2 f6 charcoal tl flex items-center" key={option.name} role="menuitem" onClick={() => onChange?.(option.value)}>
                <div className={classNames('dropdown-item-indicator mr2', selectedOptionIndex === index && 'active')}/>
                <span className='ml1'>{option.name}</span>
            </button>
        )}
      </div>
      )}
    </div>
}

export default Dropdown

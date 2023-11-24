import { useEffect, useState } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface Props {
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
  options: SelectOption[];
}

const Select = ({ value, onChange, options }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const clearOptions = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // With stopPropagation method is going to stop the click event from going
    // all the way to the parent element, without this method when clicking
    // the clear button the div element would open up.
    event.stopPropagation();
    onChange(undefined);
  };

  const selectOption = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    option: SelectOption
  ) => {
    if (option !== value) {
      event.stopPropagation();
      onChange(option);
      setIsOpen(false);
    }
  };

  const isOptionSelected = (option: SelectOption) => {
    return option == value;
  };

  // Using a useEffect so that anytime we change our open property we change the highlighted index to 0.
  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);
  return (
    <div
      onBlur={() => setIsOpen(false)} // --> When click outside this object we change state.
      onClick={() => setIsOpen(!isOpen)}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}>{value?.label}</span>
      <button onClick={(e) => clearOptions(e)} className={styles['clear-btn']}>
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
        {options.map((o, i) => (
          <li
            onMouseEnter={() => setHighlightedIndex(i)}
            onClick={(e) => selectOption(e, o)}
            key={o.value}
            className={`${styles.option} ${
              isOptionSelected(o) ? styles.selected : ''
            } ${i === highlightedIndex ? styles.highlighted : ''}`}
          >
            {o.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;

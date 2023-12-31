import { useEffect, useRef, useState } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  label: string;
  value: string | number;
}

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = SingleSelectProps | MultipleSelectProps;
type Props = {
  options: SelectOption[];
} & SelectProps;

const Select = ({ multiple, value, onChange, options }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearOptions = () => {
    // With stopPropagation method is going to stop the click event from going
    // all the way to the parent element, without this method when clicking
    // the clear button the div element would open up.
    multiple ? onChange([]) : onChange(undefined);
  };

  const selectOption = (option: SelectOption) => {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
        setIsOpen(false);
      } else {
        onChange([...value, option]);
        setIsOpen(false);
      }
    } else {
      if (option !== value) {
        onChange(option);
        setIsOpen(false);
      }
    }
  };

  const isOptionSelected = (option: SelectOption) => {
    return multiple ? value.includes(option) : option == value;
  };

  // Using a useEffect so that anytime we change our open property we change the highlighted index to 0.
  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  // This useEffect will handle our keyboard accessibility.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case 'Enter':
        case 'Space':
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;

        case 'ArrowUp':
        case 'ArrowDown': {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }

        case 'Escape':
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener('keydown', handler);

    return () => {
      containerRef.current?.removeEventListener('keydown', handler);
    };
  }, [isOpen, highlightedIndex]);

  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)} // --> When click outside this object we change state.
      onClick={() => setIsOpen(!isOpen)}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}>
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className={styles['option-badge']}
              >
                {v.label}
                <span className={styles['remove-btn']}>&times;</span>
              </button>
            ))
          : value?.label}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className={styles['clear-btn']}
      >
        &times;
      </button>

      <div className={styles.divider}></div>

      <div className={styles.caret}></div>

      <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
        {options.map((o, i) => (
          <li
            onMouseEnter={() => setHighlightedIndex(i)}
            onClick={(e) => {
              e.stopPropagation();
              selectOption(o);
            }}
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

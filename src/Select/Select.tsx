import styles from './Select.module.css';

interface SelectOption {
  label: string;
  value: any;
}

interface Props {
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
  options: SelectOption[];
}

const Select = ({ value, onChange, options }: Props) => {
  return (
    <div tabIndex={0} className={styles.container}>
      <span className={styles.value}>Value</span>
      <button className={styles['clear-btn']}>&times;</button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={styles.options}>
        {options.map((o) => (
          <li key={o.value} className={styles.option}>
            {o.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;

import { useState } from 'react';
import Select, { SelectOption } from './components/Select/Select';

const options = [
  { label: 'First', 'value': 1 },
  { label: 'Second', 'value': 2 },
  { label: 'Third', 'value': 3 },
  { label: 'Fourth', 'value': 4 },
  { label: 'Fifth', 'value': 5 },
];

function App() {
  const [singleValue, setSingleValue] = useState<SelectOption | undefined>(
    options[0]
  );
  const [multipleValue, setMultipleValue] = useState<SelectOption[]>([
    options[0],
  ]);

  return (
    <>
      <Select
        multiple
        options={options}
        value={multipleValue}
        onChange={(o) => setMultipleValue(o)}
      />
      <br />
      <Select
        options={options}
        value={singleValue}
        onChange={(o) => setSingleValue(o)}
      />
    </>
  );
}

export default App;

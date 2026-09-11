import { useState } from 'react';
import { simulateWhatIf } from '../api/whatIf';

export function useWhatIf() {
  const [whatIfResult, setWhatIfResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);

  const runSimulation = async (parameters) => {
    try {
      setSimulating(true);
      setError(null);
      const result = await simulateWhatIf(parameters);
      setWhatIfResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setSimulating(false);
    }
  };

  const resetSimulation = () => {
    setWhatIfResult(null);
  };

  return {
    whatIfResult,
    simulating,
    error,
    runSimulation,
    resetSimulation,
  };
}

export function useProgramWizard() {
  const programId = useState('program-id', () => null)
  return { programId }
}
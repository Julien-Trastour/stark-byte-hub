export function showError(err) {
  if (err instanceof Error) {
    return err.message;
  }
  return 'Une erreur est survenue.';
}

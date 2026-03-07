/**
 * Web color scheme.
 *
 * We default to dark mode regardless of the OS preference.
 */
export function useColorScheme() {
  return 'dark' as const;
}

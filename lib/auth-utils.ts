/**
 * Generates a deterministic UUID format from a string input.
 * This maps Firebase string UIDs (e.g. alphanumeric) to standard UUID format for Postgres.
 */
export function firebaseUidToUuid(uid: string): string {
  if (!uid) return '';
  
  // Simple but robust deterministic hashing function that is client & server safe
  let hash1 = 0;
  let hash2 = 0;
  
  const str1 = uid + "-part1";
  const str2 = uid + "-part2";
  
  for (let i = 0; i < str1.length; i++) {
    const char = str1.charCodeAt(i);
    hash1 = (hash1 << 5) - hash1 + char;
    hash1 = hash1 & hash1;
  }
  
  for (let i = 0; i < str2.length; i++) {
    const char = str2.charCodeAt(i);
    hash2 = (hash2 << 5) - hash2 + char;
    hash2 = hash2 & hash2;
  }
  
  const h1 = Math.abs(hash1).toString(16).padStart(8, '0');
  const h2 = Math.abs(hash2).toString(16).padStart(8, '0');
  const h3 = Math.abs(hash1 ^ hash2).toString(16).padStart(8, '0');
  const h4 = Math.abs(hash1 & hash2).toString(16).padStart(8, '0');
  
  const hex = (h1 + h2 + h3 + h4).slice(0, 32);
  
  // Format as standard UUID format: 8-4-4-4-12
  // We force the version digit to be '4' (UUID v4 format) and variant to be 'a' for valid parsing
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

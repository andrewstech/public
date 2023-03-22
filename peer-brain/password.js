// https://haveibeenpwned.com/API/v2#SearchingPwnedPasswordsByRange
const apiUrl = 'https://api.pwnedpasswords.com/range';
const $form = document.getElementById('data-form');

// Send the first 5 letters of a SHA-1 Hash of the submitted 
// password to the Pwned Passwords API to check if it has been
// compromised in a security breach. If so, do not submit the form
// and show an error message
$form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const passwordDigest = await digestMessage(password)
  
  const checkDigest = passwordDigest.substring(5, 41).toUpperCase();
  const digestFive = passwordDigest.substring(0, 5).toUpperCase();
  
  const res = await fetch(`${apiUrl}/${digestFive}`);
  const response = await res.text();
  // if the hash of our password is present, then it is pwned
  const isPwned = response.search(checkDigest) > -1;
  
  if (isPwned) {
    document.getElementById('password-error').classList.remove('hidden');
    document.getElementById('password-ok').classList.add('hidden');
    document.getElementById('password').classList.add('error');    
    return false;
  } else {
    document.getElementById('password-ok').classList.remove('hidden');
    document.getElementById('password-error').classList.add('hidden');
    // irl submit the form here, in this test we just show the success 
    return $form.submit();
    
  }
  
  
})

// From MDN example: 
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
// Converts a String to SHA-1 Hash
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);             // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

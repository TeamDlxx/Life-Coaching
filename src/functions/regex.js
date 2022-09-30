export function validateEmail(email) {
  let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regEmail.test(email);
}

export function checkSpace(text) {
  let reg_space = /\s/g;
  return reg_space.test(text);
}

export function isFirstLetterAlphabet(str) {
  let reg_olnyAlphabet = /^[a-zA-Z]/;
  return reg_olnyAlphabet.test(str.charAt(0));
}

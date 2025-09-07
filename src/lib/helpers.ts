export function maskPhone(v: string) {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4}).*/, "$1-$2");
}

export function maskDate(v: string) {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/(\/\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}

export const sanitizePlayerName = (name) => {
  if (!name) {
    throw new Error("Nome é obrigatório");
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length === 0 || trimmed.length > 20) {
    throw new Error("O nome deve conter entre 1 e 20 caracteres");
  }
  
  const allowedPattern = /^[a-zA-ZÀ-ÿ0-9\s\-_]+$/;
  
  if (!allowedPattern.test(trimmed)) {
    throw new Error("Nome contém caracteres inválidos. Use apenas letras, números, espaços, - ou _");
  }
  
  return trimmed;
};
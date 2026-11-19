export const enderecoVazio = {
  identificacao: '', cep: '', logradouro: '', numero: '',
  complemento: '', bairro: '', cidade: '', estado: '',
};

export function limparCep(cep) {
  return cep.trim().replace(/^(\d{5})-(\d{3})$/, '$1$2');
}

export function cepValido(cep) {
  return /^\d{8}$/.test(limparCep(cep));
}

export function formatarCep(cep) {
  return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

export function validarEndereco(dados) {
  const erros = {};
  for (const campo of Object.keys(enderecoVazio)) {
    if (campo !== 'complemento' && !dados[campo].trim()) erros[campo] = 'Preencha este campo.';
  }
  if (!cepValido(dados.cep)) erros.cep = 'Informe um CEP com oito dígitos.';
  if (!/^[A-Za-z]{2}$/.test(dados.estado.trim())) erros.estado = 'Use duas letras, como MG.';
  return erros;
}

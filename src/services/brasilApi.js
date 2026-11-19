export async function consultarCep(cep, signal) {
  const resposta = await fetch('https://brasilapi.com.br/api/cep/v2/' + cep, { signal });
  if (resposta.status === 404) throw new Error('CEP não encontrado. Confira o CEP ou preencha o endereço manualmente.');
  if (!resposta.ok) throw new Error('A consulta está indisponível. Tente novamente ou preencha manualmente.');
  const dados = await resposta.json();
  return { logradouro: dados.street || '', bairro: dados.neighborhood || '',
    cidade: dados.city || '', estado: dados.state || '' };
}

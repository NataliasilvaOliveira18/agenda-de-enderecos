import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { lerEnderecos, gravarEnderecos } from '../services/storage';

const Contexto = createContext(null);
export const useEnderecos = () => useContext(Contexto);

export function EnderecosProvider({ children }) {
  const [enderecos, setEnderecos] = useState([]);
  const [situacao, setSituacao] = useState('carregando');
  const atuais = useRef([]);
  const fila = useRef(Promise.resolve());

  async function carregar() {
    setSituacao('carregando');
    try {
      atuais.current = await lerEnderecos();
      setEnderecos(atuais.current);
      setSituacao('pronto');
    } catch {
      setSituacao('erro');
    }
  }
  useEffect(() => { carregar(); }, []);

  // Cada operação parte do resultado da última gravação concluída.
  function alterar(transformar) {
    const operacao = fila.current.then(async () => {
      if (situacao !== 'pronto') throw new Error('Agenda indisponível.');
      const proxima = transformar(atuais.current);
      await gravarEnderecos(proxima);
      atuais.current = proxima;
      setEnderecos(proxima);
    });
    fila.current = operacao.catch(() => {});
    return operacao;
  }
  function salvar(dados, id) {
    return alterar(lista => {
      if (!id) return [{ ...dados, id: Date.now().toString(36) + Math.random().toString(36).slice(2) }, ...lista];
      if (!lista.some(item => item.id === id)) throw new Error('Registro indisponível.');
      return lista.map(item => item.id === id ? { ...dados, id } : item);
    });
  }
  const excluir = id => alterar(lista => lista.filter(item => item.id !== id));
  return <Contexto.Provider value={{ enderecos, situacao, carregar, salvar, excluir }}>{children}</Contexto.Provider>;
}

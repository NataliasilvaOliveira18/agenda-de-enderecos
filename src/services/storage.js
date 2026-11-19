import AsyncStorage from '@react-native-async-storage/async-storage';
import { enderecoVazio } from '../utils/validacao';

const chave = '@agenda:enderecos';

export async function lerEnderecos() {
  const salvo = await AsyncStorage.getItem(chave);
  if (salvo === null) return [];
  const lista = JSON.parse(salvo);
  const campos = ['id', ...Object.keys(enderecoVazio)];
  if (!Array.isArray(lista) || !lista.every(item => item && campos.every(campo => typeof item[campo] === 'string'))) {
    throw new Error('Dados da agenda inválidos.');
  }
  return lista;
}

export function gravarEnderecos(lista) {
  return AsyncStorage.setItem(chave, JSON.stringify(lista));
}

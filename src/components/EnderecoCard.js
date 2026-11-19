import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icone, SeloCep, useCores } from './Interface';
import { formatarCep } from '../utils/validacao';

export default function EnderecoCard({ endereco, onPress }) {
  const c = useCores();
  const { identificacao, logradouro, numero, complemento, bairro, cidade, estado, cep } = endereco;
  const rua = [logradouro, numero, complemento].filter(Boolean).join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${identificacao}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: c.card, borderWidth: 1, borderColor: c.borda,
        borderRadius: 15, paddingHorizontal: 13, paddingVertical: 16,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View style={{
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: c.iconeFundo, alignItems: 'center', justifyContent: 'center',
      }}>
        <Icone nome="pin" cor={c.destaque} />
      </View>

      <View style={{ flex: 1, gap: 6 }}>
        <Text style={{ color: c.texto, fontWeight: '700', fontSize: 16 }}>
          {identificacao}
        </Text>
        <Text style={{ color: c.secundario, fontSize: 14, lineHeight: 20 }}>
          {rua} – {bairro}, {cidade}/{estado}
        </Text>
        <SeloCep cep={formatarCep(cep)} />
      </View>

      <Icone nome="seta" cor={c.secundario} tamanho={17} />
    </Pressable>
  );
}
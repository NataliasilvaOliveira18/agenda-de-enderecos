import React, { useRef, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useEnderecos } from '../context/EnderecosContext';
import { Tela, Botao, Rodape, SeloCep, useCores } from '../components/Interface';
import { formatarCep } from '../utils/validacao';

export default function DetalhesEnderecoScreen({ route, navigation }) {
  const c = useCores();
  const { enderecos, excluir } = useEnderecos();
  const endereco = enderecos.find(item => item.id === route.params.id);
  const [ocupado, setOcupado] = useState(false);
  const removendo = useRef(false);
  if (!endereco) return <Tela />;
  async function remover() {
    if (removendo.current) return;
    removendo.current = true;
    setOcupado(true);
    try {
      await excluir(endereco.id);
      navigation.popToTop();
    } catch {
      Alert.alert('Falha ao excluir', 'O endereço foi mantido. Tente novamente.');
    } finally { removendo.current = false; setOcupado(false); }
  }
  function confirmar() {
    Alert.alert('Excluir endereço?', 'Deseja excluir “' + endereco.identificacao + '” da sua agenda?', [
      { text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: remover },
    ]);
  }
  const linhas = [
    ['Logradouro', endereco.logradouro], ['Número', endereco.numero],
    ['Complemento', endereco.complemento || 'Não informado'], ['Bairro', endereco.bairro],
    ['Cidade / UF', endereco.cidade + ' / ' + endereco.estado],
  ];
    return (
    <Tela>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{
          backgroundColor: c.card, borderRadius: 15,
          borderColor: c.borda, borderWidth: 1, padding: 16,
        }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: c.texto }}>
            {endereco.identificacao}
          </Text>

          <View style={{ marginTop: 8, marginBottom: 14 }}>
            <SeloCep cep={formatarCep(endereco.cep)} />
          </View>

          {linhas.map(([rotulo, valor]) => (
            <View key={rotulo} style={{
              paddingVertical: 12, gap: 4,
              borderTopWidth: 1, borderTopColor: c.divisor,
            }}>
              <Text style={{ color: c.secundario, fontSize: 12, fontWeight: '500' }}>
                {rotulo.toLocaleUpperCase('pt-BR')}
              </Text>
              <Text style={{ color: c.texto, fontSize: 16 }}>{valor}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Rodape>
        <Botao
          icone="editar"
          titulo="Editar endereço"
          disabled={ocupado}
          onPress={() => navigation.navigate('Cadastro', { id: endereco.id })}
        />
        <Botao icone="excluir" titulo="Excluir endereço" perigo disabled={ocupado} onPress={confirmar} />
      </Rodape>
    </Tela>
    );
}

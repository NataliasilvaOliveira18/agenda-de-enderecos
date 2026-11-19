import React, { useState } from 'react';
import { ActivityIndicator, FlatList, TextInput, View } from 'react-native';
import { useEnderecos } from '../context/EnderecosContext';
import { Tela, Botao, EstadoVazio, Icone, useCores } from '../components/Interface';
import EnderecoCard from '../components/EnderecoCard';

export default function ListaEnderecosScreen({ navigation }) {
  const c = useCores();
  const { enderecos, situacao, carregar } = useEnderecos();
  const [busca, setBusca] = useState('');

  if (situacao === 'carregando') {
    return <Tela><ActivityIndicator style={{ marginTop: 36 }} color={c.destaque} /></Tela>;
  }
  if (situacao === 'erro') {
    return (
      <Tela>
        <View style={{ padding: 16 }}>
          <EstadoVazio titulo="Não foi possível abrir a agenda" mensagem="Tente carregar seus registros novamente." />
          <Botao titulo="Tentar novamente" onPress={carregar} />
        </View>
      </Tela>
    );
  }

  const termo = busca.trim().toLocaleLowerCase('pt-BR');
  const lista = enderecos.filter(item =>
    item.identificacao.toLocaleLowerCase('pt-BR').includes(termo)
  );

  return (
    <Tela>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          paddingHorizontal: 14, minHeight: 48, backgroundColor: c.card,
          borderWidth: 1, borderColor: c.borda, borderRadius: 11, marginBottom: 12,
        }}>
          <Icone nome="busca" cor={c.secundario} />
          <TextInput
            accessibilityLabel="Buscar pela identificação do local"
            placeholder="Buscar pela identificação do local"
            placeholderTextColor={c.secundario}
            value={busca}
            onChangeText={setBusca}
            style={{ flex: 1, minHeight: 46, color: c.texto }}
          />
        </View>

        <FlatList
          data={lista}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 90, flexGrow: 1 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <EnderecoCard
              endereco={item}
              onPress={() => navigation.navigate('Detalhes', { id: item.id })}
            />
          )}
          ListEmptyComponent={
            <EstadoVazio
              titulo={enderecos.length ? 'Nenhum resultado' : 'Nenhum endereço cadastrado'}
              mensagem={enderecos.length
                ? 'Tente outra identificação na busca.'
                : 'Toque em Novo endereço para cadastrar o primeiro.'}
            />
          }
        />

        <View style={{ position: 'absolute', bottom: 16, right: 16 }}>
          <Botao
            redondo
            icone="mais"
            titulo="Novo endereço"
            onPress={() => {
              setBusca('');
              navigation.navigate('Cadastro');
            }}
          />
        </View>
      </View>
    </Tela>
  );
}
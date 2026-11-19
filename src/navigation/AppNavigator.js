import React from 'react';
import { StatusBar, Text, useColorScheme, View } from 'react-native';
import {
  DarkTheme, DefaultTheme, NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Lista from '../screens/ListaEnderecosScreen';
import Cadastro from '../screens/CadastroEnderecoScreen';
import Detalhes from '../screens/DetalhesEnderecoScreen';
import { azul, useCores } from '../components/Interface';
import { useEnderecos } from '../context/EnderecosContext';

const Pilha = createNativeStackNavigator();

function TituloLista() {
  const { enderecos, situacao } = useEnderecos();
  const total = enderecos.length;

  return (
    <View>
      <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
        Meus endereços
      </Text>
      {situacao === 'pronto' && (
        <Text style={{ color: '#E5EFFF', fontSize: 13 }}>
          {total === 1 ? '1 endereço salvo' : `${total} endereços salvos`}
        </Text>
      )}
    </View>
  );
}

export default function AppNavigator() {
  const c = useCores();
  const tema = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={tema}>
      <StatusBar barStyle="light-content" />
      <Pilha.Navigator screenOptions={{
        headerStyle: { backgroundColor: azul },
        headerTintColor: '#FFFFFF',
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        contentStyle: { backgroundColor: c.fundo },
      }}>
        <Pilha.Screen
          name="Lista"
          component={Lista}
          options={{ headerTitle: () => <TituloLista /> }}
        />
        <Pilha.Screen
          name="Cadastro"
          component={Cadastro}
          options={({ route }) => ({
            title: route.params?.id ? 'Editar endereço' : 'Novo endereço',
          })}
        />
        <Pilha.Screen
          name="Detalhes"
          component={Detalhes}
          options={{ title: 'Detalhes do endereço' }}
        />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}
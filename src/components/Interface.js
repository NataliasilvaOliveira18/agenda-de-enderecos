import React from 'react';
import {
  Pressable, Text, TextInput, useColorScheme, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

export const azul = '#216CEB';

const claro = {
  fundo: '#F4F5FA',
  card: '#FFFFFF',
  texto: '#172231',
  secundario: '#586779',
  borda: '#D6DCE6',
  divisor: '#E9EDF3',
  selo: '#EDF1F5',
  iconeFundo: '#E7F0FF',
  destaque: '#1865DF',
  perigo: '#C82430',
};

const escuro = {
  fundo: '#101722',
  card: '#1A2432',
  texto: '#F1F5FA',
  secundario: '#B8C4D4',
  borda: '#39475B',
  divisor: '#324052',
  selo: '#293749',
  iconeFundo: '#203B63',
  destaque: '#8CBAFF',
  perigo: '#FF929A',
};

export function useCores() {
  return useColorScheme() === 'dark' ? escuro : claro;
}

const desenhos = {
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z',
  busca: 'm16 16 5 5',
  seta: 'm9 5 7 7-7 7',
  mais: 'M12 5v14M5 12h14',
  editar: 'm4 16-1 5 5-1L20 8l-4-4L4 16Zm10-10 4 4',
  excluir: 'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 10v8m4-8v8',
};

export function Icone({ nome, cor, tamanho = 20 }) {
  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {nome === 'busca' && <Circle cx="10.5" cy="10.5" r="6.5" />}
      <Path d={desenhos[nome]} />
      {nome === 'pin' && <Circle cx="12" cy="10" r="2.5" />}
    </Svg>
  );
}

export function Tela({ children }) {
  const c = useCores();
  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={{ flex: 1, backgroundColor: c.fundo }}
    >
      {children}
    </SafeAreaView>
  );
}

export function Rodape({ children }) {
  const c = useCores();
  return (
    <View style={{
      backgroundColor: c.card, borderTopWidth: 1, borderColor: c.borda,
      paddingHorizontal: 16, paddingVertical: 12, gap: 9,
    }}>
      {children}
    </View>
  );
}

export function Botao({ titulo, onPress, disabled, perigo, icone, redondo }) {
  const c = useCores();
  const corTexto = perigo ? c.perigo : '#FFFFFF';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 50,
        paddingHorizontal: redondo ? 21 : 16,
        borderRadius: redondo ? 28 : 11,
        backgroundColor: perigo ? c.card : azul,
        borderWidth: 1,
        borderColor: perigo ? c.perigo : azul,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: disabled ? 0.55 : pressed ? 0.8 : 1,
        elevation: redondo ? 4 : 0,
      })}
    >
      {icone && <Icone nome={icone} cor={corTexto} tamanho={18} />}
      <Text style={{ color: corTexto, fontSize: 15, fontWeight: '600' }}>
        {titulo}
      </Text>
    </Pressable>
  );
}

export function CampoTexto({ rotulo, erro, obrigatorio = true, ...props }) {
  const c = useCores();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: c.texto, fontSize: 13, fontWeight: '500' }}>
        {rotulo}
        {obrigatorio && <Text style={{ color: c.perigo }}> *</Text>}
      </Text>

      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={c.secundario}
        {...props}
        style={{
          minHeight: 48, paddingHorizontal: 13, borderRadius: 10,
          borderWidth: 1, borderColor: erro ? c.perigo : c.borda,
          backgroundColor: c.card, color: c.texto, fontSize: 15,
        }}
      />

      {!!erro && <Text style={{ color: c.perigo }}>{erro}</Text>}
    </View>
  );
}

export function SeloCep({ cep }) {
  const c = useCores();
  return (
    <View style={{
      alignSelf: 'flex-start', borderRadius: 12,
      backgroundColor: c.selo, paddingHorizontal: 10, paddingVertical: 3,
    }}>
      <Text style={{ color: c.texto, fontSize: 12 }}>CEP {cep}</Text>
    </View>
  );
}

export function EstadoVazio({ titulo, mensagem }) {
  const c = useCores();
  return (
    <View style={{ alignItems: 'center', padding: 24, gap: 9 }}>
      <Icone nome="pin" cor={c.destaque} tamanho={28} />
      <Text style={{ color: c.texto, fontWeight: '700', fontSize: 17 }}>
        {titulo}
      </Text>
      <Text style={{ color: c.secundario, textAlign: 'center' }}>
        {mensagem}
      </Text>
    </View>
  );
}
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import * as Location from 'expo-location';

import { Icone, useCores } from './Interface';
import { cepValido, formatarCep, limparCep } from '../utils/validacao';

function comPrazo(operacao, milissegundos, mensagem) {
  let timer;

  const limite = new Promise((_, rejeitar) => {
    timer = setTimeout(() => rejeitar(new Error(mensagem)), milissegundos);
  });

  return Promise.race([operacao, limite]).finally(() => clearTimeout(timer));
}

export default function LocalizarCep({ onUsar, disabled }) {
  const c = useCores();
  const [etapa, setEtapa] = useState('');
  const [aviso, setAviso] = useState('');
  const consultando = useRef(false);
  const montado = useRef(true);

  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  async function localizar() {
    if (consultando.current || disabled) return;

    consultando.current = true;
    setAviso('');
    setEtapa('Verificando permissão…');

    let orientacao = 'Não foi possível acessar a localização. Você pode digitar o CEP.';

    try {
      const permissao = await Location.requestForegroundPermissionsAsync();
      if (!montado.current) return;

      if (!permissao.granted) {
        setAviso(
          permissao.canAskAgain
            ? 'Para buscar pelo celular, permita o uso da localização ou digite o CEP.'
            : 'Permita a localização nas configurações do Expo Go ou digite o CEP.'
        );
        return;
      }

      setEtapa('Verificando se a localização está ligada…');

      const ligado = await comPrazo(
        Location.hasServicesEnabledAsync(),
        5000,
        orientacao
      );
      if (!montado.current) return;

      if (!ligado) {
        setAviso('A localização do celular está desligada. Ative-a e tente novamente.');
        return;
      }

      setEtapa('Obtendo sua posição…');
      orientacao = 'O celular não conseguiu obter sua posição. Tente perto de uma janela ou digite o CEP.';

      const posicao = await comPrazo(
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        15000,
        orientacao
      );
      if (!montado.current) return;

      setEtapa('Procurando o CEP dessa posição…');
      orientacao = 'A posição foi encontrada, mas a consulta do endereço falhou. Confira a conexão ou digite o CEP.';

      const { latitude, longitude } = posicao.coords;
      const locais = await comPrazo(
        Location.reverseGeocodeAsync({ latitude, longitude }),
        10000,
        orientacao
      );
      if (!montado.current) return;

      const local = locais.find(item => {
        const codigo = limparCep(item.postalCode || '');
        const pais = item.isoCountryCode?.toUpperCase();
        return cepValido(codigo) && (!pais || pais === 'BR');
      });

      if (!local) {
        setAviso('Sua posição foi encontrada, mas o celular não informou um CEP para esse ponto. Digite o CEP manualmente.');
        return;
      }

      const cep = formatarCep(limparCep(local.postalCode));
      onUsar(cep);
    } catch {
      if (montado.current) setAviso(orientacao);
    } finally {
      consultando.current = false;
      if (montado.current) setEtapa('');
    }
  }

  const ocupado = etapa.length > 0;

  return (
    <View style={{ gap: 4 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || ocupado, busy: ocupado }}
        disabled={disabled || ocupado}
        onPress={localizar}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          minHeight: 44,
        }}
      >
        {ocupado ? (
          <ActivityIndicator size="small" color={c.destaque} />
        ) : (
          <Icone nome="pin" cor={c.destaque} tamanho={17} />
        )}

        <Text
          accessibilityLiveRegion="polite"
          style={{ flex: 1, color: c.destaque, fontWeight: '600' }}
        >
          {etapa || 'Usar CEP da minha localização'}
        </Text>
      </Pressable>

      {!!aviso && (
        <Text
          accessibilityLiveRegion="polite"
          style={{ color: c.secundario, fontSize: 13, lineHeight: 19 }}
        >
          {aviso}
        </Text>
      )}
    </View>
  );
}
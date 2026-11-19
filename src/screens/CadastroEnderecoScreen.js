import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Tela, Botao, CampoTexto, Rodape, useCores } from '../components/Interface';
import LocalizarCep from '../components/LocalizarCep';
import { useEnderecos } from '../context/EnderecosContext';
import { consultarCep } from '../services/brasilApi';
import { cepValido, enderecoVazio, formatarCep, limparCep, validarEndereco } from '../utils/validacao';

export default function CadastroEnderecoScreen({ route, navigation }) {
  const c = useCores();
  const id = route.params?.id;
  const { enderecos, salvar } = useEnderecos();
  const original = enderecos.find(item => item.id === id);
  const [dados, setDados] = useState(() => original ? { ...original, cep: formatarCep(original.cep) } : { ...enderecoVazio });
  const [erros, setErros] = useState({});
  const [aviso, setAviso] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const consulta = useRef(null);
  const gravando = useRef(false);
  const rolagem = useRef(null);
  useEffect(() => () => {
    consulta.current?.abort();
    consulta.current = null;
  }, []);

  function atualizar(campo, valor) {
    if (campo === 'cep') {
      consulta.current?.abort();
      consulta.current = null;
      setBuscando(false);
      setAviso('');
    }
    setDados(anterior => ({ ...anterior, [campo]: valor }));
    setErros(anterior => ({ ...anterior, [campo]: undefined }));
  }
  async function buscar(cepInformado = dados.cep) {
    if (!cepValido(cepInformado)) {
      setErros(anterior => ({ ...anterior, cep: 'Informe um CEP com oito dígitos.' }));
      return;
    }
    consulta.current?.abort();
    const controle = new AbortController();
    consulta.current = controle;
    setBuscando(true);
    setAviso('');
    const tempo = setTimeout(() => controle.abort(), 10000);
    try {
      const resultado = await consultarCep(limparCep(cepInformado), controle.signal);
      if (consulta.current === controle) {
        setDados(anterior => ({ ...anterior, ...resultado }));
        setErros(anterior => ({ ...anterior, logradouro: undefined, bairro: undefined, cidade: undefined, estado: undefined }));
      }
    } catch (erro) {
      if (consulta.current === controle) setAviso(erro instanceof TypeError || controle.signal.aborted
        ? 'Falha de conexão. Tente novamente ou preencha os campos manualmente.' : erro.message);
    } finally {
      clearTimeout(tempo);
      if (consulta.current === controle) { consulta.current = null; setBuscando(false); }
    }
  }
  async function confirmar() {
    if (gravando.current || buscando) return;
    const falhas = validarEndereco(dados);
    setErros(falhas);
    if (Object.keys(falhas).length) {
      rolagem.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    gravando.current = true;
    setSalvando(true);
    try {
      const registro = Object.fromEntries(Object.keys(enderecoVazio).map(chave => [chave, dados[chave].trim()]));
      await salvar({ ...registro, cep: limparCep(dados.cep), estado: registro.estado.toUpperCase() }, id);
      navigation.popToTop();
    } catch {
      Alert.alert('Falha ao salvar', 'Seus dados continuam no formulário. Tente novamente.');
    } finally {
      gravando.current = false;
      setSalvando(false);
    }
  }
  function campo(chave, rotulo, props = {}) {
    return <CampoTexto rotulo={rotulo} value={dados[chave]} erro={erros[chave]}
      editable={!salvando && (!buscando || chave === 'cep')} onChangeText={v => atualizar(chave, v)} {...props} />;
  }
  return (
    <Tela>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={rolagem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, gap: 14 }}
        >
          {campo('identificacao', 'Identificação do local', {
            placeholder: 'Ex.: Faculdade',
          })}

          <View style={{ gap: 5 }}>
            <View style={{ flexDirection: 'row', gap: 9, alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                {campo('cep', 'CEP', {
                  keyboardType: 'number-pad',
                  placeholder: '00000-000',
                })}
              </View>
              <View style={{ marginTop: 22 }}>
                <Botao titulo="Buscar" onPress={() => buscar()} disabled={buscando || salvando} />
              </View>
            </View>

            {buscando ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color={c.destaque} />
                <Text style={{ color: c.secundario }}>Consultando CEP…</Text>
              </View>
            ) : (
              <Text style={{ color: c.secundario, fontSize: 12 }}>
                Busque pelo CEP ou preencha os campos manualmente.
              </Text>
            )}

            {!!aviso && (
              <Text accessibilityLiveRegion="polite" style={{ color: c.perigo }}>
                {aviso}
              </Text>
            )}

            {!id && (
              <LocalizarCep
                disabled={buscando || salvando}
                onUsar={cepEncontrado => {
                  atualizar('cep', cepEncontrado);
                  buscar(cepEncontrado);
                }}
              />
            )}
          </View>

          {campo('logradouro', 'Logradouro')}

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              {campo('numero', 'Número', { placeholder: 'Número ou s/n' })}
            </View>
            <View style={{ flex: 1 }}>
              {campo('complemento', 'Complemento', {
                obrigatorio: false,
                placeholder: 'Opcional',
              })}
            </View>
          </View>

          {campo('bairro', 'Bairro')}

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 2 }}>
              {campo('cidade', 'Cidade')}
            </View>
            <View style={{ flex: 1 }}>
              {campo('estado', 'UF', {
                maxLength: 2, autoCapitalize: 'characters', placeholder: 'MG',
              })}
            </View>
          </View>
        </ScrollView>

        <Rodape>
          <Botao
            titulo={salvando ? 'Salvando…' : 'Salvar endereço'}
            onPress={confirmar}
            disabled={buscando || salvando}
          />
        </Rodape>
      </KeyboardAvoidingView>
    </Tela>
  );
}
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
View,
Text,
TextInput,
TouchableOpacity,
ScrollView,
StyleSheet,
Alert,
KeyboardAvoidingView,
Platform,
Image,
ActivityIndicator,
} from 'react-native';

import logo from '../cadastro-app/assets/logo-graodigital.png';

export default function App() {
const [form, setForm] = useState({
nome: '',
email: '',
senha: '',
confirmarSenha: '',
cep: '',
rua: '',
bairro: '',
cidade: '',
estado: '',
});

const [loadingCep, setLoadingCep] = useState(false);
const [errors, setErrors] = useState({});

const handleChange = (field, value) => {
setForm(prev => ({
...prev,
[field]: value,
}));

if (errors[field]) {
setErrors(prev => ({
...prev,
[field]: null,
}));
}
};

const formatCep = (value) => {
const digits = value.replace(/\D/g, '').slice(0, 8);

return digits.length > 5
? `${digits.slice(0, 5)}-${digits.slice(5)}`
: digits;
};

const fetchCep = async (cep) => {
setLoadingCep(true);
try {
const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
const data = await response.json();

if (!data.erro) {
setForm(prev => ({
...prev,
rua: data.logradouro || '',
bairro: data.bairro || '',
cidade: data.localidade || '',
estado: data.uf || '',
}));
} else {
Alert.alert('CEP não encontrado', 'Verifique o CEP informado.');
}
} catch (error) {
Alert.alert('Erro', 'Não foi possível buscar o CEP.');
} finally {
setLoadingCep(false);
}
};

const handleCepChange = (value) => {
const formatted = formatCep(value);
handleChange('cep', formatted);

const digits = formatted.replace(/\D/g, '');
if (digits.length === 8) {
fetchCep(digits);
}
};

const validate = () => {
const newErrors = {};

if (!form.nome.trim()) {
newErrors.nome = 'Nome é obrigatório';
}

if (!form.email.trim()) {
newErrors.email = 'Email é obrigatório';
} else if (!/\S+@\S+\.\S+/.test(form.email)) {
newErrors.email = 'Email inválido';
}

if (!form.senha) {
newErrors.senha = 'Senha é obrigatória';
} else if (form.senha.length < 6) {
newErrors.senha = 'Senha deve ter ao menos 6 caracteres';
}

if (!form.confirmarSenha) {
newErrors.confirmarSenha = 'Confirme sua senha';
} else if (form.senha !== form.confirmarSenha) {
newErrors.confirmarSenha = 'Senhas não coincidem';
}

if (!form.cep.trim()) {
newErrors.cep = 'CEP é obrigatório';
}

if (!form.rua.trim()) {
newErrors.rua = 'Rua é obrigatória';
}

if (!form.bairro.trim()) {
newErrors.bairro = 'Bairro é obrigatório';
}

if (!form.cidade.trim()) {
newErrors.cidade = 'Cidade é obrigatória';
}

if (!form.estado.trim()) {
newErrors.estado = 'Estado é obrigatório';
}

return newErrors;
};

const handleSubmit = () => {
const newErrors = validate();

if (Object.keys(newErrors).length > 0) {
setErrors(newErrors);
return;
}

Alert.alert('Sucesso', 'Cadastro realizado!');
};

const fields = [
{
key: 'nome',
label: 'Nome*',
placeholder: 'Digite seu nome',
},
{
key: 'email',
label: 'Email*',
placeholder: 'Digite seu email',
keyboardType: 'email-address',
autoCapitalize: 'none',
},
{
key: 'senha',
label: 'Senha*',
placeholder: 'Digite sua senha',
secureTextEntry: true,
},
{
key: 'confirmarSenha',
label: 'Confirmar Senha*',
placeholder: 'Confirme sua senha',
secureTextEntry: true,
},
{
key: 'rua',
label: 'Rua*',
placeholder: 'Digite sua rua',
},
{
key: 'bairro',
label: 'Bairro*',
placeholder: 'Digite seu bairro',
},
{
key: 'cidade',
label: 'Cidade*',
placeholder: 'Digite sua cidade',
},
{
key: 'estado',
label: 'Estado*',
placeholder: 'Digite seu estado',
},
];

return (
<KeyboardAvoidingView
style={styles.flex}
behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
<ScrollView
style={styles.flex}
contentContainerStyle={styles.scrollContent}
keyboardShouldPersistTaps="handled"
>
<View style={styles.header}>
<Image source={logo} style={styles.logo} resizeMode="contain" />
</View>

<Text style={styles.title}>Cadastro</Text>

<View style={styles.card}>
<View style={styles.fieldGroup}>
<Text style={styles.label}>CEP*</Text>

<View style={styles.cepRow}>
<TextInput
style={[
styles.input,
styles.cepInput,
errors.cep && styles.inputError,
]}
value={form.cep}
onChangeText={handleCepChange}
placeholder="00000-000"
placeholderTextColor="#aaa"
keyboardType="numeric"
maxLength={9}
/>

{loadingCep && (
<ActivityIndicator style={styles.cepLoader} color="#061D21" />
)}
</View>

{errors.cep && (
<Text style={styles.errorText}>{errors.cep}</Text>
)}
</View>

{fields.map(
({
key,
label,
placeholder,
keyboardType,
secureTextEntry,
autoCapitalize,
}) => (
<View key={key} style={styles.fieldGroup}>
<Text style={styles.label}>{label}</Text>

<TextInput
style={[styles.input, errors[key] && styles.inputError]}
value={form[key]}
onChangeText={(v) => handleChange(key, v)}
placeholder={placeholder}
placeholderTextColor="#aaa"
keyboardType={keyboardType || 'default'}
secureTextEntry={secureTextEntry || false}
autoCapitalize={autoCapitalize || 'sentences'}
/>

{errors[key] && (
<Text style={styles.errorText}>{errors[key]}</Text>
)}
</View>
)
)}

<TouchableOpacity
style={styles.button}
onPress={handleSubmit}
activeOpacity={0.85}
>
<Text style={styles.buttonText}>Cadastrar</Text>
</TouchableOpacity>
</View>

<StatusBar style="auto" />
</ScrollView>
</KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
flex: {
flex: 1,
backgroundColor: '#f5f5f7',
},
scrollContent: {
paddingBottom: 40,
},
header: {
backgroundColor: '#061D21',
paddingVertical: 20,
paddingHorizontal: 30,
alignItems: 'flex-start',
borderBottomWidth: 1,
borderBottomColor: '#e5e7eb',
},
logo: {
width: 100,
height: 60,
},
title: {
fontSize: 26,
fontWeight: '700',
color: '#1f2937',
marginTop: 28,
marginBottom: 16,
marginHorizontal: 20,
},
card: {
backgroundColor: '#ffffff',
marginHorizontal: 16,
borderRadius: 16,
padding: 20,
elevation: 3,
},
fieldGroup: {
marginBottom: 16,
},
label: {
fontSize: 13,
fontWeight: '600',
color: '#374151',
marginBottom: 6,
},
input: {
borderWidth: 1.5,
borderColor: '#d1d5db',
borderRadius: 12,
paddingHorizontal: 14,
paddingVertical: Platform.OS === 'ios' ? 14 : 10,
fontSize: 15,
color: '#111827',
backgroundColor: '#f9fafb',
},
inputError: {
borderColor: '#ef4444',
backgroundColor: '#fef2f2',
},
errorText: {
color: '#ef4444',
fontSize: 12,
marginTop: 4,
marginLeft: 2,
},
cepRow: {
flexDirection: 'row',
alignItems: 'center',
},
cepInput: {
flex: 1,
},
cepLoader: {
marginLeft: 10,
},
button: {
backgroundColor: '#4CAF50',
borderRadius: 24,
paddingVertical: 14,
alignItems: 'center',
marginTop: 8,
},
buttonText: {
color: '#ffffff',
fontSize: 16,
fontWeight: '700',
letterSpacing: 0.5,
},
});
import fs from 'node:fs';
import { PDFDocument, PDFName, PDFBool } from 'pdf-lib';
import { mapearCampos } from './src/export/pdf.js';
import { personagemVazio } from './src/engine/character.js';

const p = personagemVazio();
p.nome = 'Rodrigo Teste'; p.jogador = 'Rodrigo'; p.classeId = 'combatente';
p.origemId = '__custom__'; p.origemCustom = { nome: 'Acadêmico', pericias: ['ciencias','investigacao'] };
p.atributos = { for:1, agi:2, int:3, pre:1, vig:1 };
p.pericias.ciencias.grau='treinado'; p.pericias.investigacao.grau='treinado';
p.ataques=[{nome:'Faca',dano:'1d4',critico:'19/x2',alcance:'Corpo a corpo',espacos:'1'}];
p.habilidades=[{nome:'Ataque Especial'}];
p.rituais=[{nome:'Primeiro Socorro',custo:'1'}];
p.inventario=[{nome:'Lanterna',categoria:'0',espacos:'1'}];
p.descricao={aparencia:'Alto',personalidade:'Calmo',historico:'X',objetivo:'Y'};
p.trilhaNome='Aniquilador';

const bytes = fs.readFileSync('public/ficha-template.pdf');
const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
const form = pdf.getForm();
const { textos, escolhas } = mapearCampos(p);
const falhas=[];
for (const [n,v] of Object.entries(textos)) { try { form.getTextField(n).setText(v==null?'':String(v)); } catch(e){ falhas.push('TXT '+n); } }
for (const [n,v] of Object.entries(escolhas)) { try { form.getDropdown(n).select(String(v)); } catch(e){ try{ form.getOptionList(n).select(String(v)); }catch(e2){ falhas.push('CH '+n+' = '+v); } } }
form.acroForm.dict.set(PDFName.of('NeedAppearances'), PDFBool.True);
fs.writeFileSync('/tmp/saida.pdf', await pdf.save({useObjectStreams:false}));
console.log('campos texto:', Object.keys(textos).length, 'escolhas:', Object.keys(escolhas).length);
console.log('FALHAS:', falhas.length ? falhas : 'nenhuma');

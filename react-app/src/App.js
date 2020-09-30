import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

export default function App() {
  const [calculos, setCalculos] = useState([]);
  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState(0);
  const [nDependentes, setNDependentes] = useState(0);

  const handleChangeNome = (event) => {
    setNome(event.target.value);
  }

  const handleChangeSalario = (event) => {
    setSalario(parseFloat(event.target.value));
  }

  const handleChangeNDependentes = (event) => {
    setNDependentes(parseFloat(event.target.value));
  }

  const handleSubmit = (event) => {
    calcular();
    event.preventDefault();
  }

  const calcular = () => {
    const descontoInss = descontoINSS(salario);
    const baseCalculo = salario - descontoInss;
    const descontoIrrf = descontoIRRF(baseCalculo, nDependentes);
    const salarioLiquido = salario - descontoIrrf - descontoInss;

    setCalculos([
      ...calculos,
      {
        id: uuid(),
        nome: nome,
        salario: salario.toFixed(2),
        nDependentes: nDependentes,
        descontoInss: descontoInss.toFixed(2),
        descontoIrrf: descontoIrrf.toFixed(2),
        salarioLiquido: salarioLiquido.toFixed(2)
      }
    ])
    
  }

  const descontoINSS = (salario) => {

    let desconto = 0;

    if (salario <= 1045) { // 1a faixa
      desconto = salario * 0.075;

    } else if (salario > 1045 && salario <= 2089.60) { // 2a faixa
      desconto = 0.09 * (salario - 1045.01);
      desconto += 0.075 * 1045;

    } else if (salario > 2089.60 && salario <= 3134.40) { // 3a faixa
      desconto = 0.12 * (salario - 2089.61);
      desconto += 0.09 * (2089.60 - 1045.01);
      desconto += 0.075 * 1045;

    } else if (salario > 3134.40 && salario <= 6101.06) { // 4a faixa
      desconto = 0.14 * (salario - 3134.41);
      desconto += 0.12 * (3134.40 - 2089.61);
      desconto += 0.09 * (2089.60 - 1045.01);
      desconto += 0.075 * 1045;
    
    } else {
      desconto = 713.08;
    } 

    return desconto;
  }

  const descontoIRRF = (baseCalculo, nDependentes) => {
    
    let aliquota = 0;
    let parcelaDedutivel = 0;
    let desconto = 0;

    if (baseCalculo <= 1903.98) return 0;

    if (nDependentes > 0) {
      baseCalculo = baseCalculo - (189.59 * nDependentes);
    }
    
    if (baseCalculo > 1903.98 && baseCalculo <= 2826.65) {
      aliquota = 0.075;
      parcelaDedutivel = 142.80;
    
    } else if (baseCalculo > 2826.65 && baseCalculo <= 3751.05) {
      aliquota = 0.15;
      parcelaDedutivel = 354.80;

    } else if (baseCalculo > 3751.05 && baseCalculo <= 4664.68) { 
      aliquota = 0.225;
      parcelaDedutivel = 636.13;

    } else if (baseCalculo > 4664.69) { 
      aliquota = 0.275;
      parcelaDedutivel = 869.36;

    }

    desconto = baseCalculo * aliquota - parcelaDedutivel;

    return desconto;
  }

  let rows = []
  for(let i = 0; i < calculos.length; i++){
    rows.push(
      <tr key={calculos[i].id}>
        <td>{calculos[i].nome}</td>
        <td>{calculos[i].salario}</td>
        <td>{calculos[i].nDependentes}</td>
        <td>{calculos[i].descontoInss}</td>
        <td>{calculos[i].descontoIrrf}</td>
        <td>{calculos[i].salarioLiquido}</td>
      </tr>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <nav className="navbar is-dark">
        <div className="navbar-brand">
          <strong>Cálculo de Salário Líquido - React</strong>
        </div>
      </nav>
      <div className="columns is-multiline is-centered is-mobile"
          style={{ marginTop: '20px' }}>
        <div className="column is-half">
          <div className="columns">
            <div className="column is-3">
              <input className="input" type="text" name="nome" placeholder="Nome" 
                value={nome}
                onChange={handleChangeNome} />
            </div>
            <div className="column is-3">
              <input className="input" type="number" name="salario" placeholder="Salário bruto"
                value={salario}
                onChange={handleChangeSalario} />
            </div>
            <div className="column is-3">
              <input className="input" type="number" name="ndependentes" placeholder="Nº de dependentes"
                value={nDependentes} 
                onChange={handleChangeNDependentes} />
            </div>
            <div className="column is-3">
              <button className="button is-success" type="submit">Calcular</button>
            </div>
          </div>
        </div>
      </div>
      <div className="columns is-multiline is-centered">
        <div className="column is-half">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Salário bruto</th>
                <th>Nº de dependentes</th>
                <th>Ref. INSS</th>
                <th>Ref. IRRF</th>
                <th>Salário líquido</th>
              </tr>
            </thead>
            <tbody className="has-text-centered">
              { rows }
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
}

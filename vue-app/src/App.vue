<template>
  <div id="app">
    <nav class="navbar is-dark">
      <div class="navbar-brand">
        <a class="navbar-item" href="#">
          <strong class="logo">Cálculo de Salário Líquido</strong>
        </a>
      </div>
    </nav>
    <div class="columns is-multiline is-centered is-mobile" style="margin: 20px;">
      <div class="column is-half">
        <div class="columns">
          <div class="column is-3">
            <input class="input" type="text" name="nome" placeholder="Nome" v-model="calculo.nome">
          </div>
          <div class="column is-3">
            <input class="input" type="number" name="salario" placeholder="Salário bruto" min="0" step="0.01" v-model="calculo.salario">
          </div>
          <div class="column is-3">
            <input class="input" type="number" name="ndependentes" placeholder="Nº de dependentes" min="0" step="1" v-model="calculo.nDependentes">
          </div>
          <div class="column is-3">
            <button class="button is-success" type="button" @click="calcular()">Calcular</button>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-multiline is-centered">
      <div class="column is-half">
        <table class="table">
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
          <tbody class="has-text-centered">
            <tr v-for="(calculo, index) in calculos" :key="index">
              <td>{{calculo.nome}}</td>
              <td>{{calculo.salario | currency}}</td>
              <td>{{calculo.nDependentes}}</td>
              <td>{{calculo.descontoInss | currency}}</td>
              <td>{{calculo.descontoIrrf | currency}}</td>
              <td>{{calculo.salarioLiquido | currency}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Calculo } from './models/Calculo'

@Component({
  filters: {
    currency(amount: number) {
      const amt = Number(amount)
      return amt && amt.toLocaleString(undefined, {maximumFractionDigits:2}) || '0'
    }
  }
})
export default class App extends Vue {
  private calculos: Calculo[] = []
  private calculo: Calculo = {
    nome: '', 
    salario: 0,
    nDependentes: 0,
    descontoInss: 0,
    descontoIrrf: 0,
    salarioLiquido: 0
  }

  private calcular() {
    const descontoInss = this.descontoINSS(this.calculo.salario);
    const baseCalculo = this.calculo.salario - descontoInss;
    const descontoIrrf = this.descontoIRRF(baseCalculo, this.calculo.nDependentes);
    const salarioLiquido = this.calculo.salario - descontoIrrf - descontoInss;

    this.calculos.push({
      nome: this.calculo.nome,
      salario: this.calculo.salario,
      nDependentes: this.calculo.nDependentes,
      descontoInss,
      descontoIrrf,
      salarioLiquido
    })
    
  }

  private descontoINSS(salario: number): number{

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

  private descontoIRRF(baseCalculo: number, nDependentes: number): number{
    
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
}
</script>

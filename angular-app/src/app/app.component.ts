import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-app';

  form = new FormGroup({
    nome: new FormControl(''),
    salario: new FormControl(''),
    ndependentes: new FormControl('')
  });

  calculos = []

  onSubmit() {
    const nome = this.form.controls.nome.value
    const salario = this.form.controls.salario.value
    const ndependentes = this.form.controls.ndependentes.value

    const calculo = this.calculoSalario(salario, ndependentes)


    this.calculos.push({
      nome,
      salario,
      ndependentes,
      ...calculo
    })
  }

  calculoSalario(salario, nDependentes) {
    const descontoInss = this.descontoINSS(salario)
    const baseCalculo = salario - descontoInss;
    const descontoIrrf = this.descontoIRRF(baseCalculo, nDependentes)
    const salarioLiquido = salario - descontoIrrf - descontoInss;

    return {
      descontoInss,
      descontoIrrf,
      salarioLiquido
    }
  }

  descontoINSS(salario){

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

  descontoIRRF(baseCalculo, nDependentes){
    
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

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  listTarjetas: any[] = [];
  accion = "Agregar";
  id: number|undefined;

  form: FormGroup;

  constructor(private fb: FormBuilder, 
    private toastr: ToastrService, 
    private _tarjetaService: TarjetaService) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExp: ['', [Validators.required, Validators.maxLength(5),Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]],
    })
   }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaService.getListTarjetas().subscribe({
      next: (data) => {
        console.log(data);
        this.listTarjetas = data;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  guardarTarjeta(){
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExp: this.form.get('fechaExp')?.value,
      cvv: this.form.get('cvv')?.value,
    }
    
    if(this.id == undefined){
      //agregamos tarjeta
      this._tarjetaService.saveTarjeta(tarjeta).subscribe({
          next: (data) => {
            this.toastr.success('La tarjeta fue registrada con exito!', 'Tarjeta Registrada!');
            this.obtenerTarjetas();
            this.form.reset();
          },
          error: (response) => {
            this.toastr.error('ocurrio un error', 'Error');
            console.log(response);
          }
      })
    }else{
      //set id
      tarjeta.id = this.id;
      //editamos tarjeta
      this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe({
        next: (data) => {
          this.form.reset();
          this.accion = "Agregar";
          this.id = undefined;
          this.toastr.info('La tarjeta fue actualizada con exito!', 'Tarjeta actualizada!');
          this.obtenerTarjetas();
        },
        error: (response) => {
          console.log(response);
        }
      })
    }

  }

  editarTarjeta(tarjeta: any){
    this.accion = "Editar";
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExp: tarjeta.fechaExp,
      cvv: tarjeta.cvv,
    })
  }

  eliminarTarjeta(id: number){
    this._tarjetaService.deleteTarjeta(id).subscribe({
      next: (data) => {
        this.toastr.error('La tarjeta fue eliminada con exito!', 'Tarjeta eliminada!');
        this.obtenerTarjetas();
      },
      error: (response) => {
        console.log(response);
      }
    })
    
  }

}

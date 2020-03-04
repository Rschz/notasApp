import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { snapToArray } from './../../environments/environment';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  filteredItems:any[];
  notas:any[];
  lastId = 0;
  canceDel= false;
  inpSearch:string;
  ref = firebase.database().ref("notas");

  constructor(private alertController: AlertController, public toastController:ToastController) {
    this.ref.on("value", snap => {
      this.notas = snapToArray(snap);
      this.lastId = this.notas.length > 0 ? this.notas[this.notas.length - 1].key :false ;
      this.assignCopy();//when you fetch collection from server.
    });


  }

  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentToastWithOptions(key:string) {
    // const toast = await this.toastController.create({
    //   message: 'Nota sera eliminada...',
    //   duration: 2000,
    //   position: 'top',
    //   buttons: [
    //      {
    //       text: 'Deshacer',
    //       role: 'cancel',
    //       handler: () =>{
    //         this.canceDel = true;

    //       }
    //     }
    //   ]
    // });
    // toast.present();
    // setTimeout(()=>{ this.canceDel? false: this.delItem(key)}, 2500);
    const alert = await this.alertController.create({
      header: 'Advertencia!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Aceptar',
          handler: () => {
            this.delItem(key);
          }
        }
      ]
    });

    await alert.present();
  }

  assignCopy(){
    this.filteredItems = Object.assign([], this.notas);
 }

 filterItem(value:string){
  if(!value){
      this.assignCopy();
  } // when nothing has typed
  this.filteredItems = Object.assign([], this.notas).filter(
     item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.description.toLowerCase().indexOf(value.toLowerCase()) > -1
  )
}



 async addItem() {
    const alert = await this.alertController.create({
      header: 'Editar Nota',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Titulo'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: data => {
            if (data.title!==undefined && data.title.length > 0) {
              let insertId = +this.lastId + +1;
              this.ref.child(insertId.toString()).set({id: insertId, title:data.title,description:data.description});
              this.presentToast("Nota agregada!");
            }
          }
        }
      ]
    });

    await alert.present();

  }

  delItem(key:string){
    this.ref.child(key).remove();
  }


  async editItem(nota){
    const alert = await this.alertController.create({
      header: 'Editar Nota',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: nota.title,
          placeholder: 'Titulo'
        },
        {
          name: 'description',
          type: 'textarea',
          value: nota.description,
          placeholder: 'Descripción'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: data => {
            if (data.title!==undefined && data.title.length > 0) {
              firebase.database().ref("notas/"+ nota.id).update({title: data.title, description: data.description});
            }
          }
        }
      ]
    });

    await alert.present();
  }


}

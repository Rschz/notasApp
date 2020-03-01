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

  fullList:any[];
  notas:any[];
  lastId = "";
  canceDel= false;
  inpSearch:string;
  ref = firebase.database().ref("notas");

  constructor(private alertController: AlertController, public toastController:ToastController) {
    this.ref.on("value", snap => {
      this.notas = snapToArray(snap);
      this.lastId = this.notas.length > 0 ? this.notas[this.notas.length - 1].key :false ;
      this.fullList = this.notas;

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
    const toast = await this.toastController.create({
      message: 'Nota sera eliminada...',
      duration: 2000,
      position: 'top',
      buttons: [
         {
          text: 'Deshacer',
          role: 'cancel',
          handler: () =>{
            this.canceDel = true;

          }
        }
      ]
    });
    toast.present();
    setTimeout(()=>{ this.canceDel? false: this.delItem(key)}, 2500);
  }

  filterItems(textInp:string){
    console.log(textInp);
    let filter = this.notas.filter(el => el.title.toLowerCase().indexOf(textInp.toLowerCase()) > -1 || el.description.toLowerCase().indexOf(textInp.toLowerCase()) > -1);
    this.notas = filter.length == 0? this.fullList : filter;

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
          type: 'text',
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
              this.ref.child(this.lastId +1).set({id: this.lastId +1, title:data.title,description:data.description});
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
          type: 'text',
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

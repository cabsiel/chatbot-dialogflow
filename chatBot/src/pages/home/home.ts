import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, Content, Platform} from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';

import { LocationStrategy } from '@angular/common';

declare var window;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  messages: any[] = [];
  value: string = "";
  cordova: boolean = false;
  type: string = "";
  name: string ="";
  @ViewChild(Content) content: Content; 

  constructor(platform: Platform, public navCtrl: NavController, public ngZone: NgZone, public tts: TextToSpeech, private document: DocumentViewer) {

    if (platform.is('cordova')){
      this.cordova = true
    }
    this.messages.push({
      value: "Hola, en que puedo ayudarte?",
      sender: "api",
      type:'TEXT'
    })

    /* this.showDocument(); */
    
  } 
/* 
  showDocument(){
    const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    
    this.document.viewDocument('assets/resources/Corporativo.pdf', 'application/pdf', options)
  } */
  
  sendText(){

    let message = this.value;

    this.messages.push({
      value: message,
      sender: 'me'
    });
    this.content.scrollToBottom(200);

    this.value = "";

    if (!this.cordova){
      /*Prueba de Imagen */
/*       let response = "-CODE-IMAGE-CODE-https://s4.eestatic.com/2017/12/14/cultura/cine/Cine_269484989_57668555_1024x576.jpg";
      let speech = "";   */ 
      /*Fin de prueba de IMAGEN*/
      
      /*Prueba de Imagen */
      let response = "-CODE-PDF-CODE-";
      let speech = "";  

      /*Fin de prueba de IMAGEN*/
  
      speech = this.dispatcherRequest(response);

      this.messages.push({
         value:speech,
         name: this.name,
         sender: "api",
         type: this.type
      });

      }else{
          window["ApiAIPlugin"].requestText({
            query: message
          }, (response)=>{
/*             alert(JSON.stringify(response.result.fulfillment.speech)); */
            let speech = "";
            speech = this.dispatcherRequest(response.result.fulfillment.speech);
            this.ngZone.run(()=> {
              this.messages.push({
                value:speech,
                name: this.name,
                sender: "api",
                type: this.type
              });
              this.content.scrollToBottom(200);
            });

          }, (error)=> {
            alert(JSON.stringify(error))
          });
      }
 
  }

    dispatcherRequest(response: any){

      let array = response.split('-CODE-');
      let speech = ""; 
      if (array.length==3) {
        switch (array[1]) {
          case 'IMAGE':     
              this.type= 'IMG';
              speech = array[2];   
            break;
          case 'PDF':     
              this.type= 'PDF';
              let arrayName  = array[2].split('/');

              if(arrayName.length >= 2){
                this.name = arrayName[arrayName.length-1];
              }
              speech = array[2];   
          break;
          default:
              this.type= 'TEXT';
              speech = response;
            break;
        }
      }
      else {
        this.type= 'TEXT';
        speech = response;
      }
      return speech;
    }


  sendVoice(){
    window["ApiAIPlugin"].requestVoice({},
      (response) => {
        let speech = "";
        speech = this.dispatcherRequest(response.result.fulfillment.speech);
        this.ngZone.run(()=> {
          this.messages.push({
            value:speech,
            name: this.name,
            sender: "api",
            type: this.type
          });
          this.content.scrollToBottom(200);
        });
        if (this.type != 'PDF' && this.type != 'IMG'){
            this.tts.speak({
              text: response.result.fulfillment.speech,
              locale: "es-ES",
              rate: 1
            })
          }
      }, (error) => {
          alert(error)
      }
    )
  }

}

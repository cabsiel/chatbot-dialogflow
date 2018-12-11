import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TextToSpeech } from '@ionic-native/text-to-speech';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need. 
      statusBar.styleDefault();
      splashScreen.hide();

      if (platform.is('cordova')){
              // All Cordova plugins can be used this way
              window["ApiAIPlugin"].init(
                {
                    clientAccessToken: "e10e90db94c74b8daf18f6558a174a4b", 
                    lang: "es" 
                }, 
                function(result) {
                  
                },
                function(error) {
                  alert(error)
                }
            );
          }

      });
  }
}

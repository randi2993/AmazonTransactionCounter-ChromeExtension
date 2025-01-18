import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms'; // <<<< import it here
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgClass, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  defaultUrl;
  // currentUrl;
  total = 0;
  pageTotal = 0;
  clicked = false;
  result = "Please select start to begin...";
  warning = "Note: You must be logged into your Amazon account for the extension to work properly";

  constructor(private cdr: ChangeDetectorRef) {
    this.defaultUrl = environment.data.defaultUrl;
    // this.currentUrl = this.getCurrentUrl();
  }

  ngOnInit() {
    this.validateAmazonPage();
  }

  // saveData(value: string) {
  //   localStorage.setItem('currentValue', value);
  // }

  // getCurrentUrl() {
  //   return localStorage.getItem('currentValue') || environment.data.defaultUrl;
  // }

  validateAmazonPage() {
    const tabQueryData = { active: true, currentWindow: true };
    chrome.tabs.query(tabQueryData, (tabs) => {
      if (tabs.length > 0 && !tabs[0].url?.includes(environment.data.baseUrl)) {
        this.clicked = true;
        this.warning = "You are not in an amazon page";
        this.result = "";
        this.cdr.markForCheck(); // Notify Angular about changes
        console.error('Not on an Amazon page!');
      }
    });
  }

  start() {
    const tabQueryData = { active: true, currentWindow: true };
    chrome.tabs.query(tabQueryData, (tabs) => {
      if (tabs.length > 0 && tabs[0].url?.includes(environment.data.baseUrl)) {
        const commandMessage = {
          command: 'nextPage',
          classN: environment.data.html.classWithMoneyValue,
          btnTextNext: environment.data.html.btnTextValueNext,
          btnNextValueSelector: environment.data.html.btnNextValueSelector,
          closestElement: environment.data.html.closestElement,
          closestSelector: environment.data.html.closestSelector
        };

        chrome.tabs.sendMessage(tabs[0].id ?? 0, commandMessage, (response) => {
          if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError?.message);
            console.error('Error sending message to content script:', chrome.runtime.lastError?.message);
          } else {
            console.log('Response from content script:', response);
            if (response.status == 'success') {
              this.result = "Loading data, going to next page, DO NOT CLOSE THIS...";

              if (response.message?.pageTotal !== 0) {
                this.total = 0;
                this.pageTotal = response.message?.pageTotal;

                for (let element of response.message?.total) {
                  this.total += element;
                }
              }

              this.cdr.markForCheck(); // Notify Angular about changes

              if (response.message?.done) {
                this.result = "Completed! Please refresh the page if you want to repeat...";
                this.cdr.markForCheck(); // Notify Angular about changes
                // this.clicked = false;
              } else {
                this.start();
              }
            }
          }
        });
      } else {
        this.result = "You are not in an amazon page";
        this.cdr.markForCheck(); // Notify Angular about changes
        console.error('Not on an Amazon page!');
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModelRef: BsModalRef; 

  constructor(private modalService: BsModalService) { }

  confirm(title = 'Conkfirmation', message = 'Are you sure you want to do this'
              , btnOkText = 'Ok', btnCancelTxt = 'Cancel') : Observable<boolean>{
    const config = {
      initialState: {
        title, 
        message, 
        btnOkText, 
        btnCancelTxt
      }
    }
    this.bsModelRef = this.modalService.show(ConfirmDialogComponent, config); 
    return new Observable<boolean>(this.getResult()); 
  }

  private getResult(){
    return (observer) => {
      const subscription = this.bsModelRef.onHidden.subscribe(() => {
        observer.next(this.bsModelRef.content.result); 
        observer.complete(); 
      }); 

      return {
        unsubscribe(){
          subscription.unsubscribe(); 
        }
      }
    }
  }
}

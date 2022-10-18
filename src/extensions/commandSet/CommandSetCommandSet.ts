import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetExecuteEventParameters,
  IListViewCommandSetListViewUpdatedParameters,
  ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import './customCommand.css'
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICommandSetCommandSetProperties {
  // This is an example; replace with your own properties
  commandLink:string;
  listName: string;
  openNewTab: boolean;
  lableButton: string;
}

export default class CommandSetCommandSet extends BaseListViewCommandSet<ICommandSetCommandSetProperties> {
  private setIntervalId: number
  private _intervalHandleShowButton:number
  private _listName: string
  private _buttonNewDefault: HTMLElement
  private _buttonNewDefaultParent: HTMLElement
  private _buttonNewCustom: HTMLElement
  public onInit(): Promise<void> {
    this._buttonNewDefault = document.querySelector('button[name="New"]')
    this._buttonNewDefaultParent = this._buttonNewDefault.parentElement

    if(this.setIntervalId) clearInterval(this.setIntervalId)
    //Add 2 button new into position 1
    this.setIntervalId = setInterval(()=>{
      const _buttonNewDefault = document.querySelector('button[name="New"]')
      const _buttonNewCustom:NodeListOf<HTMLElement> = document.querySelectorAll('button[name="New Button"]')
      if(_buttonNewCustom.length !== 0) {
        if(_buttonNewCustom.length > 1){
          _buttonNewCustom.forEach((e,i)=>{
            if(i !== 0) e.style.display = 'none'
          })
        }
        const _buttonNewDefaultParent = _buttonNewDefault.parentElement
        const childList = _buttonNewDefaultParent.childElementCount
        if(childList === 1){
          _buttonNewDefaultParent.appendChild(_buttonNewCustom[0])
        }
      }
      // const _buttonNewDefault = document.querySelector('button[name="New"]')
      if(_buttonNewDefault){
        const buttonNewList = _buttonNewDefault.parentElement.childNodes;
        const url = decodeURIComponent(window.location.pathname)
        if(url.indexOf(this.properties.listName) >= 0) {
          if(buttonNewList[0]) (buttonNewList[0] as HTMLElement).style.display = 'none';
          if(buttonNewList[1]) {
            (buttonNewList[1] as HTMLElement).style.display = 'block';
            const lableButton = (buttonNewList[1] as HTMLElement).querySelector('.ms-Button-label')
            if(lableButton.textContent !== this.properties.lableButton && this.properties.lableButton){
              lableButton.textContent = this.properties.lableButton
            }
          }
        }else{
          if(buttonNewList[0]) (buttonNewList[0] as HTMLElement).style.display = 'block';
          if(buttonNewList[1]) {
            (buttonNewList[1] as HTMLElement).style.display = 'none';
          }
        }
      }
    },300)
    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        console.log(this.properties)
        window.open(this.properties.commandLink,this.properties.openNewTab?'_blank':'_self')
        break;
      default:
        throw new Error('Unknown command');
    }
  }
  
}

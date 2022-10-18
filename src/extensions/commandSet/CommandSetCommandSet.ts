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
}

export default class CommandSetCommandSet extends BaseListViewCommandSet<ICommandSetCommandSetProperties> {
  private setIntervalId: number
  private _listName: string
  private _buttonNewDefault: HTMLElement
  private _buttonNewDefaultParent: HTMLElement
  private _buttonNewCustom: HTMLElement
  public onInit(): Promise<void> {
    console.log('run onInit')
    // const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    // this._buttonNewDefault = document.querySelector('button[name="New"]')
    // if(this._buttonNewDefault.parentElement) this._buttonNewDefaultParent = this._buttonNewDefault.parentElement
    if(this.setIntervalId) clearInterval(this.setIntervalId)
    let currentListName = this.context.listView.list.title

    this._buttonNewDefault = document.querySelector('button[name="New"]')

    if(!this._listName) this._listName = this.properties.listName
    if(currentListName === this._listName) {
      
      this.setIntervalId = setInterval(()=>{
        const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
        if(!compareOneCommand.visible) compareOneCommand.visible = true
        this._buttonNewCustom = document.querySelector(`button[name="New Button"]`)
        this._buttonNewDefault = document.querySelector('button[name="New"]')
        if(this._buttonNewCustom && this._buttonNewDefault){
          this._buttonNewDefault.style.display = 'none'
          this._buttonNewDefault.replaceWith(this._buttonNewCustom)
        }
      },600)
    }else{
      const _buttonNewCustom = document.querySelector(`button[name="New Button"]`)
      if(_buttonNewCustom) _buttonNewCustom.replaceWith(this._buttonNewDefault)
      this.setIntervalId = setInterval(()=>{
        const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
        if(compareOneCommand.visible) compareOneCommand.visible = false
      },600)
    }
    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    console.log(this.properties)
    console.log(event)
    switch (event.itemId) {
      case 'COMMAND_1':
        console.log(this.properties.commandLink)
        // window.location.href = this.properties.commandLink
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  protected onDispose(): void {
    if(this.setIntervalId) clearInterval(this.setIntervalId)
  }

  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {

  }
}

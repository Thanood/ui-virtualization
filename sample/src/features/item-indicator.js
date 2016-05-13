import {bindable, customAttribute, inject} from 'aurelia-framework';

@customAttribute('item-indicator')
@inject(Element)
export class ItemIndicator {
  @bindable() item;
  @bindable() firstItem;

  constructor(element) {
    this.element = element;
  }

  attached() {
    if (this.item.firstLetter === this.firstItem.firstLetter) {
      this.element.classList.add('indicator');
    }
  }
}

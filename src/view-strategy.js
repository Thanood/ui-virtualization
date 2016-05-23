import {DOM} from 'aurelia-pal';
import {insertBeforeNode} from './utilities';

interface ViewStrategy {
  getScrollContainer(element: Element): Element;
  moveViewFirst(view: View, topBuffer: Element): void;
  moveViewLast(view: View, bottomBuffer: Element): void;
  createTopBufferElement(element: Element): Element;
  createBottomBufferElement(element: Element): Element;
  removeBufferElements(element: Element, topBuffer: Element, bottomBuffer: Element): void;
  getFirstElement(topBuffer: Element): Element;
  getLastView(bottomBuffer: Element): Element;
}

export class ViewStrategyLocator {
  getStrategy(element: Element): ViewStrategy {
    if (element.parentNode && element.parentNode.localName === 'tbody') {
      return new TableStrategy();
    } else if (element.parentNode && element.parentNode.nodeType === 11) {
      // or: element.parentNode.nodeName === "#document-fragment"
      return new DocumentFragmentViewStrategy();
    }
    return new DefaultViewStrategy();
  }
}

export class TableStrategy {
  tableCssReset = '\
    display: block;\
    width: auto;\
    height: auto;\
    margin: 0;\
    padding: 0;\
    border: none;\
    border-collapse: inherit;\
    border-spacing: 0;\
    background-color: transparent;\
    -webkit-border-horizontal-spacing: 0;\
    -webkit-border-vertical-spacing: 0;';

  getScrollContainer(element: Element): Element {
    return element.parentNode;
  }

  moveViewFirst(view: View, topBuffer: Element): void {
    insertBeforeNode(view, DOM.nextElementSibling(topBuffer.parentNode).previousSibling);
  }

  moveViewLast(view: View, bottomBuffer: Element): void {
    insertBeforeNode(view, bottomBuffer.parentNode);
  }

  createTopBufferElement(element: Element): Element {
    let tr = DOM.createElement('tr');
    tr.setAttribute('style', this.tableCssReset);
    let buffer = DOM.createElement('td');
    buffer.setAttribute('style', this.tableCssReset);
    tr.appendChild(buffer);
    element.parentNode.insertBefore(tr, element);
    return buffer;
  }

  createBottomBufferElement(element: Element): Element {
    let tr = DOM.createElement('tr');
    tr.setAttribute('style', this.tableCssReset);
    let buffer = DOM.createElement('td');
    buffer.setAttribute('style', this.tableCssReset);
    tr.appendChild(buffer);
    element.parentNode.insertBefore(tr, element.nextSibling);
    return buffer;
  }

  removeBufferElements(element: Element, topBuffer: Element, bottomBuffer: Element): void {
    element.parentNode.removeChild(topBuffer.parentNode);
    element.parentNode.removeChild(bottomBuffer.parentNode);
  }

  getFirstElement(topBuffer: Element): Element {
    let tr = topBuffer.parentNode;
    return DOM.nextElementSibling(tr);
  }

  getLastElement(bottomBuffer: Element): Element {
    return bottomBuffer.parentNode.previousElementSibling;
  }
}

export class DocumentFragmentViewStrategy {
  getScrollContainer(element: Element): Element {
    // surround element with a div
    // let root = element.parentNode;
    // let container = DOM.createElement('div');
    // container.classList.add('ui-virtualization-container');
    // root.appendChild(container);
    // root.removeChild(element);
    // container.appendChild(element);
    // return container;
    return element.parentNode;
  }

  moveViewFirst(view: View, topBuffer: Element): void {
    insertBeforeNode(view, DOM.nextElementSibling(topBuffer).previousSibling);
  }

  moveViewLast(view: View, bottomBuffer: Element): void {
    let previousSibling = bottomBuffer.previousSibling;
    let referenceNode = previousSibling.nodeType === 8 && previousSibling.data === 'anchor' ? previousSibling : bottomBuffer;
    insertBeforeNode(view, referenceNode);
  }

  createTopBufferElement(element: Element): Element {
    let elementName = element.parentNode.localName === 'ul' ? 'li' : 'div';
    let buffer = DOM.createElement(elementName);
    element.parentNode.insertBefore(buffer, element);
    return buffer;
  }

  createBottomBufferElement(element: Element): Element {
    let elementName = element.parentNode.localName === 'ul' ? 'li' : 'div';
    let buffer = DOM.createElement(elementName);
    element.parentNode.insertBefore(buffer, element.nextSibling);
    return buffer;
  }

  removeBufferElements(element: Element, topBuffer: Element, bottomBuffer: Element): void {
    element.parentNode.removeChild(topBuffer);
    element.parentNode.removeChild(bottomBuffer);
  }

  getFirstElement(topBuffer: Element): Element {
    return DOM.nextElementSibling(topBuffer);
  }

  getLastElement(bottomBuffer: Element): Element {
    return bottomBuffer.previousElementSibling;
  }
}

export class DefaultViewStrategy {
  getScrollContainer(element: Element): Element {
    return element.parentNode;
  }

  moveViewFirst(view: View, topBuffer: Element): void {
    insertBeforeNode(view, DOM.nextElementSibling(topBuffer).previousSibling);
  }

  moveViewLast(view: View, bottomBuffer: Element): void {
    let previousSibling = bottomBuffer.previousSibling;
    let referenceNode = previousSibling.nodeType === 8 && previousSibling.data === 'anchor' ? previousSibling : bottomBuffer;
    insertBeforeNode(view, referenceNode);
  }

  createTopBufferElement(element: Element): Element {
    let elementName = element.parentNode.localName === 'ul' ? 'li' : 'div';
    let buffer = DOM.createElement(elementName);
    element.parentNode.insertBefore(buffer, element);
    return buffer;
  }

  createBottomBufferElement(element: Element): Element {
    let elementName = element.parentNode.localName === 'ul' ? 'li' : 'div';
    let buffer = DOM.createElement(elementName);
    element.parentNode.insertBefore(buffer, element.nextSibling);
    return buffer;
  }

  removeBufferElements(element: Element, topBuffer: Element, bottomBuffer: Element): void {
    element.parentNode.removeChild(topBuffer);
    element.parentNode.removeChild(bottomBuffer);
  }

  getFirstElement(topBuffer: Element): Element {
    return DOM.nextElementSibling(topBuffer);
  }

  getLastElement(bottomBuffer: Element): Element {
    return bottomBuffer.previousElementSibling;
  }
}

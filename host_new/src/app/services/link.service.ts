import { Injectable, Optional, RendererFactory2, ViewEncapsulation, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
 })
export class LinkService {

constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document
) {
}

/**
 * Inject the State into the bottom of the <head>
 */
addTag(tag: LinkDefinition, forceCreation?: boolean) {

    try {
        const renderer = this.rendererFactory.createRenderer(this.document, {
            id: '-1',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            data: {}
        });
        const selector = this._parseSelector(tag);
        let canonical = this.document.querySelector("link["+selector+"]");
        if( !canonical ){
            const link = renderer.createElement('link');
            const head = this.document.head;
            
            if (head === null) {
                throw new Error('<head> not found within DOCUMENT.');
            }
    
            Object.keys(tag).forEach((prop: string) => {
                return renderer.setAttribute(link, prop, tag[prop]);
            });
    
            // [TODO]: get them to update the existing one (if it exists) ?
            renderer.appendChild(head, link);
        } else {
            Object.keys(tag).forEach((prop: string) => {
                return canonical.setAttribute(prop, tag[prop]);
            });
        }

    } catch (e) {
        console.error('Error within linkService : ', e);
    }
}

private _parseSelector(tag: LinkDefinition): string {
    // Possibly re-work this
    const attr: string = tag.rel ? 'rel' : 'hreflang';
    return `${attr}="${tag[attr]}"`;
}
}

 export declare type LinkDefinition = {
  charset?: string;
  crossorigin?: string;
  href?: string;
  hreflang?: string;
  media?: string;
  rel?: string;
  rev?: string;
  sizes?: string;
  target?: string;
  type?: string;
} & {
    [prop: string]: string;
};
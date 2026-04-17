import {inject, Injectable} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import * as marked from 'marked';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ContentManagerService {
  private configuration = inject(API_URLS) as unknown as Endpoints;
  private sanitizer = inject(DomSanitizer);
  private md: any = marked.setOptions({});

  public getContentObj(data: any, contentBlock: string) {
    const toolObjList = data[contentBlock].data;

    const lineRowItems: Array<any> = [];
    const imageSizeKeys = ['large', 'medium', 'small', 'thumbnail'];

    for (let i = 0; i < toolObjList.length; i++) {
      const row = toolObjList[i].attributes;
      const rowId = toolObjList[i].id;
      const contentMap: any = {};
      const markDownKeys = ['header', 'content', 'description', 'footer', 'subheader', 'answer'];

      contentMap['id'] = rowId;

      // Building the contentMap
      Object.keys(row).forEach((key: any) => {
        if (row[key] != 'undefined' && row[key] !== null && key != 'image' && key != 'graphic') {
          contentMap[key] = row[key];

          if (markDownKeys.includes(key)) {
            contentMap[key] = this.md.parse(row[key]);
          }
        }
        if (key == 'url' && row[key] != null && row[key] !== 'undefined') {
          try {
            const hostUrl = new URL(row[key], window.location.origin);
            if (hostUrl.protocol === 'http:' || hostUrl.protocol === 'https:') {
              contentMap[key] = this.sanitizer.bypassSecurityTrustResourceUrl(row[key]);
            } else {
              console.error('Invalid URL protocol:', row[key], hostUrl.protocol);
            }
          } catch (error) {
            console.error('Invalid URL:', row[key], error);
          }
        }
      });

      // handling the image map
      if (typeof row.image != 'undefined' && row.image !== null) {
        if (row.image.data === null) {
          continue;
        }
        const rowImageFormats = row.image.data.attributes.formats;
        contentMap['images'] = {};
        for (let j = 0; j < imageSizeKeys.length; j++) {
          if (rowImageFormats !== null && imageSizeKeys[j] in rowImageFormats) {
            var imageSize = imageSizeKeys[j];
            contentMap['images'][imageSize] = rowImageFormats[imageSize];

            contentMap['images'][imageSize].url = this.configuration.n3cUrls.strapiUrl + rowImageFormats[imageSize].url;

            if (rowImageFormats[imageSize].path == 'undefined' || rowImageFormats[imageSize].path === null) {
              delete contentMap['images'][imageSize]['path'];
            }
          } else if (rowImageFormats === null) {
            var mainImage = this.configuration.n3cUrls.strapiUrl + row.image.data.attributes.url;

            contentMap['images'] = {
              main: {url: mainImage, height: row.image.data.attributes.height, width: row.image.data.attributes.width}
            };
          }
        }
      }
      // handling the graphic
      if (typeof row.graphic != 'undefined' && row.graphic !== null) {
        if (row.graphic.data !== null) {
          const rowGraphicFormats = row.graphic.data.attributes.formats;
          contentMap['graphic'] = {};

          for (let j = 0; j < imageSizeKeys.length; j++) {
            if (rowGraphicFormats !== null && imageSizeKeys[j] in rowGraphicFormats) {
              const graphicSize = imageSizeKeys[j];
              contentMap['graphic'][graphicSize] = rowGraphicFormats[graphicSize];

              contentMap['graphic'][graphicSize].url =
                this.configuration.n3cUrls.strapiUrl + rowGraphicFormats[graphicSize].url;

              if (rowGraphicFormats[graphicSize].path == 'undefined' || rowGraphicFormats[graphicSize].path === null) {
                delete contentMap['graphic'][graphicSize]['path'];
              }
            } else if (rowGraphicFormats === null) {
              const mainGraphic = this.configuration.n3cUrls.strapiUrl + row.graphic.data.attributes.url;

              contentMap['graphic'] = {
                main: {
                  url: mainGraphic,
                  height: row.graphic.data.attributes.height,
                  width: row.graphic.data.attributes.width
                }
              };
            }
          }
        }
      }

      lineRowItems.push(contentMap);
    }

    return lineRowItems;
  }

  public getImageUrls(data: any, imageBlocks: string[]): string[] {
    const imageUrls: string[] = [];

    imageBlocks.forEach((block, index) => {
      const imageData = data[block]?.data?.attributes;

      if (imageData && imageData.url) {
        const imageUrl = `${this.configuration.n3cUrls.strapiUrl}${imageData.url}`;
        imageUrls[index] = imageUrl;
      } else {
        imageUrls[index] = ''; // Use an empty string for missing images
      }
    });

    return imageUrls;
  }

  public getThumbnailUrl(data: any, imageBlock: string): string {
    const imageData = data?.[imageBlock]?.data?.attributes;

    if (imageData?.formats?.thumbnail?.url) {
      return `${this.configuration.n3cUrls.strapiUrl}${imageData.formats.thumbnail.url}`;
    } else if (imageData?.url) {
      // Fallback to original image if thumbnail doesn't exist
      return `${this.configuration.n3cUrls.strapiUrl}${imageData.url}`;
    }

    return '';
  }

  public parseMdContent(content: any): any {
    for (let key in content) {
      if (typeof content[key] === 'string') {
        // Check if variable is date string
        if (Date.parse(content[key]) > 0) {
          continue;
        }

        // Check if variable has markdown
        if (!this.likelyContainsMarkdown(content[key])) {
          continue;
        }

        content[key] = this.md.parse(content[key]);
      }
    }
    return content;
  }

  // Check if variable has markdown
  // This should used for whole site.
  private likelyContainsMarkdown(str: string): boolean {
    // Look for common Markdown patterns
    const markdownPatterns = [
      /\*\*(.*?)\*\*/g, // Bold text
      /\*(.*?)\*/g, // Italic text
      /\[(.*?)\]\(.*?\)/g, // Links
      /\#{1,6} (.*?)/g, // Headers
      /\`{1,3}(.*?)\`{1,3}/g, // Code blocks
      /\- (.*?)/g, // Unordered lists
      /\d\. (.*?)/g // Ordered lists
    ];

    for (const pattern of markdownPatterns) {
      if (pattern.test(str)) {
        return true;
      }
    }

    return false;
  }
}

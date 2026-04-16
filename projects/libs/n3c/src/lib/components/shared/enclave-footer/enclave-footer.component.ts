import {Component, Input, OnChanges, SimpleChanges, Inject} from '@angular/core';
import {API_URLS, Endpoints, N3CEndpoints} from '@odp/shared/lib/types';
import * as marked from 'marked';

@Component({
  selector: 'app-n3c-footer',
  templateUrl: './enclave-footer.component.html',
  styleUrls: ['./enclave-footer.component.scss']
})
export class N3cEnclaveFooterComponent implements OnChanges {
  @Input() public tenantContent!: any;

  public md = marked.setOptions({});
  public n3cUrls!: N3CEndpoints;

  public footerIconImage = '';
  public footerCite: any;
  public footerCredit: any;
  public footerSignUp: any;

  ngOnChanges(changes: SimpleChanges): void {
    // If 'tenantContent' object is null then let it exit & load again.
    if (changes['tenantContent'].currentValue === null) {
      return;
    }
    const tenantContent = changes['tenantContent'].currentValue.data.attributes;
    const footerImageUrl = tenantContent.banner_icon.data.attributes.url;
    this.footerIconImage = this.n3cUrls.strapiUrl + footerImageUrl;
    this.footerCite = this.md(tenantContent.footer_cite);
    this.footerCredit = this.md(tenantContent.footer_credit);
    this.footerSignUp = this.md(tenantContent.footer_signup);
  }

  constructor(@Inject(API_URLS) configuration: Endpoints) {
    this.n3cUrls = configuration.n3cUrls;
  }
}

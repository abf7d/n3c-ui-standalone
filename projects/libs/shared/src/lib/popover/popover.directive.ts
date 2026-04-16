import {
  Directive,
  Input,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef,
  Renderer2,
  NgZone
} from '@angular/core';

type Placement = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[appPopover]',
  standalone: true,
  exportAs: 'appPopover',
  host: {
    '(click)': 'onHostClick($event)',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class PopoverDirective implements OnDestroy {
  /** Popover body — pass a string or an ng-template reference. */
  @Input('appPopover') content!: string | TemplateRef<any>;

  /** Optional title displayed in the popover header. */
  @Input() popoverTitle: string = '';

  /** Placement relative to the host element. */
  @Input() placement: Placement = 'right';

  /**
   * Trigger mode.
   *   'click'                — toggle on click, close on outside click (default)
   *   'mouseenter:mouseleave' — show on hover
   */
  @Input() triggers: string = 'click';

  /** Where to append the popover. Defaults to 'body' to avoid overflow clipping. */
  @Input() popoverContainer: string = 'body';

  /** Show a close button (×) in the popover header. */
  @Input() showCloseButton: boolean = false;

  private popoverEl: HTMLElement | null = null;
  private isOpen = false;
  private outsideClickUnlisten: (() => void) | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private vcr: ViewContainerRef,
    private renderer: Renderer2,
    private zone: NgZone
  ) {}

  /* ------------------------------------------------------------------ */
  /*  Host listeners                                                     */
  /* ------------------------------------------------------------------ */

  onHostClick(event: Event): void {
    if (!this.isClickTrigger) return;
    this.toggle();
  }

  onMouseEnter(): void {
    if (!this.isHoverTrigger) return;
    this.open();
  }

  onMouseLeave(): void {
    if (!this.isHoverTrigger) return;
    this.close();
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen) return;
    if (!this.content) return;
    this.isOpen = true;
    this.createPopover();
    this.positionPopover();

    if (this.isClickTrigger) {
      // Defer so the current click doesn't immediately close it
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.outsideClickUnlisten = this.renderer.listen('document', 'click', (e: Event) => {
            if (this.popoverEl && !this.popoverEl.contains(e.target as Node)) {
              this.zone.run(() => this.close());
            }
          });
        });
      });
    }
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.destroyPopover();
  }

  ngOnDestroy(): void {
    this.close();
  }

  /* ------------------------------------------------------------------ */
  /*  Private helpers                                                    */
  /* ------------------------------------------------------------------ */

  private get isClickTrigger(): boolean {
    return this.triggers === 'click' || this.triggers === 'click:outside' || this.triggers === '';
  }

  private get isHoverTrigger(): boolean {
    return this.triggers === 'mouseenter:mouseleave' || this.triggers === 'hover';
  }

  private createPopover(): void {
    const pop = this.renderer.createElement('div') as HTMLElement;

    // Bootstrap 5 popover classes
    const bsPlacementClass = this.bsPlacementClass;
    pop.className = `popover ${bsPlacementClass} show`;
    pop.setAttribute('role', 'tooltip');
    pop.style.position = 'absolute';
    pop.style.zIndex = '1070';

    // Arrow — position is set in positionPopover()
    const arrow = this.renderer.createElement('div') as HTMLElement;
    arrow.className = 'popover-arrow';
    arrow.style.position = 'absolute';
    pop.appendChild(arrow);

    // Header (optional)
    if (this.popoverTitle) {
      const header = this.renderer.createElement('h3') as HTMLElement;
      header.className = 'popover-header';

      if (this.showCloseButton) {
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';

        const titleSpan = this.renderer.createElement('span') as HTMLElement;
        titleSpan.textContent = this.popoverTitle;
        header.appendChild(titleSpan);

        const closeBtn = this.renderer.createElement('button') as HTMLElement;
        closeBtn.className = 'popover-close-btn';
        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'none';
        closeBtn.style.fontSize = '1.25rem';
        closeBtn.style.lineHeight = '1';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '0 0 0 0.5rem';
        closeBtn.addEventListener('click', (e: Event) => {
          e.stopPropagation();
          this.zone.run(() => this.close());
        });
        header.appendChild(closeBtn);
      } else {
        header.textContent = this.popoverTitle;
      }

      pop.appendChild(header);
    }

    // Body
    const body = this.renderer.createElement('div') as HTMLElement;
    body.className = 'popover-body';

    if (typeof this.content === 'string') {
      body.textContent = this.content;
    } else if (this.content instanceof TemplateRef) {
      const viewRef: EmbeddedViewRef<any> = this.vcr.createEmbeddedView(this.content);
      viewRef.detectChanges();
      for (const node of viewRef.rootNodes) {
        body.appendChild(node);
      }
    }

    pop.appendChild(body);

    // Append to body or host parent
    if (this.popoverContainer === 'body') {
      document.body.appendChild(pop);
    } else {
      this.el.nativeElement.parentElement?.appendChild(pop);
    }

    this.popoverEl = pop;
  }

  private positionPopover(): void {
    if (!this.popoverEl) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const pop = this.popoverEl;
    const arrow = pop.querySelector('.popover-arrow') as HTMLElement | null;

    // Ensure the popover is rendered so we can measure it
    pop.style.visibility = 'hidden';
    pop.style.display = 'block';

    const popRect = pop.getBoundingClientRect();

    let top = 0;
    let left = 0;

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Center the popover on the host element, then place the arrow
    // at the popover's midpoint so it points directly at the link.
    const arrowSize = 8; // half the arrow's width/height

    switch (this.placement) {
      case 'right':
        top = hostRect.top + scrollY + hostRect.height / 2 - popRect.height / 2;
        left = hostRect.right + scrollX + 8;
        if (arrow) {
          arrow.style.top = `${popRect.height / 2 - arrowSize}px`;
        }
        break;
      case 'left':
        top = hostRect.top + scrollY + hostRect.height / 2 - popRect.height / 2;
        left = hostRect.left + scrollX - popRect.width - 8;
        if (arrow) {
          arrow.style.top = `${popRect.height / 2 - arrowSize}px`;
        }
        break;
      case 'top':
        top = hostRect.top + scrollY - popRect.height - 8;
        left = hostRect.left + scrollX + hostRect.width / 2 - popRect.width / 2;
        if (arrow) {
          arrow.style.left = `${popRect.width / 2 - arrowSize}px`;
        }
        break;
      case 'bottom':
        top = hostRect.bottom + scrollY + 8;
        left = hostRect.left + scrollX + hostRect.width / 2 - popRect.width / 2;
        if (arrow) {
          arrow.style.left = `${popRect.width / 2 - arrowSize}px`;
        }
        break;
    }

    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;
    pop.style.visibility = 'visible';
  }

  private get bsPlacementClass(): string {
    switch (this.placement) {
      case 'right':
        return 'bs-popover-end';
      case 'left':
        return 'bs-popover-start';
      case 'top':
        return 'bs-popover-top';
      case 'bottom':
        return 'bs-popover-bottom';
      default:
        return 'bs-popover-end';
    }
  }

  private destroyPopover(): void {
    if (this.outsideClickUnlisten) {
      this.outsideClickUnlisten();
      this.outsideClickUnlisten = null;
    }
    if (this.popoverEl) {
      this.popoverEl.remove();
      this.popoverEl = null;
    }
    this.vcr.clear();
  }
}

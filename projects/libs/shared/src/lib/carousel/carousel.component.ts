import {Component, Input, TemplateRef, ContentChild, ViewChild, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-simple-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (items.length > 0) {
      <div class="carousel slide">
        @if (showIndicators) {
          <div class="carousel-indicators">
            @for (item of items; track item; let i = $index) {
              <button
                type="button"
                [class.active]="i === activeIndex"
                (click)="goTo(i)"
                [attr.aria-label]="'Slide ' + (i + 1)"
              ></button>
            }
          </div>
        }
        <div class="carousel-inner" #carouselInner>
          @for (item of items; track item; let i = $index) {
            <div class="carousel-item" [class.active]="i === activeIndex">
              <ng-container *ngTemplateOutlet="slideTemplate; context: {$implicit: item, index: i}"></ng-container>
            </div>
          }
        </div>
        @if (showArrows && items.length > 1) {
          <button class="carousel-control-prev" type="button" (click)="prev()" aria-label="Previous">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
        }
        @if (showArrows && items.length > 1) {
          <button class="carousel-control-next" type="button" (click)="next()" aria-label="Next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        }
      </div>
    }
  `,
  styles: [
    `
      .carousel-indicators button {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #999;
        border: none;
        margin: 0 3px;
        opacity: 0.5;
        cursor: pointer;
      }
      .carousel-indicators button.active {
        opacity: 1;
        background-color: #333;
      }
      .carousel-item {
        transition: transform 0.6s ease-in-out;
        backface-visibility: hidden;
      }
    `
  ]
})
export class SimpleCarouselComponent {
  @Input() items: any[] = [];
  @Input() showArrows = true;
  @Input() showIndicators = true;

  @ContentChild('slide', {static: false}) slideTemplate!: TemplateRef<any>;
  @ViewChild('carouselInner', {static: false}) carouselInner!: ElementRef<HTMLElement>;

  activeIndex = 0;
  private animating = false;

  prev(): void {
    const newIndex = (this.activeIndex - 1 + this.items.length) % this.items.length;
    this.slideTo(newIndex, 'right');
  }

  next(): void {
    const newIndex = (this.activeIndex + 1) % this.items.length;
    this.slideTo(newIndex, 'left');
  }

  goTo(index: number): void {
    if (index === this.activeIndex) return;
    const direction = index > this.activeIndex ? 'left' : 'right';
    this.slideTo(index, direction);
  }

  private slideTo(newIndex: number, direction: 'left' | 'right'): void {
    if (this.animating || newIndex === this.activeIndex) return;
    if (!this.carouselInner) {
      this.activeIndex = newIndex;
      return;
    }

    this.animating = true;

    const inner = this.carouselInner.nativeElement;
    const slides = inner.querySelectorAll(':scope > .carousel-item');
    const activeSlide = slides[this.activeIndex] as HTMLElement;
    const nextSlide = slides[newIndex] as HTMLElement;

    if (!activeSlide || !nextSlide) {
      this.activeIndex = newIndex;
      this.animating = false;
      return;
    }

    const orderClass = direction === 'left' ? 'carousel-item-next' : 'carousel-item-prev';
    const dirClass = direction === 'left' ? 'carousel-item-start' : 'carousel-item-end';

    // Step 1: Position the incoming slide off-screen (makes it display:block via Bootstrap CSS)
    nextSlide.classList.add(orderClass);

    // Step 2: Force reflow so the browser registers the initial position
    void nextSlide.offsetHeight;

    // Step 3: Apply directional class to both slides to trigger the CSS transform transition
    activeSlide.classList.add(dirClass);
    nextSlide.classList.add(dirClass);

    // Step 4: After the transition completes, clean up classes and update activeIndex
    setTimeout(() => {
      nextSlide.classList.remove(dirClass, orderClass);
      activeSlide.classList.remove(dirClass);
      this.activeIndex = newIndex;
      this.animating = false;
    }, 600);
  }
}

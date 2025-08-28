import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[scrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements AfterViewInit {
  @Input() scrollAnimate: 'auto' | 'parallax' | 'pin' = 'auto';
  @Input() delay = 0;
  @Input() stagger = 0;

  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const elem = this.el.nativeElement;

    if (this.scrollAnimate === 'pin') {
      ScrollTrigger.create({
        trigger: elem,
        start: 'top top',
        end: '+=200',
        pin: true,
        scrub: 0.5,
      });
      return;
    }

    let animation: gsap.TweenVars = {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power2.out'
    };

    if (this.scrollAnimate === 'parallax') {
      animation = { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out' };
    } else if (elem.tagName === 'IMG') {
      animation = { opacity: 0, scale: 0.95, duration: 1, ease: 'power2.out' };
    } else if (elem.tagName === 'BUTTON' || elem.tagName === 'A') {
      animation = { opacity: 0, y: 20, scale: 0.98, duration: 0.8, ease: 'back.out(1.5)' };
    }

    gsap.from(elem, {
      ...animation,
      delay: this.delay,
      scrollTrigger: {
        trigger: elem,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      stagger: this.stagger
    });
  }
}

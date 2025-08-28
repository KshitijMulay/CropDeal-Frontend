import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {
  currentStep = 0;
  isVisible = true; // Start visible for testing

  steps: any[] = [
    {
      title: 'Welcome to CropDeal!',
      content: 'Empowering Farmers & Dealers! Start by logging in or registering to connect, trade, and grow together.',
      icon: 'bi-person-plus',
      target: '.navbar .dropdown',
      position: 'bottom'
    },
    {
      title: 'Explore Our Products',
      content: 'Click "Explore Products" to discover fresh agricultural products from verified farmers.',
      icon: 'bi-search',
      target: '.btn-warning',
      position: 'bottom'
    },
    {
      title: 'Browse Available Crops',
      content: 'View all available crops with prices, quantities, and farmer details in our marketplace.',
      icon: 'bi-grid-3x3-gap',
      target: 'app-crops, section[class*="container py-5"]:has(app-crops)',
      position: 'top'
    },
    {
      title: 'Get in Touch',
      content: 'Use our contact form to send us messages, get support, or connect with our team.',
      icon: 'bi-envelope',
      target: '#contact, section#contact',
      position: 'top'
    }
  ];

  ngOnInit() {
    // Always show onboarding for testing - remove this line later
    localStorage.removeItem('hasSeenOnboarding');
    
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setTimeout(() => {
        this.isVisible = true;
      }, 1000);
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.scrollToTarget();
      // Force update positioning after scroll
      setTimeout(() => {
        this.updateTooltipPosition();
      }, 500);
    } else {
      this.finishOnboarding();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.scrollToTarget();
    }
  }

  skipOnboarding() {
    this.finishOnboarding();
  }

  finishOnboarding() {
    this.isVisible = false;
    localStorage.setItem('hasSeenOnboarding', 'true');
  }

  // Method to reset onboarding (for testing)
  resetOnboarding() {
    localStorage.removeItem('hasSeenOnboarding');
    this.currentStep = 0;
    this.isVisible = true;
  }

  // Force update tooltip position
  updateTooltipPosition() {
    // Trigger change detection to update tooltip position
    const tooltip = document.querySelector('.onboarding-tooltip') as HTMLElement;
    if (tooltip) {
      const position = this.getTooltipPosition();
      tooltip.style.top = position.top as string;
      tooltip.style.left = position.left as string;
    }
  }

  private scrollToTarget() {
    setTimeout(() => {
      const step = this.steps[this.currentStep];
      if (!step || !step.target) return;
      
      const targets = step.target.split(', ');
      let target: HTMLElement | null = null;
      
      for (const selector of targets) {
        target = document.querySelector(selector.trim()) as HTMLElement;
        if (target) break;
      }
      
      // Aggressive fallbacks to ensure we always find something
      if (!target) {
        if (this.currentStep === 2) {
          // Find crops section - it's inside a section with app-crops
          target = document.querySelector('app-crops') as HTMLElement;
          if (!target) {
            // Look for the section containing app-crops
            const sections = document.querySelectorAll('section');
            for (const section of sections) {
              if (section.querySelector('app-crops')) {
                target = section as HTMLElement;
                break;
              }
            }
          }
        } else if (this.currentStep === 3) {
          // Find contact section in footer
          target = document.querySelector('#contact') as HTMLElement;
          if (!target) {
            // Look for section with contact heading
            const sections = document.querySelectorAll('section');
            for (const section of sections) {
              const heading = section.querySelector('h2');
              if (heading?.textContent?.includes('Contact')) {
                target = section as HTMLElement;
                break;
              }
            }
          }
        }
      }
      
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  getHighlightPosition() {
    const step = this.steps[this.currentStep];
    if (!step || !step.target) return { display: 'none' };
    
    const targets = step.target.split(', ');
    let target: HTMLElement | null = null;
    
    for (const selector of targets) {
      target = document.querySelector(selector.trim()) as HTMLElement;
      if (target) break;
    }
    
    // Step-specific fallbacks
    if (!target) {
      if (this.currentStep === 2) {
        // Crops section
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const heading of headings) {
          if (heading.textContent?.includes('Available Crops')) {
            target = heading as HTMLElement;
            break;
          }
        }
        if (!target) target = document.querySelector('app-crops, .container.my-5') as HTMLElement;
      } else if (this.currentStep === 3) {
        // Contact section
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const heading of headings) {
          if (heading.textContent?.includes('Contact')) {
            target = heading as HTMLElement;
            break;
          }
        }
        if (!target) target = document.querySelector('section[id*="contact"], footer, form') as HTMLElement;
      }
    }
    
    if (!target) return { display: 'none' };
    
    const rect = target.getBoundingClientRect();
    return {
      position: 'fixed',
      top: `${rect.top - 4}px`,
      left: `${rect.left - 4}px`,
      width: `${rect.width + 8}px`,
      height: `${rect.height + 8}px`,
      zIndex: '9998'
    };
  }

  getTooltipPosition() {
    const currentStep = this.steps[this.currentStep];
    if (!currentStep || !currentStep.target) return { top: '50%', left: '50%' };
    
    const targets = currentStep.target.split(', ');
    let target: HTMLElement | null = null;
    
    for (const selector of targets) {
      target = document.querySelector(selector.trim()) as HTMLElement;
      if (target) break;
    }
    
    // Step-specific fallbacks
    if (!target) {
      if (this.currentStep === 2) {
        // Crops section
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const heading of headings) {
          if (heading.textContent?.includes('Available Crops')) {
            target = heading as HTMLElement;
            break;
          }
        }
        if (!target) target = document.querySelector('app-crops, .container.my-5') as HTMLElement;
      } else if (this.currentStep === 3) {
        // Contact section
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const heading of headings) {
          if (heading.textContent?.includes('Contact')) {
            target = heading as HTMLElement;
            break;
          }
        }
        if (!target) target = document.querySelector('section[id*="contact"], footer, form') as HTMLElement;
      }
    }
    
    if (!target) return { top: '50%', left: '50%' };
    
    const rect = target.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const tooltipWidth = Math.min(400, screenWidth * 0.9);
    const tooltipHeight = 250;
    
    let top: number = 0;
    let left: number = 0;
    
    // Smart positioning based on available space
    const spaceBelow = screenHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = screenWidth - rect.right;
    const spaceLeft = rect.left;
    
    // Position tooltip where there's most space
    if (spaceBelow >= tooltipHeight + 20) {
      // Position below
      top = rect.bottom + 15;
      left = Math.max(10, Math.min(rect.left + (rect.width / 2) - (tooltipWidth / 2), screenWidth - tooltipWidth - 10));
    } else if (spaceAbove >= tooltipHeight + 20) {
      // Position above
      top = rect.top - tooltipHeight - 15;
      left = Math.max(10, Math.min(rect.left + (rect.width / 2) - (tooltipWidth / 2), screenWidth - tooltipWidth - 10));
    } else if (spaceRight >= tooltipWidth + 20) {
      // Position right
      left = rect.right + 15;
      top = Math.max(10, Math.min(rect.top + (rect.height / 2) - (tooltipHeight / 2), screenHeight - tooltipHeight - 10));
    } else {
      // Position left
      left = Math.max(10, rect.left - tooltipWidth - 15);
      top = Math.max(10, Math.min(rect.top + (rect.height / 2) - (tooltipHeight / 2), screenHeight - tooltipHeight - 10));
    }
    
    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      zIndex: '9999'
    };
  }

  getTooltipClass() {
    const currentStep = this.steps[this.currentStep];
    return currentStep ? `tooltip-${currentStep.position || 'bottom'}` : 'tooltip-bottom';
  }

  getArrowClass() {
    const currentStep = this.steps[this.currentStep];
    return currentStep ? `arrow-${currentStep.position || 'bottom'}` : 'arrow-bottom';
  }
}
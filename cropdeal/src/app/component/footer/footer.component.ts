import { Component } from '@angular/core';
import emailjs from 'emailjs-com';
import { keys } from '../../keys/keys';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  email: string = "kshitijmulay411@gmail.com";
  currentYear: number = new Date().getFullYear();

  sendEmail(event: Event) {
    event.preventDefault();
    emailjs.sendForm(
      keys.feedback_keys.service_key,
      keys.feedback_keys.template_key,
      event.target as HTMLFormElement,
      keys.feedback_keys.user_key
    ).then(
      result => {
        console.log(result.text);
        alert("Message sent successfully!");
      },
      error => {
        console.log(error.text);
        alert("Failed to send message.");
      }
    );
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

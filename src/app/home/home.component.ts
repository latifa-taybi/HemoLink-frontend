import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  features = [
    {
      id: 1,
      icon: '📊',
      title: 'Suivi Temps Réel',
      description: 'Dashboard intuitif avec vue complète des stocks et des opérations en cours'
    },
    {
      id: 2,
      icon: '⚡',
      title: 'Automatisation',
      description: 'Processus automatisés pour réduire les erreurs et gagner du temps'
    },
    {
      id: 3,
      icon: '🔐',
      title: 'Sécurité Maximale',
      description: 'Chiffrement end-to-end et conformité totale aux normes de santé'
    },
    {
      id: 4,
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Accès complet sur tous les appareils, partout et n\'importe quand'
    },
    {
      id: 5,
      icon: '🚀',
      title: 'Scalable',
      description: 'Infrastructure prête pour croître avec votre organisation'
    },
    {
      id: 6,
      icon: '💼',
      title: 'Support 24/7',
      description: 'Équipe dédiée disponible à tout moment pour vous aider'
    }
  ];

  benefits = [
    { number: '40%', text: 'Réduction du temps de gestion' },
    { number: '99.9%', text: 'Disponibilité du système' },
    { number: '100%', text: 'Conformité réglementaire' },
    { number: '50+', text: 'Partenaires de confiance' }
  ];

  testimonials = [
    {
      name: 'Dr. Hassan Bennani',
      role: 'Directeur Médical',
      org: 'Hôpital Central',
      message: 'HémoLink a transformé notre gestion des stocks. Les erreurs ont diminué de 80%.',
      avatar: '👨‍⚕️'
    },
    {
      name: 'Sarah Khadija',
      role: 'Coordinatrice',
      org: 'Centre de Collecte Nord',
      message: 'Interface simple et efficace. Nos équipes l\'ont adoptée immédiatement.',
      avatar: '👩‍💼'
    },
    {
      name: 'Prof. Mohammed Alaoui',
      role: 'Chef Laboratoire',
      org: 'Lab Qualité',
      message: 'La traçabilité est parfaite. Un outil indispensable pour nous.',
      avatar: '👨‍🔬'
    }
  ];

  faqItems = [
    {
      question: 'Comment démarrer avec HémoLink?',
      answer: 'Créez un compte, configurez votre organisation et invitez vos équipes. Une session de formation est incluse gratuitement.'
    },
    {
      question: 'Quels sont les coûts?',
      answer: 'Notre tarification est flexible. Les donneurs rejoignent gratuitement. Nous proposons des forfaits pour les organisations.'
    },
    {
      question: 'Mes données sont-elles sécurisées?',
      answer: 'Absolument. Nous utilisons le chiffrement military-grade, les sauvegardes automatiques et respectons la conformité RGPD.'
    },
    {
      question: 'Puis-je intégrer HémoLink à mes systèmes existants?',
      answer: 'Oui, nous proposons une API complète pour l\'intégration avec vos systèmes ERP ou hospitaliers.'
    },
    {
      question: 'Y a-t-il une période d\'essai gratuite?',
      answer: 'Oui! 30 jours gratuits sans carte de crédit requise. Commencez maintenant.'
    },
    {
      question: 'Quel support est disponible?',
      answer: 'Support par email, chat, téléphone et sessions de formation dédiées. Notre équipe est là 24/7.'
    }
  ];

  expandedFaq: number | null = null;

  ngOnInit(): void {
    this.animateOnScroll();
  }

  toggleFaq(index: number): void {
    this.expandedFaq = this.expandedFaq === index ? null : index;
  }

  animateOnScroll(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(
      '.feature-card, .benefit-card, .testimonial-card, .faq-item, .section-content'
    ).forEach(el => {
      observer.observe(el);
    });
  }
}

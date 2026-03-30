import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';

interface Notification {
  id: number;
  message: string;
  lu: boolean;
  creeLe: string;
}

@Component({
  selector: 'app-donor-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-gray-800 mb-2">Notifications</h1>
            <p class="text-gray-600">{{ unreadCount }} notification(s) non lue(s)</p>
          </div>
          <button 
            *ngIf="notifications.length > 0"
            (click)="markAllAsRead()"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            ✓ Marquer tout comme lu
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-white rounded-lg shadow-lg p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p class="mt-4 text-gray-600">Chargement des notifications...</p>
        </div>

        <!-- Notifications List -->
        <div *ngIf="!loading && notifications.length > 0" class="space-y-4">
          <div 
            *ngFor="let notif of notifications; let i = index"
            [ngClass]="'bg-white rounded-lg shadow-lg p-6 cursor-pointer transition hover:shadow-xl border-l-4' + (notif.lu ? ' border-gray-300 bg-gray-50' : ' border-orange-600 bg-orange-50')"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <!-- Notification Message -->
                <p [ngClass]="notif.lu ? 'text-gray-600' : 'text-gray-800 font-semibold'">
                  {{ notif.message }}
                </p>
                
                <!-- Timestamp -->
                <p class="text-sm text-gray-500 mt-2">
                  {{ formatDate(notif.creeLe) }}
                </p>
              </div>

              <!-- Notification Status Badge -->
              <div class="ml-4 text-right">
                <span 
                  [ngClass]="notif.lu ? 'bg-gray-200 text-gray-700' : 'bg-orange-200 text-orange-700'"
                  class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {{ notif.lu ? '✓ Lu' : '● Non lu' }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 mt-4">
              <button 
                *ngIf="!notif.lu"
                (click)="markAsRead(notif.id)"
                class="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition"
              >
                ✓ Marquer comme lu
              </button>
              <button 
                (click)="deleteNotification(notif.id, i)"
                class="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && notifications.length === 0" class="bg-white rounded-lg shadow-lg p-12 text-center text-gray-600">
          <div class="text-5xl mb-4">📭</div>
          <p class="text-xl">Aucune notification</p>
          <p class="mt-2">Vous êtes à jour!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DonorNotificationsComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  notifications: Notification[] = [];
  loading = true;

  get unreadCount(): number {
    return this.notifications.filter(n => !n.lu).length;
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.loading = false;
      return;
    }

    // Fetch all notifications - no pagination for donor's own notifications
    this.notificationService.getAllNotifications(0, 100).subscribe({
      next: (response: any) => {
        // Handle both paginated response and direct array
        this.notifications = Array.isArray(response) ? response : (response.content || []);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur notifications:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) {
          notif.lu = true;
          this.cdr.markForCheck();
        }
      },
      error: (err) => console.error('Erreur marquer comme lu:', err)
    });
  }

  markAllAsRead(): void {
    this.notifications
      .filter(n => !n.lu)
      .forEach(n => this.markAsRead(n.id));
  }

  deleteNotification(id: number, index: number): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications.splice(index, 1);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur suppression:', err)
    });
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} minute(s)`;
    if (diffHours < 24) return `Il y a ${diffHours} heure(s)`;
    if (diffDays < 7) return `Il y a ${diffDays} jour(s)`;

    return d.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordChangedNotification extends Notification
{
    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Votre mot de passe a été modifié')
            ->line('Votre mot de passe a été modifié avec succès.')
            ->line('Si vous n\'avez pas effectué cette modification, veuillez contacter notre support immédiatement.')
            ->action('Connexion', config('app.frontend_url', 'http://localhost:5173') . '/login')
            ->line('Merci d\'utiliser notre application !');
    }
}